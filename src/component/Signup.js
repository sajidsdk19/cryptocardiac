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

    const SITE_KEY = "0x4AAAAAAACG8DIC2mN-jyS6r";

    React.useEffect(() => {
        // Define callback function globally
        window.onTurnstileSuccess = (token) => {
            setCaptchaToken(token);
        };

        // Inject script
        const script = document.createElement('script');
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
            delete window.onTurnstileSuccess;
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
                        <div className="cf-turnstile" data-sitekey={SITE_KEY} data-callback="onTurnstileSuccess" data-theme="dark"></div>
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
