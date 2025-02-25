import AdminContent from "../models/AdminContent.js";

// Get main page content
export const getMainPageContent = async (req, res) => {
  try {
    const content = await AdminContent.findOne();
    res.json(content || {});
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update main page content (Admin only)
export const updateMainPageContent = async (req, res) => {
  const { text, image } = req.body;

  try {
    let content = await AdminContent.findOne();
    if (!content) {
      content = new AdminContent({ text, image });
    } else {
      content.text = text;
      content.image = image;
    }

    await content.save();
    res.json({ message: "Main page content updated successfully", content });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Add a new topic-related item
export const addTopicItem = async (req, res) => {
  const { pictures, name_en, name_ru, description_en, description_ru } = req.body;

  if (!pictures || !name_en || !name_ru || !description_en || !description_ru) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newItem = new AdminContent({
      pictures,
      name: { en: name_en, ru: name_ru },
      description: { en: description_en, ru: description_ru },
    });

    await newItem.save();
    res.status(201).json({ message: "Item added successfully", newItem });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update a topic-related item
export const updateTopicItem = async (req, res) => {
  const { id } = req.params;
  const { pictures, name_en, name_ru, description_en, description_ru } = req.body;

  try {
    const updatedItem = await AdminContent.findByIdAndUpdate(
      id,
      {
        pictures,
        name: { en: name_en, ru: name_ru },
        des
