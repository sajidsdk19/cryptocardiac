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
        { label: 'Privacy Policy', to: '/privacy-policy' },
        { label: 'Terms & Conditions', to: '/terms' },
        { label: 'Disclaimer', to: '/disclaimer' },
    ];

    return (
        <footer style={{ width: '100%', background: '#0d0d1a' }}>
            {/* Google Auto Ads injects above-footer ads automatically */}
            <div style={{ width: '100%', minHeight: '0px', background: '#0d0d1a' }} />

            {/* Footer Links */}
            <div style={{
                borderTop: '1px solid rgba(255,255,255,0.08)',
                padding: '24px 20px 8px',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '8px 24px',
            }}>
                {links.map((link) => (
                    <Link
                        key={link.to}
                        to={link.to}
                        style={{ color: '#888', textDecoration: 'none', fontSize: '0.85rem' }}
                        onMouseEnter={e => e.target.style.color = '#CE34EA'}
                        onMouseLeave={e => e.target.style.color = '#888'}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>

            {/* Copyright */}
            <div style={{
                textAlign: 'center',
                padding: '12px 16px 20px',
                color: '#555',
                fontSize: '0.8rem',
                background: '#0d0d1a',
            }}>
                © {new Date().getFullYear()} CryptoCardiac. All rights reserved.{' '}
                Made by{' '}
                <a
                    href="https://sajidkhan.me"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#CE34EA', textDecoration: 'none' }}
                >
                    Raul and Developed by Sajid Khan
                </a>
            </div>
        </footer>
    );
};

export default Footer;

