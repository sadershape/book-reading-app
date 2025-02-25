import mongoose from "mongoose";

const BookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String },
    coverImage: { type: String }, // URL to book cover
    source: { type: String, enum: ["Gutenberg", "OpenLibrary"], required: true }, // Identify API source
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Optional: Link book to a user
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", BookSchema);

export default Book;
