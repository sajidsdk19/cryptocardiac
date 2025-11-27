const db = require('./db');

// Replace with your user email
const userEmail = 'your-email@example.com';

async function checkMyVotes() {
    try {
        // Get user ID from email
        const [users] = await db.query('SELECT id FROM users WHERE email = ?', [userEmail]);

        if (users.length === 0) {
            console.log('User not found');
            process.exit(1);
        }

        const userId = users[0].id;

        // Get all votes by this user
        const [votes] = await db.query(
            'SELECT coin_id, coin_name, created_at FROM votes WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );

        console.log(`\n=== Voting History for ${userEmail} ===\n`);

        if (votes.length === 0) {
            console.log('No votes found.');
        } else {
            votes.forEach((vote, index) => {
                const voteDate = new Date(vote.created_at);
                const now = new Date();
                const diffMs = now - voteDate;
                const hoursAgo = Math.floor(diffMs / (1000 * 60 * 60));
                const minutesAgo = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

                console.log(`${index + 1}. ${vote.coin_name} (${vote.coin_id})`);
                console.log(`   Voted: ${voteDate.toLocaleString()}`);
                console.log(`   Time ago: ${hoursAgo}h ${minutesAgo}m ago\n`);
            });
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkMyVotes();
