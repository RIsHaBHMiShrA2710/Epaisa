const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  // Option A: use your full connection string
  connectionString: process.env.POSTGRES_URI,
  
  // Option B: or build from individual vars—pick one approach, not both:
  // host:     process.env.DB_HOST,
  // port:     parseInt(process.env.DB_PORT, 10),
  // user:     process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  // database: process.env.DB_NAME,
  
  ssl: process.env.DB_SSL === 'true'
    ? { rejectUnauthorized: false }
    : false,
});

module.exports = pool;


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
