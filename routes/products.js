const express = require("express")
const router = express.Router()
const productController = require("../controllers/productController")
const { authenticateToken, requireAdmin } = require("../middleware/auth")
const { validateProduct } = require("../middleware/validation")

// Get all products (public)
router.get("/", productController.getProducts)

// Get single product (public)
router.get("/:id", productController.getProduct)

// Add product (admin only)
router.post("/", authenticateToken, requireAdmin, validateProduct, productController.addProduct)

// Update product (admin only)
router.put("/:id", authenticateToken, requireAdmin, validateProduct, productController.updateProduct)

// Delete product (admin only)
router.delete("/:id", authenticateToken, requireAdmin, productController.deleteProduct)

module.exports = router
