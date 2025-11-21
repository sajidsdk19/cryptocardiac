import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

// Dummy mode for testing without Firebase
const DUMMY_MODE = true; // Set to false when Firebase is configured

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Dummy authentication functions
    const dummySignup = (email, password) => {
        return new Promise((resolve) => {
            const dummyUser = {
                email: email,
                uid: 'dummy-user-' + Date.now()
            };
            localStorage.setItem('dummyUser', JSON.stringify(dummyUser));
            setCurrentUser(dummyUser);
            resolve(dummyUser);
        });
    };

    const dummyLogin = (email, password) => {
        return new Promise((resolve, reject) => {
            // Check for admin credentials
            if (email === 'admin@cryptocardiac.com' && password === 'admin') {
                const dummyUser = {
                    email: 'admin@cryptocardiac.com',
                    uid: 'dummy-admin-user'
                };
                localStorage.setItem('dummyUser', JSON.stringify(dummyUser));
                setCurrentUser(dummyUser);
                resolve(dummyUser);
            } else {
                reject({ code: 'auth/wrong-password', message: 'Invalid credentials. Use admin/admin' });
            }
        });
    };

    const dummyLogout = () => {
        return new Promise((resolve) => {
            localStorage.removeItem('dummyUser');
            setCurrentUser(null);
            resolve();
        });
    };

    const signup = DUMMY_MODE ? dummySignup : (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const login = DUMMY_MODE ? dummyLogin : (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = DUMMY_MODE ? dummyLogout : () => {
        return signOut(auth);
    };

    useEffect(() => {
        if (DUMMY_MODE) {
            // Check for stored dummy user
            const storedUser = localStorage.getItem('dummyUser');
            if (storedUser) {
                setCurrentUser(JSON.parse(storedUser));
            }
            setLoading(false);
        } else {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                setCurrentUser(user);
                setLoading(false);
            });
            return unsubscribe;
        }
    }, []);

    const value = {
        currentUser,
        signup,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
