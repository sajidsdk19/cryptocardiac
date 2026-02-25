import React from 'react';

/**
 * Footer component.
 * Google Auto Ads (enabled via the script tag in index.html) will
 * automatically inject ads near this footer. No slot IDs required.
 */
const Footer = () => {
    return (
        <footer style={{ width: '100%', background: '#0d0d1a' }}>
            {/* Google Auto Ads injects above-footer ads automatically */}
            <div style={{ width: '100%', minHeight: '0px', background: '#0d0d1a' }} />
            <div
                style={{
                    textAlign: 'center',
                    padding: '16px',
                    color: '#888',
                    fontSize: '0.8rem',
                    background: '#0d0d1a',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                }}
            >
                © {new Date().getFullYear()} CryptoCardiac. All rights reserved.{' '}
                Made by{' '}
                <a
                    href="https://sajidkhan.me"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#CE34EA', textDecoration: 'none' }}
                >
                    Sajid Khan
                </a>
            </div>
        </footer>
    );
};

export default Footer;
