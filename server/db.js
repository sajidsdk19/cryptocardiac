const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// Parse JAWSDB_URL for Heroku deployment
// Format: mysql://username:password@hostname:port/database_name
let dbConfig;

if (process.env.JAWSDB_URL) {
    // Heroku JawsDB MySQL
    const url = new URL(process.env.JAWSDB_URL);
    dbConfig = {
        host: url.hostname,
        user: url.username,
        password: url.password,
        database: url.pathname.substring(1), // Remove leading '/'
        port: url.port || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    };
} else {
    // Local development
    dbConfig = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'cryptocardiac',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    };
}

const pool = mysql.createPool(dbConfig);

module.exports = pool.promise();
