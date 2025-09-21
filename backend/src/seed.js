
require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const { User } = require("./models/User");
const { Sweet } = require("./models/Sweet");

const runSeed = async () => {
  try {
    await connectDB();

    console.log("🌱 Starting seed...");

    // Create Admin
    const adminEmail = "admin@sweetshop.com";
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      const passwordHash = await bcrypt.hash("admin123", 10);
      await User.create({
        username: "Admin",
        email: adminEmail,
        password: passwordHash,
        role: "admin",
      });
      console.log(`✅ Admin created: ${adminEmail} / admin123`);
    } else {
      console.log("ℹ️ Admin already exists");
    }

    // Insert sample sweets
    const sweetCount = await Sweet.countDocuments();
    if (sweetCount === 0) {
      await Sweet.insertMany([
        { name: "Chocolate Bar", category: "Chocolate", price: 50, quantity: 100 },
        { name: "Gummy Bears", category: "Candy", price: 30, quantity: 200 },
        { name: "Ladoo", category: "Ladoo", price: 20, quantity: 150 },
      ]);
      console.log("✅ Sample sweets inserted");
    } else {
      console.log("ℹ️ Sweets already exist");
    }

    console.log("🌱 Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
};

runSeed();
