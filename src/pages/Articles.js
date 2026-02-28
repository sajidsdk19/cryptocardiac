import React, { useState, useEffect } from 'react';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import { useMediaQuery, useTheme } from '@mui/material';
import { Helmet } from 'react-helmet-async';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ArticleCard = ({ article, onClick, isMobile }) => (
    <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: isMobile ? '20px' : '24px',
        marginBottom: '24px',
        transition: 'transform 0.2s, background 0.2s',
        cursor: 'pointer'
    }}
        onClick={() => onClick(article)}
        onMouseEnter={e => {
            if (!isMobile) {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            }
        }}
        onMouseLeave={e => {
            if (!isMobile) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
            }
        }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{
                background: 'rgba(206, 52, 234, 0.1)',
                color: '#CE34EA',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.7rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
            }}>
                {article.category}
            </span>
            <span style={{ color: '#555', fontSize: '0.75rem' }}>
                {article.created_at ? new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Featured Content'}
            </span>
        </div>
        <h3 style={{ color: '#fff', fontSize: isMobile ? '1.2rem' : '1.4rem', marginBottom: '12px', lineHeight: '1.4' }}>{article.title}</h3>
        <p style={{ color: '#CE34EA', fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px' }}>{article.source}</p>
        <p style={{ color: '#888', fontSize: isMobile ? '0.9rem' : '1rem', lineHeight: '1.6' }}>{article.description}</p>
        <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px' }}>
            <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 500 }}>Read Full Article →</span>
        </div>
    </div>
);

