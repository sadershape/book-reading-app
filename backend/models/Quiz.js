import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: [{ type: String, required: true }], // Array of answer choices
    correctAnswer: { type: String, required: true }, // The correct answer
    language: { type: String, enum: ["en", "ru"], default: "en" }, // Language support
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", QuizSchema);

export default Quiz;
