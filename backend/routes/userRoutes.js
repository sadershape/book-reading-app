import express from "express";
import User from "../models/User.js";
import { authenticateUser, checkAdmin } from "../config/auth.js";

const router = express.Router();

// Get all users (Admin only)
router.get("/", authenticateUser, checkAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude passwords
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Add a new user (Admin only)
router.post("/", authenticateUser, checkAdmin, async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ username, password, role });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Update a user's password (Admin only)
router.put("/:id", authenticateUser, checkAdmin, async (req, res) => {
  const { password } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = password;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Delete a user (Admin only)
router.delete("/:id", authenticateUser, checkAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
