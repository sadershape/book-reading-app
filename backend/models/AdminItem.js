import mongoose from "mongoose";

const AdminItemSchema = new mongoose.Schema(
  {
    images: [{ type: String, required: true }], // Array of 3 image URLs
    name_en: { type: String, required: true }, // English name
    name_ru: { type: String, required: true }, // Russian name
    description_en: { type: String, required: true }, // English description
    description_ru: { type: String, required: true }, // Russian description
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
  },
  { timestamps: true }
);

const AdminItem = mongoose.model("AdminItem", AdminItemSchema);

export default AdminItem;
