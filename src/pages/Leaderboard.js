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

    const loadLeaderboard = async () => {
        try {
            // 1. Get time-based vote counts first to know which coins have votes
            const timeResponse = await fetch(`${API_URL}/votes/time-based`);
            const timeVotes = await timeResponse.json();
            setTimeBasedVotes(timeVotes);

            // 2. Get total vote counts
            const response = await fetch(`${API_URL}/votes`);
            const voteCounts = await response.json();

            // 3. Get top cryptocurrencies from CoinGecko (top 100 for better coverage)
            const allCryptos = await getAllCurrencies('usd');

            // 4. Get list of coin IDs that have votes
            const votedCoinIds = Object.keys(timeVotes);
            const topCryptoIds = new Set(allCryptos.map(c => c.id));
            const missingCoinIds = votedCoinIds.filter(id => !topCryptoIds.has(id));

            // 5. Fetch details for coins that have votes but aren't in top 100
            let missingCryptos = [];
            if (missingCoinIds.length > 0) {
                try {
                    const missingCoinsData = await getCoinDetails(missingCoinIds.join(','), 'usd');
                    missingCryptos = Array.isArray(missingCoinsData) ? missingCoinsData : [missingCoinsData];
                } catch (error) {
                    console.error('Error fetching missing coins:', error);
                }
            }

            // 6. Combine all coins (top 100 + coins with votes)
            const allCoinsMap = new Map();

            // Add top coins
            allCryptos.forEach(crypto => {
                allCoinsMap.set(crypto.id, {
                    ...crypto,
                    votes: voteCounts[crypto.id] || 0
                });
            });

            // Add/update coins that have votes but weren't in top 100
            missingCryptos.forEach(crypto => {
                allCoinsMap.set(crypto.id, {
                    ...crypto,
                    votes: voteCounts[crypto.id] || 0
                });
            });

            // 7. Convert to array and sort by 24-hour votes
            const cryptosWithVotes = Array.from(allCoinsMap.values());
            cryptosWithVotes.sort((a, b) => {
                const aVotes24h = timeVotes[a.id]?.votes_24h || 0;
                const bVotes24h = timeVotes[b.id]?.votes_24h || 0;
                return bVotes24h - aVotes24h;
            });

            // 8. Take top 50 after sorting by 24h votes
            setCryptos(cryptosWithVotes.slice(0, 50));

            // 9. Check user's vote status per coin
            if (currentUser) {
                const globalStatus = await checkGlobalVoteStatus();

                // globalStatus now returns { votedCoins: [{ coinId, votedAt }] }
                const votedCoinIds = new Set(
                    (globalStatus.votedCoins || []).map(v => v.coinId)
                );

                // Build status map - only disable coins the user has voted for
                const statusMap = {};

                // Calculate time until midnight EST once
                const now = new Date();
                const nowESTString = now.toLocaleString('en-US', { timeZone: 'America/New_York' });
                const nowEST = new Date(nowESTString);
                const nextMidnight = new Date(nowEST);
                nextMidnight.setHours(24, 0, 0, 0);
                const remainingMs = nextMidnight - nowEST;

                cryptosWithVotes.slice(0, 50).forEach(c => {
                    statusMap[c.id] = {
                        canVote: !votedCoinIds.has(c.id),
                        remainingMs: votedCoinIds.has(c.id) ? remainingMs : 0
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

    useEffect(() => {
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

                            // Calculate time until midnight EST
                            const now = new Date();
                            const nowESTString = now.toLocaleString('en-US', { timeZone: 'America/New_York' });
                            const nowEST = new Date(nowESTString);
                            const nextMidnight = new Date(nowEST);
                            nextMidnight.setHours(24, 0, 0, 0);
                            const remainingMs = nextMidnight - nowEST;

                            coinsWithVotes.forEach(c => {
                                newStatus[c.id] = {
                                    canVote: !votedCoinIds.has(c.id),
                                    remainingMs: votedCoinIds.has(c.id) ? remainingMs : 0
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

            // Reload the entire leaderboard to get updated vote counts and proper sorting
            await loadLeaderboard();

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
