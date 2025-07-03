require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Setup your MySQL connection using .env variables
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "med_booking",
});

// --- GET all doctors for dropdown ---
app.get("/api/doctors", (req, res) => {
  db.query("SELECT id, name FROM users WHERE role = 'doctor'", (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

// Example route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Node.js backend!' });
});

// Example user registration route
app.post('/api/register', (req, res) => {
  const { name, email, password, role, date_of_birth, gender, address, medical_history, emergency_contact } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  db.query(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, password, role],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
      const userId = result.insertId;
      // After successful user registration (role === 'patient')
      if (role === 'patient') {
        db.query(
          'INSERT INTO patients (user_id, date_of_birth, gender, address, medical_history, emergency_contact) VALUES (?, ?, ?, ?, ?, ?)',
          [userId, date_of_birth, gender, address, medical_history, emergency_contact],
          (err, result) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: 'Database error' });
            }
            res.json({ message: 'User registered!' });
          }
        );
      } else {
        res.json({ message: 'User registered!' });
      }
    }
  );
});

// User login route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  db.query(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
      if (results.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      // You can return user info or a token here
      res.json({ message: 'Login successful', user: results[0] });
    }
  );
});

// --- Book an appointment ---
app.post("/api/appointments", (req, res) => {
  const { date, time, doctor_id, reason, user_id } = req.body;
  if (!date || !time || !doctor_id || !reason || !user_id) {
    return res.status(400).json({ error: "All fields are required" });
  }
  db.query(
    "INSERT INTO appointments (date, time, doctor_id, reason, user_id) VALUES (?, ?, ?, ?, ?)",
    [date, time, doctor_id, reason, user_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });
      db.query(
        "SELECT * FROM appointments WHERE id = ?",
        [result.insertId],
        (err2, rows) => {
          if (err2) return res.status(500).json({ error: "Database error" });
          res.json({ message: "Appointment booked!", appointment: rows[0] });
        }
      );
    }
  );
});

// --- Get appointments for a patient ---
app.get("/api/appointments", (req, res) => {
  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ error: "User ID required" });
  db.query(
    `SELECT a.*, u.name AS doctor_name
     FROM appointments a
     LEFT JOIN users u ON a.doctor_id = u.id
     WHERE a.user_id = ?
     ORDER BY a.date, a.time`,
    [user_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json(results);
    }
  );
});

// --- Cancel appointment ---
app.delete("/api/appointments/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM appointments WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ message: "Appointment cancelled." });
  });
});

// --- Get all patients for a user (if needed) ---
app.get("/api/patients", (req, res) => {
  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ error: "User ID required" });
  db.query(
    "SELECT * FROM patients WHERE user_id = ?",
    [user_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json(results);
    }
  );
});

// --- Patient profile endpoints (GET/POST) ---
app.get("/api/patient/profile", (req, res) => {
  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ error: "User ID required" });
  db.query(
    "SELECT * FROM patients WHERE user_id = ?",
    [user_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (results.length === 0) return res.json({});
      res.json(results[0]);
    }
  );
});

app.post("/api/patient/profile", (req, res) => {
  const { user_id, date_of_birth, gender, address, medical_history, emergency_contact } = req.body;
  if (!user_id) return res.status(400).json({ error: "User ID required" });
  db.query(
    `INSERT INTO patients (user_id, date_of_birth, gender, address, medical_history, emergency_contact)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE date_of_birth=?, gender=?, address=?, medical_history=?, emergency_contact=?`,
    [
      user_id, date_of_birth, gender, address, medical_history, emergency_contact,
      date_of_birth, gender, address, medical_history, emergency_contact
    ],
    (err, result) => {
      if (err) {
        console.error(err); // <-- Add this line
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ message: "Profile saved!" });
    }
  );
});

// --- Get all appointments for a doctor (for Doctor Dashboard) ---
app.get("/api/doctor/appointments", (req, res) => {
  const { doctor_id } = req.query;
  if (!doctor_id) return res.status(400).json({ error: "Doctor ID required" });
  db.query(
    `SELECT a.*, u.name AS patient_name
     FROM appointments a
     LEFT JOIN users u ON a.user_id = u.id
     WHERE a.doctor_id = ?
     ORDER BY a.date, a.time`,
    [doctor_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json(results);
    }
  );
});

// --- Get upcoming appointments for a doctor ---
app.get("/api/doctor/upcoming", (req, res) => {
  const { doctor_id } = req.query;
  if (!doctor_id) return res.status(400).json({ error: "Doctor ID required" });
  db.query(
    `SELECT a.*, u.name AS patient_name
     FROM appointments a
     LEFT JOIN users u ON a.user_id = u.id
     WHERE a.doctor_id = ? AND a.date >= CURDATE()
     ORDER BY a.date, a.time`,
    [doctor_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json(results);
    }
  );
});

// --- Mark appointment as completed ---
app.post("/api/appointments/:id/complete", (req, res) => {
  const { id } = req.params;
  db.query(
    "UPDATE appointments SET status = 'Completed' WHERE id = ?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json({ message: "Appointment marked as completed." });
    }
  );
});

// --- Start the server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));