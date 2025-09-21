const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const sweetRoutes = require("./routes/sweetRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Middleware
app.use(express.json());

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetRoutes);


module.exports = app;
