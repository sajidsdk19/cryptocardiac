const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_this';

app.use(cors());
app.use(express.json());

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- Auth Routes ---

// Signup
app.post('/api/auth/signup', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Check if user exists
        const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user
        const [result] = await db.query('INSERT INTO users (email, password_hash) VALUES (?, ?)', [email, hashedPassword]);

        // Create token
        const token = jwt.sign({ id: result.insertId, email }, JWT_SECRET, { expiresIn: '24h' });

        res.status(201).json({ token, user: { id: result.insertId, email } });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

        res.json({ token, user: { id: user.id, email: user.email } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get Current User (Verify Token)
app.get('/api/auth/me', authenticateToken, (req, res) => {
    res.json({ user: req.user });
});

// --- Voting Routes ---

// Get all vote counts
app.get('/api/votes', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT coin_id, COUNT(*) as count FROM votes GROUP BY coin_id');
        const votes = {};
        rows.forEach(row => {
            votes[row.coin_id] = row.count;
        });
        res.json(votes);
    } catch (error) {
        console.error('Get votes error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get time-based vote counts (24h, 7d, 3 months)
app.get('/api/votes/time-based', async (req, res) => {
    try {
        // Get votes for last 24 hours
        const [votes24h] = await db.query(`
            SELECT coin_id, COUNT(*) as count 
            FROM votes 
            WHERE created_at >= NOW() - INTERVAL 1 DAY 
            GROUP BY coin_id
        `);

        // Get votes for last 7 days
        const [votes7d] = await db.query(`
            SELECT coin_id, COUNT(*) as count 
            FROM votes 
            WHERE created_at >= NOW() - INTERVAL 7 DAY 
            GROUP BY coin_id
        `);

        // Get votes for last 3 months (90 days)
        const [votes3m] = await db.query(`
            SELECT coin_id, COUNT(*) as count 
            FROM votes 
            WHERE created_at >= NOW() - INTERVAL 90 DAY 
            GROUP BY coin_id
        `);

        // Combine all results into a single object
        const timeBasedVotes = {};

        votes24h.forEach(row => {
            if (!timeBasedVotes[row.coin_id]) {
                timeBasedVotes[row.coin_id] = { votes_24h: 0, votes_7d: 0, votes_3m: 0 };
            }
            timeBasedVotes[row.coin_id].votes_24h = row.count;
        });

        votes7d.forEach(row => {
            if (!timeBasedVotes[row.coin_id]) {
                timeBasedVotes[row.coin_id] = { votes_24h: 0, votes_7d: 0, votes_3m: 0 };
            }
            timeBasedVotes[row.coin_id].votes_7d = row.count;
        });

        votes3m.forEach(row => {
            if (!timeBasedVotes[row.coin_id]) {
                timeBasedVotes[row.coin_id] = { votes_24h: 0, votes_7d: 0, votes_3m: 0 };
            }
            timeBasedVotes[row.coin_id].votes_3m = row.count;
        });

        res.json(timeBasedVotes);
    } catch (error) {
        console.error('Get time-based votes error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Check user's per-coin voting status
app.get('/api/votes/status', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        // Get all votes by this user in the last 24 hours
        const [rows] = await db.query(
            'SELECT coin_id, created_at FROM votes WHERE user_id = ? AND created_at >= NOW() - INTERVAL 1 DAY',
            [userId]
        );

        console.log(`Checking status for user ${userId}. Found ${rows.length} recent votes.`);

        // Return list of coins the user has voted for in the last 24h
        const votedCoins = rows.map(row => ({
            coinId: row.coin_id,
            votedAt: row.created_at
        }));

        res.json({ votedCoins });
    } catch (error) {
        console.error('Check vote status error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Check if user can vote for a specific coin (24h restriction per coin)
app.get('/api/votes/check/:coinId', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const { coinId } = req.params;

    try {
        // Check for vote on THIS specific coin in the last 24h
        const [rows] = await db.query(
            'SELECT created_at FROM votes WHERE user_id = ? AND coin_id = ? AND created_at >= NOW() - INTERVAL 1 DAY',
            [userId, coinId]
        );

        if (rows.length > 0) {
            const lastVoteTime = new Date(rows[0].created_at);
            const now = new Date();
            const diffMs = now - lastVoteTime;
            const remainingMs = (24 * 60 * 60 * 1000) - diffMs;

            return res.json({
                canVote: false,
                remainingMs,
                lastVoteTime: lastVoteTime
            });
        }

        res.json({ canVote: true });
    } catch (error) {
        console.error('Check vote status error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Cast a vote
app.post('/api/votes', authenticateToken, async (req, res) => {
    const { coinId, coinName } = req.body;
    const userId = req.user.id;

    try {
        // Check restriction for THIS specific coin (per-coin restriction)
        const [rows] = await db.query(
            'SELECT created_at FROM votes WHERE user_id = ? AND coin_id = ? AND created_at >= NOW() - INTERVAL 1 DAY',
            [userId, coinId]
        );

        if (rows.length > 0) {
            const lastVoteTime = new Date(rows[0].created_at);
            const now = new Date();
            const diffMs = now - lastVoteTime;
            const remainingHours = Math.ceil((24 * 60 * 60 * 1000 - diffMs) / (1000 * 60 * 60));

            return res.status(400).json({
                error: `You already voted for ${coinName}. You can vote again in ${remainingHours} hour${remainingHours !== 1 ? 's' : ''}.`
            });
        }

        await db.query(
            'INSERT INTO votes (user_id, coin_id, coin_name) VALUES (?, ?, ?)',
            [userId, coinId, coinName]
        );

        res.json({ message: 'Vote cast successfully' });
    } catch (error) {
        console.error('Cast vote error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

const axios = require('axios');
const NodeCache = require('node-cache');
const myCache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes
let apiHitsToday = 0;

// Reset API hits counter every 24 hours (simple implementation)
setInterval(() => {
    apiHitsToday = 0;
}, 24 * 60 * 60 * 1000);

// --- CoinGecko Proxy Route ---
app.get('/api/coins', async (req, res) => {
    const { vs_currency = 'usd', order = 'market_cap_desc', per_page = 100, page = 1, sparkline = false } = req.query;
    const cacheKey = `coins_${vs_currency}_${order}_${per_page}_${page}_${sparkline}`;

    const cachedData = myCache.get(cacheKey);
    if (cachedData) {
        return res.json(cachedData);
    }

    try {
        apiHitsToday++;
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
            params: {
                vs_currency,
                order,
                per_page,
                page,
                sparkline
            }
        });

        myCache.set(cacheKey, response.data);
        res.json(response.data);
    } catch (error) {
        console.error('CoinGecko API error:', error.message);
        res.status(500).json({ error: 'Failed to fetch coin data' });
    }
});

// Search for cryptocurrencies
app.get('/api/coins/search', async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    const cacheKey = `search_${query}`;

    const cachedData = myCache.get(cacheKey);
    if (cachedData) {
        return res.json(cachedData);
    }

    try {
        apiHitsToday++;
        const response = await axios.get('https://api.coingecko.com/api/v3/search', {
            params: { query }
        });

        myCache.set(cacheKey, response.data);
        res.json(response.data);
    } catch (error) {
        console.error('CoinGecko Search API error:', error.message);
        res.status(500).json({ error: 'Failed to search coins' });
    }
});

// Get detailed data for specific coins by IDs
app.get('/api/coins/details', async (req, res) => {
    const { ids, vs_currency = 'usd' } = req.query;

    if (!ids) {
        return res.status(400).json({ error: 'IDs parameter is required' });
    }

    const cacheKey = `details_${ids}_${vs_currency}`;

    const cachedData = myCache.get(cacheKey);
    if (cachedData) {
        return res.json(cachedData);
    }

    try {
        apiHitsToday++;
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
            params: {
                vs_currency,
                ids,
                order: 'market_cap_desc',
                sparkline: false
            }
        });

        myCache.set(cacheKey, response.data);
        res.json(response.data);
    } catch (error) {
        console.error('CoinGecko Details API error:', error.message);
        res.status(500).json({ error: 'Failed to fetch coin details' });
    }
});

// --- Admin Stats Route ---
app.get('/api/admin/stats', async (req, res) => {
    // In a real app, add admin check here: if (req.user.role !== 'admin') ...

    try {
        // 1. Total Users
        const [userRows] = await db.query('SELECT COUNT(*) as count FROM users');
        const totalUsers = userRows[0].count;

        // 2. Total Votes
        const [voteRows] = await db.query('SELECT COUNT(*) as count FROM votes');
        const totalVotes = voteRows[0].count;

        // 3. Top Coin (All Time)
        const [topCoinRows] = await db.query('SELECT coin_name, COUNT(*) as count FROM votes GROUP BY coin_name ORDER BY count DESC LIMIT 1');
        const topCoinAllTime = topCoinRows.length > 0 ? topCoinRows[0] : null;

        // 4. Top Coin (Last 24h)
        const [topCoin24hRows] = await db.query(`
            SELECT coin_name, COUNT(*) as count 
            FROM votes 
            WHERE created_at >= NOW() - INTERVAL 1 DAY 
            GROUP BY coin_name 
            ORDER BY count DESC 
            LIMIT 1
        `);
        const topCoin24h = topCoin24hRows.length > 0 ? topCoin24hRows[0] : null;

        res.json({
            apiHitsToday,
            totalUsers,
            totalVotes,
            topCoinAllTime,
            topCoin24h
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
