import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Dummy mode for testing without Firebase
const DUMMY_MODE = true;

export const useVoting = () => {
    const { currentUser } = useAuth();
    const [userVotes, setUserVotes] = useState({});
    const [loading, setLoading] = useState(true);

    // Load user's votes on mount
    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        const loadUserVotes = async () => {
            try {
                if (DUMMY_MODE) {
                    // Load from localStorage
                    const storedVotes = localStorage.getItem(`dummyUserVotes_${currentUser.uid}`);
                    if (storedVotes) {
                        const votes = JSON.parse(storedVotes);
                        // Convert string dates back to Date objects
                        Object.keys(votes).forEach(coinId => {
                            votes[coinId].votedAt = new Date(votes[coinId].votedAt);
                            votes[coinId].expiresAt = new Date(votes[coinId].expiresAt);
                        });
                        setUserVotes(votes);
                    }
                } else {
                    // Firebase mode
                    const { db } = await import('../firebase');
                    const { collection, query, where, getDocs } = await import('firebase/firestore');

                    const votesRef = collection(db, 'votes');
                    const q = query(votesRef, where('userId', '==', currentUser.uid));
                    const querySnapshot = await getDocs(q);

                    const votes = {};
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        votes[data.coinId] = {
                            votedAt: data.votedAt?.toDate(),
                            expiresAt: data.expiresAt?.toDate()
                        };
                    });

                    setUserVotes(votes);
                }
            } catch (error) {
                console.error('Error loading votes:', error);
            } finally {
                setLoading(false);
            }
        };

        loadUserVotes();
    }, [currentUser]);

    // Check if user can vote (only ONE vote per 24 hours total)
    const canVote = (coinId) => {
        if (!currentUser) return false;

        // Check if user has voted for ANY coin in the last 24 hours
        const now = new Date();
        const allVotes = Object.values(userVotes);

        for (let vote of allVotes) {
            if (now < vote.expiresAt) {
                return false; // User has an active vote, can't vote again
            }
        }

        return true; // No active votes, can vote
    };

    // Get time remaining until next vote (checks all votes)
    const getTimeRemaining = () => {
        const now = new Date();
        let nearestExpiry = null;

        // Find the vote that expires soonest
        Object.values(userVotes).forEach(vote => {
            const remaining = vote.expiresAt - now;
            if (remaining > 0) {
                if (!nearestExpiry || remaining < nearestExpiry) {
                    nearestExpiry = remaining;
                }
            }
        });

        if (!nearestExpiry) return null;

        const hours = Math.floor(nearestExpiry / (1000 * 60 * 60));
        const minutes = Math.floor((nearestExpiry % (1000 * 60 * 60)) / (1000 * 60));

        return { hours, minutes, total: nearestExpiry };
    };

    // Submit a vote
    const vote = async (coinId, coinName) => {
        if (!currentUser) {
            throw new Error('You must be logged in to vote');
        }

        if (!canVote(coinId)) {
            throw new Error('You can only vote once every 24 hours');
        }

        try {
            const now = new Date();
            const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

            if (DUMMY_MODE) {
                // Save to localStorage
                const newVote = {
                    votedAt: now,
                    expiresAt: expiresAt
                };

                const updatedVotes = {
                    ...userVotes,
                    [coinId]: newVote
                };

                setUserVotes(updatedVotes);
                localStorage.setItem(`dummyUserVotes_${currentUser.uid}`, JSON.stringify(updatedVotes));
            } else {
                // Firebase mode
                const { db } = await import('../firebase');
                const { collection, addDoc, doc, setDoc, getDoc, serverTimestamp, increment } = await import('firebase/firestore');

                // Add vote record
                await addDoc(collection(db, 'votes'), {
                    userId: currentUser.uid,
                    coinId: coinId,
                    coinName: coinName,
                    votedAt: serverTimestamp(),
                    expiresAt: expiresAt
                });

                // Update crypto vote count
                const cryptoRef = doc(db, 'cryptoVotes', coinId);
                const cryptoDoc = await getDoc(cryptoRef);

                if (cryptoDoc.exists()) {
                    await setDoc(cryptoRef, {
                        totalVotes: increment(1),
                        lastUpdated: serverTimestamp()
                    }, { merge: true });
                } else {
                    await setDoc(cryptoRef, {
                        coinId: coinId,
                        coinName: coinName,
                        totalVotes: 1,
                        lastUpdated: serverTimestamp()
                    });
                }

                // Update local state
                setUserVotes(prev => ({
                    ...prev,
                    [coinId]: {
                        votedAt: now,
                        expiresAt: expiresAt
                    }
                }));
            }

            return true;
        } catch (error) {
            console.error('Error voting:', error);
            throw error;
        }
    };

    return {
        canVote,
        vote,
        getTimeRemaining,
        userVotes,
        loading
    };
};
