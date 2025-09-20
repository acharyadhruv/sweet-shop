const { User, userZodSchema } = require("../models/User");

const register = async (req, res) => {
  try {
    const parsed = userZodSchema.parse(req.body);

    // ✅ Duplicate email check
    const exists = await User.findOne({ email: parsed.email });
    if (exists) return res.status(400).json({ error: "Email already registered" });

    return res.status(201).json({ message: "User registered", user: parsed });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

module.exports = { register };
