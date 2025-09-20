const express = require("express");
const {
  addSweet,
  getSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
} = require("../controllers/sweetController");
const { protect, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", protect, getSweets);
router.get("/search", protect, searchSweets);
router.post("/", protect, isAdmin, addSweet);
router.put("/:id", protect, isAdmin, updateSweet);
router.delete("/:id", protect, isAdmin, deleteSweet);
router.post("/:id/purchase", protect, purchaseSweet);
router.post("/:id/restock", protect, isAdmin, restockSweet);

module.exports = router;
