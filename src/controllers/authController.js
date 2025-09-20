const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, userZodSchema } = require("../models/User");

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });

// Register (always customer)
const register = async (req, res) => {
  try {
    const parsed = userZodSchema.parse(req.body);

    const exists = await User.findOne({ email: parsed.email });
    if (exists) return res.status(400).json({ error: "Email already registered" });

    const hashed = await bcrypt.hash(parsed.password, 10);
    const user = await User.create({
      ...parsed,
      password: hashed,
      role: "customer",
    });

    res.status(201).json({
      message: "User registered",
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (err) {
    return res
      .status(400)
      .json({ error: err.errors ? err.errors.map((e) => e.message) : err.message });
  }
};
const login = async (req, res) => {
  return res.status(500).json({ error: "Email and password are required" });
};


module.exports = { register , login };