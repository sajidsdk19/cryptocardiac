const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function initDB() {
    try {
        // Connect without database selected to create it
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });

        console.log('Connected to MySQL server.');

        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'cryptocardiac'}`);
        console.log(`Database '${process.env.DB_NAME || 'cryptocardiac'}' created or already exists.`);

        await connection.changeUser({ database: process.env.DB_NAME || 'cryptocardiac' });

        const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await connection.query(createUsersTable);
        console.log('Table "users" created or checked.');

        const createVotesTable = `
            CREATE TABLE IF NOT EXISTS votes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                coin_id VARCHAR(255) NOT NULL,
                coin_name VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `;
        await connection.query(createVotesTable);
        console.log('Table "votes" created or checked.');

        await connection.end();
        console.log('Database initialization complete.');
        process.exit(0);
    } catch (error) {
        console.error('Database initialization failed:', error);
        process.exit(1);
    }
}

initDB();
