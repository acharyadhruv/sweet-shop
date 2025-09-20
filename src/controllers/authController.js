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
  try {
    const { email, password } = req.body;

    // Missing fields
    if (!email || !password) {
      return res.status(500).json({ error: "Email and password are required" });
    }

    // User existence
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    // Password verification
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    // Generate JWT
    const secret = process.env.JWT_SECRET || "testsecret";
    const token = jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: "1d" });

    return res.status(200).json({ message: "Login successful", token, role: user.role });
  } catch (err) {
    // Catch unexpected errors
    return res.status(500).json({ error: err.message });
  }
};
module.exports = { register , login };