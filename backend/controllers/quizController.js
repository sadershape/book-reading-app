import Quiz from "../models/Quiz.js";

// Create a new quiz question
export const createQuizQuestion = async (req, res) => {
  const { question, options, correctAnswer, language } = req.body;

  if (!question || !options || !correctAnswer || !language) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newQuiz = new Quiz({ question, options, correctAnswer, language });
    await newQuiz.save();
    res.status(201).json({ message: "Quiz question created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all quiz questions (with optional language filter)
export const getQuizQuestions = async (req, res) => {
  const { language } = req.query;

  try {
    const filter = language ? { language } : {};
    const questions = await Quiz.find(filter);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get a randomized set of quiz questions
export const getRandomQuiz = async (req, res) => {
  const { language, limit = 5 } = req.query;

  try {
    const filter = language ? { language } : {};
    const questions = await Quiz.aggregate([{ $match: filter }, { $sample: { size: Number(limit) } }]);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update a quiz question
export const updateQuizQuestion = async (req, res) => {
  const { id } = req.params;
  const { question, options, correctAnswer, language } = req.body;

  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      id,
      { question, options, correctAnswer, language },
      { new: true }
    );

    if (!updatedQuiz) return res.status(404).json({ message: "Quiz question not found" });

    res.json({ message: "Quiz question updated successfully", updatedQuiz });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a quiz question
export const deleteQuizQuestion = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(id);
    if (!deletedQuiz) return res.status(404).json({ message: "Quiz question not found" });

    res.json({ message: "Quiz question deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
