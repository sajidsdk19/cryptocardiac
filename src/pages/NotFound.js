import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import { Helmet } from 'react-helmet-async';

const NotFound = () => {
    return (
        <>
            <Helmet>
                <title>404 — Page Not Found | CryptoCardiac</title>
                <meta name="description" content="The page you are looking for does not exist. Return to the CryptoCardiac home page." />
                <meta name="robots" content="noindex, follow" />
            </Helmet>

            <Navbar />

            <div style={{
                minHeight: '80vh',
                background: 'rgb(21,21,32)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 20px',
                textAlign: 'center',
            }}>
                <style>{`
                    @keyframes float404 {
                        0%, 100% { transform: translateY(0px); }
                        50%       { transform: translateY(-18px); }
                    }
                    @keyframes glowPulse {
                        0%, 100% { text-shadow: 0 0 40px rgba(206,52,234,0.4); }
                        50%       { text-shadow: 0 0 80px rgba(206,52,234,0.8), 0 0 120px rgba(87,0,249,0.4); }
                    }
                    .nf-home-btn:hover {
                        background: #a020c0 !important;
                        transform: translateY(-2px) !important;
                        box-shadow: 0 8px 24px rgba(206,52,234,0.4) !important;
                    }
                    .nf-back-btn:hover {
                        background: rgba(255,255,255,0.08) !important;
                        color: #fff !important;
                    }
                `}</style>

                {/* Big 404 */}
                <div style={{
                    fontSize: 'clamp(6rem, 20vw, 12rem)',
                    fontWeight: 900,
                    lineHeight: 1,
                    background: 'linear-gradient(135deg, #5700F9 0%, #CE34EA 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'float404 3.5s ease-in-out infinite, glowPulse 3.5s ease-in-out infinite',
                    userSelect: 'none',
                    marginBottom: '16px',
                }}>
                    404
                </div>

                {/* Icon */}
                <div style={{ fontSize: '3rem', marginBottom: '20px', animation: 'float404 3.5s ease-in-out infinite 0.5s' }}>
                    🔍
                </div>

                <h1 style={{
                    color: '#fff',
                    fontSize: 'clamp(1.4rem, 4vw, 2.2rem)',
                    fontWeight: 800,
                    marginBottom: '12px',
                }}>
                    Page Not Found
                </h1>

                <p style={{
                    color: '#888',
                    fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
                    maxWidth: '480px',
                    lineHeight: '1.7',
                    marginBottom: '40px',
                }}>
                    The page you're looking for doesn't exist or has been moved.
                    Let's get you back to the pulse of crypto.
                </p>

                {/* Decorative divider */}
                <div style={{
                    width: '60px',
                    height: '3px',
                    background: 'linear-gradient(90deg, #5700F9, #CE34EA)',
                    borderRadius: '2px',
                    marginBottom: '40px',
                }} />

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <button
                            className="nf-home-btn"
                            style={{
                                padding: '14px 32px',
                                borderRadius: '10px',
                                border: 'none',
                                background: '#CE34EA',
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            🏠 Go to Leaderboard
                        </button>
                    </Link>
                    <Link to="/featured-articles" style={{ textDecoration: 'none' }}>
                        <button
                            className="nf-back-btn"
                            style={{
                                padding: '14px 32px',
                                borderRadius: '10px',
                                border: '1px solid rgba(255,255,255,0.15)',
                                background: 'transparent',
                                color: '#aaa',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            📰 Read Articles
                        </button>
                    </Link>
                </div>

                {/* Quick nav links */}
                <div style={{ marginTop: '48px', display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {[
                        { label: 'Home', to: '/' },
                        { label: 'Articles', to: '/featured-articles' },
                        { label: 'About', to: '/about' },
                        { label: 'Contact', to: '/contact' },
                        { label: 'Privacy Policy', to: '/privacy-policy' },
                    ].map(({ label, to }) => (
                        <Link
                            key={to}
                            to={to}
                            style={{ color: '#555', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s' }}
                            onMouseEnter={e => e.target.style.color = '#CE34EA'}
                            onMouseLeave={e => e.target.style.color = '#555'}
                        >
                            {label}
                        </Link>
                    ))}
                </div>
            </div>

            <Footer />
        </>
    );
};

export default NotFound;
