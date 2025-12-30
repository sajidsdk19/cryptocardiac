import { Box, Chip, LinearProgress, Typography, Snackbar, Alert } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { AppContext } from 'App';
import { getCoinData } from 'component/api';
import Loading from 'component/Loading';
import { Anchor, AutorenewRounded, BoltOutlined, OfflineBoltOutlined, Straight } from '@mui/icons-material';
import { StatBarHeader } from "component/commons";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import { useAuth } from '../contexts/AuthContext';
import { useVoting } from '../hooks/useVoting';
import VoteButton from '../component/VoteButton';
import ShareModal from '../component/ShareModal';
import styles from "../Styles.module.scss"

const CurrencyData = () => {
  const { currency, vsCurrency } = useContext(AppContext);
  const { currentUser, refreshUser } = useAuth();
  const { vote, checkGlobalVoteStatus } = useVoting();
  const navigate = useNavigate();
  const [coinData, setCoinData] = useState([]);
  const [voteCount, setVoteCount] = useState(0);
  const [canVote, setCanVote] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  let supplyPercent = useRef(0);
  let marketCapToBTC = useRef(0);
  let volume24ToBtc = useRef(0);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    setCoinData([]);
    const coin = async () => {
      const data = await getCoinData(currency);
      setCoinData(data);
      supplyPercent.current = Number(((data.market_data.total_supply / data.market_data.max_supply) * 100)).toFixed(0);
      marketCapToBTC.current = 0;
      volume24ToBtc.current = 0;
      data.tickers.forEach(item => {
        marketCapToBTC.current += item.converted_volume.btc
        volume24ToBtc.current += item.converted_last.btc
      })
    }
    coin();
  }, [currency]);

  // Fetch vote count and user vote status
  useEffect(() => {
    const fetchVoteData = async () => {
      try {
        // Get total vote count for this coin
        const response = await fetch(`${API_URL}/votes`);
        const voteCounts = await response.json();
        setVoteCount(voteCounts[currency] || 0);

        // Check if user can vote for this coin
        if (currentUser) {
          const globalStatus = await checkGlobalVoteStatus();
          const votedCoinIds = new Set(
            (globalStatus.votedCoins || []).map(v => v.coinId)
          );

          const userCanVote = !votedCoinIds.has(currency);
          setCanVote(userCanVote);

          if (!userCanVote) {
            // Calculate time until midnight EST
            const now = new Date();
            const nowESTString = now.toLocaleString('en-US', { timeZone: 'America/New_York' });
            const nowEST = new Date(nowESTString);
            const nextMidnight = new Date(nowEST);
            nextMidnight.setHours(24, 0, 0, 0);
            const remainingMs = nextMidnight - nowEST;
            const hours = Math.floor(remainingMs / (1000 * 60 * 60));
            const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
            setTimeRemaining({ hours, minutes });
          }
        }
      } catch (error) {
        console.error('Error fetching vote data:', error);
      }
    };

    if (currency) {
      fetchVoteData();
    }
  }, [currency, currentUser, API_URL, checkGlobalVoteStatus]);

  const handleVote = async () => {
    try {
      const data = await vote(currency, coinData.name);

      await refreshUser();
      setNotification({ open: true, message: `✅ You earned +1 Share Point! Points Earned: ${data.share_points}`, severity: 'success' });

      // Update local vote count
      setVoteCount(prev => prev + 1);

      // Update vote status
      setCanVote(false);
      // Calculate time until midnight EST
      const now = new Date();
      const nowESTString = now.toLocaleString('en-US', { timeZone: 'America/New_York' });
      const nowEST = new Date(nowESTString);
      const nextMidnight = new Date(nowEST);
      nextMidnight.setHours(24, 0, 0, 0);
      const remainingMs = nextMidnight - nowEST;
      const hours = Math.floor(remainingMs / (1000 * 60 * 60));
      const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
      setTimeRemaining({ hours, minutes });
    } catch (error) {
      console.error('Error voting:', error);
      setNotification({ open: true, message: error.message, severity: 'error' });
    }
  };

  const handleShareComplete = async (platform) => {
    // Close modal
    setShareModalOpen(false);

    // If user cancelled (platform is null), do nothing
    if (!platform) return;

    // ShareModal.js already handles awarding points for Twitter shares
    // No need to call the API again here
  };

  if (coinData.length === 0) return <Loading />

  const pageUrl = window.location.href;
  const logoUrl = coinData.image?.large || `${window.location.origin}/og-image.png`;
  const pageTitle = `${coinData.name} (${coinData.symbol.toUpperCase()}) — CryptoCardiac`;
  const pageDescription = `Vote for ${coinData.name} and explore real-time rankings, charts, and analytics on CryptoCardiac.`;

  return (
    <Box sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={logoUrl} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={pageUrl} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={logoUrl} />
      </Helmet>

      <Typography
        variant='h6'
        component='h2'
        sx={{
          color: "#dfdfdf",
          fontWeight: 500,
          fontSize: "1.1rem",
          letterSpacing: "0.1px",
          pb: 3
        }} >
        Price
      </Typography>
      <Box className={styles.priceSection} sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box component="img" src={coinData.image.small} sx={{ mr: 2 }} />
          <Box sx={{ color: "#dfdfdf", display: "flex", flexDirection: "column" }}>
            <Typography component="h3" fontWeight={600} fontSize={"1.5rem"} sx={{ display: "flex", alignItems: "center", letterSpacing: "0.5px" }}>
              {coinData.name}
              <Typography component="span" fontWeight={500} sx={{ ml: 1, color: "rgb(183 183 183 / 62%)" }}>
                ({(coinData.symbol).toUpperCase()})
              </Typography>
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1, flexWrap: { xs: "wrap", sm: "nowrap" } }}>
              <Typography component="span" sx={{ color: "rgb(142 144 149)", fontSize: "0.9rem" }}>
                {voteCount.toLocaleString()} votes
              </Typography>
              <VoteButton
                crypto={{ id: currency, name: coinData.name }}
                canVote={canVote}
                onVote={handleVote}
                timeRemaining={timeRemaining}
              />
              <button
                className={styles.shareButton}
                style={{ whiteSpace: 'nowrap' }}
                onClick={() => {
                  // Check if user is logged in
                  if (!currentUser) {
                    navigate('/login');
                    return;
                  }
                  // Open custom share modal
                  setShareModalOpen(true);
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor" />
                </svg>
                {currentUser ? 'Share' : 'Sign in to Share'}
              </button>
              {!canVote && currentUser && timeRemaining && (
                <Typography component="span" sx={{ color: "rgb(142 144 149)", fontSize: "0.8rem" }}>
                  Next vote in: {timeRemaining.hours}h {timeRemaining.minutes}m
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography component="p" sx={{ color: "#dfdfdf", fontSize: "2rem", fontWeight: 600, letterSpacing: 1 }}>
            {coinData.market_data.current_price[vsCurrency].toLocaleString('en-US', { style: 'currency', currency: `${vsCurrency}`, minimumFractionDigits: 0 })}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Chip label={`${(Math.abs(coinData.market_data.price_change_percentage_24h_in_currency[vsCurrency]).toFixed(2))}%`} sx={{ ml: 1, height: "20px", backgroundColor: coinData.market_data.price_change_percentage_24h >= 1 ? "rgb(40,182,85)" : "red", color: "#dfdfdf", fontSize: ".9rem", fontWeight: 700 }} icon={<Straight sx={{ color: "#fff !important", height: "0.7em", width: "0.7em", ...(coinData.market_data.price_change_percentage_24h_in_currency[vsCurrency] < 1 && { transform: "rotate(180deg)" }) }} />} />
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column" }} className={styles.statBar}>
        <Box className={styles.statBarHeader} sx={{ mt: 2, width: "100%", display: "flex", alignItems: "center", color: "#dfdfdf" }}>
          <StatBarHeader
            icon={<Anchor sx={{ color: 'rgb(75,76,93)', fontSize: "1.6rem" }} />}
            title={"Market Cap"}
            borderdir="start"
          />
          <StatBarHeader
            icon={<BoltOutlined sx={{ color: 'rgb(75,76,93)', fontSize: "1.6rem" }} />}
            title={"Volume (24h)"}
          />
          <StatBarHeader
            icon={<OfflineBoltOutlined sx={{ color: 'rgb(75,76,93)', fontSize: "1.6rem" }} />}
            title={"Max Supply"}
          />
          <StatBarHeader
            icon={<AutorenewRounded sx={{ color: 'rgb(75,76,93)', fontSize: "1.6rem" }} />}
            title={"Circulating Supply"}
            borderdir="end"
          />
        </Box>
        <Box className={styles.statBarContent} sx={{ display: "flex", justifyContent: "space-between", color: "#dfdfdf" }}>
          <Box className={styles.numbers} sx={{ px: 2, py: 1.7, width: "100%" }}>
            <Typography component="p" sx={{ fontSize: '0.9rem', width: "100%" }}>
              {coinData.market_data.market_cap[vsCurrency].toLocaleString('en-US', { style: 'currency', currency: `${vsCurrency}`, minimumFractionDigits: 0 })}
            </Typography>
            <Typography component="p" sx={{ fontSize: "0.8rem", color: "rgb(142 144 149)", mt: 1.5 }}>{(marketCapToBTC.current).toFixed(1)} {(coinData.symbol).toUpperCase()}</Typography>
          </Box>
          <Box className={styles.numbers} sx={{ px: 2, py: 1.7, width: "100%" }}>
            <Typography component="p" sx={{ fontSize: '0.9rem', width: "100%" }}>
              {coinData.market_data.total_volume[vsCurrency].toLocaleString('en-US', { style: 'currency', currency: `${vsCurrency}`, minimumFractionDigits: 0 })}
            </Typography>
            <Typography component="p" sx={{ fontSize: "0.8rem", color: "rgb(142 144 149)", mt: 1.5 }}>{(volume24ToBtc.current).toFixed(1)} {(coinData.symbol).toUpperCase()}</Typography>
          </Box>
          <Box className={styles.numbers} sx={{ px: 2, py: 1.7, width: "100%" }}>
            {(coinData.market_data.max_supply !== null) ?
              <Box>
                <Typography component="p" sx={{ fontSize: '0.9rem' }}>
                  {String(coinData.market_data.max_supply).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {(coinData.symbol).toUpperCase()}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", width: "100%", mt: 1.5 }}>
                  <LinearProgress className={styles.progressBar} variant="determinate" color="primary" value={Number(supplyPercent.current)}
                    sx={{
                      bgcolor: "rgb(37,41,60)", width: "40%", borderRadius: "25px",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: `rgb(39, 115, 163) 161, 242)`
                      }
                    }}
                  />
                  <Typography component="p" sx={{ fontSize: "0.8rem", ml: 1, color: "rgb(142 144 149)" }}>{supplyPercent.current}%</Typography>
                </Box>
              </Box> :
              <Typography component="p" sx={{ color: "rgb(142 144 149)" }}>Nothing Found</Typography>
            }
          </Box>
          <Typography className={styles.circulate} component="p" sx={{ px: 2, py: 1.7, fontSize: '0.9rem', width: "100%" }}>
            {String(coinData.market_data.circulating_supply).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {(coinData.symbol).toUpperCase()}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ flexGrow: 1 }} className={styles.tradingView} >
        <AdvancedRealTimeChart symbol={`${coinData.symbol}usdt`} theme="dark" height={"100%"} width={"100%"} timezone={Intl.DateTimeFormat().resolvedOptions().timeZone} copyrightStyles={{ parent: { display: "none" } }}></AdvancedRealTimeChart>
      </Box>

      <ShareModal
        open={shareModalOpen}
        onClose={handleShareComplete}
        coinData={coinData}
        onShareSuccess={(points) => {
          setVoteCount(prev => prev + 1);
          setNotification({ open: true, message: `✅ Shared! +1 Point. Total Points: ${points}`, severity: 'success' });
        }}
      />

      <Snackbar
        open={notification.open}
        autoHideDuration={1000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default CurrencyData;
