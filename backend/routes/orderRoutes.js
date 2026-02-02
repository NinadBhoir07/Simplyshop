const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Order = require("../models/Order");

const router = express.Router();

// @route GET /api/orders/my-orders
// @desc GEt logged-in user's orders
// @access Private
router.get("/my-orders", protect, async (req, res) => {
  try {
    // Find order for the unauthenticated user
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    }); //sort by most recent order
    res.json(orders);
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ message: "Server Error" })
  }
});

// @route GET /api/order/:id
// @desc vGet order details by Id
// @access Private
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Return the full order details
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;