const express = require("express")
const cors = require("cors")
require("dotenv").config()

const errorHandler = require("./middleware/errorHandler")

// Import routes
const authRoutes = require("./routes/auth")
const productRoutes = require("./routes/products")
const orderRoutes = require("./routes/orders")
const reportRoutes = require("./routes/reports")

// Create Express app
const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/reports", reportRoutes)

app.get('/', (req, res) => {
  res.send("Welcome to XM Bakery");
});

// Health check route
app.get("/api/health", (req, res) => {
  res.send("XM Bakery API is running");
});


// Error handling middleware
app.use(errorHandler)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" })
})

// Start server
app.listen(PORT, () => {
  console.log(`XM Bakery API server running on port ${PORT}`)
})

module.exports = app
