import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import { Helmet } from 'react-helmet-async';

const contactEmail = 'support@cryptocardiac.com';

const StatCard = ({ value, label }) => (
    <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '8px',
        padding: '22px',
        textAlign: 'center',
    }}>
        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#CE34EA' }}>{value}</div>
        <div style={{ color: '#888', fontSize: '0.85rem', marginTop: '4px' }}>{label}</div>
    </div>
);

const Section = ({ title, children }) => (
    <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ color: '#fff', fontSize: '1.65rem', marginBottom: '1rem' }}>{title}</h2>
        <div style={{ color: '#aaa', fontSize: '1rem', lineHeight: 1.8 }}>{children}</div>
    </section>
);

const DetailCard = ({ title, children }) => (
    <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '8px',
        padding: '22px',
    }}>
        <h3 style={{ color: '#CE34EA', marginBottom: '0.65rem', fontSize: '1rem' }}>{title}</h3>
        <div style={{ color: '#aaa', fontSize: '0.94rem', lineHeight: 1.7 }}>{children}</div>
    </div>
);

const AboutUs = () => {
    return (
        <>
            <Helmet>
                <title>About CryptoCardiac | Community Crypto Rankings and Editorial Methodology</title>
                <meta name="description" content="Learn about CryptoCardiac's community voting methodology, editorial standards, publisher contact details, and educational approach to cryptocurrency rankings." />
                <meta name="keywords" content="about cryptocardiac, crypto voting methodology, community crypto rankings, cryptocurrency education, editorial policy" />
                <meta property="og:title" content="About CryptoCardiac | Community Crypto Rankings and Editorial Methodology" />
                <meta property="og:description" content="CryptoCardiac explains community attention signals through transparent rankings and educational crypto research." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://cryptocardiac.com/about" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content="About CryptoCardiac" />
                <meta name="twitter:description" content="Learn about CryptoCardiac's mission, ranking methodology, and editorial standards." />
                <link rel="canonical" href="https://cryptocardiac.com/about" />
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'AboutPage',
                        name: 'About CryptoCardiac',
                        url: 'https://cryptocardiac.com/about',
                        description: 'CryptoCardiac is a cryptocurrency community voting and education platform focused on transparent community-interest signals.',
                        mainEntity: {
                            '@type': 'Organization',
                            name: 'CryptoCardiac',
                            url: 'https://cryptocardiac.com',
                            email: contactEmail,
                            contactPoint: {
                                '@type': 'ContactPoint',
                                email: contactEmail,
                                contactType: 'customer support'
                            }
                        }
                    })}
                </script>
            </Helmet>
            <Navbar />
            <div style={{
                minHeight: '100vh',
                background: 'rgb(21,21,32)',
                color: '#ccc',
                fontFamily: 'Inter, sans-serif',
                lineHeight: '1.8',
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, #5700F9 0%, #CE34EA 100%)',
                    padding: '76px 20px',
                    textAlign: 'center',
                }}>
                    <h1 style={{ color: '#fff', fontSize: '2.8rem', fontWeight: 800, marginBottom: '1rem' }}>
                        About CryptoCardiac
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: '1.12rem', maxWidth: '720px', margin: '0 auto' }}>
                        CryptoCardiac tracks public community attention around cryptocurrency projects and pairs those rankings with educational articles about risk, research, and responsible interpretation.
                    </p>
                </div>

                <div style={{ maxWidth: '980px', margin: '0 auto', padding: '56px 20px' }}>
                    <Section title="Mission">
                        <p>
                            CryptoCardiac exists to make community interest easier to observe without turning popularity into investment advice. A vote count can show that a community is active, but it cannot prove safety, legal clarity, liquidity, token value, or future performance. The site is designed to help readers discover signals, then slow down and research them.
                        </p>
                    </Section>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '3rem' }}>
                        <StatCard value="19,000+" label="Coins Searchable" />
                        <StatCard value="24h / 7d" label="Voting Windows" />
                        <StatCard value="1/day" label="Vote Limit Per Coin" />
                        <StatCard value="Education" label="Core Purpose" />
                    </div>

                    <Section title="How Rankings Work">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                            <DetailCard title="Community voting">
                                Users can vote for listed crypto projects. Vote windows help compare short-term attention with steadier participation.
                            </DetailCard>
                            <DetailCard title="Anti-spam limits">
                                Daily limits make repeat voting less useful and help each vote behave more like a deliberate community signal.
                            </DetailCard>
                            <DetailCard title="Market context">
                                Rankings can be compared with price, liquidity, supply, documentation, security history, and independent research.
                            </DetailCard>
                            <DetailCard title="No guarantee">
                                A high ranking is not a recommendation to buy, sell, or hold. It only reflects activity on the platform.
                            </DetailCard>
                        </div>
                    </Section>

                    <Section title="Editorial Methodology">
                        <p style={{ marginBottom: '1rem' }}>
                            CryptoCardiac articles are written for general education. They explain crypto concepts, community signals, wallet safety, exchange risk, regulation, and market behavior in plain language. Articles avoid guaranteed-return claims, personal portfolio advice, and instructions to evade legal or tax responsibilities.
                        </p>
                        <p style={{ marginBottom: '1rem' }}>
                            When an article discusses a project, platform, or market signal, the goal is to separate facts from interpretation. Readers are encouraged to compare official documentation, block explorers, risk disclosures, regulatory context, and independent sources before making decisions.
                        </p>
                        <p>
                            Corrections, source concerns, and editorial feedback can be sent to <a href={`mailto:${contactEmail}`} style={{ color: '#CE34EA' }}>{contactEmail}</a>. CryptoCardiac may update pages when facts change, clearer wording is needed, or additional risk context improves the article.
                        </p>
                    </Section>

                    <Section title="Publisher Details">
                        <p>
                            CryptoCardiac is the publisher and operator of cryptocardiac.com. The website provides public cryptocurrency education, voting methodology explanations, and community-interest rankings. For support, privacy, copyright, corrections, or advertising-policy questions, contact <a href={`mailto:${contactEmail}`} style={{ color: '#CE34EA' }}>{contactEmail}</a>.
                        </p>
                    </Section>

                    <Section title="What CryptoCardiac Does Not Do">
                        <ul style={{ paddingLeft: '1.25rem' }}>
                            <li>CryptoCardiac does not provide personal financial, investment, legal, or tax advice.</li>
                            <li>CryptoCardiac does not guarantee the accuracy or completeness of third-party market data.</li>
                            <li>CryptoCardiac does not certify that a voted coin is safe, compliant, liquid, or suitable for purchase.</li>
                            <li>CryptoCardiac does not sell rankings or treat paid promotion as a substitute for disclosure and research.</li>
                        </ul>
                    </Section>

                    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                        <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Explore the platform</h2>
                        <p style={{ color: '#888', marginBottom: '1.5rem' }}>Use rankings as a discovery tool, then read the educational guides before drawing conclusions.</p>
                        <Link to="/featured-articles" style={{
                            display: 'inline-block',
                            padding: '14px 30px',
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #5700F9 0%, #CE34EA 100%)',
                            color: '#fff',
                            fontWeight: 700,
                            textDecoration: 'none',
                            fontSize: '1rem',
                        }}>
                            Read Articles
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AboutUs;
