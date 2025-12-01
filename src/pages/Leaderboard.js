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
    const [allCryptos, setAllCryptos] = useState([]); // Store ALL coins
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [userVoteStatus, setUserVoteStatus] = useState({}); // { coinId: { canVote: boolean, remainingMs: number } }
    const [timeBasedVotes, setTimeBasedVotes] = useState({}); // { coinId: { votes_24h, votes_7d, votes_3m } }
    const [currentPage, setCurrentPage] = useState(1);
    const [apiSearchResults, setApiSearchResults] = useState([]); // Results from API search
    const [isSearchingAPI, setIsSearchingAPI] = useState(false); // Loading state for API search
    const searchTimeout = useRef(null);
    const COINS_PER_PAGE = 15;
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

            // 8. Store ALL coins (no slicing)
            setAllCryptos(cryptosWithVotes);

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

                cryptosWithVotes.forEach(c => {
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

    // Debounced API search when no local results found
    useEffect(() => {
        // Clear API results when search is empty
        if (searchTerm.trim().length === 0) {
            setApiSearchResults([]);
            setIsSearchingAPI(false);
            return;
        }

        // Check if we have local results
        const localResults = allCryptos.filter(crypto =>
            crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // If we have local results, don't search API
        if (localResults.length > 0) {
            setApiSearchResults([]);
            setIsSearchingAPI(false);
            return;
        }

        // No local results - trigger API search after debounce
        setIsSearchingAPI(true);

        // Clear previous timeout
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        // Set new timeout for debouncing (1 second)
        searchTimeout.current = setTimeout(async () => {
            try {
                // 1. Search for coins via API
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

                    setApiSearchResults(coinsWithVotes);

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
                    setApiSearchResults([]);
                }
            } catch (error) {
                console.error('Error searching API:', error);
                setApiSearchResults([]);
            } finally {
                setIsSearchingAPI(false);
            }
        }, 1000);

        return () => {
            if (searchTimeout.current) {
                clearTimeout(searchTimeout.current);
            }
        };
    }, [searchTerm, allCryptos, currentUser]);

    // Reset to page 1 when search term changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

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

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

    // Instant client-side search filtering (local results)
    const localFilteredCryptos = allCryptos.filter(crypto =>
        crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Merge local results with API results (API results only shown if no local results)
    const filteredCryptos = localFilteredCryptos.length > 0 ? localFilteredCryptos : apiSearchResults;

    // Pagination logic
    const totalPages = Math.ceil(filteredCryptos.length / COINS_PER_PAGE);
    const startIndex = (currentPage - 1) * COINS_PER_PAGE;
    const endIndex = startIndex + COINS_PER_PAGE;
    const displayCryptos = filteredCryptos.slice(startIndex, endIndex);

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
                    {isSearchingAPI && (
                        <div className={styles.searchInfo}>
                            🔍 Searching database...
                        </div>
                    )}
                    {searchTerm && !isSearchingAPI && (
                        <div className={styles.searchInfo}>
                            Found {filteredCryptos.length} coin{filteredCryptos.length !== 1 ? 's' : ''}
                            {localFilteredCryptos.length === 0 && apiSearchResults.length > 0 && ' (from full database)'}
                        </div>
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
                            {displayCryptos.map((crypto, index) => {
                                const status = userVoteStatus[crypto.id] || { canVote: true };
                                const userCanVote = status.canVote;
                                const timeRemaining = !userCanVote ? getLocalTimeRemaining(crypto.id) : null;
                                const coinTimeVotes = timeBasedVotes[crypto.id] || { votes_24h: 0, votes_7d: 0, votes_3m: 0 };
                                const globalRank = startIndex + index + 1;

                                return (
                                    <tr key={crypto.id} className={styles.tr}>
                                        <td className={`${styles.td} ${styles.rank}`}>{globalRank}</td>
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

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className={styles.paginationContainer}>
                        <button
                            className={styles.paginationButton}
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>

                        <div className={styles.pageInfo}>
                            Page {currentPage} of {totalPages}
                        </div>

                        <button
                            className={styles.paginationButton}
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                )}

            </div>
        </>
    );
};

export default Leaderboard;
