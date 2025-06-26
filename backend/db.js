
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // change to your MySQL user
  password: 'macharia@001', // change to your MySQL password
  database: 'med_booking' // change to your database name
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

module.exports = db;