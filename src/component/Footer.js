import React from 'react';
import AdBanner from './AdBanner';

/**
 * Footer component with an ad slot above the footer content.
 * Appears at the bottom of every page.
 */
const Footer = () => {
    return (
        <footer style={{ width: '100%', background: '#0d0d1a' }}>
            {/* Ad above footer */}
            <AdBanner
                adSlot="6300978111"
                style={{ background: '#0d0d1a', padding: '6px 0' }}
            />
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
