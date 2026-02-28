const db = require('../db');

const articlesData = [
    {
        title: "5 Best No-KYC Crypto Exchanges for 2026",
        source: "Blockchain Magazine (Featured)",
        category: "Exchanges",
        description: "A featured guide to popular exchanges that don't require Know-Your-Customer procedures, useful for privacy-focused traders. It also highlights key features to consider when choosing an exchange, from liquidity to security protocols.",
        full_content: JSON.stringify([
            "In 2026, the landscape of cryptocurrency trading has split into two distinct paths: heavily regulated institutional platforms and the resilient, privacy-focused No-KYC exchanges. For many traders, the core ethos of decentralization remains paramount, leading to a surge in volume for platforms that respect user anonymity.",
            "Choosing a No-KYC exchange isn't just about avoiding paperwork; it's about financial sovereignty. However, this freedom comes with responsibility. Liquidity, security history, and withdrawal limits vary significantly across these platforms.",
            "Top of our list is NexusTrade, which has pioneered a zero-knowledge proof verification system that allows for high-volume trading without exposing personal identity. Following closely is OrbitDex, a decentralized liquidity aggregator that provides the best rates across multiple chains without a single login requirement.",
            "Thirdly, we look at PrivacyPro, which offers a unique escrow system for P2P trades specifically designed for privacy-conscious individuals. We also examine the 'Hybrid' model of ShadowEx, which requires no ID for trades under $20,000 equivalent—a limit that suits 90% of retail traders.",
            "Finally, we discuss the risks. While these platforms offer privacy, they often lack the customer support of their KYC counterparts. We recommend using a hardware wallet for all non-active funds and utilizing VPNs to further secure your digital footprint while trading."
        ]),
        sort_order: 1
    },
    {
        title: "What Is XRP Crypto? The Crypto Powering Ripple Explained!",
        source: "Blockchain Magazine (Featured)",
        category: "Education",
        description: "A deep-dive explanation of XRP, the digital asset behind Ripple, how it's used, and why it matters in payments and blockchain ecosystems. We explore the consensus ledger, cross-border settlement, and the regulatory landscape.",
        full_content: JSON.stringify([
            "XRP remains one of the most debated yet fundamentally significant assets in the crypto space. Unlike Bitcoin, which was designed as a store of value and P2P electronic cash, XRP was built from the ground up for the financial services industry.",
            "At its core, XRP is the native token of the XRP Ledger (XRPL), an open-source, permissionless, and decentralized blockchain technology. Its primary utility lies in Ripple's On-Demand Liquidity (ODL) service, which allows financial institutions to bridge currencies instantly and cheaply.",
            "The technology behind XRP allows for transactions to settle in 3-5 seconds with negligible costs, compared to the 3-5 days and high fees typically associated with traditional SWIFT transfers. This 'bridge currency' functionality solves the trillion-dollar problem of pre-funded Nostro/Vostro accounts.",
            "We also address the controversy regarding decentralization. While Ripple (the company) holds a significant portion of XRP in escrow, the ledger itself is maintained by a global network of independent validators. XRP is not 'owned' or 'controlled' by Ripple any more than Ethereum is by the Ethereum Foundation.",
            "Looking forward, the legal clarity achieved in 2024 has paved the way for massive institutional adoption. With XRP ETPs now launching globally, we analyze how the supply-demand dynamics are shifting as the asset transforms from a speculative token into a utility-driven global settlement standard."
        ]),
        sort_order: 2
    },
    {
        title: "Why Proof-of-Reserves Alone Doesn't Build Real Trust",
        source: "Cointelegraph Explained",
        category: "Analysis",
        description: "Part of Cointelegraph's Explained series, this article breaks down why proof-of-reserves (a method exchanges use to show they hold customer funds) isn't sufficient to ensure solvency or investor confidence. It discusses the limitations of point-in-time snapshots.",
        full_content: JSON.stringify([
            "In the wake of several high-profile exchange collapses, 'Proof-of-Reserves' (PoR) became the industry's rallying cry for transparency. While PoR is a step in the right direction, it's often marketed as a silver bullet for safety—which is a dangerous misconception.",
            "The fundamental flaw of most PoR systems is that they only show one side of the ledger: the assets. To understand an exchange's true health, you need to see the liabilities. An exchange could prove they hold 10,000 BTC, but if they owe their customers 12,000 BTC, they are insolvent.",
            "Furthermore, traditional PoR is a static snapshot. It's like taking a photo of a bank vault on a Monday morning—it doesn't tell you if that money was borrowed an hour before the photo or if it was moved an hour after. Real-time, continuous auditing via Merkle Trees is necessary, yet still rare.",
            "We also explore the risk of 'custodial mixing.' When users deposit funds, they aren't kept in a separate drawer with the user's name on it. They go into a collective pool. Without strict internal controls and verifiable liabilities, PoR remains a marketing tool rather than a guarantee of solvency.",
            "True trust in 2026 comes from 'Proof-of-Solvency,' which includes both assets and verifiable liabilities, combined with independent, reputable, and ideally non-crypto-native auditing firms. Until this becomes the standard, the safest place for your crypto remains your own private keys."
        ]),
        sort_order: 3
    },
    {
        title: "Editor's Pick: 'How Cryptocurrency and Its Owners Are Tracked' – The Coinomist",
        source: "The Coinomist",
        category: "Privacy",
        description: "A featured editor's pick article that explores the mechanisms and tools used to track crypto ownership and transactions, covering implications for privacy, forensic analysis, and the evolving world of blockchain regulation.",
        full_content: JSON.stringify([
            "The myth of crypto as a 'shadow economy' for criminals is dying. Today, blockchain analysis is one of the most sophisticated fields of forensic science. This article explores how every transaction leaves a breadcrumb and how those crumbs are turned into identities.",
            "Heuristics and clustering are the primary tools of companies like Chainalysis and Elliptic. By analyzing patterns—such as change addresses and common input ownership—analysts can group thousands of addresses as belonging to a single entity or exchange.",
            "We dive into the 'KYC-Bridge' problem. The moment you move funds from a regulated exchange to a private wallet, your real-world identity is linked to that address. Even if you move those funds multiple times, the path remains visible on the immutable ledger.",
            "There is also the emergence of 'Dusting Attacks' and 'Poisoning'—techniques used by both malicious actors and state agencies to track movements of specific funds. We explain how these work and how advanced users can defend against them.",
            "However, it's not all doom for privacy lovers. We examine the rise of privacy-preserving technologies like Taproot, Lightning Network's off-chain transactions, and CoinJoin protocols that allow users to reclaim their financial privacy in a transparent world."
        ]),
        sort_order: 4
    },
    {
        title: "Bitcoin Indonesia's Real-Life Comeback: From 40 Meetups to Nationwide Freedom",
        source: "Bitcoin Magazine (Featured)",
        category: "Global Adoption",
        description: "A featured story on Bitcoin Magazine highlighting the grassroots resurgence of Bitcoin adoption in Indonesia, including community-driven initiatives, cultural influence, and how it's becoming a tool for financial sovereignty.",
        full_content: JSON.stringify([
            "Indonesia is currently experiencing what sociologists call a 'Bitcoin Renaissance.' What started as a few tech enthusiasts meeting in Jakarta basements has exploded into a nationwide movement involving millions of citizens across the 17,000 islands of the archipelago.",
            "The catalyst wasn't just speculation; it was utility. In a country where banking penetration remains uneven, Bitcoin has become a parallel financial system. Merchants from Bali to Surabaya are now accepting Satoshis for everything from coffee to rent.",
            "We profile the '40 Meetups' initiative—a grassroots project that organized educational gatherings in small towns to teach people about seed phrases, lightning wallets, and the danger of 'get-rich-quick' crypto scams. This education-first approach built a layer of trust that didn't exist before.",
            "The government's stance has also shifted. Seeing the influx of foreign investment and the potential for a digital hub, regulators have moved from skepticism to a constructive framework that recognizes crypto-assets as tradable commodities.",
            "More than just an asset, Bitcoin in Indonesia has become a symbol of 'Merdeka' (Freedom). For many Indonesians, it represents the first time they have had access to a truly global, unbiased, and uncensorable asset that protects their labor from local inflation."
        ]),
        sort_order: 5
    },
    {
        title: "Solana's High-Speed Ecosystem: The Future of Scalable DeFi",
        source: "Crypto Trends",
        category: "Altcoins",
        description: "Explore how Solana's lightning-fast blockchain and low transaction fees are driving a new wave of decentralized applications.",
        full_content: JSON.stringify([
            "Solana has rapidly established itself as a premier blockchain, distinguished by its incredible speed and cost-effectiveness. Utilizing a unique Proof-of-History consensus mechanism, Solana processes thousands of transactions per second, leaving traditional networks behind.",
            "This scalability makes it the ideal foundation for decentralized finance (DeFi), non-fungible tokens (NFTs), and Web3 gaming. As user adoption surges, the Solana ecosystem continues to attract top developers building the future of finance.",
            "Despite occasional network halts in its early days, its relentless innovation and vibrant community solidify its position as a top-tier cryptocurrency. The ecosystem's growth is a testament to the demand for fast, accessible blockchain solutions."
        ]),
        sort_order: 6
    },
    {
        title: "Bitcoin's Enduring Legacy: Digital Gold in the Modern Era",
        source: "Blockchain Insights",
        category: "Market Leaders",
        description: "An overview of Bitcoin's dominance as the pioneer cryptocurrency, serving as a reliable store of value and a hedge against inflation.",
        full_content: JSON.stringify([
            "Bitcoin remains the undisputed king of the cryptocurrency market. Created as a decentralized, peer-to-peer electronic cash system, it has evolved into a globally recognized store of value—often dubbed digital gold.",
            "With its capped supply of 21 million coins, Bitcoin provides a robust hedge against fiat inflation and economic instability. Institutional adoption has accelerated significantly, with major financial players integrating Bitcoin ETFs and corporate treasuries.",
            "As the foundational pillar of the crypto industry, Bitcoin's robust security, unwavering decentralization, and network effects continue to inspire confidence among retail and institutional investors worldwide."
        ]),
        sort_order: 7
    },
    {
        title: "Dogecoin: How a Meme Became a Crypto Phenomenon",
        source: "Meme Coin Watch",
        category: "Meme Coins",
        description: "Discover how Dogecoin transcended its comedic origins to build a massive, passionate community and achieve significant market capitalization.",
        full_content: JSON.stringify([
            "What started as a lighthearted joke has transformed into one of the most recognized cryptocurrencies globally. Dogecoin, featuring the iconic Shiba Inu, owes its massive success to a passionate, community-driven approach rather than complex technological utility.",
            "Propelled by social media trends and high-profile endorsements, Dogecoin has captured the public's imagination like no other digital asset. Its low transaction fees and fast block times make it surprisingly practical for micro-tipping and everyday online transactions.",
            "The Doge army proves that community engagement, viral marketing, and a fun, welcoming culture can be powerful drivers in the modern cryptocurrency economy."
        ]),
        sort_order: 8
    },
    {
        title: "Trump Coin and Political Tokens: A New Era of PolitiFi",
        source: "Crypto Politics",
        category: "PolitiFi",
        description: "Analyzing the surprising rise of Trump Coin and how political figures are inspiring a new niche of meme tokens in the cryptocurrency space.",
        full_content: JSON.stringify([
            "The intersection of politics and cryptocurrency has birthed a fascinating new sector known as PolitiFi. Trump Coin represents the tip of this spear, a token driven largely by political sentiment and grassroots support rather than traditional financial metrics.",
            "These politically themed meme coins thrive on news cycles, election events, and social media fervor. While highly volatile and speculative, Trump Coin demonstrates exactly how blockchain technology can monetize, track, and gamify political enthusiasm in real-time.",
            "As the landscape evolves, investors are closely watching these tokens not just as jokes, but as unique, high-risk assets dynamically tied to rapidly shifting cultural and political movements."
        ]),
        sort_order: 9
    }
];

