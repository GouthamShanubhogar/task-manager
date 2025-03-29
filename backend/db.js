import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

// Explicitly specify the path to the .env file
dotenv.config({ path: './.env' });

// Debugging: Log environment variables (remove in production)
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '******' : 'Not Set');
console.log('DB_NAME:', process.env.DB_NAME);

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD || ''), // Ensure password is a string
  database: process.env.DB_NAME,
});

export default pool;
