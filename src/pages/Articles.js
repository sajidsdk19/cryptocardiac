import React, { useState, useEffect } from 'react';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import { useMediaQuery, useTheme } from '@mui/material';

const ArticleCard = ({ article, onClick, isMobile }) => (
    <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: isMobile ? '20px' : '24px',
        marginBottom: '24px',
        transition: 'transform 0.2s, background 0.2s',
        cursor: 'pointer'
    }}
        onClick={() => onClick(article)}
        onMouseEnter={e => {
            if (!isMobile) {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            }
        }}
        onMouseLeave={e => {
            if (!isMobile) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
            }
        }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{
                background: 'rgba(206, 52, 234, 0.1)',
                color: '#CE34EA',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.7rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
            }}>
                {article.category}
            </span>
            <span style={{ color: '#555', fontSize: '0.75rem' }}>Mar 2026</span>
        </div>
        <h3 style={{ color: '#fff', fontSize: isMobile ? '1.2rem' : '1.4rem', marginBottom: '12px', lineHeight: '1.4' }}>{article.title}</h3>
        <p style={{ color: '#CE34EA', fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px' }}>{article.source}</p>
        <p style={{ color: '#888', fontSize: isMobile ? '0.9rem' : '1rem', lineHeight: '1.6' }}>{article.description}</p>
        <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px' }}>
            <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 500 }}>Read Full Article →</span>
        </div>
    </div>
);

