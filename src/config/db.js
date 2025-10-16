import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
    user: process.env.DB_USER || 'garnek',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'websitemsshops',
    password: process.env.DB_PASSWORD || '1234',
    port: process.env.DB_PORT || '5432',
});

pool.on('connect', () => {
    console.log('Connection pool established with DB');
});

export default pool;
