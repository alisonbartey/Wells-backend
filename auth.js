const express = require("express");
const router = express.Router();
const pool = require("../db");

// REGISTER
router.post("/register", async (req, res) => {
  const { username, password, full_name, email } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (username, password, full_name, email) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, password, full_name, email]
    );
    res.json({ status: "success", user: result.rows[0] });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1 AND password = $2",
      [username, password]
    );
    if (result.rows.length > 0) {
      res.json({ status: "success", user: result.rows[0] });
    } else {
      res.status(401).json({ status: "fail", message: "Invalid login" });
    }
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

module.exports = router;