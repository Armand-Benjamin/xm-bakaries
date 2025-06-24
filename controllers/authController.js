const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const db = require("../database/connection")

// Register new user
function register(req, res) {
  const { username, email, password, role } = req.body

  // Hash password
  const hashedPassword = bcrypt.hashSync(password, 10)

  const query = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)"

  db.query(query, [username, email, hashedPassword, role || "customer"], (err, result) => {
    if (err) {
      return res.status(400).json({ error: "Registration failed" })
    }

    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId,
    })
  })
}

// Login user
function login(req, res) {
  const { email, password } = req.body

  const query = "SELECT * FROM users WHERE email = ?"

  db.query(query, [email], (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const user = results[0]

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    })

    res.json({
      message: "Login successful",
      token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    })
  })
}

module.exports = {
  register,
  login,
}
