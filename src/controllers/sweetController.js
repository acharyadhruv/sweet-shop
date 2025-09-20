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


// src/controllers/sweetController.js
const getSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find();
    res.json(sweets);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
const searchSweets = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    const query = {};

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }
    if (category) {
      query.category = category;
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice && !isNaN(parseFloat(minPrice))) {
        query.price.$gte = parseFloat(minPrice);
      }
      if (maxPrice && !isNaN(parseFloat(maxPrice))) {
        query.price.$lte = parseFloat(maxPrice);
      }
      if (Object.keys(query.price).length === 0) delete query.price;
    }

    const sweets = await Sweet.find(query);
    res.json(sweets);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


module.exports = { addSweet , getSweets , searchSweets};
