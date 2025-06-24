// Input validation middleware
function validateProduct(req, res, next) {
  const { name, price, category, quantity } = req.body

  if (!name || !price || !category || quantity === undefined) {
    return res.status(400).json({
      error: "Missing required fields: name, price, category, quantity",
    })
  }

  if (price <= 0) {
    return res.status(400).json({ error: "Price must be greater than 0" })
  }

  if (quantity < 0) {
    return res.status(400).json({ error: "Quantity cannot be negative" })
  }

  next()
}

function validateOrder(req, res, next) {
  const { items, delivery_location } = req.body

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Order must contain at least one item" })
  }

  if (!delivery_location) {
    return res.status(400).json({ error: "Delivery location is required" })
  }

  next()
}

function validateUser(req, res, next) {
  const { username, email, password } = req.body

  if (!username || !email || !password) {
    return res.status(400).json({
      error: "Missing required fields: username, email, password",
    })
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" })
  }

  next()
}

module.exports = {
  validateProduct,
  validateOrder,
  validateUser,
}
