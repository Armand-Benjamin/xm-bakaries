// Global error handling middleware
function errorHandler(err, req, res, next) {
  console.error("Error:", err)

  if (err.code === "ER_DUP_ENTRY") {
    return res.status(400).json({ error: "Duplicate entry found" })
  }

  if (err.code === "ER_NO_REFERENCED_ROW_2") {
    return res.status(400).json({ error: "Referenced record not found" })
  }

  res.status(500).json({ error: "Internal server error" })
}

module.exports = errorHandler
