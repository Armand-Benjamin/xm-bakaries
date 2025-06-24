const express = require("express")
const router = express.Router()
const reportController = require("../controllers/reportController")
const { authenticateToken, requireAdmin } = require("../middleware/auth")

// Sales report (admin only)
router.get("/sales", authenticateToken, requireAdmin, reportController.getSalesReport)

// Inventory report (admin only)
router.get("/inventory", authenticateToken, requireAdmin, reportController.getInventoryReport)

// Customer report (admin only)
router.get("/customers", authenticateToken, requireAdmin, reportController.getCustomerReport)

module.exports = router
