const { Sweet, sweetZodSchema } = require("../models/Sweet");

// Add sweet (Admin only)
const addSweet = async (req, res) => {
  try {
    const parsed = sweetZodSchema.parse(req.body);
    const sweet = await Sweet.create(parsed);
    res.status(201).json(sweet);
  } catch (err) {
    if (err.errors) {
      return res.status(400).json({
        error: err.errors.map((e) => e.message).join(", "),
      });
    }
    if (err.code === 11000) {
      return res.status(400).json({
        error: "Duplicate sweet name already exists",
      });
    }
    return res.status(400).json({
      error: err.message || "Invalid request",
    });
  }
};

module.exports = { addSweet };
// src/controllers/sweetController.js
const { Sweet } = require("../models/Sweet");

const getSweets = async (req, res) => {
  const sweets = await Sweet.find();
  res.json(sweets);
};

module.exports = { getSweets };
