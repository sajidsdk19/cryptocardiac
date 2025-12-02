const db = require('../db');

async function createShareLogsTable() {
    try {
        console.log('Creating share_logs table...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS share_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                coin_id VARCHAR(255) NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );
        `);
        console.log('Successfully created share_logs table.');
    } catch (error) {
        console.error('Error creating share_logs table:', error);
    }
}

module.exports = createShareLogsTable;
