import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    serverTimestamp,
    doc,
    setDoc,
    getDoc,
    increment
} from 'firebase/firestore';

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
            } catch (error) {
                console.error('Error loading votes:', error);
            } finally {
                setLoading(false);
            }
        };

        loadUserVotes();
    }, [currentUser]);

    // Check if user can vote for a specific coin
    const canVote = (coinId) => {
        if (!currentUser) return false;

        const vote = userVotes[coinId];
        if (!vote) return true;

        const now = new Date();
        return now >= vote.expiresAt;
    };

    // Get time remaining until next vote
    const getTimeRemaining = (coinId) => {
        const vote = userVotes[coinId];
        if (!vote) return null;

        const now = new Date();
        const remaining = vote.expiresAt - now;

        if (remaining <= 0) return null;

        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

        return { hours, minutes, total: remaining };
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
