const db = require("../database/connection")

// Create new order
function createOrder(req, res) {
  const { items, delivery_location } = req.body
  const customerId = req.user.id

  // Calculate total amount
  let totalAmount = 0
  const orderItems = []

  // Get product prices and validate items
  const productIds = items.map((item) => item.product_id)
  const query = "SELECT id, price, quantity FROM products WHERE id IN (?)"

  db.query(query, [productIds], (err, products) => {
    if (err) {
      return res.status(500).json({ error: "Failed to validate products" })
    }

    // Validate each item
    for (const item of items) {
      const product = products.find((p) => p.id === item.product_id)

      if (!product) {
        return res.status(400).json({ error: `Product ${item.product_id} not found` })
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for product ${item.product_id}` })
      }

      totalAmount += product.price * item.quantity
      orderItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price: product.price,
      })
    }

    // Create order
    const orderQuery = "INSERT INTO orders (customer_id, total_amount, delivery_location) VALUES (?, ?, ?)"

    db.query(orderQuery, [customerId, totalAmount, delivery_location], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Failed to create order" })
      }

      const orderId = result.insertId

      // Insert order items
      const itemsQuery = "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?"
      const itemsData = orderItems.map((item) => [orderId, item.product_id, item.quantity, item.price])

      db.query(itemsQuery, [itemsData], (err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to add order items" })
        }

        // Update product quantities
        for (const item of orderItems) {
          const updateQuery = "UPDATE products SET quantity = quantity - ? WHERE id = ?"
          db.query(updateQuery, [item.quantity, item.product_id])
        }

        res.status(201).json({
          message: "Order created successfully",
          orderId: orderId,
          totalAmount: totalAmount,
        })
      })
    })
  })
}

// Get customer orders
function getOrders(req, res) {
  const customerId = req.user.id

  const query = `
    SELECT o.*, 
           GROUP_CONCAT(CONCAT(p.name, ' (', oi.quantity, ')') SEPARATOR ', ') as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE o.customer_id = ?
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `

  db.query(query, [customerId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch orders" })
    }

    res.json({ orders: results })
  })
}

// Get single order details
function getOrder(req, res) {
  const orderId = req.params.id
  const customerId = req.user.id

  const query = `
    SELECT o.*, oi.quantity, oi.price as item_price, p.name as product_name
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE o.id = ? AND o.customer_id = ?
  `

  db.query(query, [orderId, customerId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch order" })
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Order not found" })
    }

    res.json({ order: results })
  })
}

// Update order status (admin only)
function updateOrderStatus(req, res) {
  const orderId = req.params.id
  const { status } = req.body

  const validStatuses = ["pending", "processing", "delivered", "cancelled"]

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status" })
  }

  const query = "UPDATE orders SET status = ? WHERE id = ?"

  db.query(query, [status, orderId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to update order status" })
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Order not found" })
    }

    res.json({ message: "Order status updated successfully" })
  })
}

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
}
