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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));