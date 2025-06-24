const express = require("express")
const router = express.Router()
const orderController = require("../controllers/orderController")
const { authenticateToken, requireAdmin } = require("../middleware/auth")
const { validateOrder } = require("../middleware/validation")

// Create order (authenticated users)
router.post("/", authenticateToken, validateOrder, orderController.createOrder)

// Get user orders (authenticated users)
router.get("/", authenticateToken, orderController.getOrders)

// Get single order (authenticated users)
router.get("/:id", authenticateToken, orderController.getOrder)

// Update order status (admin only)
router.put("/:id/status", authenticateToken, requireAdmin, orderController.updateOrderStatus)

module.exports = router
