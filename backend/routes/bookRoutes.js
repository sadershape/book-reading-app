import express from "express";
import axios from "axios";

const router = express.Router();

// Search books from Gutenberg API
router.get("/gutenberg", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    const response = await axios.get(`https://gutendex.com/books/?search=${query}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data from Gutenberg API", error });
  }
});

// Search books from OpenLibrary API
router.get("/openlibrary", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    const response = await axios.get(`https://openlibrary.org/search.json?q=${query}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data from OpenLibrary API", error });
  }
});

export default router;
