import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useVoting } from '../hooks/useVoting';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { getAllCurrencies } from '../component/api';
import VotingCard from '../component/VotingCard';
import Navbar from '../component/Navbar';
import styles from '../styles/Leaderboard.module.scss';

const Leaderboard = () => {
    const { currentUser } = useAuth();
    const { canVote, vote, getTimeRemaining, loading: votingLoading } = useVoting();
    const [cryptos, setCryptos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadLeaderboard = async () => {
            try {
                // Get all cryptocurrencies from CoinGecko
                const allCryptos = await getAllCurrencies('usd');

                // Get vote counts from Firestore
                const votesRef = collection(db, 'cryptoVotes');
                const votesSnapshot = await getDocs(votesRef);

                const voteCounts = {};
                votesSnapshot.forEach((doc) => {
                    const data = doc.data();
                    voteCounts[data.coinId] = data.totalVotes || 0;
                });

                // Merge crypto data with vote counts
                const cryptosWithVotes = allCryptos.slice(0, 50).map(crypto => ({
                    ...crypto,
                    votes: voteCounts[crypto.id] || 0
                }));

                // Sort by votes (descending)
                cryptosWithVotes.sort((a, b) => b.votes - a.votes);

                setCryptos(cryptosWithVotes);
            } catch (error) {
                console.error('Error loading leaderboard:', error);
            } finally {
                setLoading(false);
            }
        };

        loadLeaderboard();
    }, []);

    const handleVote = async (coinId, coinName) => {
        try {
            await vote(coinId, coinName);

            // Update local state
            setCryptos(prev => {
                const updated = prev.map(crypto =>
                    crypto.id === coinId
                        ? { ...crypto, votes: crypto.votes + 1 }
                        : crypto
                );
                // Re-sort by votes
                return updated.sort((a, b) => b.votes - a.votes);
            });
        } catch (error) {
            console.error('Error voting:', error);
            alert(error.message);
        }
    };

    if (!currentUser) {
        return (
            <>
                <Navbar />
                <div className={styles.leaderboardContainer}>
                    <div className={styles.loginPrompt}>
                        <h2 className={styles.loginPromptTitle}>Join the Community</h2>
                        <p className={styles.loginPromptText}>
                            Sign in to vote for your favorite cryptocurrencies and see the community rankings!
                        </p>
                        <Link to="/login">
                            <button className={styles.loginPromptButton}>
                                Log In to Vote
                            </button>
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    if (loading || votingLoading) {
        return (
            <>
                <Navbar />
                <div className={styles.leaderboardContainer}>
                    <div className={styles.loading}>Loading leaderboard...</div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className={styles.leaderboardContainer}>
                <div className={styles.leaderboardHeader}>
                    <h1 className={styles.leaderboardTitle}>Crypto Leaderboard</h1>
                    <p className={styles.leaderboardSubtitle}>
                        Vote for your favorite cryptocurrencies • One vote per crypto every 24 hours
                    </p>
                </div>

                <div className={styles.votingGrid}>
                    {cryptos.map((crypto, index) => (
                        <VotingCard
                            key={crypto.id}
                            rank={index + 1}
                            crypto={crypto}
                            canVote={canVote(crypto.id)}
                            onVote={() => handleVote(crypto.id, crypto.name)}
                            timeRemaining={getTimeRemaining(crypto.id)}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default Leaderboard;
