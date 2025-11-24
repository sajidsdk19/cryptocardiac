import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useVoting } from '../hooks/useVoting';
import { getAllCurrencies } from '../component/api';
import VoteButton from '../component/VoteButton';
import Navbar from '../component/Navbar';
import styles from '../styles/Leaderboard.module.scss';

const Leaderboard = () => {
    const { currentUser } = useAuth();
    const { vote, checkGlobalVoteStatus, loading: votingLoading } = useVoting();
    const [cryptos, setCryptos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [userVoteStatus, setUserVoteStatus] = useState({}); // { coinId: { canVote: boolean, remainingMs: number } }

    useEffect(() => {
        const loadLeaderboard = async () => {
            try {
                // 1. Get all cryptocurrencies from CoinGecko
                const allCryptos = await getAllCurrencies('usd');

                // 2. Get vote counts from our backend
                const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
                const response = await fetch(`${API_URL}/votes`);
                const voteCounts = await response.json();

                // 3. Merge data
                const cryptosWithVotes = allCryptos.slice(0, 50).map(crypto => ({
                    ...crypto,
                    votes: voteCounts[crypto.id] || 0
                }));

                // 4. Sort by votes
                cryptosWithVotes.sort((a, b) => b.votes - a.votes);
                setCryptos(cryptosWithVotes);

                // 5. Check user's vote status per coin
                if (currentUser) {
                    const globalStatus = await checkGlobalVoteStatus();

                    // globalStatus now returns { votedCoins: [{ coinId, votedAt }] }
                    const votedCoinIds = new Set(
                        (globalStatus.votedCoins || []).map(v => v.coinId)
                    );

                    // Build status map - only disable coins the user has voted for
                    const statusMap = {};
                    cryptosWithVotes.forEach(c => {
                        statusMap[c.id] = {
                            canVote: !votedCoinIds.has(c.id),
                            remainingMs: votedCoinIds.has(c.id) ? 24 * 60 * 60 * 1000 : 0
                        };
                    });
                    setUserVoteStatus(statusMap);
                }

            } catch (error) {
                console.error('Error loading leaderboard:', error);
            } finally {
                setLoading(false);
            }
        };

        loadLeaderboard();
    }, [currentUser]); // Reload if user changes (login/logout)

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
                return updated.sort((a, b) => b.votes - a.votes);
            });

            // Update status - only disable THIS coin
            const nextVoteTime = 24 * 60 * 60 * 1000;
            setUserVoteStatus(prev => ({
                ...prev,
                [coinId]: { canVote: false, remainingMs: nextVoteTime }
            }));

        } catch (error) {
            console.error('Error voting:', error);
            alert(error.message);
        }
    };

    const getLocalTimeRemaining = (coinId) => {
        const status = userVoteStatus[coinId];
        if (!status || !status.remainingMs) return { hours: 0, minutes: 0 };

        const hours = Math.floor(status.remainingMs / (1000 * 60 * 60));
        const minutes = Math.floor((status.remainingMs % (1000 * 60 * 60)) / (1000 * 60));
        return { hours, minutes };
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
                <div className={styles.heroSection}>
                    <h1 className={styles.heroTitle}>Crypto Cardiac</h1>
                    <p className={styles.heroSubtitle}>
                        Feel the social pulse of your favorite cryptocurrency community!
                    </p>
                </div>

                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Search cryptocurrencies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
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
                                const status = userVoteStatus[crypto.id] || { canVote: true };
                                const userCanVote = status.canVote;
                                const timeRemaining = !userCanVote ? getLocalTimeRemaining(crypto.id) : null;

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
                                                timeRemaining={timeRemaining}
                                            />
                                            {!userCanVote && currentUser && (
                                                <div className={styles.timeRemaining}>
                                                    {timeRemaining.hours}h {timeRemaining.minutes}m
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
                        const status = userVoteStatus[crypto.id] || { canVote: true };
                        const userCanVote = status.canVote;
                        const timeRemaining = !userCanVote ? getLocalTimeRemaining(crypto.id) : null;
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
                                    timeRemaining={timeRemaining}
                                    isMobile={true}
                                />
                                {!userCanVote && currentUser && (
                                    <div className={styles.timeRemaining}>
                                        Next vote in: {timeRemaining.hours}h {timeRemaining.minutes}m
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
