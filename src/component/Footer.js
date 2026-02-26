import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Footer component.
 * Google Auto Ads (enabled via the script tag in index.html) will
 * automatically inject ads near this footer. No slot IDs required.
 */
const Footer = () => {
    const links = [
        { label: 'About Us', to: '/about' },
        { label: 'Contact', to: '/contact' },
        { label: 'Featured Articles', to: '/featured-articles' },
        { label: 'Privacy Policy', to: '/privacy-policy' },
        { label: 'Terms & Conditions', to: '/terms' },
        { label: 'Disclaimer', to: '/disclaimer' },
    ];

    return (
        <footer style={{ width: '100%', background: '#0d0d1a' }}>
            {/* Google Auto Ads injects above-footer ads automatically */}
            <div style={{ width: '100%', minHeight: '0px', background: '#0d0d1a' }} />

            {/* Main Footer Content */}
            <div style={{
                padding: '80px 20px 60px',
                borderTop: '1px solid rgba(87, 0, 249, 0.3)',
                boxShadow: 'inset 0px 20px 40px -20px rgba(87, 0, 249, 0.1)',
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '40px'
                }}>

                    {/* Brand Info */}
                    <div style={{ flex: '1 1 300px' }}>
                        <h2 style={{
                            fontSize: '1.8rem',
                            fontWeight: 800,
                            marginBottom: '1rem',
                            background: 'linear-gradient(135deg, #5700F9, #CE34EA)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            display: 'inline-block'
                        }}>
                            CryptoCardiac
                        </h2>
                        <p style={{ color: '#888', fontSize: '0.95rem', lineHeight: '1.7', maxWidth: '300px' }}>
                            The social pulse of cryptocurrency communities. Vote daily, track real-time sentiment, and discover emerging projects backed by real people.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div style={{ flex: '1 1 150px' }}>
                        <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 600 }}>Explore</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {links.slice(0, 3).map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    style={{ color: '#aaa', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }}
                                    onMouseEnter={e => e.target.style.color = '#CE34EA'}
                                    onMouseLeave={e => e.target.style.color = '#aaa'}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Legal Links */}
                    <div style={{ flex: '1 1 150px' }}>
                        <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 600 }}>Legal</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {links.slice(3).map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    style={{ color: '#aaa', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }}
                                    onMouseEnter={e => e.target.style.color = '#CE34EA'}
                                    onMouseLeave={e => e.target.style.color = '#aaa'}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* Copyright */}
            <div style={{
                textAlign: 'center',
                padding: '24px 20px',
                color: '#666',
                fontSize: '0.9rem',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                background: '#0a0a14',
            }}>
                © {new Date().getFullYear()} CryptoCardiac. All rights reserved.{' '}
                <span style={{ margin: '0 8px' }}>|</span>{' '}
                Designed by Raul & Developed by{' '}
                <a
                    href="https://sajidkhan.me"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#CE34EA', textDecoration: 'none', fontWeight: 600 }}
                >
                    Sajid Khan
                </a>
            </div>
        </footer>
    );
};

export default Footer;
