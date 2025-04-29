const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
   connectionString: process.env.DATABASE_URL,
   ssl: { rejectUnauthorized: false }
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