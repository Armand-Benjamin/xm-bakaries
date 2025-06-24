const mysql = require("mysql2")
require("dotenv").config()

// Create database connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
})

// Connect to database
connection.connect((err) => {
  if (err) {
    console.log("Database connection failed: " + err.stack)
    return
  }
  console.log("Connected to database as id " + connection.threadId)
})

module.exports = connection
