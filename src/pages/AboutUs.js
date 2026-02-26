import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import { Helmet } from 'react-helmet-async';

const StatCard = ({ value, label }) => (
    <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px',
        padding: '24px',
        textAlign: 'center',
    }}>
        <div style={{ fontSize: '2rem', fontWeight: 800, background: 'linear-gradient(135deg, #5700F9, #CE34EA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{value}</div>
        <div style={{ color: '#888', fontSize: '0.85rem', marginTop: '4px' }}>{label}</div>
    </div>
);

const FeatureCard = ({ icon, title, desc }) => (
    <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px',
        padding: '24px',
    }}>
        <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{icon}</div>
        <h3 style={{ color: '#fff', marginBottom: '8px', fontSize: '1rem' }}>{title}</h3>
        <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: 1.6 }}>{desc}</p>
    </div>
);

const AboutUs = () => {
    return (
        <>
            <Helmet>
                <title>About CryptoCardiac | Community-Powered Crypto Voting Platform</title>
                <meta name="description" content="Learn about CryptoCardiac's mission to provide transparent community-driven cryptocurrency rankings. Discover our voting system, real-time analytics, and commitment to crypto democracy." />
                <meta name="keywords" content="about cryptocardiac, crypto voting platform, community crypto rankings, cryptocurrency analytics, crypto democracy, blockchain voting software, transparent crypto rankings" />
                <meta property="og:title" content="About CryptoCardiac | Community-Powered Crypto Voting Platform" />
                <meta property="og:description" content="The social pulse of cryptocurrency communities — where the crowd decides which coins are beating hardest. Built to give the crypto community a voice." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://cryptocardiac.com/about" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content="About CryptoCardiac" />
                <meta name="twitter:description" content="Learn about CryptoCardiac's mission to provide transparent, community-driven cryptocurrency rankings." />
                <link rel="canonical" href="https://cryptocardiac.com/about" />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "AboutPage",
                        "name": "About CryptoCardiac",
                        "url": "https://cryptocardiac.com/about",
                        "description": "Learn about the mission and features of the CryptoCardiac community crypto voting platform.",
                        "mainEntity": {
                            "@type": "Organization",
                            "name": "CryptoCardiac",
                            "url": "https://cryptocardiac.com",
                            "description": "A community-powered cryptocurrency voting platform built to capture genuine sentiment across 19,000+ crypto projects.",
                            "founder": {
                                "@type": "Person",
                                "name": "Sajid Khan",
                                "url": "https://sajidkhan.me"
                            }
                        }
                    })}
                </script>
            </Helmet>
            <Navbar />
            <div style={{
                minHeight: '100vh',
                background: 'rgb(21,21,32)',
                color: '#ccc',
                fontFamily: 'Inter, sans-serif',
                lineHeight: '1.8',
            }}>
                {/* Hero */}
                <div style={{
                    background: 'linear-gradient(135deg, #5700F9 0%, #CE34EA 100%)',
                    padding: '80px 20px',
                    textAlign: 'center',
                }}>
                    <h1 style={{ color: '#fff', fontSize: '2.8rem', fontWeight: 800, marginBottom: '1rem' }}>
                        About CryptoCardiac
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto' }}>
                        The social pulse of cryptocurrency communities — where the crowd decides which coins are beating hardest.
                    </p>
                </div>

                <div style={{ maxWidth: '960px', margin: '0 auto', padding: '60px 20px' }}>

                    {/* Mission */}
                    <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                        <h2 style={{ color: '#fff', fontSize: '1.8rem', marginBottom: '1rem' }}>Our Mission</h2>
                        <p style={{ color: '#aaa', maxWidth: '680px', margin: '0 auto', fontSize: '1.05rem' }}>
                            CryptoCardiac was built to give the crypto community a voice. We believe that community sentiment is a powerful signal — and we've built a transparent, real-time platform to capture it. No bots. No bias. Just votes.
                        </p>
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '3.5rem' }}>
                        <StatCard value="19,000+" label="Coins Tracked" />
                        <StatCard value="24/7" label="Real-Time Data" />
                        <StatCard value="1/day" label="Vote Per Coin" />
                        <StatCard value="Free" label="Always Free" />
                    </div>

                    {/* Features */}
                    <h2 style={{ color: '#fff', fontSize: '1.6rem', marginBottom: '1.5rem', textAlign: 'center' }}>What We Offer</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '3.5rem' }}>
                        <FeatureCard icon="🗳️" title="Community Voting" desc="Vote for your favorite cryptocurrencies once per day. Votes are tracked across 24h, 7d, and 3-month windows." />
                        <FeatureCard icon="📊" title="Live Rankings" desc="See which coins the community is buzzing about in real time, sorted by recent vote momentum." />
                        <FeatureCard icon="🔍" title="Deep Coin Search" desc="Search across 19,000+ cryptocurrencies with live market data powered by CoinGecko." />
                        <FeatureCard icon="🏆" title="Share Points" desc="Earn share points every time you vote. Climb the leaderboard and show your crypto conviction." />
                    </div>

                    {/* CTA */}
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Ready to vote?</h2>
                        <p style={{ color: '#888', marginBottom: '1.5rem' }}>Join thousands of crypto enthusiasts and make your voice heard.</p>
                        <Link to="/" style={{
                            display: 'inline-block',
                            padding: '14px 36px',
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #5700F9 0%, #CE34EA 100%)',
                            color: '#fff',
                            fontWeight: 700,
                            textDecoration: 'none',
                            fontSize: '1rem',
                        }}>
                            Start Voting →
                        </Link>
                    </div>

                    {/* Additional Content Sections */}
                    <div style={{ marginTop: '4rem' }}>
                        <h2 style={{ color: '#fff', fontSize: '1.6rem', marginBottom: '1.5rem', textAlign: 'center' }}>🎯 How Crypto Voting Works</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '3rem' }}>
                            <div style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '12px',
                                padding: '24px',
                            }}>
                                <h4 style={{ color: '#CE34EA', marginBottom: '12px' }}>One Vote Per Day</h4>
                                <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                    Each user can vote for any cryptocurrency once every 24 hours. This prevents spam and ensures each vote represents genuine daily sentiment.
                                </p>
                            </div>
                            <div style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '12px',
                                padding: '24px',
                            }}>
                                <h4 style={{ color: '#CE34EA', marginBottom: '12px' }}>Time-Based Tracking</h4>
                                <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                    Votes are tracked across multiple time windows to identify both short-term trends and long-term community support patterns.
                                </p>
                            </div>
                            <div style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '12px',
                                padding: '24px',
                            }}>
                                <h4 style={{ color: '#CE34EA', marginBottom: '12px' }}>Share Points System</h4>
                                <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                    Earn points for each vote to climb the community leaderboard. Your voting history and consistency are rewarded with higher rankings.
                                </p>
                            </div>
                            <div style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '12px',
                                padding: '24px',
                            }}>
                                <h4 style={{ color: '#CE34EA', marginBottom: '12px' }}>Real Data, Real Impact</h4>
                                <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                    Unlike speculative price movements, community votes reflect actual user engagement and belief in cryptocurrency projects.
                                </p>
                            </div>
                        </div>

                        <h2 style={{ color: '#fff', fontSize: '1.6rem', marginBottom: '1.5rem', textAlign: 'center' }}>🌟 Platform Features & Benefits</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                            <div style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '12px',
                                padding: '24px',
                            }}>
                                <h4 style={{ color: '#CE34EA', marginBottom: '12px' }}>🗳️ Community-Powered Rankings</h4>
                                <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                    Real-time voting data from thousands of crypto enthusiasts worldwide. Each vote represents genuine community sentiment, not automated bots or fake engagement.
                                </p>
                            </div>
                            <div style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '12px',
                                padding: '24px',
                            }}>
                                <h4 style={{ color: '#CE34EA', marginBottom: '12px' }}>📊 Smart Analytics</h4>
                                <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                    Track voting trends across 24-hour, 7-day, and 3-month windows. Identify emerging cryptocurrencies before they explode in popularity.
                                </p>
                            </div>
                            <div style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '12px',
                                padding: '24px',
                            }}>
                                <h4 style={{ color: '#CE34EA', marginBottom: '12px' }}>🔍 Comprehensive Coverage</h4>
                                <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                    Search and vote for over 19,000 cryptocurrencies with live market data, price tracking, and community-driven insights.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Built by */}
                    <div style={{
                        marginTop: '4rem',
                        background: 'rgba(87, 0, 249, 0.12)',
                        border: '1px solid rgba(87, 0, 249, 0.3)',
                        borderRadius: '16px',
                        padding: '32px',
                        textAlign: 'center',
                    }}>
                        <h2 style={{ color: '#fff', marginBottom: '0.75rem', fontSize: '1.3rem' }}>Built By</h2>
                        <p style={{ color: '#aaa' }}>
                            CryptoCardiac was designed and developed by{' '}
                            <a href="https://sajidkhan.me" target="_blank" rel="noopener noreferrer" style={{ color: '#CE34EA', fontWeight: 700, textDecoration: 'none' }}>
                                Raul & Sajid Khan
                            </a>
                            {' '}— a full-stack developer passionate about building community-driven web applications.
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AboutUs;
