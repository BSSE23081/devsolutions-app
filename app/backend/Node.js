// app/backend/index.js
const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = 5000;

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect(err => {
  if (err) {
    console.error('DB connection failed:', err);
  } else {
    console.log('DB connected successfully');
  }
});

app.get('/api', (req, res) => {
  res.json({ message: 'Backend API is working!' });
});

app.listen(PORT, () => {
  console.log(`Backend API running at http://localhost:${PORT}`);
});
