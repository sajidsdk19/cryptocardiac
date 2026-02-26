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

const TermsAndConditions = () => {
    return (
        <>
            <Helmet>
                <title>Terms & Conditions - CryptoCardiac | Platform Usage Rules</title>
                <meta name="description" content="CryptoCardiac's terms and conditions. Read our platform usage rules, voting guidelines, account policies, and user responsibilities for the crypto voting platform." />
                <meta name="keywords" content="cryptocardiac terms, crypto platform terms, voting platform rules, cryptocurrency terms, user agreement, crypto voting terms" />
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
                    <h1 style={{ color: '#fff', fontSize: '2rem', marginBottom: '0.5rem' }}>Terms & Conditions</h1>
                    <p style={{ color: '#888', marginBottom: '2rem' }}>Last updated: February 26, 2025</p>

                    <Section title="1. Acceptance of Terms">
                        <p>By accessing or using <strong style={{ color: '#fff' }}>CryptoCardiac</strong> ("the Site"), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the Site.</p>
                    </Section>

                    <Section title="2. Description of Service">
                        <p>CryptoCardiac is a cryptocurrency community voting platform. Users can vote for their favorite cryptocurrencies, view rankings, explore charts, and participate in community engagement. We do not provide financial advice.</p>
                    </Section>

                    <Section title="3. User Accounts">
                        <ul style={{ paddingLeft: '1.5rem' }}>
                            <li>You must be at least 13 years old to create an account.</li>
                            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                            <li>You agree to provide accurate and current information during registration.</li>
                            <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
                        </ul>
                    </Section>

                    <Section title="4. Voting Rules">
                        <ul style={{ paddingLeft: '1.5rem' }}>
                            <li>Each registered user may cast one vote per cryptocurrency per day (reset at midnight EST).</li>
                            <li>Vote manipulation, bots, or automated voting is strictly prohibited.</li>
                            <li>We reserve the right to remove fraudulent votes without notice.</li>
                        </ul>
                    </Section>

                    <Section title="5. Intellectual Property">
                        <p>All content on this Site, including logos, text, graphics, and software, is the property of CryptoCardiac or its content suppliers and is protected by intellectual property laws. You may not reproduce or distribute any content without prior written consent.</p>
                    </Section>

                    <Section title="6. Third-Party Content & Advertisements">
                        <p>The Site displays third-party advertisements served by <strong style={{ color: '#fff' }}>Google AdSense</strong>. We are not responsible for the content of those advertisements. Clicking on third-party ads is at your own risk.</p>
                        <p style={{ marginTop: '0.5rem' }}>Cryptocurrency data is sourced from third-party APIs (e.g., CoinGecko). We do not guarantee the accuracy or completeness of this data.</p>
                    </Section>

                    <Section title="7. No Financial Advice">
                        <p>Nothing on this Site constitutes financial, investment, legal, or tax advice. Cryptocurrency investments are highly volatile and risky. Always do your own research before making any investment decisions.</p>
                    </Section>

                    <Section title="8. Limitation of Liability">
                        <p>To the fullest extent permitted by law, CryptoCardiac shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of (or inability to use) the Site.</p>
                    </Section>

                    <Section title="9. Modifications">
                        <p>We reserve the right to modify these Terms at any time. Updates will be posted on this page. Your continued use of the Site after changes constitutes your acceptance of the revised Terms.</p>
                    </Section>

                    <Section title="10. Governing Law">
                        <p>These Terms shall be governed by and construed in accordance with applicable laws. Any disputes shall be resolved through binding arbitration.</p>
                    </Section>

                    <Section title="11. Contact">
                        <p>For questions regarding these Terms, contact us at: <a href="mailto:support@cryptocardiac.com" style={{ color: '#CE34EA' }}>support@cryptocardiac.com</a></p>
                    </Section>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default TermsAndConditions;
