import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import errorHandler from "./backend/middleware/errorMiddleware.js";
import bookRoutes from "./backend/routes/bookRoutes.js";
import userRoutes from "./backend/routes/userRoutes.js";
import authRoutes from "./backend/routes/authRoutes.js";
import quizRoutes from "./backend/routes/quizRoutes.js";

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON requests

// Routes
app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Book Reading API!");
});

// Error Handling Middleware
app.use(errorHandler);

// Connect to MongoDB Atlas & Start Server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`✅ MongoDB Connected`);
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((error) => console.error("❌ MongoDB Connection Failed:", error));
