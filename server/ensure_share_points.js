const db = require('./db');

async function ensureSharePointsColumn() {
    try {
        console.log('Checking for share_points column in users table...');

        // Check if column exists
        const [columns] = await db.query("SHOW COLUMNS FROM users LIKE 'share_points'");

        if (columns.length === 0) {
            console.log('Column share_points missing. Adding it now...');
            await db.query(`
                ALTER TABLE users 
                ADD COLUMN share_points INT DEFAULT 0;
            `);
            console.log('Successfully added share_points column.');
        } else {
            console.log('Column share_points already exists.');
        }

    } catch (error) {
        console.error('Error ensuring share_points column:', error);
    }
}

module.exports = ensureSharePointsColumn;
