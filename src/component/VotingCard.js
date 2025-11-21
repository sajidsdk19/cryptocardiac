import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Favorite, FavoriteBorder, AccessTime } from '@mui/icons-material';
import styles from '../styles/Leaderboard.module.scss';

const VotingCard = ({ rank, crypto, canVote, onVote, timeRemaining }) => {
    const [voting, setVoting] = useState(false);

    const handleVote = async (e) => {
        e.preventDefault(); // Prevent navigation when clicking vote button
        setVoting(true);
        try {
            await onVote();
        } catch (error) {
            console.error('Vote error:', error);
        } finally {
            setVoting(false);
        }
    };

    const formatTimeRemaining = () => {
        if (!timeRemaining) return null;

        const { hours, minutes } = timeRemaining;
        return `${hours}h ${minutes}m until next vote`;
    };

    return (
        <div className={styles.votingCard}>
            <div className={styles.rankBadge}>#{rank}</div>

            <Link to={`/${crypto.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className={styles.coinInfo}>
                    <img
                        src={crypto.image}
                        alt={crypto.name}
                        className={styles.coinImage}
                    />
                    <div className={styles.coinDetails}>
                        <div className={styles.coinName}>{crypto.name}</div>
                        <div className={styles.coinSymbol}>{crypto.symbol}</div>
                    </div>
                </div>
            </Link>

            <div className={styles.voteStats}>
                <div>
                    <div className={styles.voteCount}>
                        {crypto.votes.toLocaleString()}
                    </div>
                    <div className={styles.voteLabel}>Total Votes</div>
                </div>
                <Favorite sx={{ color: '#8B5CF6', fontSize: '2rem' }} />
            </div>

            <button
                className={styles.voteButton}
                onClick={handleVote}
                disabled={!canVote || voting}
            >
                {voting ? (
                    <>Voting...</>
                ) : canVote ? (
                    <>
                        <FavoriteBorder /> Vote
                    </>
                ) : (
                    <>
                        <AccessTime /> Voted
                    </>
                )}
            </button>

            {!canVote && timeRemaining && (
                <div className={styles.timeRemaining}>
                    {formatTimeRemaining()}
                </div>
            )}
        </div>
    );
};

export default VotingCard;