const ArticleDetail = ({ article, onBack, isMobile }) => (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
        <button
            onClick={onBack}
            style={{
                background: 'none',
                border: 'none',
                color: '#CE34EA',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                marginBottom: isMobile ? '20px' : '30px',
                padding: 0
            }}
        >
            ← Back to Articles
        </button>

        <span style={{
            background: 'rgba(206, 52, 234, 0.1)',
            color: '#CE34EA',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            marginBottom: '16px',
            display: 'inline-block'
        }}>
            {article.category}
        </span>

        <h1 style={{
            color: '#fff',
            fontSize: isMobile ? '1.8rem' : '2.5rem',
            fontWeight: 800,
            marginBottom: '16px',
            lineHeight: '1.2'
        }}>
            {article.title}
        </h1>

        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            marginBottom: isMobile ? '30px' : '40px',
            color: '#888',
            fontSize: '0.85rem',
            gap: '8px'
        }}>
            <span style={{ color: '#CE34EA', fontWeight: 600 }}>{article.source}</span>
            <span>•</span>
            <span>Evergreen Content</span>
            {!isMobile && (
                <>
                    <span>•</span>
                    <span>8 min read</span>
                </>
            )}
        </div>

        <div style={{ color: '#ccc', fontSize: isMobile ? '1rem' : '1.1rem', lineHeight: '1.8' }}>
            {(article.fullContent || []).map((paragraph, i) => (
                <p key={i} style={{ marginBottom: '1.5rem' }}>{paragraph}</p>
            ))}
        </div>

        <div style={{
            marginTop: isMobile ? '40px' : '60px',
            padding: isMobile ? '25px' : '40px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px',
            textAlign: 'center'
        }}>
            <h3 style={{ color: '#fff', marginBottom: '15px', fontSize: isMobile ? '1.1rem' : '1.3rem' }}>Enjoyed this deep dive?</h3>
            <p style={{ color: '#888', marginBottom: '25px', fontSize: '0.9rem' }}>Share it with your community and help grow the heart of crypto.</p>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'center', gap: '12px' }}>
                <button
                    onClick={() => {
                        const text = encodeURIComponent(`${article.title} — via CryptoCardiac`);
                        const url = encodeURIComponent('https://cryptocardiac.com/articles');
                        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
                    }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    style={{ padding: '12px 25px', borderRadius: '8px', border: 'none', background: '#1DA1F2', color: '#fff', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', transition: 'opacity 0.2s, transform 0.2s' }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" /></svg>
                    Share on X
                </button>
                <button
                    onClick={() => {
                        const text = encodeURIComponent(`${article.title} — via CryptoCardiac\nhttps://cryptocardiac.com/articles`);
                        window.open(`https://t.me/share/url?url=https://cryptocardiac.com/articles&text=${text}`, '_blank', 'noopener,noreferrer');
                    }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    style={{ padding: '12px 25px', borderRadius: '8px', border: 'none', background: '#0088cc', color: '#fff', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', transition: 'opacity 0.2s, transform 0.2s' }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8-1.7 8.02c-.13.59-.47.73-.95.46l-2.6-1.92-1.25 1.21c-.14.14-.26.26-.53.26l.19-2.66 4.83-4.36c.21-.19-.05-.29-.33-.1L7.1 14.53l-2.56-.8c-.56-.17-.57-.56.12-.83l10-3.86c.46-.17.87.11.98.76z" /></svg>
                    Telegram
                </button>
            </div>
        </div>
    </div>
);

const TrendingTopic = ({ title, trend }) => (
    <div style={{
        padding: '12px 0',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    }}>
        <span style={{ color: '#ccc', fontSize: '0.9rem' }}>{title}</span>
        <span style={{ color: trend.startsWith('+') ? '#4caf50' : '#f44336', fontSize: '0.8rem' }}>{trend}</span>
    </div>
);

// Skeleton loader for articles
const ArticleSkeleton = () => (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
        {[80, 60, 40, 90, 70].map((w, i) => (
            <div key={i} style={{ height: i === 1 ? '20px' : '12px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', marginBottom: '12px', width: `${w}%`, animation: 'pulse 1.5s ease-in-out infinite' }} />
        ))}
    </div>
);

const Articles = () => {
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [pulseEmail, setPulseEmail] = useState('');
    const [pulseSubscribed, setPulseSubscribed] = useState(false);
    const [articles, setArticles] = useState([]);
    const [trendingTopics, setTrendingTopics] = useState([]);
    const [articlesLoading, setArticlesLoading] = useState(true);
    const [trendingLoading, setTrendingLoading] = useState(true);
    const [articlesError, setArticlesError] = useState('');

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Fetch articles
    useEffect(() => {
        setArticlesLoading(true);
        fetch(`${API_URL}/articles`)
            .then(r => r.json())
            .then(data => {
                setArticles(Array.isArray(data) ? data : []);
                setArticlesError('');
            })
            .catch(() => setArticlesError('Unable to load articles. Please try again later.'))
            .finally(() => setArticlesLoading(false));
    }, []);

    // Fetch trending topics
    useEffect(() => {
        setTrendingLoading(true);
        fetch(`${API_URL}/trending-topics`)
            .then(r => r.json())
            .then(data => setTrendingTopics(Array.isArray(data) ? data : []))
            .catch(() => setTrendingTopics([]))
            .finally(() => setTrendingLoading(false));
    }, []);

    const handlePulseSubscribe = (e) => {
        e.preventDefault();
        if (!pulseEmail || !pulseEmail.includes('@')) {
            alert('Please enter a valid email address.');
            return;
        }
        setPulseSubscribed(true);
        setPulseEmail('');
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [selectedArticle]);

    return (
        <div style={{ background: 'rgb(21,21,32)', minHeight: '100vh' }}>
            <Helmet>
                <title>Crypto Articles & Insights | CryptoCardiac Featured Content</title>
                <meta name="description" content="Explore curated cryptocurrency articles, market analysis, and blockchain insights from leading publications. Stay informed with expert crypto content and industry trends." />
                <meta name="keywords" content="crypto articles, blockchain insights, cryptocurrency analysis, market trends, crypto news, defi articles, solana, bitcoin, dogecoin, trump coin, no KYC exchanges, crypto education" />
                <meta property="og:title" content="Crypto Articles & Insights | CryptoCardiac Featured Content" />
                <meta property="og:description" content="Read our featured deep dives into the crypto market, including education, No-KYC exchanges, privacy tools, and global adoption trends." />
                <meta property="og:type" content="article" />
                <meta property="og:url" content="https://cryptocardiac.com/articles" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="CryptoArticles | CryptoCardiac" />
                <meta name="twitter:description" content="Handpicked crypto insights, articles, and educational content from leading blockchain researchers." />
                <link rel="canonical" href="https://cryptocardiac.com/articles" />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Blog",
                        "name": "CryptoCardiac Featured Articles",
                        "url": "https://cryptocardiac.com/articles",
                        "description": "Curated cryptocurrency analysis, educational guides, and the latest blockchain insights.",
                        "publisher": {
                            "@type": "Organization",
                            "name": "CryptoCardiac",
                            "url": "https://cryptocardiac.com"
                        }
                    })}
                </script>
            </Helmet>
            <Navbar />

            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes pulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.4; }
                    }
                `}
            </style>

            {/* Hero Section */}
            {!selectedArticle && (
                <div style={{
                    background: 'linear-gradient(135deg, #5700F9 0%, #CE34EA 100%)',
                    padding: isMobile ? '60px 20px' : '80px 20px',
                    textAlign: 'center',
                    marginBottom: isMobile ? '30px' : '40px',
                    animation: 'fadeIn 0.6s ease-out'
                }}>
                    <h1 style={{
                        color: '#fff',
                        fontSize: isMobile ? '2.2rem' : '3rem',
                        fontWeight: 800,
                        marginBottom: '16px',
                        lineHeight: 1.1
                    }}>
                        Featured Insights
                    </h1>
                    <p style={{
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: isMobile ? '1rem' : '1.2rem',
                        maxWidth: '800px',
                        margin: '0 auto',
                        lineHeight: 1.5
                    }}>
                        Curated market analysis and industrial trends from the world's leading blockchain publications.
                    </p>
                </div>
            )}

            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: selectedArticle
                    ? (isMobile ? '40px 16px 80px' : '60px 20px 80px')
                    : (isMobile ? '0 16px 60px' : '0 20px 80px'),
                display: 'grid',
                gridTemplateColumns: (selectedArticle || isMobile) ? '1fr' : 'minmax(0, 1fr) 350px',
                gap: isMobile ? '40px' : '40px'
            }}>

                {/* Main Content */}
                <div style={{ maxWidth: selectedArticle ? '850px' : 'none', margin: selectedArticle ? '0 auto' : '0' }}>
                    {selectedArticle ? (
                        <ArticleDetail
                            article={selectedArticle}
                            onBack={() => setSelectedArticle(null)}
                            isMobile={isMobile}
                        />
                    ) : (
                        <>
                            <h2 style={{ color: '#fff', fontSize: isMobile ? '1.4rem' : '1.8rem', marginBottom: '25px', display: 'flex', alignItems: 'center' }}>
                                <span style={{ width: '4px', height: isMobile ? '20px' : '24px', background: '#CE34EA', marginRight: '12px', borderRadius: '2px' }}></span>
                                Must Read Stories
                            </h2>

                            {articlesError && (
                                <div style={{ background: 'rgba(244,67,54,0.08)', border: '1px solid rgba(244,67,54,0.2)', borderRadius: '12px', padding: '20px', textAlign: 'center', color: '#f44336', marginBottom: '24px' }}>
                                    {articlesError}
                                </div>
                            )}

                            {articlesLoading ? (
                                [1, 2, 3].map(i => <ArticleSkeleton key={i} />)
                            ) : (
                                articles.map((art) => (
                                    <ArticleCard key={art.id} article={art} onClick={setSelectedArticle} isMobile={isMobile} />
                                ))
                            )}

                            {!articlesLoading && !articlesError && articles.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#555' }}>
                                    <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📭</div>
                                    <p>No articles published yet. Check back soon!</p>
                                </div>
                            )}

                            <div style={{ marginTop: '40px', padding: '30px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px dashed rgba(255,255,255,0.1)', textAlign: 'center' }}>
                                <p style={{ color: '#666', fontSize: '0.85rem' }}>More articles are being curated by our editorial team daily.</p>
                            </div>
                        </>
                    )}
                </div>

                {/* Sidebar - Only show on list view */}
                {!selectedArticle && (
                    <aside style={{ marginTop: isMobile ? '40px' : '0' }}>
                        <div style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '20px',
                            padding: '24px',
                            position: isMobile ? 'static' : 'sticky',
                            top: '100px'
                        }}>
                            <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '20px' }}>Trending Topics</h3>

                            {trendingLoading ? (
                                [1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} style={{ height: '12px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', marginBottom: '14px', animation: 'pulse 1.5s ease-in-out infinite' }} />
                                ))
                            ) : (
                                trendingTopics.map(t => (
                                    <TrendingTopic key={t.id} title={t.title} trend={t.trend} />
                                ))
                            )}

                            {!trendingLoading && trendingTopics.length === 0 && (
                                <p style={{ color: '#555', fontSize: '0.85rem', textAlign: 'center', padding: '10px 0' }}>No trending topics yet.</p>
                            )}

                            <div style={{
                                marginTop: '40px',
                                padding: '24px',
                                background: 'linear-gradient(135deg, rgba(87, 0, 249, 0.2) 0%, rgba(206, 52, 234, 0.2) 100%)',
                                borderRadius: '16px',
                                border: '1px solid rgba(206, 52, 234, 0.3)',
                                textAlign: 'center'
                            }}>
                                <h4 style={{ color: '#fff', marginBottom: '10px' }}>Join the Pulse</h4>
                                {pulseSubscribed ? (
                                    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                                        <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>✨</div>
                                        <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>Thanks for subscribing!</p>
                                    </div>
                                ) : (
                                    <>
                                        <p style={{ color: '#aaa', fontSize: '0.8rem', marginBottom: '20px' }}>Weekly insights delivered straight to your inbox.</p>
                                        <form onSubmit={handlePulseSubscribe}>
                                            <input
                                                type="email"
                                                placeholder="Email address"
                                                value={pulseEmail}
                                                onChange={(e) => setPulseEmail(e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    borderRadius: '8px',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    background: 'rgba(0,0,0,0.2)',
                                                    color: '#fff',
                                                    marginBottom: '10px',
                                                    outline: 'none',
                                                    boxSizing: 'border-box',
                                                    fontSize: '0.9rem'
                                                }}
                                                required
                                            />
                                            <button
                                                type="submit"
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    background: '#CE34EA',
                                                    color: '#fff',
                                                    fontWeight: 700,
                                                    cursor: 'pointer',
                                                    fontSize: '0.9rem'
                                                }}
                                            >
                                                Subscribe
                                            </button>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>
                    </aside>
                )}

            </div>

            <Footer />
        </div>
    );
};

export default Articles;
