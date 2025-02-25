import express from "express";
import Quiz from "../models/Quiz.js";
import { authenticateUser, checkAdmin } from "../config/auth.js";

const router = express.Router();

// Get random quiz questions (for users)
router.get("/", authenticateUser, async (req, res) => {
  try {
    const count = await Quiz.countDocuments();
    const randomQuestions = await Quiz.aggregate([{ $sample: { size: 5 } }]); // Fetch 5 random questions
    res.json(randomQuestions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Add a new quiz question (Admin only)
router.post("/", authenticateUser, checkAdmin, async (req, res) => {
  const { question, options, correctAnswer, language } = req.body;

  if (!question || !options || !correctAnswer || options.length < 2) {
    return res.status(400).json({ message: "Invalid question format." });
  }

  try {
    const newQuiz = new Quiz({ question, options, correctAnswer, language });
    await newQuiz.save();
    res.status(201).json({ message: "Quiz question added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Update a quiz question (Admin only)
router.put("/:id", authenticateUser, checkAdmin, async (req, res) => {
  const { question, options, correctAnswer, language } = req.body;

  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Question not found" });

    quiz.question = question || quiz.question;
    quiz.options = options || quiz.options;
    quiz.correctAnswer = correctAnswer || quiz.correctAnswer;
    quiz.language = language || quiz.language;
    quiz.updatedAt = new Date();

    await quiz.save();
    res.json({ message: "Quiz question updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Delete a quiz question (Admin only)
router.delete("/:id", authenticateUser, checkAdmin, async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Question not found" });

    res.json({ message: "Quiz question deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
