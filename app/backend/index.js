const mysql = require('mysql2');
const express = require('express');
const app = express();
const port = 5000;

const dbConfig = {
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootpassword',
  database: process.env.DB_NAME || 'devdb',
  port: process.env.DB_PORT || 3306
};

let db;

function connectWithRetry(retries = 10, delay = 3000) {
  db = mysql.createConnection(dbConfig);
  db.connect(err => {
    if (err) {
      console.log(`DB connection failed. Retrying in ${delay / 1000}s...`);
      if (retries > 0) {
        setTimeout(() => connectWithRetry(retries - 1, delay), delay);
      } else {
        console.error('DB connection failed after multiple attempts:', err);
        process.exit(1);
      }
    } else {
      console.log('DB connected successfully');
    }
  });
}

connectWithRetry();

app.get('/api', (req, res) => {
  res.json({ message: 'API is working!' });
});

app.listen(port, () => {
  console.log(`Backend API running at http://localhost:${port}`);
});
