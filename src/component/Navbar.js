import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, Typography, Button } from '@mui/material';
import { Favorite, ExitToApp } from '@mui/icons-material';

const Navbar = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <Box sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '15px 30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Favorite sx={{ color: '#fff', fontSize: '2rem' }} />
                    <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700 }}>
                        CryptoCardiac
                    </Typography>
                </Box>
            </Link>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Link to="/leaderboard" style={{ textDecoration: 'none' }}>
                    <Button sx={{
                        color: '#fff',
                        fontWeight: 600,
                        '&:hover': {
                            background: 'rgba(255, 255, 255, 0.1)'
                        }
                    }}>
                        Leaderboard
                    </Button>
                </Link>

                {currentUser ? (
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Typography sx={{ color: '#fff', fontSize: '0.9rem' }}>
                            {currentUser.email}
                        </Typography>
                        <Button
                            onClick={handleLogout}
                            startIcon={<ExitToApp />}
                            sx={{
                                color: '#fff',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                fontWeight: 600,
                                '&:hover': {
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    borderColor: '#fff'
                                }
                            }}
                        >
                            Logout
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Link to="/login" style={{ textDecoration: 'none' }}>
                            <Button sx={{
                                color: '#fff',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                fontWeight: 600,
                                '&:hover': {
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    borderColor: '#fff'
                                }
                            }}>
                                Login
                            </Button>
                        </Link>
                        <Link to="/signup" style={{ textDecoration: 'none' }}>
                            <Button sx={{
                                background: '#fff',
                                color: '#764ba2',
                                fontWeight: 600,
                                '&:hover': {
                                    background: 'rgba(255, 255, 255, 0.9)'
                                }
                            }}>
                                Sign Up
                            </Button>
                        </Link>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default Navbar;
