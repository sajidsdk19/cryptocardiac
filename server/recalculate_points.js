const db = require('./db');

async function recalculateSharePoints() {
    try {
        console.log('Recalculating share points from logs...');

        // 1. Get accurate counts from share_logs
        const [counts] = await db.query(`
            SELECT user_id, COUNT(*) as actual_points 
            FROM share_logs 
            GROUP BY user_id
        `);

        if (counts.length === 0) {
            console.log('No share logs found. Skipping recalculation.');
            return;
        }

        // 2. Update users table
        for (const row of counts) {
            await db.query(`
                UPDATE users 
                SET share_points = ? 
                WHERE id = ?
            `, [row.actual_points, row.user_id]);
        }

        console.log(`Updated share_points for ${counts.length} users.`);

    } catch (error) {
        console.error('Error recalculating share points:', error);
    }
}

module.exports = recalculateSharePoints;
