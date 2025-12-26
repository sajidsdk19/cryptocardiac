import React from 'react';
import { Box, Typography } from '@mui/material';
import { EmojiEvents, Diamond } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/ProfileRanking.module.scss';

const ProfileRanking = () => {
    const { currentUser } = useAuth();

    if (!currentUser) return null;

    return (
        <Box className={styles.container}>
            <Box className={styles.statContainer}>
                <Box className={styles.iconBox}>
                    <EmojiEvents className={styles.icon} style={{ color: '#ffd700' }} />
                </Box>
                <Box>
                    <Typography className={styles.label}>Global Rank</Typography>
                    <Typography className={styles.value}>#{currentUser.rank || '-'}</Typography>
                </Box>
            </Box>

            <Box className={styles.divider} />

            <Box className={styles.statContainer}>
                <Box className={styles.iconBox}>
                    <Diamond className={styles.icon} style={{ color: '#00e5ff' }} />
                </Box>
                <Box>
                    <Typography className={styles.label}>Share Points</Typography>
                    <Typography className={styles.value}>{currentUser.share_points || 0}</Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default ProfileRanking;
