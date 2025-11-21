import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useVoting } from '../hooks/useVoting';
import { getAllCurrencies } from '../component/api';
import VotingCard from '../component/VotingCard';
import Navbar from '../component/Navbar';
import styles from '../styles/Leaderboard.module.scss';

// Dummy mode for testing without Firebase
const DUMMY_MODE = true;

const Leaderboard = () => {
    const { currentUser } = useAuth();
    const { canVote, vote, getTimeRemaining, loading: votingLoading } = useVoting();
    const [cryptos, setCryptos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadLeaderboard = async () => {
            try {
                // Get all cryptocurrencies from CoinGecko
                const allCryptos = await getAllCurrencies('usd');

                if (DUMMY_MODE) {
                    // Use localStorage for dummy vote counts
                    const storedVotes = localStorage.getItem('dummyVotes');
                    const voteCounts = storedVotes ? JSON.parse(storedVotes) : {};

                    // Merge crypto data with vote counts
                    const cryptosWithVotes = allCryptos.slice(0, 50).map(crypto => ({
                        ...crypto,
                        votes: voteCounts[crypto.id] || Math.floor(Math.random() * 100) // Random initial votes
                    }));

                    // Sort by votes (descending)
                    cryptosWithVotes.sort((a, b) => b.votes - a.votes);

                    setCryptos(cryptosWithVotes);
                } else {
                    // Firebase mode (original code)
                    const { db } = await import('../firebase');
                    const { collection, getDocs } = await import('firebase/firestore');

                    const votesRef = collection(db, 'cryptoVotes');
                    const votesSnapshot = await getDocs(votesRef);

                    const voteCounts = {};
                    votesSnapshot.forEach((doc) => {
                        const data = doc.data();
                        voteCounts[data.coinId] = data.totalVotes || 0;
                    });

                    const cryptosWithVotes = allCryptos.slice(0, 50).map(crypto => ({
                        ...crypto,
                        votes: voteCounts[crypto.id] || 0
                    }));

                    cryptosWithVotes.sort((a, b) => b.votes - a.votes);
                    setCryptos(cryptosWithVotes);
                }
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

                // Save to localStorage in dummy mode
                if (DUMMY_MODE) {
                    const voteCounts = {};
                    updated.forEach(crypto => {
                        voteCounts[crypto.id] = crypto.votes;
                    });
                    localStorage.setItem('dummyVotes', JSON.stringify(voteCounts));
                }

                // Re-sort by votes
                return updated.sort((a, b) => b.votes - a.votes);
            });
        } catch (error) {
            console.error('Error voting:', error);
            alert(error.message);
        }
    };



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
                        Vote for your favorite cryptocurrency • One vote every 24 hours
                    </p>

                    <div className={styles.searchContainer}>
                        <input
                            type="text"
                            placeholder="Search cryptocurrencies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                </div>

                <div className={styles.votingGrid}>
                    {cryptos
                        .filter(crypto =>
                            crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((crypto, index) => {
                            const userCanVote = canVote(crypto.id);
                            return (
                                <VotingCard
                                    key={crypto.id}
                                    rank={index + 1}
                                    crypto={crypto}
                                    canVote={userCanVote}
                                    onVote={() => handleVote(crypto.id, crypto.name)}
                                    timeRemaining={!userCanVote ? getTimeRemaining() : null}
                                />
                            );
                        })}
                </div>
            </div>
        </>
    );
};

export default Leaderboard;
