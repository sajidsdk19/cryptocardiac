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

const Disclaimer = () => {
    return (
        <>
            <Helmet>
                <title>Disclaimer - CryptoCardiac | Important Risk Information</title>
                <meta name="description" content="Important disclaimer for CryptoCardiac cryptocurrency voting platform. Read about investment risks, data accuracy, and usage terms before participating." />
                <meta name="keywords" content="crypto disclaimer, cryptocurrency risk, investment disclaimer, crypto voting risks, financial disclaimer, terms of use cryptocardiac" />
                <meta property="og:title" content="Disclaimer | CryptoCardiac" />
                <meta property="og:description" content="Important regulatory and financial disclaimers regarding the use of CryptoCardiac and the risks of cryptocurrency." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://cryptocardiac.com/disclaimer" />
                <link rel="canonical" href="https://cryptocardiac.com/disclaimer" />
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
                    <h1 style={{ color: '#fff', fontSize: '2rem', marginBottom: '0.5rem' }}>Disclaimer</h1>
                    <p style={{ color: '#888', marginBottom: '2rem' }}>Last updated: February 26, 2025</p>

                    <Section title="🚨 No Financial Advice">
                        <p>The information provided on <strong style={{ color: '#fff' }}>CryptoCardiac</strong> (cryptocardiac.com) is for general informational and entertainment purposes only. Nothing on this website constitutes financial, investment, legal, or tax advice of any kind.</p>
                        <p style={{ marginTop: '0.75rem' }}>Cryptocurrency markets are highly volatile and unpredictable. You should always conduct your own research and consult with a qualified financial advisor before making any investment decisions.</p>
                        <p style={{ marginTop: '0.75rem' }}><strong style={{ color: '#fff' }}>Never invest more than you can afford to lose.</strong> Past performance is not indicative of future results.</p>
                    </Section>

                    <Section title="⚠️ Understanding Cryptocurrency Risks">
                        <p>Cryptocurrency investments involve significant risks that may not be suitable for all investors:</p>
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                            <li><strong style={{ color: '#fff' }}>Market Volatility:</strong> Crypto prices can fluctuate dramatically in short periods</li>
                            <li><strong style={{ color: '#fff' }}>Regulatory Risk:</strong> Governments may restrict or ban cryptocurrency use</li>
                            <li><strong style={{ color: '#fff' }}>Security Risk:</strong> Exchanges and wallets can be hacked or go bankrupt</li>
                            <li><strong style={{ color: '#fff' }}>Liquidity Risk:</strong> Some cryptocurrencies may be difficult to sell quickly</li>
                            <li><strong style={{ color: '#fff' }}>Technology Risk:</strong> Code vulnerabilities and network failures can cause losses</li>
                            <li><strong style={{ color: '#fff' }}>Fraud Risk:</strong> Scams and fraudulent projects are common in crypto</li>
                        </ul>
                    </Section>

                    <Section title="📊 Data Accuracy & Reliability">
                        <p>We do not guarantee the accuracy, completeness, timeliness, or reliability of any information displayed on this site, including:</p>
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                            <li>Cryptocurrency prices and market capitalizations</li>
                            <li>Voting counts and community rankings</li>
                            <li>Trading volumes and market data</li>
                            <li>Project information and descriptions</li>
                        </ul>
                        <p style={{ marginTop: '0.75rem' }}>Data is sourced from third-party APIs and may contain errors, delays, or inaccuracies. Always verify information from multiple sources before making decisions.</p>
                    </Section>

                    <Section title="🔗 Third-Party Content & Advertisements">
                        <p>This site contains links to third-party websites and displays advertisements served by <strong style={{ color: '#fff' }}>Google AdSense</strong>. We have no control over the content or practices of these third-party sites and assume no responsibility for them.</p>
                        <p style={{ marginTop: '0.75rem' }}>Third-party content may include:</p>
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                            <li>Sponsored content and paid promotions</li>
                            <li>Affiliate links and referral programs</li>
                            <li>User-generated content and comments</li>
                            <li>External news articles and analysis</li>
                        </ul>
                        <p style={{ marginTop: '0.75rem' }}><strong style={{ color: '#fff' }}>Visiting third-party links is at your own risk.</strong> We do not endorse or guarantee any external products, services, or information.</p>
                    </Section>

                    <Section title="🗳️ Understanding Community Votes">
                        <p>Community votes on CryptoCardiac represent user opinions and sentiment, <strong style={{ color: '#fff' }}>not investment advice or quality indicators</strong>:</p>
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                            <li>Votes are subjective and may be manipulated</li>
                            <li>High vote counts do not guarantee project quality or success</li>
                            <li>Voting patterns may reflect marketing efforts rather than genuine support</li>
                            <li>Projects with few votes may still be valuable investments</li>
                        </ul>
                        <p style={{ marginTop: '0.75rem' }}>Always conduct thorough due diligence beyond community voting data when evaluating cryptocurrency projects.</p>
                    </Section>

                    <Section title="⚖️ Limitation of Liability">
                        <p>To the maximum extent permitted by applicable law, CryptoCardiac and its operators shall not be held liable for any direct, indirect, incidental, special, or consequential damages arising out of or in connection with:</p>
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                            <li>Your use of this website or reliance on any information presented herein</li>
                            <li>Any investment decisions made based on site content</li>
                            <li>Technical issues, website downtime, or data inaccuracies</li>
                            <li>Losses from cryptocurrency investments or trading</li>
                            <li>Security breaches or unauthorized access to your accounts</li>
                        </ul>
                    </Section>

                    <Section title="🔍 Due Diligence Best Practices">
                        <p>Before investing in any cryptocurrency, we recommend:</p>
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                            <li><strong style={{ color: '#fff' }}>Research the Team:</strong> Investigate developers and advisors behind the project</li>
                            <li><strong style={{ color: '#fff' }}>Analyze the Technology:</strong> Understand the blockchain and its use cases</li>
                            <li><strong style={{ color: '#fff' }}>Review Tokenomics:</strong> Study supply, distribution, and economic models</li>
                            <li><strong style={{ color: '#fff' }}>Check Community:</strong> Assess genuine community engagement and development activity</li>
                            <li><strong style={{ color: '#fff' }}>Verify Legality:</strong> Ensure compliance with your local regulations</li>
                            <li><strong style={{ color: '#fff' }}>Start Small:</strong> Begin with minimal investments to test your understanding</li>
                        </ul>
                    </Section>

                    <Section title="📞 Contact & Questions">
                        <p>If you have any questions about this Disclaimer or need clarification on any risks mentioned, please contact us at: <a href="mailto:support@cryptocardiac.com" style={{ color: '#CE34EA' }}>support@cryptocardiac.com</a></p>
                        <p style={{ marginTop: '0.75rem' }}>For financial advice, please consult with a qualified financial advisor who understands cryptocurrency markets and your personal financial situation.</p>
                    </Section>

                    <Section title="🎯 How Crypto Voting Works">
                        <p><strong style={{ color: '#fff' }}>One Vote Per Day:</strong> Each user can vote for any cryptocurrency once every 24 hours. This prevents spam and ensures each vote represents genuine daily sentiment.</p>
                        <p style={{ marginTop: '0.75rem' }}><strong style={{ color: '#fff' }}>Time-Based Tracking:</strong> Votes are tracked across multiple time windows to identify both short-term trends and long-term community support patterns.</p>
                        <p style={{ marginTop: '0.75rem' }}><strong style={{ color: '#fff' }}>Share Points System:</strong> Earn points for each vote to climb the community leaderboard. Your voting history and consistency are rewarded with higher rankings.</p>
                        <p style={{ marginTop: '0.75rem' }}><strong style={{ color: '#fff' }}>Real Data, Real Impact:</strong> Unlike speculative price movements, community votes reflect actual user engagement and belief in cryptocurrency projects.</p>
                    </Section>

                    <Section title="🌟 Platform Features & Benefits">
                        <p><strong style={{ color: '#fff' }}>🗳️ Community-Powered Rankings:</strong> Real-time voting data from thousands of crypto enthusiasts worldwide. Each vote represents genuine community sentiment, not automated bots or fake engagement.</p>
                        <p style={{ marginTop: '0.75rem' }}><strong style={{ color: '#fff' }}>📊 Smart Analytics:</strong> Track voting trends across 24-hour, 7-day, and 3-month windows. Identify emerging cryptocurrencies before they explode in popularity.</p>
                        <p style={{ marginTop: '0.75rem' }}><strong style={{ color: '#fff' }}>🔍 Comprehensive Coverage:</strong> Search and vote for over 19,000 cryptocurrencies with live market data, price tracking, and community-driven insights.</p>
                    </Section>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Disclaimer;
