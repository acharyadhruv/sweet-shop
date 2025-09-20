const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Health check
app.get("/api/health", (_, res) => res.json({ status: "ok" }));

module.exports = app;
