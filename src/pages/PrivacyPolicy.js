import React from 'react';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import { Helmet } from 'react-helmet-async';

const contactEmail = 'support@cryptocardiac.com';

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
                <meta name="description" content="CryptoCardiac privacy policy covering account data, voting activity, cookies, analytics, Google AdSense, third-party ad serving, opt-out choices, and contact details." />
                <meta name="keywords" content="cryptocardiac privacy policy, crypto data protection, user privacy, cryptocurrency privacy, cookie policy, google adsense privacy" />
                <link rel="canonical" href="https://cryptocardiac.com/privacy-policy" />
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
                    <p style={{ color: '#888', marginBottom: '0.5rem' }}>Effective date: June 28, 2026</p>
                    <p style={{ color: '#888', marginBottom: '2rem' }}>Last updated: June 28, 2026</p>

                    <Section title="1. Introduction">
                        <p>CryptoCardiac ("we", "us", or "our") operates cryptocardiac.com as a cryptocurrency education and community-voting website. This Privacy Policy explains what information we collect, how we use it, how third-party services may process data, and how users can contact us about privacy questions.</p>
                    </Section>

                    <Section title="2. Information We Collect">
                        <p>We may collect the following types of information when you use CryptoCardiac:</p>
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                            <li>Account information such as email address, username, and authentication details when you register or sign in.</li>
                            <li>Voting activity, leaderboard interactions, article visits, and preferences needed to operate the platform.</li>
                            <li>Usage data such as pages visited, approximate session activity, browser type, referring pages, and feature interactions.</li>
                            <li>Technical data such as IP address, device type, operating system, cookies, web beacons, log files, and similar identifiers used for security, analytics, and advertising.</li>
                        </ul>
                    </Section>

                    <Section title="3. How We Use Information">
                        <p>We use information to operate, protect, and improve CryptoCardiac. This includes processing votes, maintaining accounts, preventing abuse, measuring site performance, improving educational content, responding to support requests, complying with legal obligations, and displaying advertising where applicable.</p>
                    </Section>

                    <Section title="4. Cookies and Similar Technologies">
                        <p>CryptoCardiac uses cookies and similar technologies for account sessions, preferences, security, analytics, advertising, and site performance. Cookies are small files stored on your device. Similar technologies may include web beacons, pixels, local storage, IP addresses, and other identifiers.</p>
                        <p style={{ marginTop: '0.75rem' }}>You can control or disable cookies through your browser settings. Some parts of the site, including login and voting features, may not work correctly if necessary cookies are disabled.</p>
                    </Section>

                    <Section title="5. Google AdSense and Third-Party Advertising">
                        <p>CryptoCardiac may display advertisements through Google AdSense and other third-party advertising services. Google and its partners may use cookies, web beacons, IP addresses, device identifiers, and other data to serve ads, measure ad performance, limit repeated ads, detect abuse, and personalize ads where permitted.</p>
                        <p style={{ marginTop: '0.75rem' }}>Google may use information from visits to CryptoCardiac and other websites or apps to provide advertising services. You can learn more at{' '}
                            <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" style={{ color: '#CE34EA' }}>
                                How Google uses data when you use our partners' sites or apps
                            </a>.
                        </p>
                        <p style={{ marginTop: '0.75rem' }}>Users may opt out of personalized Google advertising through{' '}
                            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: '#CE34EA' }}>Google Ads Settings</a>
                            {' '}and may review additional choices through{' '}
                            <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" style={{ color: '#CE34EA' }}>aboutads.info/choices</a>.
                        </p>
                    </Section>

                    <Section title="6. Third-Party Services">
                        <p>We use third-party services to operate the website. These services may process data according to their own privacy policies:</p>
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                            <li><strong style={{ color: '#fff' }}>Google AdSense</strong> for advertising and ad measurement.</li>
                            <li><strong style={{ color: '#fff' }}>Cloudflare</strong> for security, DNS, traffic routing, and performance.</li>
                            <li><strong style={{ color: '#fff' }}>CoinGecko API</strong> for cryptocurrency market data.</li>
                            <li><strong style={{ color: '#fff' }}>Authentication and database services</strong> for account access, votes, and platform records.</li>
                        </ul>
                    </Section>

                    <Section title="7. Data Sharing and Disclosure">
                        <p>We do not sell personal information. We may share limited data with service providers that help operate the website, with advertising and analytics partners as described above, when required by law, to protect users and the platform, or with user consent.</p>
                    </Section>

                    <Section title="8. Cookie Consent and Regional Choices">
                        <p>Where required, CryptoCardiac may show a cookie notice or consent prompt. Users in regions with privacy rights may contact us to ask questions about access, correction, deletion, or restriction of personal information, subject to verification and applicable law.</p>
                    </Section>

                    <Section title="9. Data Security and Retention">
                        <p>We use reasonable technical and organizational measures to protect information, but no online service can guarantee perfect security. We keep information for as long as needed to operate the platform, comply with legal obligations, resolve disputes, prevent abuse, and maintain accurate voting records.</p>
                    </Section>

                    <Section title="10. Children's Privacy">
                        <p>CryptoCardiac is not directed to children under 13, and we do not knowingly collect personal information from children under 13. If you believe a child has provided personal information, contact us so we can review the issue.</p>
                    </Section>

                    <Section title="11. Changes to This Policy">
                        <p>We may update this Privacy Policy from time to time. Updates will be posted on this page with a revised last updated date. Continued use of the site after changes means the updated policy applies.</p>
                    </Section>

                    <Section title="12. Contact Us">
                        <p>For privacy questions, advertising-policy concerns, data requests, or corrections, contact CryptoCardiac at <a href={`mailto:${contactEmail}`} style={{ color: '#CE34EA' }}>{contactEmail}</a>.</p>
                    </Section>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PrivacyPolicy;
