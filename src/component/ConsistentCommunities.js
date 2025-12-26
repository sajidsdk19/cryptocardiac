import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { LocalFireDepartment } from '@mui/icons-material';
import styles from '../styles/ConsistentCommunities.module.scss';

const ConsistentCommunities = () => {
    const [communities, setCommunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const fetchConsistent = async () => {
            try {
                const response = await fetch(`${API_URL}/votes/consistent`);
                const data = await response.json();

                if (Array.isArray(data)) {
                    setCommunities(data);
                } else {
                    console.error("Consistent communities API returned invalid data:", data);
                    setCommunities([]);
                }
            } catch (error) {
                console.error("Error fetching consistent communities", error);
                setCommunities([]);
            } finally {
                setLoading(false);
            }
        };

        fetchConsistent();
    }, [API_URL]);

    if (loading || communities.length === 0) return null;

    return (
        <Box className={styles.container}>
            <Box className={styles.header}>
                <Typography variant="h5" className={styles.title}>
                    <span style={{ color: '#ffd700' }}>Most Consistent Communities</span>
                    <span className={styles.subtitle}> These communities never miss a day! 💪</span>
                </Typography>
            </Box>

            <Box className={styles.scrollContainer}>
                {communities.map((coin, index) => (
                    <Link to={`/coins/${coin.coinId}`} key={coin.coinId} style={{ textDecoration: 'none' }}>
                        <Box className={`${styles.card} ${index === 0 ? styles.goldCard : ''}`}>
                            <Box className={styles.rankBadge}>
                                #{index + 1}
                            </Box>
                            {index === 0 && <LocalFireDepartment className={styles.fireIcon} />}

                            <Box className={styles.coinInfo}>
                                {coin.image ? (
                                    <img src={coin.image} alt={coin.coinName} className={styles.coinImage} />
                                ) : (
                                    <div className={styles.coinPlaceholder}>{coin.symbol?.[0] || '?'}</div>
                                )}
                                <Typography className={styles.coinName}>
                                    {index === 0 && <span style={{ marginRight: '4px' }}>🏅</span>}
                                    {coin.coinName} ({coin.symbol?.toUpperCase()})
                                </Typography>
                            </Box>

                            <Typography className={styles.streakText}>
                                <span className={styles.streakNumber}>{coin.streak}</span>-day voting streak!
                            </Typography>
                        </Box>
                    </Link>
                ))}
            </Box>
        </Box>
    );
};

export default ConsistentCommunities;
