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
  const { weight, calories, user_id } = req.body;

  if (!weight || !calories || !user_id) {
    return res
      .status(400)
      .json({ message: "Weight, calories, and user ID are required" });
  }

  try {
    const client = await pool.connect();

    // Insert the new log data into the daily_logs table
    const dailyLogQuery =
      "INSERT INTO daily_logs (weight, calories, user_id) VALUES ($1, $2, $3) RETURNING *";
    const dailyLogValues = [weight, calories, user_id];

    const result = await client.query(dailyLogQuery, dailyLogValues);
    const newLog = result.rows[0];

    // Calculate the week start date for the log
    const logDate = new Date(newLog.log_date);
    const weekStartDate = new Date(logDate);
    weekStartDate.setDate(logDate.getDate() - logDate.getDay()); // Assuming Sunday is the first day of the week

    // Check if a weekly log for the user and week start date already exists
    const existingWeeklyLogQuery =
      "SELECT * FROM weekly_logs WHERE user_id = $1 AND week_start_date = $2";
    const existingWeeklyLogValues = [user_id, weekStartDate];

    const existingWeeklyLogResult = await client.query(
      existingWeeklyLogQuery,
      existingWeeklyLogValues
    );

    if (existingWeeklyLogResult.rows.length > 0) {
      // Update the existing weekly log with new data
      const existingWeeklyLog = existingWeeklyLogResult.rows[0];
      const updatedWeight = existingWeeklyLog.total_weight + weight;
      const updatedCalories = existingWeeklyLog.total_calories + calories;

      const updateWeeklyLogQuery =
        "UPDATE weekly_logs SET total_weight = $1, total_calories = $2 WHERE id = $3";
      const updateWeeklyLogValues = [
        updatedWeight,
        updatedCalories,
        existingWeeklyLog.id,
      ];

      await client.query(updateWeeklyLogQuery, updateWeeklyLogValues);
    } else {
      // Create a new weekly log for the user and week start date
      const newWeeklyLogQuery =
        "INSERT INTO weekly_logs (user_id, week_start_date, total_weight, total_calories) VALUES ($1, $2, $3, $4)";
      const newWeeklyLogValues = [user_id, weekStartDate, weight, calories];

      await client.query(newWeeklyLogQuery, newWeeklyLogValues);
    }

    client.release();

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

app.get("/weekly-logs", async (req, res) => {
  const { user_id } = req.query;

  try {
    const client = await pool.connect();

    // Modify the SQL query to retrieve aggregated weekly log data
    const weeklyLogsQuery = `
        SELECT week_start_date, SUM(weight) as total_weight, SUM(calories) as total_calories
        FROM daily_logs
        WHERE user_id = $1
        GROUP BY week_start_date
        ORDER BY week_start_date DESC
      `;
    const weeklyLogsValues = [user_id];

    const result = await client.query(weeklyLogsQuery, weeklyLogsValues);
    const logs = result.rows;

    client.release();

    res.json({ data: logs });
  } catch (error) {
    console.error("Error during weekly log retrieval:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
