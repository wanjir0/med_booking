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

app.post('/api/appointments', (req, res) => {
  const { date, time, doctor_id, reason, user_id } = req.body;
  if (!date || !time || !doctor_id || !reason || !user_id) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  db.query(
    'INSERT INTO appointments (date, time, doctor_id, reason, user_id) VALUES (?, ?, ?, ?, ?)',
    [date, time, doctor_id, reason, user_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      db.query(
        'SELECT * FROM appointments WHERE id = ?',
        [result.insertId],
        (err2, rows) => {
          if (err2) return res.status(500).json({ error: 'Database error' });
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
      res.json(results || []);
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

app.get('/api/doctor/today', (req, res) => {
  const { doctor_id } = req.query;
  if (!doctor_id) return res.status(400).json({ error: 'Doctor ID required' });
  db.query(
    `SELECT a.id, a.time, a.reason, u.name AS patient_name
     FROM appointments a
     JOIN users u ON a.user_id = u.id
     WHERE a.doctor_id = ? AND a.date = CURDATE()
     ORDER BY a.time`,
    [doctor_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json(results);
    }
  );
});

app.get('/api/doctor/notifications', (req, res) => {
  const { doctor_id } = req.query;
  if (!doctor_id) return res.status(400).json({ error: 'Doctor ID required' });

  db.query(
    'SELECT * FROM notifications WHERE doctor_id = ? ORDER BY created_at DESC',
    [doctor_id],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(results);
    }
  );
});

app.post('/api/doctor/profile', (req, res) => {
  const { doctor_id, name, specialty, phone, email } = req.body;
  if (!doctor_id || !name || !specialty || !phone || !email) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  db.query(
    `INSERT INTO doctor_profiles (doctor_id, name, specialty, phone, email)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE name=?, specialty=?, phone=?, email=?`,
    [doctor_id, name, specialty, phone, email, name, specialty, phone, email],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Profile saved!' });
    }
  );
});

app.get('/api/doctor/upcoming', (req, res) => {
  const { doctor_id } = req.query;
  if (!doctor_id) return res.status(400).json({ error: 'Doctor ID required' });
  db.query(
    `SELECT a.id, a.date, a.time, a.reason, u.name AS patient_name
     FROM appointments a
     JOIN users u ON a.user_id = u.id
     WHERE a.doctor_id = ? AND a.date >= CURDATE()
     ORDER BY a.date, a.time`,
    [doctor_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json(results);
    }
  );
});

app.get('/api/doctor/patients', (req, res) => {
  const { doctor_id } = req.query;
  if (!doctor_id) return res.status(400).json({ error: 'Doctor ID required' });
  db.query(
    `SELECT DISTINCT u.id, u.name, u.email, u.phone
     FROM appointments a
     JOIN users u ON a.user_id = u.id
     WHERE a.doctor_id = ?`,
    [doctor_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json(results);
    }
  );
});

app.get('/api/doctor/profile', (req, res) => {
  const { doctor_id } = req.query;
  if (!doctor_id) return res.status(400).json({ error: 'Doctor ID required' });
  db.query(
    'SELECT name, specialty, phone, email FROM doctor_profiles WHERE doctor_id = ?',
    [doctor_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (results.length === 0) return res.json({});
      res.json(results[0]);
    }
  );
});

app.post('/api/patient/profile', (req, res) => {
  console.log("Received body:", req.body); // <-- Add this
  const { user_id, date_of_birth, gender, address, medical_history, emergency_contact } = req.body;
  if (!user_id) return res.status(400).json({ error: 'User ID required' });
  db.query(
    `INSERT INTO patients (user_id, date_of_birth, gender, address, medical_history, emergency_contact)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE date_of_birth=?, gender=?, address=?, medical_history=?, emergency_contact=?`,
    [user_id, date_of_birth, gender, address, medical_history, emergency_contact, date_of_birth, gender, address, medical_history, emergency_contact],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ message: 'Patient profile saved!' });
    }
  );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));