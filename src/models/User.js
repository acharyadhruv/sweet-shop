const mongoose = require("mongoose");
const { z } = require("zod");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

// Zod validation (role excluded, always customer on register)
const userZodSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 chars" }),
  email: z.string().regex(
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    { message: "Invalid email address" }
  ),
  password: z.string().min(6, { message: "Password must be at least 6 chars" }),
});

module.exports = { User, userZodSchema };
