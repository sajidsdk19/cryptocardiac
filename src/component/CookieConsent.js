import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const COOKIE_KEY = 'cc_cookie_consent';

const CookieConsent = () => {
    const [visible, setVisible] = useState(false);
    const [animateOut, setAnimateOut] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(COOKIE_KEY);
        if (!stored) {
            // Slight delay so it doesn't pop instantly on load
            const t = setTimeout(() => setVisible(true), 1200);
            return () => clearTimeout(t);
        }
    }, []);

    const dismiss = (accepted) => {
        localStorage.setItem(COOKIE_KEY, accepted ? 'accepted' : 'declined');
        setAnimateOut(true);
        setTimeout(() => setVisible(false), 350);
    };

    if (!visible) return null;

    return (
        <>
            <style>{`
                @keyframes ccSlideUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to   { transform: translateY(0);    opacity: 1; }
                }
                @keyframes ccSlideDown {
                    from { transform: translateY(0);    opacity: 1; }
                    to   { transform: translateY(100%); opacity: 0; }
                }
                .cc-accept:hover { background: #a020c0 !important; }
                .cc-decline:hover { background: rgba(255,255,255,0.08) !important; }
            `}</style>

            <div
                role="dialog"
                aria-label="Cookie consent"
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 9999,
                    background: 'rgba(10, 10, 20, 0.97)',
                    borderTop: '1px solid rgba(206,52,234,0.35)',
                    backdropFilter: 'blur(12px)',
                    padding: '20px 24px',
                    animation: `${animateOut ? 'ccSlideDown' : 'ccSlideUp'} 0.35s ease-out forwards`,
                    boxShadow: '0 -8px 40px rgba(87,0,249,0.2)',
                }}
            >
                <div style={{
                    maxWidth: '1100px',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    flexWrap: 'wrap',
                }}>
                    {/* Icon */}
                    <span style={{ fontSize: '1.6rem', flexShrink: 0 }}>🍪</span>

                    {/* Text */}
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <p style={{
                            color: '#fff',
                            fontSize: '0.9rem',
                            lineHeight: '1.6',
                            margin: 0,
                        }}>
                            We use cookies to enhance your experience, serve personalised ads, and analyse site traffic.
                            By clicking <strong>Accept</strong>, you consent to our use of cookies.{' '}
                            <Link
                                to="/privacy-policy"
                                style={{ color: '#CE34EA', textDecoration: 'underline', fontWeight: 600 }}
                            >
                                Learn more
                            </Link>
                        </p>
                    </div>

                    {/* Buttons */}
                    <div style={{ display: 'flex', gap: '10px', flexShrink: 0, flexWrap: 'wrap' }}>
                        <button
                            className="cc-decline"
                            onClick={() => dismiss(false)}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.15)',
                                background: 'transparent',
                                color: '#aaa',
                                fontWeight: 600,
                                fontSize: '0.88rem',
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            Decline
                        </button>
                        <button
                            className="cc-accept"
                            onClick={() => dismiss(true)}
                            style={{
                                padding: '10px 24px',
                                borderRadius: '8px',
                                border: 'none',
                                background: '#CE34EA',
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: '0.88rem',
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            Accept All
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CookieConsent;
