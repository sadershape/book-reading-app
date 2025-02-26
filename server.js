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

// Ensure MongoDB URI is set
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in .env!");
  process.exit(1);
}

// Resolve __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Import connect-mongo dynamically to fix ERR_MODULE_NOT_FOUND in deployment
let MongoStore;
import("connect-mongo").then((module) => {
  MongoStore = module.default;

  // Session middleware (for storing logged-in user)
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "your-secret-key",
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: "sessions",
      }),
      cookie: { secure: process.env.NODE_ENV === "production" }, // Secure in production
    })
  );

  // Pass user data to all views
  app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
  });

  // Routes
  app.use("/api/books", bookRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/quiz", quizRoutes);

  // Root Route - Render Home Page
  app.get("/", (req, res) => {
    res.render("index", { title: "Welcome to Book Reading App" });
  });

  // Error Handling Middleware
  app.use(errorHandler);

  // Start Server after connecting to MongoDB
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log(`✅ MongoDB Connected`);
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch((error) => console.error("❌ MongoDB Connection Failed:", error));
});
