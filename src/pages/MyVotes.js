import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../component/Navbar';
import styles from '../styles/MyVotes.module.scss';

const MyVotes = () => {
    const { currentUser } = useAuth();
    const [votes, setVotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        fetchVotingHistory();
    }, [currentUser]);

    // Update current time every minute to refresh countdown timers
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute

        return () => clearInterval(timer);
    }, []);

    const fetchVotingHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/votes/history`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch voting history');
            }

            const data = await response.json();
            setVotes(data.votes || []);
        } catch (err) {
            console.error('Error fetching voting history:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getTimeRemaining = (votedAt) => {
        const voteDate = new Date(votedAt);
        const now = currentTime;
        const diffMs = now - voteDate;
        const remainingMs = (24 * 60 * 60 * 1000) - diffMs;

        if (remainingMs <= 0) {
            return { canVote: true, hours: 0, minutes: 0 };
        }

        const hours = Math.floor(remainingMs / (1000 * 60 * 60));
        const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

        return { canVote: false, hours, minutes };
    };

    const formatPrice = (price) => {
        if (!price) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 6
        }).format(price);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!currentUser) {
        return (
            <>
                <Navbar />
                <div className={styles.container}>
                    <div className={styles.emptyState}>
                        <h2>Please Log In</h2>
                        <p>You need to be logged in to view your voting history.</p>
                        <Link to="/login" className={styles.loginButton}>
                            Go to Login
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    if (loading) {
        return (
            <>
                <Navbar />
                <div className={styles.container}>
                    <div className={styles.loading}>Loading your voting history...</div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className={styles.container}>
                    <div className={styles.error}>
                        <h2>Error</h2>
                        <p>{error}</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>My Voting History</h1>
                    <p className={styles.subtitle}>
                        Track all your votes and see when you can vote again
                    </p>
                </div>

                {votes.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>🗳️</div>
                        <h2>No Votes Yet</h2>
                        <p>You haven't voted for any cryptocurrencies yet.</p>
                        <Link to="/" className={styles.voteButton}>
                            Start Voting
                        </Link>
                    </div>
                ) : (
                    <div className={styles.votesGrid}>
                        {votes.map((vote, index) => {
                            const timeRemaining = getTimeRemaining(vote.votedAt);
                            const statusClass = timeRemaining.canVote ? styles.canVote : styles.cooldown;

                            return (
                                <div key={`${vote.coinId}-${index}`} className={styles.voteCard}>
                                    <Link to={`/coins/${vote.coinId}`} className={styles.coinLink}>
                                        <div className={styles.coinHeader}>
                                            {vote.coinImage ? (
                                                <img
                                                    src={vote.coinImage}
                                                    alt={vote.coinName}
                                                    className={styles.coinImage}
                                                />
                                            ) : (
                                                <div className={styles.coinImagePlaceholder}>
                                                    {vote.coinName.charAt(0)}
                                                </div>
                                            )}
                                            <div className={styles.coinInfo}>
                                                <h3 className={styles.coinName}>{vote.coinName}</h3>
                                                {vote.symbol && (
                                                    <span className={styles.coinSymbol}>
                                                        {vote.symbol.toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>

                                    <div className={styles.voteDetails}>
                                        {vote.currentPrice && (
                                            <div className={styles.priceInfo}>
                                                <span className={styles.label}>Current Price:</span>
                                                <span className={styles.price}>
                                                    {formatPrice(vote.currentPrice)}
                                                </span>
                                            </div>
                                        )}

                                        <div className={styles.voteTime}>
                                            <span className={styles.label}>Voted:</span>
                                            <span className={styles.time}>
                                                {formatDate(vote.votedAt)}
                                            </span>
                                        </div>

                                        <div className={`${styles.status} ${statusClass}`}>
                                            {timeRemaining.canVote ? (
                                                <>
                                                    <span className={styles.statusIcon}>✅</span>
                                                    <span className={styles.statusText}>Can vote now!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className={styles.statusIcon}>⏳</span>
                                                    <span className={styles.statusText}>
                                                        Next vote in: {timeRemaining.hours}h {timeRemaining.minutes}m
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
};

export default MyVotes;
