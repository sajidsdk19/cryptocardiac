import React from 'react';
import styles from '../styles/DatabaseStatusModal.module.scss';

const DatabaseStatusModal = ({ isOpen }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.iconContainer}>
                    <svg
                        className={styles.databaseIcon}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <ellipse cx="12" cy="5" rx="9" ry="3" stroke="currentColor" strokeWidth="2" />
                        <path d="M3 5v6c0 1.657 4.03 3 9 3s9-1.343 9-3V5" stroke="currentColor" strokeWidth="2" />
                        <path d="M3 11v6c0 1.657 4.03 3 9 3s9-1.343 9-3v-6" stroke="currentColor" strokeWidth="2" />
                    </svg>
                </div>

                <h2 className={styles.title}>MySQL Server Not Running</h2>
                <p className={styles.message}>
                    The database server is currently not connected. Please start your MySQL server.
                </p>

                <div className={styles.statusContainer}>
                    <div className={styles.spinner}></div>
                    <p className={styles.statusText}>Waiting for MySQL server to connect...</p>
                </div>

                <div className={styles.instructions}>
                    <p className={styles.instructionTitle}>To start MySQL:</p>
                    <ul className={styles.instructionList}>
                        <li>Open Services (services.msc)</li>
                        <li>Find "MySQL" service</li>
                        <li>Click "Start"</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DatabaseStatusModal;
