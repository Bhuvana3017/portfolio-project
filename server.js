const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // XAMPP default
  database: "portfolio_db"
});

db.connect((err) => {
  if (err) console.error("Database connection failed:", err);
  else console.log("Connected to MySQL");
});

// Save contact messages
app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;
  const sql = "INSERT INTO messages (name, email, message) VALUES (?, ?, ?)";
  db.query(sql, [name, email, message], (err) => {
    if (err) return res.status(500).send("Error saving message");
    res.send("Message saved successfully!");
  });
});

// Admin messages API
app.get("/messages", (req, res) => {
  const sql = "SELECT * FROM messages ORDER BY created_at DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send("Error fetching messages");
    res.json(results);
  });
});

// Start server
app.listen(3000, () => console.log("Server running on http://localhost:3000"));