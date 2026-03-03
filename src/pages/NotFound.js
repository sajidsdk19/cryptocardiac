import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import { Helmet } from 'react-helmet-async';

const quickLinks = [
    { label: '🏆 Leaderboard', to: '/', desc: 'See top-ranked coins' },
    { label: '📰 Articles', to: '/featured-articles', desc: 'Latest crypto news' },
    { label: '🗳️ My Votes', to: '/my-votes', desc: 'Your voting history' },
    { label: '💬 Contact', to: '/contact', desc: 'Get in touch with us' },
];

const NotFound = () => {
    const location = useLocation();
    const [dots, setDots] = useState('');

    // Animated loading dots for flavour
    useEffect(() => {
        const t = setInterval(() => setDots(d => d.length < 3 ? d + '.' : ''), 500);
        return () => clearInterval(t);
    }, []);

    return (
        <>
            <Helmet>
                <title>404 — Page Not Found | CryptoCardiac</title>
                <meta name="description" content="The page you are looking for does not exist. Return to the CryptoCardiac home page." />
                <meta name="robots" content="noindex, follow" />
            </Helmet>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(-1deg); }
                    50%       { transform: translateY(-20px) rotate(1deg); }
                }
                @keyframes scanline {
                    0%   { top: -10%; }
                    100% { top: 110%; }
                }
                @keyframes flicker {
                    0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
                    20%, 24%, 55% { opacity: 0.4; }
                }
                @keyframes orbitSpin {
                    from { transform: rotate(0deg) translateX(90px) rotate(0deg); }
                    to   { transform: rotate(360deg) translateX(90px) rotate(-360deg); }
                }
                @keyframes orbitSpin2 {
                    from { transform: rotate(180deg) translateX(130px) rotate(-180deg); }
                    to   { transform: rotate(540deg) translateX(130px) rotate(-540deg); }
                }
                @keyframes gradientShift {
                    0%, 100% { background-position: 0% 50%; }
                    50%       { background-position: 100% 50%; }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .nf-card {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 14px;
                    padding: 18px 22px;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    transition: all 0.25s;
                    animation: fadeInUp 0.6s ease both;
                }
                .nf-card:hover {
                    background: rgba(206,52,234,0.08);
                    border-color: rgba(206,52,234,0.35);
                    transform: translateY(-3px);
                    box-shadow: 0 8px 28px rgba(206,52,234,0.15);
                }
                .nf-home-btn {
                    transition: all 0.22s !important;
                }
                .nf-home-btn:hover {
                    transform: translateY(-3px) !important;
                    box-shadow: 0 10px 30px rgba(206,52,234,0.45) !important;
                    opacity: 0.9 !important;
                }
                .nf-ghost-btn {
                    transition: all 0.22s !important;
                }
                .nf-ghost-btn:hover {
                    background: rgba(255,255,255,0.08) !important;
                    color: #fff !important;
                    transform: translateY(-3px) !important;
                }
            `}</style>

            <div style={{ minHeight: '100vh', background: 'rgb(21,21,32)', display: 'flex', flexDirection: 'column' }}>
                <Navbar />

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', position: 'relative', overflow: 'hidden' }}>

                    {/* ── Background glows ── */}
                    <div style={{ position: 'absolute', top: '10%', left: '15%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(87,0,249,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(206,52,234,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

                    {/* ── Orbiting particles ── */}
                    <div style={{ position: 'relative', width: '0', height: '0', marginBottom: '0' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '10px', height: '10px', borderRadius: '50%', background: '#5700F9', animation: 'orbitSpin 6s linear infinite', boxShadow: '0 0 12px #5700F9' }} />
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '8px', height: '8px', borderRadius: '50%', background: '#CE34EA', animation: 'orbitSpin2 9s linear infinite', boxShadow: '0 0 10px #CE34EA' }} />
                    </div>

                    {/* ── Giant 404 ── */}
                    <div style={{
                        fontSize: 'clamp(7rem, 22vw, 14rem)',
                        fontWeight: 900,
                        lineHeight: 1,
                        backgroundImage: 'linear-gradient(135deg, #5700F9 0%, #CE34EA 50%, #5700F9 100%)',
                        backgroundSize: '200% 200%',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        animation: 'float 4s ease-in-out infinite, gradientShift 4s ease infinite',
                        userSelect: 'none',
                        letterSpacing: '-4px',
                        position: 'relative',
                        zIndex: 1,
                    }}>
                        404
                        {/* scanline effect */}
                        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: '8px', pointerEvents: 'none' }}>
                            <div style={{ position: 'absolute', width: '100%', height: '3px', background: 'rgba(206,52,234,0.3)', animation: 'scanline 3s linear infinite', filter: 'blur(1px)' }} />
                        </div>
                    </div>

                    {/* ── Glitch badge ── */}
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        background: 'rgba(206,52,234,0.12)', border: '1px solid rgba(206,52,234,0.3)',
                        borderRadius: '30px', padding: '6px 16px', marginBottom: '24px', marginTop: '-8px',
                        animation: 'flicker 5s linear infinite',
                    }}>
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#CE34EA', display: 'inline-block', boxShadow: '0 0 8px #CE34EA' }} />
                        <span style={{ color: '#CE34EA', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Page Not Found</span>
                    </div>

                    {/* ── Heading & subtext ── */}
                    <h1 style={{ color: '#fff', fontSize: 'clamp(1.5rem, 4vw, 2.4rem)', fontWeight: 800, margin: '0 0 14px', textAlign: 'center', animation: 'fadeInUp 0.5s ease 0.1s both' }}>
                        Lost in the blockchain{dots}
                    </h1>
                    <p style={{ color: '#666', fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', maxWidth: '500px', lineHeight: '1.75', marginBottom: '12px', textAlign: 'center', animation: 'fadeInUp 0.5s ease 0.2s both' }}>
                        The page at <code style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '6px', padding: '2px 8px', color: '#CE34EA', fontSize: '0.9em' }}>{location.pathname}</code> doesn't exist or has been moved.
                    </p>
                    <p style={{ color: '#444', fontSize: '0.85rem', marginBottom: '40px', animation: 'fadeInUp 0.5s ease 0.25s both' }}>
                        Let's get you back to the pulse of crypto.
                    </p>

                    {/* ── CTA Buttons ── */}
                    <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '56px', animation: 'fadeInUp 0.5s ease 0.3s both' }}>
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <button className="nf-home-btn" style={{
                                padding: '14px 32px', borderRadius: '12px', border: 'none',
                                background: 'linear-gradient(135deg, #5700F9, #CE34EA)',
                                color: '#fff', fontWeight: 700, fontSize: '0.95rem',
                                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px',
                            }}>
                                🚀 Back to Leaderboard
                            </button>
                        </Link>
                        <Link to="/featured-articles" style={{ textDecoration: 'none' }}>
                            <button className="nf-ghost-btn" style={{
                                padding: '14px 32px', borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.13)',
                                background: 'rgba(255,255,255,0.04)', color: '#aaa',
                                fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer',
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                            }}>
                                📰 Read Articles
                            </button>
                        </Link>
                    </div>

                    {/* ── Quick navigation cards ── */}
                    <div style={{ width: '100%', maxWidth: '620px', animation: 'fadeInUp 0.5s ease 0.4s both' }}>
                        <div style={{ color: '#444', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '14px', textAlign: 'center' }}>
                            — Quick navigation —
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                            {quickLinks.map(({ label, to, desc }, i) => (
                                <Link
                                    key={to}
                                    to={to}
                                    className="nf-card"
                                    style={{ animationDelay: `${0.45 + i * 0.07}s` }}
                                >
                                    <div style={{ fontSize: '1.6rem', flexShrink: 0 }}>{label.split(' ')[0]}</div>
                                    <div>
                                        <div style={{ color: '#ddd', fontWeight: 600, fontSize: '0.9rem', marginBottom: '2px' }}>{label.slice(label.indexOf(' ') + 1)}</div>
                                        <div style={{ color: '#555', fontSize: '0.78rem' }}>{desc}</div>
                                    </div>
                                    <div style={{ marginLeft: 'auto', color: '#333', fontSize: '1rem' }}>›</div>
                                </Link>
                            ))}
                        </div>
                    </div>

                </div>

                <Footer />
            </div>
        </>
    );
};

export default NotFound;
