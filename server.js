const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const errorHandler = require("./backend/middleware/errorMiddleware");
const bookRoutes = require("./backend/routes/bookRoutes");
const userRoutes = require("./backend/routes/userRoutes");
const authRoutes = require("./backend/routes/authRoutes");
const quizRoutes = require("./backend/routes/quizRoutes");

dotenv.config();

// Ensure MongoDB URI is set
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in .env!");
  process.exit(1);
}

const app = express();

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({
      checkPeriod: 86400000, // Remove expired sessions every 24h
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

// Connect to MongoDB Atlas & Start Server
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
