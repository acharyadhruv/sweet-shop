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

// Update sweet (Admin only)
const updateSweet = async (req, res) => {
  try {
    // Check valid ObjectId
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ error: "Not found" });
    }

    // Validate body with Zod (partial schema)
    const parsed = sweetZodSchema.partial().parse(req.body);

    // Update in DB
    const sweet = await Sweet.findByIdAndUpdate(
      req.params.id,
      parsed,
      { new: true, runValidators: true }
    );

    // If no doc found
    if (!sweet) {
      return res.status(404).json({ error: "Not found" });
    }

    // Success
    res.json(sweet);
  } catch (err) {
    // ✅ Handle Zod OR Mongoose validation errors
    if (err.errors) {
      let messages;
      if (Array.isArray(err.errors)) {
        // Zod error array
        messages = err.errors.map(e => e.message);
      } else {
        // Mongoose error object
        messages = Object.values(err.errors).map(e => e.message);
      }
      return res.status(400).json({ error: messages.join(", ") });
    }

    // ✅ Mongoose ValidationError (safety net)
    if (err.name === "ValidationError") {
      return res.status(400).json({
        error: Object.values(err.errors).map(e => e.message).join(", ")
      });
    }

    // ✅ Invalid ObjectId inside find/update
    if (err.name === "CastError") {
      return res.status(404).json({ error: "Not found" });
    }

    // ✅ Unknown error
    res.status(400).json({
      error: err.message || "Invalid request"
    });
  }
};


module.exports = { addSweet , getSweets , searchSweets, updateSweet};
