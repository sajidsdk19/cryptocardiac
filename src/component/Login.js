import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/Auth.module.scss';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            return setError('Please fill in all fields');
        }

        try {
            setError('');
            setLoading(true);
            await login(email, password);
            navigate('/leaderboard');
        } catch (error) {
            console.error('Login error:', error);
            if (error.code === 'auth/user-not-found') {
                setError('No account found with this email');
            } else if (error.code === 'auth/wrong-password') {
                setError('Incorrect password');
            } else if (error.code === 'auth/invalid-email') {
                setError('Invalid email address');
            } else {
                setError('Failed to log in. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <h1 className={styles.authTitle}>Welcome Back</h1>
                <p className={styles.authSubtitle}>Log in to vote for your favorite cryptos</p>

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
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>

                <p className={styles.authLink}>
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </p>

                <p className={styles.authLink} style={{ marginTop: '10px' }}>
                    <Link to="/">← Back to Home</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
