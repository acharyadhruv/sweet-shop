const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return res.status(401).json({ error: "Invalid token user" });
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};



const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Admins only" });
  next();
};


module.exports = { protect, isAdmin };
