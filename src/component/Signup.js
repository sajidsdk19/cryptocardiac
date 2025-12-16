import React, { useState } from 'react';

import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/Auth.module.scss';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [captchaToken, setCaptchaToken] = useState(null);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const SITE_KEY = "0x4AAAAAAACG9NmeSm2CWC3Hr";

    React.useEffect(() => {
        const scriptId = 'turnstile-script';
        let widgetId = null;

        // Function to render the widget
        const renderWidget = () => {
            if (window.turnstile) {
                widgetId = window.turnstile.render('#cf-turnstile', {
                    sitekey: SITE_KEY,
                    callback: (token) => {
                        setCaptchaToken(token);
                    },
                    theme: 'dark',
                });
            }
        };

        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"; // Use explicit render mode
            script.async = true;
            script.defer = true;
            script.onload = renderWidget;
            document.body.appendChild(script);
        } else {
            // Script already loaded, just render
            if (window.turnstile) {
                renderWidget();
            }
        }

        return () => {
            // Clean up if needed (Turnstile doesn't have a specific destroy method for the global script, but we can remove the widget)
            if (window.turnstile && widgetId) {
                window.turnstile.remove(widgetId);
            }
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password || !confirmPassword) {
            return setError('Please fill in all fields');
        }

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        if (password.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        if (!captchaToken) {
            return setError('Please complete the CAPTCHA check');
        }

        try {
            setError('');
            setLoading(true);
            await signup(email, password, captchaToken);
            navigate('/');
        } catch (error) {
            console.error('Signup error:', error);
            setError(error.message || 'Failed to create account. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <h1 className={styles.authTitle}>Join CryptoCardiac</h1>
                <p className={styles.authSubtitle}>Create an account to start voting</p>

                {error && <div className={styles.errorMessage}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.authForm}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Email</label>
                        <input
                            type="email"
                            className={styles.formInput}
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Password</label>
                        <input
                            type="password"
                            className={styles.formInput}
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Confirm Password</label>
                        <input
                            type="password"
                            className={styles.formInput}
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    {/* Turnstile Widget Container */}
                    <div className={styles.formGroup} style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', minHeight: '65px' }}>
                        <div id="cf-turnstile"></div>
                    </div>

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p className={styles.authLink}>
                    Already have an account? <Link to="/login">Log in</Link>
                </p>

                <p className={styles.authLink} style={{ marginTop: '10px' }}>
                    <Link to="/">← Back to Home</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
