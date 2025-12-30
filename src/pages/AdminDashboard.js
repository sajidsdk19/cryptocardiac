import React, { useState, useEffect } from 'react';
import Navbar from '../component/Navbar';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${API_URL}/admin/stats`);
            if (!response.ok) throw new Error('Failed to fetch stats');
            const data = await response.json();
            setStats(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching admin stats:', err);
            setError('Failed to load statistics');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const containerStyle = {
        minHeight: '100vh',
        backgroundColor: 'rgb(21, 21, 32)',
        color: '#fff',
        padding: '40px 20px'
    };

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
    };

    const cardStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
    };

    const valueStyle = {
        fontSize: '2.5rem',
        fontWeight: '700',
        margin: '10px 0',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    };

    const labelStyle = {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '0.9rem',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    };

    if (loading) return (
        <div style={containerStyle}>
            <Navbar />
            <div style={{ textAlign: 'center', marginTop: '100px' }}>Loading stats...</div>
        </div>
    );

    return (
        <>
            <Navbar />
            <div style={containerStyle}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Super Admin Dashboard</h1>
                    <button
                        onClick={fetchStats}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '8px',
                            border: 'none',
                            background: '#8B5CF6',
                            color: 'white',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        Refresh Stats
                    </button>
                </div>

                {error && (
                    <div style={{
                        backgroundColor: 'rgba(255, 61, 0, 0.1)',
                        color: '#FF3D00',
                        padding: '16px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                {stats && (
                    <div style={gridStyle}>
                        {/* CoinGecko Hits */}
                        <div style={cardStyle}>
                            <div style={labelStyle}>CoinGecko Hits Today</div>
                            <div style={valueStyle}>{stats.apiHitsToday}</div>
                            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                                Resets every 24h
                            </div>
                        </div>

                        {/* Total Users */}
                        <div style={cardStyle}>
                            <div style={labelStyle}>Total Registered Users</div>
                            <div style={valueStyle}>{stats.totalUsers}</div>
                        </div>

                        {/* Total Votes */}
                        <div style={cardStyle}>
                            <div style={labelStyle}>Total Votes Cast</div>
                            <div style={valueStyle}>{stats.totalVotes}</div>
                        </div>

                        {/* Top Coin All Time */}
                        <div style={cardStyle}>
                            <div style={labelStyle}>Top Coin (All Time)</div>
                            <div style={{ ...valueStyle, fontSize: '1.8rem' }}>
                                {stats.topCoinAllTime ? stats.topCoinAllTime.coin_name : 'N/A'}
                            </div>
                            <div style={{ color: '#CE34EA', fontWeight: '600' }}>
                                {stats.topCoinAllTime ? `${stats.topCoinAllTime.count} votes` : '-'}
                            </div>
                        </div>

                        {/* Top Coin 24h */}
                        <div style={cardStyle}>
                            <div style={labelStyle}>Top Coin (Last 24h)</div>
                            <div style={{ ...valueStyle, fontSize: '1.8rem' }}>
                                {stats.topCoin24h ? stats.topCoin24h.coin_name : 'N/A'}
                            </div>
                            <div style={{ color: '#CE34EA', fontWeight: '600' }}>
                                {stats.topCoin24h ? `${stats.topCoin24h.count} votes` : '-'}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default AdminDashboard;
