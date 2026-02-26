import React from 'react';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import { Helmet } from 'react-helmet-async';

const Section = ({ title, children }) => (
    <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#CE34EA', fontSize: '1.2rem', marginBottom: '0.5rem' }}>{title}</h2>
        {children}
    </div>
);

const PrivacyPolicy = () => {
    return (
        <>
            <Helmet>
                <title>Privacy Policy - CryptoCardiac | Data Protection & User Privacy</title>
                <meta name="description" content="CryptoCardiac's comprehensive privacy policy. Learn how we collect, use, and protect your data. Understand our cookie policy, Google AdSense usage, and your privacy rights." />
                <meta name="keywords" content="cryptocardiac privacy policy, crypto data protection, user privacy, cryptocurrency privacy, cookie policy, google adsense privacy" />
            </Helmet>
            <Navbar />
            <div style={{
                minHeight: '100vh',
                background: 'rgb(21,21,32)',
                color: '#ccc',
                padding: '40px 20px',
                fontFamily: 'Inter, sans-serif',
                lineHeight: '1.8',
            }}>
                <div style={{ maxWidth: '860px', margin: '0 auto' }}>
                    <h1 style={{ color: '#fff', fontSize: '2rem', marginBottom: '0.5rem' }}>Privacy Policy</h1>
                    <p style={{ color: '#888', marginBottom: '2rem' }}>Last updated: February 26, 2025</p>

                    <Section title="1. Introduction">
                        <p>Welcome to <strong style={{ color: '#fff' }}>CryptoCardiac</strong> ("we", "us", or "our"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit <strong style={{ color: '#fff' }}>cryptocardiac.com</strong>. Please read this policy carefully.</p>
                    </Section>

                    <Section title="2. Information We Collect">
                        <p>We may collect the following types of information:</p>
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                            <li>Account information (email address, username) when you register.</li>
                            <li>Voting activity and preferences.</li>
                            <li>Usage data including pages visited, time spent, and browser type.</li>
                            <li>Device and technical information (IP address, operating system).</li>
                        </ul>
                    </Section>

                    <Section title="3. Cookies">
                        <p>We use cookies and similar tracking technologies to enhance your experience. Cookies are small files stored on your device. We use cookies to:</p>
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                            <li>Keep you logged in across sessions.</li>
                            <li>Remember your preferences.</li>
                            <li>Analyze site traffic and usage patterns.</li>
                            <li>Serve personalized advertisements through third-party services.</li>
                        </ul>
                        <p style={{ marginTop: '0.75rem' }}>You can control or disable cookies via your browser settings. Note that disabling cookies may affect site functionality.</p>
                    </Section>

                    <Section title="4. Google AdSense & Third-Party Advertising">
                        <p>We use <strong style={{ color: '#fff' }}>Google AdSense</strong> to display advertisements on our site. Google and its partners use cookies (including the <strong style={{ color: '#fff' }}>DoubleClick cookie</strong>) to serve ads based on your prior visits to this website and other websites on the Internet.</p>
                        <p style={{ marginTop: '0.75rem' }}>Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the Internet.</p>
                        <p style={{ marginTop: '0.75rem' }}>
                            You may opt out of personalized advertising by visiting{' '}
                            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: '#CE34EA' }}>
                                Google Ads Settings
                            </a>
                            {' '}or{' '}
                            <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" style={{ color: '#CE34EA' }}>
                                www.aboutads.info/choices
                            </a>.
                        </p>
                    </Section>

                    <Section title="5. Third-Party Vendors">
                        <p>In addition to Google AdSense, we may work with the following third-party vendors who may use cookies or similar technologies:</p>
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                            <li><strong style={{ color: '#fff' }}>Google Analytics</strong> — for usage analytics.</li>
                            <li><strong style={{ color: '#fff' }}>CoinGecko API</strong> — for cryptocurrency market data.</li>
                            <li><strong style={{ color: '#fff' }}>Firebase / Auth services</strong> — for user authentication.</li>
                        </ul>
                        <p style={{ marginTop: '0.75rem' }}>These third-party vendors have their own privacy policies governing data use. We encourage you to review their policies.</p>
                    </Section>

                    <Section title="6. How We Use Your Information">
                        <p>We use the information we collect to:</p>
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                            <li>Provide, operate, and maintain our website.</li>
                            <li>Process votes and manage user accounts.</li>
                            <li>Send transactional emails and important notices.</li>
                            <li>Analyze usage to improve our services.</li>
                            <li>Display relevant advertisements via Google AdSense.</li>
                            <li>Comply with legal obligations.</li>
                        </ul>
                    </Section>

                    <Section title="7. Data Sharing & Disclosure">
                        <p>We do not sell your personal data. We may share data with:</p>
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                            <li>Service providers who assist us in operating the website.</li>
                            <li>Law enforcement or regulators when required by law.</li>
                            <li>Third-party advertisers (Google AdSense) in aggregate, non-personally identifiable form.</li>
                        </ul>
                    </Section>

                    <Section title="8. Opting Out">
                        <p>You have the following opt-out options:</p>
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                            <li>
                                <strong style={{ color: '#fff' }}>Google personalized ads:</strong>{' '}
                                <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: '#CE34EA' }}>
                                    google.com/settings/ads
                                </a>
                            </li>
                            <li>
                                <strong style={{ color: '#fff' }}>Network Advertising Initiative opt-out:</strong>{' '}
                                <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" style={{ color: '#CE34EA' }}>
                                    optout.networkadvertising.org
                                </a>
                            </li>
                            <li><strong style={{ color: '#fff' }}>Browser cookies:</strong> Disable via your browser's settings menu.</li>
                        </ul>
                    </Section>

                    <Section title="9. Children's Privacy">
                        <p>Our services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children.</p>
                    </Section>

                    <Section title="10. Changes to This Policy">
                        <p>We reserve the right to update this Privacy Policy at any time. Changes will be posted on this page with an updated date. Continued use of the site after changes constitutes acceptance.</p>
                    </Section>

                    <Section title="11. Contact Us">
                        <p>If you have questions about this Privacy Policy, please contact us at:</p>
                        <p style={{ marginTop: '0.5rem' }}>
                            📧 <a href="mailto:support@cryptocardiac.com" style={{ color: '#CE34EA' }}>support@cryptocardiac.com</a>
                        </p>
                    </Section>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PrivacyPolicy;
