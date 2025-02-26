import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import session from "express-session";
import { fileURLToPath } from "url";
import errorHandler from "./backend/middleware/errorMiddleware.js";
import bookRoutes from "./backend/routes/bookRoutes.js";
import userRoutes from "./backend/routes/userRoutes.js";
import authRoutes from "./backend/routes/authRoutes.js";
import quizRoutes from "./backend/routes/quizRoutes.js";

// Load environment variables
dotenv.config();

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fix MemoryStore import
const MemoryStore = require("memorystore")(session);

const app = express();

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files before routes
app.use(express.static(path.join(__dirname, "public")));

// Use express-session with MemoryStore
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({
      checkPeriod: 86400000, // Remove expired sessions every 24h
    }),
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

// Pass user and title data to all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.title = "Book Reading App";
  next();
});

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/books", bookRoutes);
app.use("/quiz", quizRoutes);

// Root Route - Render Home Page with Data
app.get("/", (req, res) => {
  res.render("index", { 
    libraryDescription: "A place to explore and read amazing books!", 
    libraryImage: "/images/default-library.jpg"
  });
});

// Error Handling Middleware
app.use(errorHandler);

// Connect to MongoDB Atlas & Start Server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(`✅ MongoDB Connected`);
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((error) => console.error("❌ MongoDB Connection Failed:", error));
