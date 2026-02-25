import React from 'react';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';

const Section = ({ title, children }) => (
    <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#CE34EA', fontSize: '1.2rem', marginBottom: '0.5rem' }}>{title}</h2>
        {children}
    </div>
);

const Disclaimer = () => {
    return (
        <>
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
                    <h1 style={{ color: '#fff', fontSize: '2rem', marginBottom: '0.5rem' }}>Disclaimer</h1>
                    <p style={{ color: '#888', marginBottom: '2rem' }}>Last updated: February 26, 2025</p>

                    <Section title="No Financial Advice">
                        <p>The information provided on <strong style={{ color: '#fff' }}>CryptoCardiac</strong> (cryptocardiac.com) is for general informational and entertainment purposes only. Nothing on this website constitutes financial, investment, legal, or tax advice of any kind.</p>
                        <p style={{ marginTop: '0.75rem' }}>Cryptocurrency markets are highly volatile and unpredictable. You should always conduct your own research and consult with a qualified financial advisor before making any investment decisions.</p>
                    </Section>

                    <Section title="No Guarantees">
                        <p>We do not guarantee the accuracy, completeness, timeliness, or reliability of any information displayed on this site, including cryptocurrency prices, market capitalizations, or vote counts. Data is sourced from third-party APIs and may not always be up to date.</p>
                    </Section>

                    <Section title="Third-Party Links & Advertisements">
                        <p>This site contains links to third-party websites and displays advertisements served by <strong style={{ color: '#fff' }}>Google AdSense</strong>. We have no control over the content or practices of these third-party sites and assume no responsibility for them. Visiting third-party links is at your own risk.</p>
                    </Section>

                    <Section title="Investment Risk">
                        <p>Investing in cryptocurrencies involves substantial risk of loss. Past performance is not indicative of future results. Community votes on this platform do not reflect the investment potential of any cryptocurrency. Never invest more than you can afford to lose.</p>
                    </Section>

                    <Section title="Limitation of Liability">
                        <p>To the maximum extent permitted by applicable law, CryptoCardiac and its operators shall not be held liable for any direct, indirect, incidental, special, or consequential damages arising out of or in connection with the use of this website or reliance on any information presented herein.</p>
                    </Section>

                    <Section title="Contact">
                        <p>If you have any questions about this Disclaimer, please contact us at: <a href="mailto:support@cryptocardiac.com" style={{ color: '#CE34EA' }}>support@cryptocardiac.com</a></p>
                    </Section>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Disclaimer;
