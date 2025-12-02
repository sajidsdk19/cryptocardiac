const db = require('./db');

async function addSharePointsColumn() {
    try {
        console.log('Attempting to add share_points column...');
        await db.query(`
            ALTER TABLE users 
            ADD COLUMN share_points INT DEFAULT 0;
        `);
        console.log('Successfully added share_points column.');
    } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log('Column share_points already exists.');
        } else {
            console.error('Error adding column:', error);
        }
    } finally {
        process.exit();
    }
}

addSharePointsColumn();
