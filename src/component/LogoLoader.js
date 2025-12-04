import React from 'react';
import logo from '../assets/logo_crypto.png';
import styles from '../styles/LogoLoader.module.scss';

const LogoLoader = () => {
    return (
        <div className={styles.loaderContainer}>
            <div className={styles.logoWrapper}>
                <img src={logo} alt="CryptoCardiac Logo" className={styles.logo} />
                <div className={styles.pulse}></div>
            </div>
        </div>
    );
};

export default LogoLoader;
