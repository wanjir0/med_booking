const express = require('express');
const cors = require('cors');
const db = require('./db'); // <-- import db.js

const app = express();
app.use(cors());
app.use(express.json());

// Example route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Node.js backend!' });
});

// Example user registration route
app.post('/api/register', (req, res) => {
  const { name, email, password, role } = req.body;
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
      res.json({ message: 'User registered!' });
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

app.post('/api/appointments', (req, res) => {
  const { date, time, doctor, reason, user_id } = req.body;
  if (!date || !time || !doctor || !reason || !user_id) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  db.query(
    'INSERT INTO appointments (date, time, doctor, reason, user_id) VALUES (?, ?, ?, ?, ?)',
    [date, time, doctor, reason, user_id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
      // Return the newly created appointment
      db.query(
        'SELECT * FROM appointments WHERE id = ?',
        [result.insertId],
        (err2, rows) => {
          if (err2) {
            console.error(err2);
            return res.status(500).json({ error: 'Database error' });
          }
          res.json({ message: 'Appointment booked!', appointment: rows[0] });
        }
      );
    }
  );
});

// Update or create patient profile
app.post('/api/profile', (req, res) => {
  const { user_id, name, age, address, phone, gender } = req.body;
  if (!user_id || !name || !age || !address || !phone || !gender) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  // Upsert logic: update if exists, else insert
  db.query(
    `INSERT INTO profiles (user_id, name, age, address, phone, gender)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE name=?, age=?, address=?, phone=?, gender=?`,
    [user_id, name, age, address, phone, gender, name, age, address, phone, gender],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Profile saved!' });
    }
  );
});

app.get('/api/appointments', (req, res) => {
  const { user_id } = req.query;
  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  db.query(
    'SELECT * FROM appointments WHERE user_id = ? ORDER BY date, time',
    [user_id],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(results);
    }
  );
});

app.delete('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  db.query(
    'DELETE FROM appointments WHERE id = ?',
    [id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      res.json({ message: 'Appointment cancelled.' });
    }
  );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));