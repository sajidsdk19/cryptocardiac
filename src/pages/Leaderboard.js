import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useVoting } from '../hooks/useVoting';
import { getAllCurrencies, searchCoins, getCoinDetails } from '../component/api';
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
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [timeBasedVotes, setTimeBasedVotes] = useState({}); // { coinId: { votes_24h, votes_7d, votes_3m } }
    const searchTimeout = useRef(null);
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const loadLeaderboard = async () => {
            try {
                // 1. Get all cryptocurrencies from CoinGecko
                const allCryptos = await getAllCurrencies('usd');

                // 2. Get vote counts from our backend
                const response = await fetch(`${API_URL}/votes`);
                const voteCounts = await response.json();

                // 3. Get time-based vote counts
                const timeResponse = await fetch(`${API_URL}/votes/time-based`);
                const timeVotes = await timeResponse.json();
                setTimeBasedVotes(timeVotes);

                // 4. Merge data
                const cryptosWithVotes = allCryptos.slice(0, 50).map(crypto => ({
                    ...crypto,
                    votes: voteCounts[crypto.id] || 0
                }));

                // 5. Sort by 24-hour votes (most recent activity first)
                cryptosWithVotes.sort((a, b) => {
                    const aVotes24h = timeVotes[a.id]?.votes_24h || 0;
                    const bVotes24h = timeVotes[b.id]?.votes_24h || 0;
                    return bVotes24h - aVotes24h;
                });
                setCryptos(cryptosWithVotes);

                // 6. Check user's vote status per coin
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

    // Debounced search effect
    useEffect(() => {
        if (searchTerm.trim().length === 0) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        setSearchLoading(true);

        // Clear previous timeout
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        // Set new timeout for debouncing (3 seconds)
        searchTimeout.current = setTimeout(async () => {
            try {
                // 1. Search for coins
                const searchData = await searchCoins(searchTerm);
                const coinIds = searchData.coins.slice(0, 20).map(coin => coin.id).join(',');

                if (coinIds) {
                    // 2. Get detailed market data for search results
                    const detailedCoins = await getCoinDetails(coinIds, 'usd');

                    // 3. Get vote counts
                    const response = await fetch(`${API_URL}/votes`);
                    const voteCounts = await response.json();

                    // 4. Merge with votes
                    const coinsWithVotes = detailedCoins.map(coin => ({
                        ...coin,
                        votes: voteCounts[coin.id] || 0
                    }));

                    setSearchResults(coinsWithVotes);

                    // 5. Update vote status for search results
                    if (currentUser) {
                        const globalStatus = await checkGlobalVoteStatus();
                        const votedCoinIds = new Set(
                            (globalStatus.votedCoins || []).map(v => v.coinId)
                        );

                        setUserVoteStatus(prev => {
                            const newStatus = { ...prev };
                            coinsWithVotes.forEach(c => {
                                newStatus[c.id] = {
                                    canVote: !votedCoinIds.has(c.id),
                                    remainingMs: votedCoinIds.has(c.id) ? 24 * 60 * 60 * 1000 : 0
                                };
                            });
                            return newStatus;
                        });
                    }
                } else {
                    setSearchResults([]);
                }
            } catch (error) {
                console.error('Error searching:', error);
                setSearchResults([]);
            } finally {
                setSearchLoading(false);
            }
        }, 3000);

        return () => {
            if (searchTimeout.current) {
                clearTimeout(searchTimeout.current);
            }
        };
    }, [searchTerm, currentUser]);

    const handleVote = async (coinId, coinName) => {
        try {
            await vote(coinId, coinName);

            // Update time-based votes for this coin
            setTimeBasedVotes(prev => ({
                ...prev,
                [coinId]: {
                    votes_24h: (prev[coinId]?.votes_24h || 0) + 1,
                    votes_7d: (prev[coinId]?.votes_7d || 0) + 1,
                    votes_3m: (prev[coinId]?.votes_3m || 0) + 1
                }
            }));

            // Update local state for both cryptos and search results
            setCryptos(prev => {
                const updated = prev.map(crypto =>
                    crypto.id === coinId
                        ? { ...crypto, votes: crypto.votes + 1 }
                        : crypto
                );
                // Sort by 24-hour votes
                return updated.sort((a, b) => {
                    const aVotes24h = (a.id === coinId ? (timeBasedVotes[a.id]?.votes_24h || 0) + 1 : timeBasedVotes[a.id]?.votes_24h || 0);
                    const bVotes24h = (b.id === coinId ? (timeBasedVotes[b.id]?.votes_24h || 0) + 1 : timeBasedVotes[b.id]?.votes_24h || 0);
                    return bVotes24h - aVotes24h;
                });
            });

            setSearchResults(prev => {
                return prev.map(crypto =>
                    crypto.id === coinId
                        ? { ...crypto, votes: crypto.votes + 1 }
                        : crypto
                );
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

    // Determine which cryptos to display
    const displayCryptos = isSearching ? searchResults : cryptos;

    const filteredCryptos = displayCryptos.filter(crypto =>
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
                        placeholder="Search any cryptocurrency (19,000+ coins)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                    {searchLoading && (
                        <div className={styles.searchLoadingIndicator}>Searching...</div>
                    )}
                    {isSearching && searchResults.length === 0 && !searchLoading && (
                        <div className={styles.searchNoResults}>No results found for "{searchTerm}"</div>
                    )}
                </div>

                {/* Desktop Table View */}
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead className={styles.thead}>
                            <tr>
                                <th className={styles.th}>#</th>
                                <th className={styles.th}>Coin</th>
                                <th className={styles.th}>Price</th>
                                <th className={styles.th}>24h Votes</th>
                                <th className={styles.th}>7d Votes</th>
                                <th className={styles.th}>3M Votes</th>
                                <th className={styles.th}>Total Votes</th>
                                <th className={styles.th}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCryptos.map((crypto, index) => {
                                const status = userVoteStatus[crypto.id] || { canVote: true };
                                const userCanVote = status.canVote;
                                const timeRemaining = !userCanVote ? getLocalTimeRemaining(crypto.id) : null;
                                const coinTimeVotes = timeBasedVotes[crypto.id] || { votes_24h: 0, votes_7d: 0, votes_3m: 0 };

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
                                        <td className={styles.td}>{formatPrice(crypto.current_price)}</td>
                                        <td className={styles.td}>{coinTimeVotes.votes_24h.toLocaleString()}</td>
                                        <td className={styles.td}>{coinTimeVotes.votes_7d.toLocaleString()}</td>
                                        <td className={styles.td}>{coinTimeVotes.votes_3m.toLocaleString()}</td>
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
