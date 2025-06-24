const db = require("../database/connection")

// Get sales report
function getSalesReport(req, res) {
  const { startDate, endDate } = req.query

  let query = `
    SELECT 
      DATE(o.created_at) as date,
      COUNT(o.id) as total_orders,
      SUM(o.total_amount) as total_sales,
      AVG(o.total_amount) as average_order_value
    FROM orders o
    WHERE 1=1
  `

  const params = []

  if (startDate) {
    query += " AND DATE(o.created_at) >= ?"
    params.push(startDate)
  }

  if (endDate) {
    query += " AND DATE(o.created_at) <= ?"
    params.push(endDate)
  }

  query += " GROUP BY DATE(o.created_at) ORDER BY date DESC"

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to generate sales report" })
    }

    res.json({ salesReport: results })
  })
}

// Get inventory report
function getInventoryReport(req, res) {
  const query = `
    SELECT 
      id,
      name,
      category,
      quantity,
      price,
      (quantity * price) as total_value,
      CASE 
        WHEN quantity <= 10 THEN 'Low Stock'
        WHEN quantity <= 50 THEN 'Medium Stock'
        ELSE 'High Stock'
      END as stock_status
    FROM products
    ORDER BY quantity ASC
  `

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to generate inventory report" })
    }

    const totalValue = results.reduce((sum, item) => sum + Number.parseFloat(item.total_value), 0)
    const lowStockItems = results.filter((item) => item.stock_status === "Low Stock").length

    res.json({
      inventoryReport: results,
      summary: {
        totalProducts: results.length,
        totalInventoryValue: totalValue,
        lowStockItems: lowStockItems,
      },
    })
  })
}

// Get customer report
function getCustomerReport(req, res) {
  const query = `
    SELECT 
      u.id,
      u.username,
      u.email,
      COUNT(o.id) as total_orders,
      COALESCE(SUM(o.total_amount), 0) as total_spent,
      MAX(o.created_at) as last_order_date
    FROM users u
    LEFT JOIN orders o ON u.id = o.customer_id
    WHERE u.role = 'customer'
    GROUP BY u.id
    ORDER BY total_spent DESC
  `

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to generate customer report" })
    }

    res.json({ customerReport: results })
  })
}

module.exports = {
  getSalesReport,
  getInventoryReport,
  getCustomerReport,
}
