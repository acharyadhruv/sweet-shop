const mongoose = require("mongoose");
const { z } = require("zod");

const sweetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ["Laddu", "Barfi", "Jalebi", "Other"], required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 0 },
});

const Sweet = mongoose.model("Sweet", sweetSchema);

const sweetZodSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  category: z.enum(["Laddu", "Barfi", "Jalebi", "Other"]),
  price: z.number().positive({ message: "Price must be positive" }),
  quantity: z.number().int().nonnegative({ message: "Quantity must be 0 or more" }),
});

module.exports = { Sweet, sweetZodSchema };
