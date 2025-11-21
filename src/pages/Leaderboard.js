import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useVoting } from '../hooks/useVoting';
import { getAllCurrencies } from '../component/api';
import VoteButton from '../component/VoteButton';
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

    const formatNumber = (num) => {
        if (!num) return 'N/A';
        if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        return num.toLocaleString();
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

    const filteredCryptos = cryptos.filter(crypto =>
        crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

                {/* Desktop Table View */}
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead className={styles.thead}>
                            <tr>
                                <th className={styles.th}>#</th>
                                <th className={styles.th}>Coin</th>
                                <th className={styles.th}>Market Cap</th>
                                <th className={styles.th}>Volume (24h)</th>
                                <th className={styles.th}>Max Supply</th>
                                <th className={styles.th}>Circulating Supply</th>
                                <th className={styles.th}>Total Votes</th>
                                <th className={styles.th}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCryptos.map((crypto, index) => {
                                const userCanVote = canVote(crypto.id);
                                return (
                                    <tr key={crypto.id} className={styles.tr}>
                                        <td className={`${styles.td} ${styles.rank}`}>{index + 1}</td>
                                        <td className={styles.td}>
                                            <Link to={`/coins/${crypto.id}`} style={{ textDecoration: 'none' }}>
                                                <div className={styles.coinCell}>
                                                    <img src={crypto.image} alt={crypto.name} className={styles.coinImage} />
                                                    <div>
                                                        <div className={styles.coinName}>{crypto.name}</div>
                                                        <div className={styles.coinSymbol}>{crypto.symbol}</div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className={styles.td}>{formatNumber(crypto.market_cap)}</td>
                                        <td className={styles.td}>{formatNumber(crypto.total_volume)}</td>
                                        <td className={styles.td}>{formatNumber(crypto.max_supply)}</td>
                                        <td className={styles.td}>{formatNumber(crypto.circulating_supply)}</td>
                                        <td className={`${styles.td} ${styles.voteCount}`}>{crypto.votes.toLocaleString()}</td>
                                        <td className={styles.td}>
                                            <VoteButton
                                                crypto={crypto}
                                                canVote={userCanVote}
                                                onVote={() => handleVote(crypto.id, crypto.name)}
                                                timeRemaining={!userCanVote ? getTimeRemaining() : null}
                                            />
                                            {!userCanVote && currentUser && (
                                                <div className={styles.timeRemaining}>
                                                    {getTimeRemaining().hours}h {getTimeRemaining().minutes}m
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Mobile List View */}
                <div className={styles.mobileList}>
                    {filteredCryptos.map((crypto, index) => {
                        const userCanVote = canVote(crypto.id);
                        const priceChangeColor = crypto.price_change_percentage_24h >= 0 ? styles.positiveChange : styles.negativeChange;

                        return (
                            <div key={crypto.id} className={styles.mobileCard}>
                                <div className={styles.mobileCardHeader}>
                                    <Link to={`/coins/${crypto.id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', flex: 1 }}>
                                        <span className={styles.mobileRank}>{index + 1}.</span>
                                        <div className={styles.coinCell}>
                                            <img src={crypto.image} alt={crypto.name} className={styles.coinImage} />
                                            <div>
                                                <div className={styles.coinName}>{crypto.name}</div>
                                                <div className={styles.coinSymbol}>{crypto.symbol}</div>
                                            </div>
                                        </div>
                                    </Link>
                                    <div className={styles.mobilePrice}>
                                        <span className={styles.mobilePriceValue}>{formatPrice(crypto.current_price)}</span>
                                        <span className={`${styles.mobilePriceChange} ${priceChangeColor}`}>
                                            {crypto.price_change_percentage_24h?.toFixed(2)}%
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.mobileStatsGrid}>
                                    <div className={styles.mobileStat}>
                                        <span className={styles.statLabel}>Market Cap</span>
                                        <span className={styles.statValue}>{formatNumber(crypto.market_cap)}</span>
                                    </div>
                                    <div className={styles.mobileStat}>
                                        <span className={styles.statLabel}>Total Votes</span>
                                        <span className={`${styles.statValue} ${styles.voteCount}`}>{crypto.votes.toLocaleString()}</span>
                                    </div>
                                </div>

                                <VoteButton
                                    crypto={crypto}
                                    canVote={userCanVote}
                                    onVote={() => handleVote(crypto.id, crypto.name)}
                                    timeRemaining={!userCanVote ? getTimeRemaining() : null}
                                    isMobile={true}
                                />
                                {!userCanVote && currentUser && (
                                    <div className={styles.timeRemaining}>
                                        Next vote in: {getTimeRemaining().hours}h {getTimeRemaining().minutes}m
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default Leaderboard;
