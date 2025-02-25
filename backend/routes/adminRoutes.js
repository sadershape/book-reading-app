import express from "express";
import AdminItem from "../models/AdminItem.js";
import { authenticateUser, checkAdmin } from "../config/auth.js";

const router = express.Router();

// Get all admin items (Homepage content)
router.get("/", async (req, res) => {
  try {
    const items = await AdminItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Add a new admin item (Admin only)
router.post("/", authenticateUser, checkAdmin, async (req, res) => {
  const { images, name_en, name_ru, description_en, description_ru } = req.body;

  if (images.length !== 3) {
    return res.status(400).json({ message: "Exactly 3 images are required." });
  }

  try {
    const newItem = new AdminItem({ images, name_en, name_ru, description_en, description_ru });
    await newItem.save();
    res.status(201).json({ message: "Admin item added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Update an existing admin item (Admin only)
router.put("/:id", authenticateUser, checkAdmin, async (req, res) => {
  const { images, name_en, name_ru, description_en, description_ru } = req.body;

  try {
    const item = await AdminItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.images = images || item.images;
    item.name_en = name_en || item.name_en;
    item.name_ru = name_ru || item.name_ru;
    item.description_en = description_en || item.description_en;
    item.description_ru = description_ru || item.description_ru;
    item.updatedAt = new Date();

    await item.save();
    res.json({ message: "Admin item updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Delete an admin item (Admin only)
router.delete("/:id", authenticateUser, checkAdmin, async (req, res) => {
  try {
    const item = await AdminItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    res.json({ message: "Admin item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
