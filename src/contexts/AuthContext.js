import React, { useContext, useState, useEffect } from 'react';

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth`;

    async function signup(email, password) {
        const response = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Signup failed');

        localStorage.setItem('token', data.token);
        setCurrentUser(data.user);
        return data;
    }

    async function login(email, password) {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Login failed');

        localStorage.setItem('token', data.token);
        setCurrentUser(data.user);
        return data;
    }

    function logout() {
        localStorage.removeItem('token');
        setCurrentUser(null);
    }

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_URL}/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setCurrentUser(data.user);
                } else {
                    localStorage.removeItem('token');
                    setCurrentUser(null);
                }
            } catch (error) {
                console.error('Auth verification error:', error);
                localStorage.removeItem('token');
                setCurrentUser(null);
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
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
}
