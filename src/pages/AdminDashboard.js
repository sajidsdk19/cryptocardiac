import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// ─── Reusable styles ─────────────────────────────────────────────────────────
const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)',
    color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
    marginBottom: '12px'
};
const labelStyle = { color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px', display: 'block' };
const cardStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', marginBottom: '20px' };
const btnPrimary = { padding: '11px 22px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #5700F9, #CE34EA)', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' };
const btnDanger = { padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'rgba(244,67,54,0.15)', color: '#f44336', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem', border: '1px solid rgba(244,67,54,0.3)' };
const btnSecondary = { padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: '#ccc', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' };
const tagStyle = { display: 'inline-block', padding: '3px 10px', borderRadius: '20px', background: 'rgba(206,52,234,0.15)', color: '#CE34EA', fontSize: '0.72rem', fontWeight: 600, border: '1px solid rgba(206,52,234,0.3)', marginRight: '6px' };

// ─── Login Gate ───────────────────────────────────────────────────────────────
const LoginGate = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Check password immediately by making a test API call
        fetch(`${API_URL}/articles`, {
            headers: { 'x-admin-password': password }
        }).then(async () => {
            // We verify by trying to POST something fake with a probe
            // Actually let's just store password and let the first real action verify
            if (!password.trim()) return setError('Enter the admin password.');
            onLogin(password.trim());
        });
    };

    return (
        <div style={{ minHeight: '100vh', background: 'rgb(21,21,32)', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
                <div style={{ width: '100%', maxWidth: '420px', ...cardStyle, border: '1px solid rgba(206,52,234,0.3)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🔐</div>
                        <h2 style={{ color: '#fff', fontWeight: 800, margin: 0, fontSize: '1.6rem' }}>Super Admin</h2>
                        <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '6px' }}>CryptoCardiac Content Management</p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <label style={labelStyle}>Admin Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => { setPassword(e.target.value); setError(''); }}
                            placeholder="Enter super admin password..."
                            style={inputStyle}
                            autoFocus
                        />
                        {error && <p style={{ color: '#f44336', fontSize: '0.85rem', marginBottom: '12px' }}>{error}</p>}
                        <button type="submit" style={{ ...btnPrimary, width: '100%', padding: '14px' }}>
                            Access Dashboard →
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

// ─── Article Form ─────────────────────────────────────────────────────────────
const ArticleForm = ({ adminPassword, onCreated }) => {
    const [form, setForm] = useState({ title: '', source: '', category: '', description: '', paragraphs: [''] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const set = (field, value) => setForm(f => ({ ...f, [field]: value }));
    const setParagraph = (i, val) => setForm(f => {
        const p = [...f.paragraphs]; p[i] = val; return { ...f, paragraphs: p };
    });
    const addParagraph = () => setForm(f => ({ ...f, paragraphs: [...f.paragraphs, ''] }));
    const removeParagraph = i => setForm(f => ({ ...f, paragraphs: f.paragraphs.filter((_, idx) => idx !== i) }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { title, source, category, description, paragraphs } = form;
        const fullContent = paragraphs.filter(p => p.trim());
        if (!title || !source || !category || !description || fullContent.length === 0) {
            return setError('All fields and at least one paragraph are required.');
        }
        setLoading(true); setError(''); setSuccess('');
        try {
            const res = await fetch(`${API_URL}/articles`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-password': adminPassword },
                body: JSON.stringify({ title, source, category, description, fullContent })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to create article');
            setSuccess('✅ Article published successfully!');
            setForm({ title: '', source: '', category: '', description: '', paragraphs: [''] });
            onCreated();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['Education', 'Analysis', 'Exchanges', 'Privacy', 'Global Adoption', 'Altcoins', 'Market Leaders', 'Meme Coins', 'PolitiFi', 'DeFi', 'NFTs', 'Regulation', 'Other'];

    return (
        <form onSubmit={handleSubmit} style={{ ...cardStyle, border: '1px solid rgba(206,52,234,0.2)' }}>
            <h3 style={{ color: '#fff', marginBottom: '20px', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#CE34EA' }}>✍</span> Publish New Article
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                    <label style={labelStyle}>Title *</label>
                    <input style={inputStyle} value={form.title} onChange={e => set('title', e.target.value)} placeholder="Article title..." />
                </div>
                <div>
                    <label style={labelStyle}>Source *</label>
                    <input style={inputStyle} value={form.source} onChange={e => set('source', e.target.value)} placeholder="e.g. Blockchain Magazine" />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                    <label style={labelStyle}>Category *</label>
                    <select style={{ ...inputStyle, marginBottom: '12px' }} value={form.category} onChange={e => set('category', e.target.value)}>
                        <option value="">Select category...</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <label style={labelStyle}>Summary / Description *</label>
                    <input style={inputStyle} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Short description shown on cards..." />
                </div>
            </div>

            <label style={{ ...labelStyle, marginTop: '8px' }}>Full Article Content (Paragraphs) *</label>
            {form.paragraphs.map((p, i) => (
                <div key={i} style={{ position: 'relative', marginBottom: '8px' }}>
                    <textarea
                        rows={4}
                        style={{ ...inputStyle, marginBottom: 0, resize: 'vertical', fontFamily: 'inherit' }}
                        value={p}
                        onChange={e => setParagraph(i, e.target.value)}
                        placeholder={`Paragraph ${i + 1}...`}
                    />
                    {form.paragraphs.length > 1 && (
                        <button type="button" onClick={() => removeParagraph(i)} style={{ ...btnDanger, position: 'absolute', top: '8px', right: '8px', padding: '4px 10px', fontSize: '0.75rem' }}>✕</button>
                    )}
                </div>
            ))}
            <button type="button" onClick={addParagraph} style={{ ...btnSecondary, marginBottom: '16px', fontSize: '0.85rem' }}>
                + Add Paragraph
            </button>

            {error && <p style={{ color: '#f44336', background: 'rgba(244,67,54,0.08)', padding: '10px 14px', borderRadius: '8px', marginBottom: '12px', fontSize: '0.9rem' }}>{error}</p>}
            {success && <p style={{ color: '#4caf50', background: 'rgba(76,175,80,0.08)', padding: '10px 14px', borderRadius: '8px', marginBottom: '12px', fontSize: '0.9rem' }}>{success}</p>}

            <button type="submit" style={btnPrimary} disabled={loading}>
                {loading ? 'Publishing...' : '🚀 Publish Article'}
            </button>
        </form>
    );
};

// ─── Articles List ─────────────────────────────────────────────────────────────
const ArticlesList = ({ adminPassword, refresh }) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    const fetchArticles = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/articles`);
            const data = await res.json();
            setArticles(data);
        } catch { setArticles([]); }
        setLoading(false);
    }, []);

    useEffect(() => { fetchArticles(); }, [fetchArticles, refresh]);

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Delete article: "${title}"?`)) return;
        setDeletingId(id);
        try {
            await fetch(`${API_URL}/articles/${id}`, {
                method: 'DELETE',
                headers: { 'x-admin-password': adminPassword }
            });
            setArticles(a => a.filter(art => art.id !== id));
        } catch { alert('Failed to delete article.'); }
        setDeletingId(null);
    };

    const formatDate = (dt) => dt ? new Date(dt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '';

    if (loading) return <div style={{ color: '#666', padding: '20px', textAlign: 'center' }}>Loading articles...</div>;

    return (
        <div style={cardStyle}>
            <h3 style={{ color: '#fff', marginBottom: '20px', fontSize: '1.15rem' }}>
                📋 Published Articles <span style={{ color: '#CE34EA', fontWeight: 700 }}>({articles.length})</span>
            </h3>
            {articles.length === 0 && <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>No articles yet. Publish one above!</p>}
            {articles.map(art => (
                <div key={art.id} style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ marginBottom: '6px' }}>
                            <span style={tagStyle}>{art.category}</span>
                            <span style={{ color: '#555', fontSize: '0.75rem' }}>{formatDate(art.created_at)}</span>
                        </div>
                        <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{art.title}</div>
                        <div style={{ color: '#CE34EA', fontSize: '0.8rem' }}>{art.source}</div>
                    </div>
                    <button
                        onClick={() => handleDelete(art.id, art.title)}
                        disabled={deletingId === art.id}
                        style={{ ...btnDanger, flexShrink: 0 }}
                    >
                        {deletingId === art.id ? '...' : '🗑 Delete'}
                    </button>
                </div>
            ))}
        </div>
    );
};

// ─── Trending Topics Management ────────────────────────────────────────────────
const TrendingManager = ({ adminPassword }) => {
    const [topics, setTopics] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [newTrend, setNewTrend] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchTopics = async () => {
        try {
            const res = await fetch(`${API_URL}/trending-topics`);
            setTopics(await res.json());
        } catch { }
    };

    useEffect(() => { fetchTopics(); }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newTitle || !newTrend) return alert('Both title and trend are required.');
        setLoading(true);
        try {
            await fetch(`${API_URL}/trending-topics`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-password': adminPassword },
                body: JSON.stringify({ title: newTitle, trend: newTrend })
            });
            setNewTitle(''); setNewTrend('');
            fetchTopics();
        } catch { alert('Failed to add topic.'); }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Remove this trending topic?')) return;
        await fetch(`${API_URL}/trending-topics/${id}`, { method: 'DELETE', headers: { 'x-admin-password': adminPassword } });
        fetchTopics();
    };

    const isPositive = (t) => t && t.startsWith('+');

    return (
        <div style={cardStyle}>
            <h3 style={{ color: '#fff', marginBottom: '20px', fontSize: '1.15rem' }}>📈 Trending Topics</h3>
            <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 120px auto', gap: '10px', marginBottom: '20px', alignItems: 'end' }}>
                <div>
                    <label style={labelStyle}>Hashtag</label>
                    <input style={{ ...inputStyle, marginBottom: 0 }} value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="#BitcoinETF" />
                </div>
                <div>
                    <label style={labelStyle}>Trend</label>
                    <input style={{ ...inputStyle, marginBottom: 0 }} value={newTrend} onChange={e => setNewTrend(e.target.value)} placeholder="+14.2%" />
                </div>
                <button type="submit" style={{ ...btnPrimary, whiteSpace: 'nowrap' }} disabled={loading}>
                    {loading ? '...' : '+ Add'}
                </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {topics.length === 0 && <p style={{ color: '#666', fontSize: '0.9rem', textAlign: 'center' }}>No trending topics yet.</p>}
                {topics.map(t => (
                    <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <span style={{ color: '#ccc', fontWeight: 500 }}>{t.title}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ color: isPositive(t.trend) ? '#4caf50' : '#f44336', fontWeight: 700, fontSize: '0.9rem' }}>{t.trend}</span>
                            <button onClick={() => handleDelete(t.id)} style={{ ...btnDanger, padding: '4px 10px', fontSize: '0.75rem' }}>✕</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── Stats Bar ─────────────────────────────────────────────────────────────────
const StatsBar = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetch(`${API_URL}/admin/stats`).then(r => r.json()).then(setStats).catch(() => { });
    }, []);

    const items = stats ? [
        { label: 'Users', value: stats.totalUsers },
        { label: 'Total Votes', value: stats.totalVotes },
        { label: 'API Hits Today', value: stats.apiHitsToday },
        { label: 'Top Coin', value: stats.topCoinAllTime?.coin_name || '—' },
    ] : [];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '32px' }}>
            {items.map(({ label, value }) => (
                <div key={label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                    <div style={{ color: '#888', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '6px' }}>{label}</div>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.4rem', background: 'linear-gradient(135deg, #5700F9, #CE34EA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{value}</div>
                </div>
            ))}
        </div>
    );
};

// ─── Main Dashboard ────────────────────────────────────────────────────────────
const AdminDashboard = () => {
    const [adminPassword, setAdminPassword] = useState(() => sessionStorage.getItem('cc_admin_pw') || '');
    const [tab, setTab] = useState('articles');
    const [refreshKey, setRefreshKey] = useState(0);

    const handleLogin = (pw) => {
        sessionStorage.setItem('cc_admin_pw', pw);
        setAdminPassword(pw);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('cc_admin_pw');
        setAdminPassword('');
    };

    if (!adminPassword) return <LoginGate onLogin={handleLogin} />;

    const tabs = [
        { id: 'articles', label: '📰 Articles' },
        { id: 'trending', label: '📈 Trending Topics' },
        { id: 'stats', label: '📊 Site Stats' },
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'rgb(21,21,32)', color: '#fff', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div style={{ flex: 1, maxWidth: '1100px', width: '100%', margin: '0 auto', padding: '40px 20px 80px' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                        <h1 style={{ margin: 0, fontWeight: 800, fontSize: '1.9rem', background: 'linear-gradient(135deg, #5700F9, #CE34EA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Super Admin Dashboard
                        </h1>
                        <p style={{ color: '#555', margin: '4px 0 0', fontSize: '0.85rem' }}>CryptoCardiac Content Management System</p>
                    </div>
                    <button onClick={handleLogout} style={{ ...btnSecondary, fontSize: '0.85rem' }}>🔓 Logout</button>
                </div>

                {/* Tab Nav */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0' }}>
                    {tabs.map(t => (
                        <button key={t.id} onClick={() => setTab(t.id)} style={{
                            padding: '10px 20px', borderRadius: '10px 10px 0 0', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
                            background: tab === t.id ? 'rgba(206,52,234,0.15)' : 'transparent',
                            color: tab === t.id ? '#CE34EA' : '#666',
                            borderBottom: tab === t.id ? '2px solid #CE34EA' : '2px solid transparent',
                            transition: 'all 0.2s'
                        }}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {tab === 'articles' && (
                    <>
                        <ArticleForm adminPassword={adminPassword} onCreated={() => setRefreshKey(k => k + 1)} />
                        <ArticlesList adminPassword={adminPassword} refresh={refreshKey} />
                    </>
                )}
                {tab === 'trending' && <TrendingManager adminPassword={adminPassword} />}
                {tab === 'stats' && <StatsBar />}
            </div>
            <Footer />
        </div>
    );
};

export default AdminDashboard;
