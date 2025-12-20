import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, Typography, Button, useMediaQuery, useTheme } from '@mui/material';
import { Favorite, ExitToApp } from '@mui/icons-material';

import logo from '../assets/logo_crypto.png';

const Navbar = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const navLinks = [
        { title: 'Home', path: '/' },
        { title: 'Coins', path: '/coins' },
    ];

    // Add My Votes link only if user is logged in
    const userNavLinks = currentUser
        ? [...navLinks, { title: 'My Votes', path: '/my-votes' }]
        : navLinks;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {/* Promo Banner */}
            <Box
                component="a"
                href="https://flagamiindustries.com/collections/crypto-cardiac"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                    display: 'block',
                    width: '100%',
                    lineHeight: 0,
                    background: 'linear-gradient(135deg, #5700F9 0%, #CE34EA 100%)' // Match website theme
                }}
            >
                <Box
                    component="img"
                    src={require('../assets/banner.png')}
                    alt="Promo Banner"
                    sx={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        maxWidth: { xs: '100%', md: '600px' }, // Limit width on desktop to make it smaller
                        margin: '0 auto' // Center the image
                    }}
                />
            </Box>

            <Box sx={{
                background: 'linear-gradient(135deg, #5700F9 0%, #CE34EA 100%)',
                padding: isMobile ? '15px 10px' : '15px 30px',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                zIndex: 400,
                gap: isMobile ? 2 : 0
            }}>
                <Link to="/" style={{ textDecoration: 'none', width: isMobile ? '100%' : 'auto' }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        justifyContent: isMobile ? 'center' : 'flex-start'
                    }}>
                        <img src={logo} alt="CryptoCardiac Logo" style={{ height: '2rem', width: '2rem', borderRadius: '50%', objectFit: 'cover' }} />
                        <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700 }}>
                            CryptoCardiac
                        </Typography>
                    </Box>
                </Link>

                <Box sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    justifyContent: isMobile ? 'center' : 'flex-end',
                    width: isMobile ? '100%' : 'auto'
                }}>
                    {userNavLinks.map((link) => (
                        <Link key={link.title} to={link.path} style={{ textDecoration: 'none' }}>
                            <Button sx={{
                                color: '#fff',
                                fontWeight: 600,
                                fontSize: isMobile ? '0.8rem' : '0.875rem',
                                minWidth: isMobile ? 'auto' : '64px',
                                padding: isMobile ? '6px 10px' : '6px 16px',
                                '&:hover': { background: 'rgba(255, 255, 255, 0.1)' }
                            }}>
                                {link.title}
                            </Button>
                        </Link>
                    ))}

                    {currentUser ? (
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', ml: isMobile ? 0 : 2 }}>
                            {!isMobile && (
                                <Typography sx={{ color: '#fff', fontSize: '0.9rem' }}>
                                    {currentUser.email}
                                </Typography>
                            )}
                            <Button
                                onClick={handleLogout}
                                startIcon={!isMobile && <ExitToApp />}
                                sx={{
                                    color: '#fff',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    fontWeight: 600,
                                    fontSize: isMobile ? '0.8rem' : '0.875rem',
                                    padding: isMobile ? '6px 10px' : '6px 16px',
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
                        <Box sx={{ display: 'flex', gap: 1, ml: isMobile ? 0 : 2 }}>
                            <Link to="/login" style={{ textDecoration: 'none' }}>
                                <Button sx={{
                                    color: '#fff',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    fontWeight: 600,
                                    fontSize: isMobile ? '0.8rem' : '0.875rem',
                                    padding: isMobile ? '6px 10px' : '6px 16px',
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
                                    color: '#5700F9',
                                    fontWeight: 600,
                                    fontSize: isMobile ? '0.8rem' : '0.875rem',
                                    padding: isMobile ? '6px 10px' : '6px 16px',
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
        </Box>
    );
};

export default Navbar;
