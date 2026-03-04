import { Box, Grid } from "@mui/material";
import React, { useState, createContext, useEffect } from "react";
import { Routes, Route, useParams, useNavigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import CurrencyData from "section/CurrencyData";
import Capitalization from "section/Capitalization";
import Navbar from "component/Navbar";
import Login from "component/Login";
import Signup from "component/Signup";
import Leaderboard from "pages/Leaderboard";
import AdminDashboard from "pages/AdminDashboard";
import MyVotes from "pages/MyVotes";
import Footer from "component/Footer";
import PrivacyPolicy from "pages/PrivacyPolicy";
import TermsAndConditions from "pages/TermsAndConditions";
import Disclaimer from "pages/Disclaimer";
import Contact from "pages/Contact";
import AboutUs from "pages/AboutUs";
import Articles from "pages/Articles";
import NotFound from "pages/NotFound";
import CookieConsent from "component/CookieConsent";
import { AuthProvider } from "contexts/AuthContext";
import styles from "./Styles.module.scss";

export const AppContext = createContext();

function CoinPage() {
  const { coinId } = useParams();
  const navigate = useNavigate();
  const [currency, setCurrency] = useState(coinId || "bitcoin");
  const [vsCurrency, setVsCurrency] = useState("usd");
  const [showCapSide, setShowCapSide] = useState(false);

  useEffect(() => {
    if (coinId) {
      setCurrency(coinId);
    }
  }, [coinId]);

  const handleSetCurrency = (newCurrency) => {
    setCurrency(newCurrency);
    navigate(`/${newCurrency}`);
  };

  return (
    <AppContext.Provider value={{ currency, setCurrency: handleSetCurrency, vsCurrency, setVsCurrency, showCapSide, setShowCapSide }}>
      <Navbar />
      <div style={{ backgroundColor: "rgb(21,21,32)" }}>
        <Box
          sx={{
            display: 'flex',
            minHeight: "100vh",
            width: "100%",
            position: "relative"
          }}>
          <Grid container spacing={0}>
            <Grid item xs={12} lg={9}>
              <CurrencyData coinName={currency} />
            </Grid>
            <Grid item lg={3}>
              <Capitalization />
            </Grid>
          </Grid>
          <Box className={`${styles.openCapitalization} ${showCapSide && styles.moveIcon}`} >
            <input className={styles.checkbox} type="checkbox" checked={showCapSide} value={showCapSide} onChange={() => setShowCapSide(!showCapSide)} />
            <div className={`${styles.line1} ${styles.lines}`} />
            <div className={`${styles.line2} ${styles.lines}`} />
            <div className={`${styles.line3} ${styles.lines}`} />
          </Box>
        </Box>
      </div>
      <Footer />
    </AppContext.Provider>
  );
}

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <CookieConsent />
        <Routes>
          <Route path="/" element={<Leaderboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/my-votes" element={<MyVotes />} />
          <Route path="/coins" element={<CoinPage />} />
          <Route path="/coins/:coinId" element={<CoinPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/featured-articles" element={<Articles />} />
          <Route path="/featured-articles/:id" element={<Articles />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;


