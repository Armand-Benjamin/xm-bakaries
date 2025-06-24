const db = require("../database/connection")

// Add new product
function addProduct(req, res) {
  const { name, price, category, quantity, description } = req.body

  const query = "INSERT INTO products (name, price, category, quantity, description) VALUES (?, ?, ?, ?, ?)"

  db.query(query, [name, price, category, quantity, description], (err, result) => {
    if (err) {
      return res.status(400).json({ error: "Failed to add product" })
    }

    res.status(201).json({
      message: "Product added successfully",
      productId: result.insertId,
    })
  })
}

// Get all products with search and filter
function getProducts(req, res) {
  const { category, minPrice, maxPrice, sortBy, sortOrder } = req.query

  let query = "SELECT * FROM products WHERE 1=1"
  const params = []

  // Add filters
  if (category) {
    query += " AND category = ?"
    params.push(category)
  }

  if (minPrice) {
    query += " AND price >= ?"
    params.push(minPrice)
  }

  if (maxPrice) {
    query += " AND price <= ?"
    params.push(maxPrice)
  }

  // Add sorting
  if (sortBy) {
    const validSortFields = ["name", "price", "category", "quantity", "created_at"]
    if (validSortFields.includes(sortBy)) {
      const order = sortOrder === "desc" ? "DESC" : "ASC"
      query += ` ORDER BY ${sortBy} ${order}`
    }
  }

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch products" })
    }

    res.json({
      products: results,
      count: results.length,
    })
  })
}

// Get single product
function getProduct(req, res) {
  const productId = req.params.id

  const query = "SELECT * FROM products WHERE id = ?"

  db.query(query, [productId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch product" })
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Product not found" })
    }

    res.json(results[0])
  })
}

// Update product
function updateProduct(req, res) {
  const productId = req.params.id
  const { name, price, category, quantity, description } = req.body

  const query = "UPDATE products SET name = ?, price = ?, category = ?, quantity = ?, description = ? WHERE id = ?"

  db.query(query, [name, price, category, quantity, description, productId], (err, result) => {
    if (err) {
      return res.status(400).json({ error: "Failed to update product" })
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" })
    }

    res.json({ message: "Product updated successfully" })
  })
}

// Delete product
function deleteProduct(req, res) {
  const productId = req.params.id

  const query = "DELETE FROM products WHERE id = ?"

  db.query(query, [productId], (err, result) => {
    if (err) {
      return res.status(400).json({ error: "Failed to delete product" })
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" })
    }

    res.json({ message: "Product deleted successfully" })
  })
}

module.exports = {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
}
