const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  }
});

(async () => {
  try {
    const client = await pool.connect();
    console.log('Database connected successfully!');
    client.release();
  } catch (err) {
    console.error('Error connecting to the database:', err.message);
  }
})();

module.exports = pool;
