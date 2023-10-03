const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const app = express();
const port = process.env.PORT || 3001;
const secretKey = "123"; // Replace with a strong secret key
const databaseUrl =
  "postgres://xovihgzm:CQQUEDMvUEHxoAUmH-8bQ37ctkbYaG0L@peanut.db.elephantsql.com/xovihgzm"; // Replace with your PostgreSQL connection URL

const pool = new Pool({ connectionString: databaseUrl });

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to Weightr App"); // You can customize this response
});
// Register a new user
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username is already taken
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    console.log("password", password);
    // Hash the password (you can use a library like bcrypt for this)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user into the database
    await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
      username,
      hashedPassword,
    ]);

    // Generate a JWT token for the newly registered user
    const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });

    res.json({ message: "Registration successful", token });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login an existing user
app.post("/daily-logs", async (req, res) => {
  const { weight, calories } = req.body;

  if (!weight || !calories) {
    return res
      .status(400)
      .json({ message: "Weight and calories are required" });
  }

  try {
    // Insert the new log data into the daily_logs table
    const dailyLogQuery =
      "INSERT INTO daily_logs (weight, calories) VALUES ($1, $2) RETURNING *";
    const dailyLogValues = [weight, calories];

    const result = await pool.query(dailyLogQuery, dailyLogValues);
    const newLog = result.rows[0];

    res
      .status(201)
      .json({ message: "Daily log added successfully", data: newLog });
  } catch (error) {
    console.error("Error during log insertion:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to retrieve all daily logs
app.get("/daily-logs", async (req, res) => {
  try {
    const client = await pool.connect();

    // Retrieve all logs from the PostgreSQL database
    const result = await client.query("SELECT * FROM daily_logs");
    const logs = result.rows;

    client.release();

    res.json({ data: logs });
  } catch (error) {
    console.error("Error during log retrieval:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
