const db = require('./db');

async function checkSchema() {
    try {
        console.log('Checking users table schema...');
        const [usersColumns] = await db.query('SHOW COLUMNS FROM users');
        console.log('Users columns:', usersColumns.map(c => c.Field));

        console.log('Checking share_logs table schema...');
        const [shareLogsColumns] = await db.query('SHOW COLUMNS FROM share_logs');
        console.log('Share_logs columns:', shareLogsColumns.map(c => c.Field));

    } catch (error) {
        console.error('Error checking schema:', error);
    } finally {
        process.exit();
    }
}

checkSchema();