const trendingTopicsData = [
    { title: '#BitcoinETF', trend: '+14.2%', sort_order: 1 },
    { title: '#SolanaSummer', trend: '+8.5%', sort_order: 2 },
    { title: '#ETH_Surge', trend: '+5.1%', sort_order: 3 },
    { title: '#CryptoRegulations', trend: '-2.4%', sort_order: 4 },
    { title: '#Web3Gaming', trend: '+12.0%', sort_order: 5 },
    { title: '#Layer2Solutions', trend: '+6.8%', sort_order: 6 },
];

const createArticlesAndTrendingTables = async () => {
    try {
        // Create articles table
        await db.query(`
            CREATE TABLE IF NOT EXISTS articles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(512) NOT NULL,
                source VARCHAR(255) NOT NULL,
                category VARCHAR(100) NOT NULL,
                description TEXT NOT NULL,
                full_content LONGTEXT NOT NULL,
                is_active TINYINT(1) DEFAULT 1,
                sort_order INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Create trending_topics table
        await db.query(`
            CREATE TABLE IF NOT EXISTS trending_topics (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                trend VARCHAR(20) NOT NULL,
                sort_order INT DEFAULT 0,
                is_active TINYINT(1) DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Seed articles only if empty
        const [existingArticles] = await db.query('SELECT COUNT(*) as count FROM articles');
        if (existingArticles[0].count === 0) {
            for (const article of articlesData) {
                await db.query(
                    'INSERT INTO articles (title, source, category, description, full_content, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
                    [article.title, article.source, article.category, article.description, article.full_content, article.sort_order]
                );
            }
            console.log('✅ Articles seeded successfully');
        }

        // Seed trending topics only if empty
        const [existingTopics] = await db.query('SELECT COUNT(*) as count FROM trending_topics');
        if (existingTopics[0].count === 0) {
            for (const topic of trendingTopicsData) {
                await db.query(
                    'INSERT INTO trending_topics (title, trend, sort_order) VALUES (?, ?, ?)',
                    [topic.title, topic.trend, topic.sort_order]
                );
            }
            console.log('✅ Trending topics seeded successfully');
        }

        console.log('✅ Articles & Trending Topics tables ready');
    } catch (error) {
        console.error('Migration error (articles/trending):', error);
        throw error;
    }
};

module.exports = createArticlesAndTrendingTables;
