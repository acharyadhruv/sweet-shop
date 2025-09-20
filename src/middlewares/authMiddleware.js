const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
};

const isAdmin = (req, res, next) => {};

module.exports = { protect, isAdmin };