const ArticleDetail = ({ article, onBack, isMobile }) => (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
        <button
            onClick={onBack}
            style={{
                background: 'none',
                border: 'none',
                color: '#CE34EA',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                marginBottom: isMobile ? '20px' : '30px',
                padding: 0
            }}
        >
            ← Back to Articles
        </button>

        <span style={{
            background: 'rgba(206, 52, 234, 0.1)',
            color: '#CE34EA',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            marginBottom: '16px',
            display: 'inline-block'
        }}>
            {article.category}
        </span>

        <h1 style={{
            color: '#fff',
            fontSize: isMobile ? '1.8rem' : '2.5rem',
            fontWeight: 800,
            marginBottom: '16px',
            lineHeight: '1.2'
        }}>
            {article.title}
        </h1>

        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            marginBottom: isMobile ? '30px' : '40px',
            color: '#888',
            fontSize: '0.85rem',
            gap: '8px'
        }}>
            <span style={{ color: '#CE34EA', fontWeight: 600 }}>{article.source}</span>
            <span>•</span>
            <span>March 12, 2026</span>
            {!isMobile && (
                <>
                    <span>•</span>
                    <span>8 min read</span>
                </>
            )}
        </div>

        <div style={{ color: '#ccc', fontSize: isMobile ? '1rem' : '1.1rem', lineHeight: '1.8' }}>
            {article.fullContent.map((paragraph, i) => (
                <p key={i} style={{ marginBottom: '1.5rem' }}>{paragraph}</p>
            ))}
        </div>

        <div style={{
            marginTop: isMobile ? '40px' : '60px',
            padding: isMobile ? '25px' : '40px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px',
            textAlign: 'center'
        }}>
            <h3 style={{ color: '#fff', marginBottom: '15px', fontSize: isMobile ? '1.1rem' : '1.3rem' }}>Enjoyed this deep dive?</h3>
            <p style={{ color: '#888', marginBottom: '25px', fontSize: '0.9rem' }}>Share it with your community and help grow the heart of crypto.</p>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'center', gap: '12px' }}>
                <button style={{ padding: '12px 25px', borderRadius: '8px', border: 'none', background: '#1DA1F2', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Share on X</button>
                <button style={{ padding: '12px 25px', borderRadius: '8px', border: 'none', background: '#0088cc', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Telegram</button>
            </div>
        </div>
    </div>
);

const TrendingTopic = ({ title, trend }) => (
    <div style={{
        padding: '12px 0',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    }}>
        <span style={{ color: '#ccc', fontSize: '0.9rem' }}>{title}</span>
        <span style={{ color: trend.startsWith('+') ? '#4caf50' : '#f44336', fontSize: '0.8rem' }}>{trend}</span>
    </div>
);

const Articles = () => {
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [pulseEmail, setPulseEmail] = useState('');
    const [pulseSubscribed, setPulseSubscribed] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handlePulseSubscribe = (e) => {
        e.preventDefault();
        if (!pulseEmail || !pulseEmail.includes('@')) {
            alert('Please enter a valid email address.');
            return;
        }
        setPulseSubscribed(true);
        setPulseEmail('');
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [selectedArticle]);

    const mainArticles = [
        {
            id: 1,
            title: "5 Best No-KYC Crypto Exchanges for 2026",
            source: "Blockchain Magazine (Featured)",
            category: "Exchanges",
            description: "A featured guide to popular exchanges that don’t require Know-Your-Customer procedures, useful for privacy-focused traders. It also highlights key features to consider when choosing an exchange, from liquidity to security protocols.",
            fullContent: [
                "In 2026, the landscape of cryptocurrency trading has split into two distinct paths: heavily regulated institutional platforms and the resilient, privacy-focused No-KYC exchanges. For many traders, the core ethos of decentralization remains paramount, leading to a surge in volume for platforms that respect user anonymity.",
                "Choosing a No-KYC exchange isn't just about avoiding paperwork; it's about financial sovereignty. However, this freedom comes with responsibility. Liquidity, security history, and withdrawal limits vary significantly across these platforms.",
                "Top of our list is NexusTrade, which has pioneered a zero-knowledge proof verification system that allows for high-volume trading without exposing personal identity. Following closely is OrbitDex, a decentralized liquidity aggregator that provides the best rates across multiple chains without a single login requirement.",
                "Thirdly, we look at PrivacyPro, which offers a unique escrow system for P2P trades specifically designed for privacy-conscious individuals. We also examine the 'Hybrid' model of ShadowEx, which requires no ID for trades under $20,000 equivalent—a limit that suits 90% of retail traders.",
                "Finally, we discuss the risks. While these platforms offer privacy, they often lack the customer support of their KYC counterparts. We recommend using a hardware wallet for all non-active funds and utilizing VPNs to further secure your digital footprint while trading."
            ]
        },
        {
            id: 2,
            title: "What Is XRP Crypto? The Crypto Powering Ripple Explained!",
            source: "Blockchain Magazine (Featured)",
            category: "Education",
            description: "A deep-dive explanation of XRP, the digital asset behind Ripple, how it’s used, and why it matters in payments and blockchain ecosystems. We explore the consensus ledger, cross-border settlement, and the regulatory landscape.",
            fullContent: [
                "XRP remains one of the most debated yet fundamentally significant assets in the crypto space. Unlike Bitcoin, which was designed as a store of value and P2P electronic cash, XRP was built from the ground up for the financial services industry.",
                "At its core, XRP is the native token of the XRP Ledger (XRPL), an open-source, permissionless, and decentralized blockchain technology. Its primary utility lies in Ripple's On-Demand Liquidity (ODL) service, which allows financial institutions to bridge currencies instantly and cheaply.",
                "The technology behind XRP allows for transactions to settle in 3-5 seconds with negligible costs, compared to the 3-5 days and high fees typically associated with traditional SWIFT transfers. This 'bridge currency' functionality solves the trillion-dollar problem of pre-funded Nostro/Vostro accounts.",
                "We also address the controversy regarding decentralization. While Ripple (the company) holds a significant portion of XRP in escrow, the ledger itself is maintained by a global network of independent validators. XRP is not 'owned' or 'controlled' by Ripple any more than Ethereum is by the Ethereum Foundation.",
                "Looking forward, the legal clarity achieved in 2024 has paved the way for massive institutional adoption. With XRP ETPs now launching globally, we analyze how the supply-demand dynamics are shifting as the asset transforms from a speculative token into a utility-driven global settlement standard."
            ]
        },
        {
            id: 3,
            title: "Why Proof-of-Reserves Alone Doesn’t Build Real Trust",
            source: "Cointelegraph Explained",
            category: "Analysis",
            description: "Part of Cointelegraph’s Explained series, this article breaks down why proof-of-reserves (a method exchanges use to show they hold customer funds) isn’t sufficient to ensure solvency or investor confidence. It discusses the limitations of point-in-time snapshots.",
            fullContent: [
                "In the wake of several high-profile exchange collapses, 'Proof-of-Reserves' (PoR) became the industry's rallying cry for transparency. While PoR is a step in the right direction, it's often marketed as a silver bullet for safety—which is a dangerous misconception.",
                "The fundamental flaw of most PoR systems is that they only show one side of the ledger: the assets. To understand an exchange's true health, you need to see the liabilities. An exchange could prove they hold 10,000 BTC, but if they owe their customers 12,000 BTC, they are insolvent.",
                "Furthermore, traditional PoR is a static snapshot. It's like taking a photo of a bank vault on a Monday morning—it doesn't tell you if that money was borrowed an hour before the photo or if it was moved an hour after. Real-time, continuous auditing via Merkle Trees is necessary, yet still rare.",
                "We also explore the risk of 'custodial mixing.' When users deposit funds, they aren't kept in a separate drawer with the user's name on it. They go into a collective pool. Without strict internal controls and verifiable liabilities, PoR remains a marketing tool rather than a guarantee of solvency.",
                "True trust in 2026 comes from 'Proof-of-Solvency,' which includes both assets and verifiable liabilities, combined with independent, reputable, and ideally non-crypto-native auditing firms. Until this becomes the standard, the safest place for your crypto remains your own private keys."
            ]
        },
        {
            id: 4,
            title: "Editor’s Pick: ‘How Cryptocurrency and Its Owners Are Tracked’ – The Coinomist",
            source: "The Coinomist",
            category: "Privacy",
            description: "A featured editor’s pick article that explores the mechanisms and tools used to track crypto ownership and transactions, covering implications for privacy, forensic analysis, and the evolving world of blockchain regulation.",
            fullContent: [
                "The myth of crypto as a 'shadow economy' for criminals is dying. Today, blockchain analysis is one of the most sophisticated fields of forensic science. This article explores how every transaction leaves a breadcrumb and how those crumbs are turned into identities.",
                "Heuristics and clustering are the primary tools of companies like Chainalysis and Elliptic. By analyzing patterns—such as change addresses and common input ownership—analysts can group thousands of addresses as belonging to a single entity or exchange.",
                "We dive into the 'KYC-Bridge' problem. The moment you move funds from a regulated exchange to a private wallet, your real-world identity is linked to that address. Even if you move those funds multiple times, the path remains visible on the immutable ledger.",
                "There is also the emergence of 'Dusting Attacks' and 'Poisoning'—techniques used by both malicious actors and state agencies to track movements of specific funds. We explain how these work and how advanced users can defend against them.",
                "However, it's not all doom for privacy lovers. We examine the rise of privacy-preserving technologies like Taproot, Lightning Network's off-chain transactions, and CoinJoin protocols that allow users to reclaim their financial privacy in a transparent world."
            ]
        },
        {
            id: 5,
            title: "Bitcoin Indonesia’s Real-Life Comeback: From 40 Meetups to Nationwide Freedom",
            source: "Bitcoin Magazine (Featured)",
            category: "Global Adoption",
            description: "A featured story on Bitcoin Magazine highlighting the grassroots resurgence of Bitcoin adoption in Indonesia, including community-driven initiatives, cultural influence, and how it's becoming a tool for financial sovereignty.",
            fullContent: [
                "Indonesia is currently experiencing what sociologists call a 'Bitcoin Renaissance.' What started as a few tech enthusiasts meeting in Jakarta basements has exploded into a nationwide movement involving millions of citizens across the 17,000 islands of the archipelago.",
                "The catalyst wasn't just speculation; it was utility. In a country where banking penetration remains uneven, Bitcoin has become a parallel financial system. Merchants from Bali to Surabaya are now accepting Satoshis for everything from coffee to rent.",
                "We profile the '40 Meetups' initiative—a grassroots project that organized educational gatherings in small towns to teach people about seed phrases, lightning wallets, and the danger of 'get-rich-quick' crypto scams. This education-first approach built a layer of trust that didn't exist before.",
                "The government's stance has also shifted. Seeing the influx of foreign investment and the potential for a digital hub, regulators have moved from skepticism to a constructive framework that recognizes crypto-assets as tradable commodities.",
                "More than just an asset, Bitcoin in Indonesia has become a symbol of 'Merdeka' (Freedom). For many Indonesians, it represents the first time they have had access to a truly global, unbiased, and uncensorable asset that protects their labor from local inflation."
            ]
        }
    ];

    return (
        <div style={{ background: 'rgb(21,21,32)', minHeight: '100vh' }}>
            <Navbar />

            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}
            </style>

            {/* Hero Section */}
            {!selectedArticle && (
                <div style={{
                    background: 'linear-gradient(135deg, #5700F9 0%, #CE34EA 100%)',
                    padding: isMobile ? '60px 20px' : '80px 20px',
                    textAlign: 'center',
                    marginBottom: isMobile ? '30px' : '40px',
                    animation: 'fadeIn 0.6s ease-out'
                }}>
                    <h1 style={{
                        color: '#fff',
                        fontSize: isMobile ? '2.2rem' : '3rem',
                        fontWeight: 800,
                        marginBottom: '16px',
                        lineHeight: 1.1
                    }}>
                        Featured Insights
                    </h1>
                    <p style={{
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: isMobile ? '1rem' : '1.2rem',
                        maxWidth: '800px',
                        margin: '0 auto',
                        lineHeight: 1.5
                    }}>
                        Curated market analysis and industrial trends from the world's leading blockchain publications.
                    </p>
                </div>
            )}

            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: selectedArticle
                    ? (isMobile ? '40px 16px 80px' : '60px 20px 80px')
                    : (isMobile ? '0 16px 60px' : '0 20px 80px'),
                display: 'grid',
                gridTemplateColumns: (selectedArticle || isMobile) ? '1fr' : 'minmax(0, 1fr) 350px',
                gap: isMobile ? '40px' : '40px'
            }}>

                {/* Main Content */}
                <div style={{ maxWidth: selectedArticle ? '850px' : 'none', margin: selectedArticle ? '0 auto' : '0' }}>
                    {selectedArticle ? (
                        <ArticleDetail
                            article={selectedArticle}
                            onBack={() => setSelectedArticle(null)}
                            isMobile={isMobile}
                        />
                    ) : (
                        <>
                            <h2 style={{ color: '#fff', fontSize: isMobile ? '1.4rem' : '1.8rem', marginBottom: '25px', display: 'flex', alignItems: 'center' }}>
                                <span style={{ width: '4px', height: isMobile ? '20px' : '24px', background: '#CE34EA', marginRight: '12px', borderRadius: '2px' }}></span>
                                Must Read Stories
                            </h2>

                            {mainArticles.map((art) => (
                                <ArticleCard key={art.id} article={art} onClick={setSelectedArticle} isMobile={isMobile} />
                            ))}

                            <div style={{ marginTop: '40px', padding: '30px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px dashed rgba(255,255,255,0.1)', textAlign: 'center' }}>
                                <p style={{ color: '#666', fontSize: '0.85rem' }}>More articles are being curated by our editorial team daily.</p>
                            </div>
                        </>
                    )}
                </div>

                {/* Sidebar - Only show on list view */}
                {!selectedArticle && (
                    <aside style={{ marginTop: isMobile ? '40px' : '0' }}>
                        <div style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '20px',
                            padding: '24px',
                            position: isMobile ? 'static' : 'sticky',
                            top: '100px'
                        }}>
                            <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '20px' }}>Trending Topics</h3>
                            <TrendingTopic title="#BitcoinETF" trend="+14.2%" />
                            <TrendingTopic title="#SolanaSummer" trend="+8.5%" />
                            <TrendingTopic title="#ETH_Surge" trend="+5.1%" />
                            <TrendingTopic title="#CryptoRegulations" trend="-2.4%" />
                            <TrendingTopic title="#Web3Gaming" trend="+12.0%" />
                            <TrendingTopic title="#Layer2Solutions" trend="+6.8%" />

                            <div style={{
                                marginTop: '40px',
                                padding: '24px',
                                background: 'linear-gradient(135deg, rgba(87, 0, 249, 0.2) 0%, rgba(206, 52, 234, 0.2) 100%)',
                                borderRadius: '16px',
                                border: '1px solid rgba(206, 52, 234, 0.3)',
                                textAlign: 'center'
                            }}>
                                <h4 style={{ color: '#fff', marginBottom: '10px' }}>Join the Pulse</h4>
                                {pulseSubscribed ? (
                                    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                                        <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>✨</div>
                                        <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>Thanks for subscribing!</p>
                                    </div>
                                ) : (
                                    <>
                                        <p style={{ color: '#aaa', fontSize: '0.8rem', marginBottom: '20px' }}>Weekly insights delivered straight to your inbox.</p>
                                        <form onSubmit={handlePulseSubscribe}>
                                            <input
                                                type="email"
                                                placeholder="Email address"
                                                value={pulseEmail}
                                                onChange={(e) => setPulseEmail(e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    borderRadius: '8px',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    background: 'rgba(0,0,0,0.2)',
                                                    color: '#fff',
                                                    marginBottom: '10px',
                                                    outline: 'none',
                                                    boxSizing: 'border-box',
                                                    fontSize: '0.9rem'
                                                }}
                                                required
                                            />
                                            <button
                                                type="submit"
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    background: '#CE34EA',
                                                    color: '#fff',
                                                    fontWeight: 700,
                                                    cursor: 'pointer',
                                                    fontSize: '0.9rem'
                                                }}
                                            >
                                                Subscribe
                                            </button>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>
                    </aside>
                )}

            </div>

            <Footer />
        </div>
    );
};

export default Articles;
