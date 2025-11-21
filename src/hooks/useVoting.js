import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useVoting = () => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/votes`;

    const canVote = useCallback((coinId) => {
        // Initial client-side check (optimistic), actual check happens on server
        // We'll rely on the server response for the final say
        return true;
    }, []);

    const getTimeRemaining = useCallback(() => {
        // This would ideally come from the server check
        return { hours: 0, minutes: 0 };
    }, []);

    const vote = async (coinId, coinName) => {
        if (!currentUser) {
            throw new Error('Must be logged in to vote');
        }

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ coinId, coinName })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to vote');
            }

            return true;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const checkGlobalVoteStatus = async () => {
        if (!currentUser) return { canVote: false };

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/status`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                return await response.json();
            }
            return { canVote: false };
        } catch (error) {
            console.error('Error checking vote status:', error);
            return { canVote: false };
        }
    };

    return {
        vote,
        checkGlobalVoteStatus,
        loading,
        error,
        canVote, // Deprecated
        getTimeRemaining // Deprecated
    };
};
