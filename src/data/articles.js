export const SITE_URL = 'https://cryptocardiac.com';

export const slugifyArticle = (value = '') =>
    value
        .toString()
        .toLowerCase()
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

const updatedAt = '2026-06-23';
const adminArticleCutoff = new Date(updatedAt).getTime();

export const EDITORIAL_ARTICLES = [
    {
        id: 'community-interest-rankings',
        title: 'How CryptoCardiac Ranks Community Interest Without Giving Investment Advice',
        source: 'CryptoCardiac Editorial',
        author: 'CryptoCardiac Research Desk',
        category: 'Platform Guide',
        created_at: updatedAt,
        updated_at: updatedAt,
        description: 'A plain-English explanation of how community voting, time windows, and transparent limits help readers understand crypto attention without treating votes as financial advice.',
        fullContent: [
            'CryptoCardiac is built around a simple idea: community attention is worth observing, but it should not be confused with investment advice. A coin can receive votes because its holders are active, its community is organized, or a conversation is spreading across social platforms. That signal can be useful context, but it does not prove that a project is safe, undervalued, or likely to rise in price.',
            'The leaderboard separates different time windows so readers can compare short-term excitement with steadier participation. A 24-hour spike can show that a community is mobilizing today, while 7-day and longer views help reveal whether that interest is still present after the first burst. Looking at several windows together is healthier than treating a single number as a verdict.',
            'Daily voting limits are an important part of the system. They reduce repeat spam from the same account and make each vote closer to a deliberate expression of interest. No voting system can perfectly measure the whole market, but clear limits make the data easier to understand and harder to manipulate casually.',
            'Readers should also compare community votes with basic project research. Token supply, liquidity, contract risk, team transparency, exchange listings, and security history all matter. A voting leaderboard can point you toward projects people are discussing, but it should be only one step in a broader research process.',
            'CryptoCardiac pages are written for education and discovery. The safest way to use the site is to treat rankings as a social pulse, then slow down and verify everything important before making financial decisions. Markets move quickly, and community enthusiasm can change faster than fundamentals.'
        ],
        sort_order: 1
    },
    {
        id: 'market-trends-limits',
        title: 'What Crypto Market Trends Can Tell You and What They Cannot',
        source: 'CryptoCardiac Editorial',
        author: 'CryptoCardiac Research Desk',
        category: 'Education',
        created_at: updatedAt,
        updated_at: updatedAt,
        description: 'Market trends can help readers notice changing attention, liquidity, and sentiment, but they have limits. This guide explains how to read them carefully.',
        fullContent: [
            'Crypto markets produce a constant stream of prices, volume, rankings, social posts, and community votes. It is tempting to compress all of that information into one simple answer, but trends are better understood as clues. They can show that attention is moving, not that a future outcome is guaranteed.',
            'Price movement is the most visible trend, yet it is also one of the easiest to misread. A sudden rise might reflect genuine demand, temporary speculation, a thin order book, or a coordinated campaign. The same percentage move can mean very different things depending on liquidity and market depth.',
            'Volume can add context because it shows whether many trades supported a price move. Higher volume may suggest broader participation, while very low volume can make a chart look dramatic without much real activity behind it. Even then, volume does not explain who is trading or why.',
            'Community signals are useful because crypto projects often depend on active users, builders, and holders. A lively community can help documentation, support, testing, and awareness. Still, social energy can fade, and popular discussions can sometimes move faster than the actual product or network.',
            'The best habit is to compare multiple signals instead of relying on one. If price, volume, developer updates, risk disclosures, community voting, and independent research all point in a similar direction, the picture is clearer. If the signals conflict, that is a reason to slow down rather than chase a headline.',
            'No trend removes the need for risk management. Crypto assets can be volatile, illiquid, and affected by regulation, security incidents, or broader market stress. Treat every trend as a starting point for questions, not a final answer.'
        ],
        sort_order: 2
    },
    {
        id: 'no-kyc-exchange-guide',
        title: 'No-KYC Crypto Exchanges: Privacy Benefits, Practical Risks, and Safer Habits',
        source: 'CryptoCardiac Editorial',
        author: 'CryptoCardiac Research Desk',
        category: 'Exchanges',
        created_at: updatedAt,
        updated_at: updatedAt,
        description: 'A neutral guide to No-KYC crypto exchanges, including why people use them, what risks to watch for, and how to think about privacy responsibly.',
        fullContent: [
            'No-KYC crypto exchanges attract users who care about privacy, fast onboarding, and fewer identity documents stored by third parties. For some people, that privacy preference is about personal security. For others, it is about reducing data exposure after years of exchange breaches and phishing campaigns.',
            'The privacy benefit does not remove the practical risks. Some No-KYC platforms have limited customer support, unclear operating history, low liquidity, or changing withdrawal limits. A platform that is easy to enter can still be hard to exit if spreads are wide, wallets are paused, or support does not respond.',
            'Users should also think about legal and tax responsibilities in their own country. No-KYC does not mean no rules. Regulations differ by jurisdiction, and users remain responsible for understanding reporting obligations, sanctions restrictions, and local requirements.',
            'Security habits matter more on privacy-focused platforms. Consider using strong account passwords, hardware wallets for long-term storage, withdrawal address checks, and small test transactions before moving larger amounts. Never assume that an exchange wallet is as safe as self-custody.',
            'It is also wise to separate privacy from secrecy. Privacy is a legitimate concern, but hiding activity to avoid lawful obligations can create serious risk. A responsible approach focuses on minimizing unnecessary data exposure while still following applicable rules.',
            'CryptoCardiac does not recommend a specific exchange or tell readers where to trade. The purpose of this guide is to help readers evaluate tradeoffs so they can ask better questions before trusting any platform with funds.'
        ],
        sort_order: 3
    },
    {
        id: 'xrp-ledger-guide',
        title: 'XRP and the XRP Ledger: A Plain-English Guide',
        source: 'CryptoCardiac Editorial',
        author: 'CryptoCardiac Research Desk',
        category: 'Education',
        created_at: updatedAt,
        updated_at: updatedAt,
        description: 'An educational overview of XRP, the XRP Ledger, payments use cases, validator concepts, and the difference between network utility and market price.',
        fullContent: [
            'XRP is the native asset of the XRP Ledger, a public blockchain designed with fast settlement and low transaction costs in mind. It is often discussed in the context of payments because the network can move value quickly compared with many traditional rails. That speed is a technical feature, not a promise about price performance.',
            'The XRP Ledger uses a consensus process that differs from proof-of-work mining. Validators help agree on the state of the ledger, and transactions can settle without the energy-intensive mining model used by Bitcoin. This design is one reason the network is frequently mentioned in conversations about payment infrastructure.',
            'A common source of confusion is the relationship between XRP the asset, the XRP Ledger the network, and Ripple the company. Ripple builds products that may use XRP or interact with the XRP Ledger, but the public ledger itself is broader than one company. Readers should separate the technology from any single business narrative.',
            'The strongest educational question is not simply whether XRP is popular. Better questions include how the ledger is used, what liquidity exists for the asset, how validators are distributed, and what regulatory or business dependencies may affect adoption. Those questions create a fuller picture than a headline can.',
            'XRP can be part of serious infrastructure discussions and still carry market risk. Crypto prices can react to news, liquidity, legal developments, and broader market cycles. Understanding the ledger does not remove the need for caution.',
            'This guide is for general education. It should not be read as a recommendation to buy, sell, or hold XRP or any other digital asset.'
        ],
        sort_order: 4
    },
    {
        id: 'proof-of-reserves-limits',
        title: 'Why Proof of Reserves Is Useful but Not a Complete Safety Check',
        source: 'CryptoCardiac Editorial',
        author: 'CryptoCardiac Research Desk',
        category: 'Risk',
        created_at: updatedAt,
        updated_at: updatedAt,
        description: 'Proof of reserves can improve transparency, but readers should understand assets, liabilities, audit scope, timing, and custody controls before trusting the headline.',
        fullContent: [
            'Proof of reserves became a popular phrase after several exchange failures made users ask harder questions about custody. At a basic level, it is a method for showing that a platform controls certain on-chain assets. That can be a useful transparency step, especially when the alternative is asking users to rely only on a company statement.',
            'The limitation is that assets are only one side of the balance sheet. An exchange could show wallets with large balances while still owing more to customers than it holds. Without a meaningful view of liabilities, proof of reserves can create a comforting but incomplete picture.',
            'Timing is another issue. A snapshot can show what existed at one moment, but it does not prove that assets were not borrowed shortly before the snapshot or moved afterward. Continuous reporting, independent review, and clear methodology are stronger than a single marketing graphic.',
            'Readers should ask who performed the review, what was included, what was excluded, and whether customer liabilities were matched against assets. They should also look for custody controls, withdrawal history, insurance claims, legal structure, and how the platform handles operational risk.',
            'Self-custody is not automatically easy or risk-free, but it gives users a different risk profile than leaving funds with a platform. The right choice depends on experience, security habits, and the purpose of the funds. What matters is understanding the tradeoff instead of assuming that one dashboard equals safety.',
            'Proof of reserves is a step toward better transparency. It is not a full guarantee of solvency, security, or honest management.'
        ],
        sort_order: 5
    },
    {
        id: 'blockchain-tracking-privacy',
        title: 'How Blockchain Tracking Works and What It Means for Wallet Privacy',
        source: 'CryptoCardiac Editorial',
        author: 'CryptoCardiac Research Desk',
        category: 'Privacy',
        created_at: updatedAt,
        updated_at: updatedAt,
        description: 'Public blockchains are transparent by design. This guide explains address clustering, exchange links, dusting, and practical privacy habits.',
        fullContent: [
            'Many people describe crypto as anonymous, but most public blockchains are better described as pseudonymous. A wallet address may not show a legal name on-chain, yet every transaction connected to that address can be visible. Once an address is linked to a person or service, the surrounding history becomes easier to analyze.',
            'Blockchain analytics often starts with patterns. Analysts may group addresses that appear to be controlled by the same user, identify change addresses, or follow funds moving between known services. These methods are not perfect, but they can be powerful when combined with exchange records, public posts, or leaked data.',
            'Centralized exchanges can become a bridge between identity and on-chain activity. If a user withdraws from an account that required identity verification, the destination address may become associated with that user inside exchange records. Future movement from that wallet can then be easier to interpret.',
            'Dusting is another privacy concern. Tiny amounts of crypto may be sent to many wallets in an attempt to track whether the funds later move together. Users who understand the risk can avoid combining suspicious small deposits with important wallet balances.',
            'Practical privacy starts with organization. Use separate wallets for separate purposes, be cautious about posting addresses publicly, check wallet permissions, and understand the privacy limits of each network. Privacy tools can help, but they may also carry legal, technical, or usability tradeoffs.',
            "Transparency is one of crypto's strengths, but it changes the privacy model. Treat wallet activity as public unless you have a clear reason to believe otherwise."
        ],
        sort_order: 6
    },
    {
        id: 'bitcoin-roles',
        title: 'Bitcoin as Digital Cash, Digital Gold, and Community Signal',
        source: 'CryptoCardiac Editorial',
        author: 'CryptoCardiac Research Desk',
        category: 'Bitcoin',
        created_at: updatedAt,
        updated_at: updatedAt,
        description: 'Bitcoin is discussed in several different ways. This article separates payment use, store-of-value narratives, network security, and community attention.',
        fullContent: [
            'Bitcoin has accumulated several identities over time. Some people focus on the original peer-to-peer cash idea, while others describe it as digital gold because of its fixed supply schedule. Both narratives exist because different users value different properties of the network.',
            'As a payment network, Bitcoin prioritizes censorship resistance and settlement without a central issuer. That can matter in situations where users want direct control over funds. At the same time, base-layer fees and confirmation times can make everyday small payments less convenient during busy periods.',
            'As a store-of-value narrative, Bitcoin is often discussed because its supply rules are transparent and difficult to change. Supporters see that predictability as a contrast to fiat systems. Critics point out that market price remains volatile and can move sharply over short periods.',
            "Security is another part of the conversation. Bitcoin's proof-of-work model makes rewriting history expensive, but it also consumes energy and depends on a healthy mining ecosystem. Readers should understand both the security argument and the environmental debate around it.",
            'Community attention matters because Bitcoin is not only code. It is also infrastructure, education, wallets, exchanges, developers, miners, long-term holders, and critics. A strong community can help a network endure, but it does not make the asset risk-free.',
            'The healthiest way to study Bitcoin is to separate the technology, the social movement, and the market price. Each one can be important, and each one deserves its own careful questions.'
        ],
        sort_order: 7
    },
    {
        id: 'solana-design-tradeoffs',
        title: "Solana's High-Speed Design: Benefits, Tradeoffs, and Common Use Cases",
        source: 'CryptoCardiac Editorial',
        author: 'CryptoCardiac Research Desk',
        category: 'Networks',
        created_at: updatedAt,
        updated_at: updatedAt,
        description: 'A balanced look at Solana, including fast settlement, low fees, application design, validator demands, and the tradeoffs that come with performance.',
        fullContent: [
            'Solana is often described as a high-performance blockchain because it is designed for fast transaction processing and low fees. Those properties can make it attractive for applications where users expect quick interactions, such as trading interfaces, games, NFT markets, and consumer apps.',
            'Performance is not magic; it comes from design choices. Solana places more demand on validator hardware than some slower networks, and that can affect the decentralization debate. Supporters argue that high throughput enables better user experiences, while critics ask whether the requirements reduce participation.',
            'Low fees can change how developers design products. If transactions are cheap enough, apps can include on-chain actions that would be impractical on expensive networks. That can support experimentation, but it can also attract spam or low-quality activity if safeguards are weak.',
            'Network reliability is part of the evaluation. Users should look at historical outages, upgrade processes, validator diversity, and how quickly issues are communicated. A fast network still needs stable operations to earn long-term trust.',
            "Solana's ecosystem includes decentralized finance, wallets, infrastructure tools, marketplaces, and community projects. The breadth of that ecosystem is a useful signal, but readers should evaluate individual applications separately. A strong chain does not automatically make every token or app on it safe.",
            'The main lesson is to understand tradeoffs. Speed and cost are valuable, but they should be weighed alongside decentralization, security, uptime, and developer quality.'
        ],
        sort_order: 8
    },
    {
        id: 'meme-coins-community-risk',
        title: 'Meme Coins, Community Energy, and the Limits of Hype',
        source: 'CryptoCardiac Editorial',
        author: 'CryptoCardiac Research Desk',
        category: 'Meme Coins',
        created_at: updatedAt,
        updated_at: updatedAt,
        description: 'Meme coins can build powerful communities, but hype can hide liquidity, supply, contract, and concentration risks. This guide explains how to read the signal.',
        fullContent: [
            'Meme coins show that crypto markets are not driven only by technical white papers. Culture, humor, identity, and online coordination can all create real attention. A meme can bring thousands of people into a community faster than a traditional product launch.',
            'Community energy can be valuable because active holders create content, welcome newcomers, organize campaigns, and keep discussion alive during quiet markets. That energy is one reason meme coins often appear on voting platforms. People vote because belonging and visibility matter.',
            'The risk is that hype can hide weak fundamentals. Some meme tokens have concentrated supply, thin liquidity, unclear contracts, or teams that disappear after launch. A lively chat room does not replace checking token distribution, liquidity locks, contract permissions, and exchange depth.',
            'Price volatility can be especially extreme in meme sectors. A token can rise quickly because attention is concentrated, then fall just as quickly when attention moves elsewhere. New readers should be careful not to confuse entertainment with a stable investment thesis.',
            'A healthier approach is to separate cultural interest from financial exposure. It is reasonable to study why a community is active, but any money decision should consider downside risk first. Never invest money that would damage your life if lost.',
            'CryptoCardiac voting can show where community energy is visible today. It cannot prove that a meme coin is safe, sustainable, or fairly valued.'
        ],
        sort_order: 9
    },
    {
        id: 'political-tokens-event-driven-communities',
        title: 'Political Tokens and Event-Driven Crypto Communities',
        source: 'CryptoCardiac Editorial',
        author: 'CryptoCardiac Research Desk',
        category: 'PolitiFi',
        created_at: updatedAt,
        updated_at: updatedAt,
        description: 'Political and event-driven tokens can move with news cycles. This article explains why they attract attention and why readers should treat them carefully.',
        fullContent: [
            'Political tokens sit at the intersection of internet culture, campaign attention, memes, and speculative markets. They often move because a public event, speech, court decision, election cycle, or viral post brings a name back into discussion. That makes them highly sensitive to news and social media momentum.',
            'The communities around these tokens can be energetic because members feel they are participating in a cultural moment. Voting, posting, and sharing can become part of the identity of the group. That social layer is real, even when the token itself has limited utility.',
            'Event-driven attention can also disappear quickly. A token that depends on one person, one topic, or one news cycle may lose relevance when the conversation changes. Liquidity can shrink, spreads can widen, and late buyers may be left with little exit activity.',
            'Readers should be especially careful about misleading branding. Some tokens imply affiliation with a public figure, campaign, or organization without any official relationship. Always check disclaimers, official sources, contract details, and whether claims are verifiable.',
            'Political tokens can be studied as a social phenomenon without being treated as a responsible investment. They reveal how quickly attention can be financialized, but they also show why strong risk warnings matter.',
            'CryptoCardiac treats these assets as community signals, not endorsements. A high vote count means people are paying attention; it does not mean the token is official, safe, or suitable for purchase.'
        ],
        sort_order: 10
    }
].map((article) => ({
    ...article,
    slug: slugifyArticle(article.title),
    readMinutes: Math.max(4, Math.ceil(article.fullContent.join(' ').split(/\s+/).length / 210))
}));

export const TRENDING_TOPICS = [
    { id: 'risk-management', title: 'Risk management', trend: '+12.4%' },
    { id: 'wallet-privacy', title: 'Wallet privacy', trend: '+9.8%' },
    { id: 'proof-of-reserves', title: 'Proof of reserves', trend: '+7.1%' },
    { id: 'community-voting', title: 'Community voting', trend: '+6.2%' },
    { id: 'meme-coin-risk', title: 'Meme coin risk', trend: '+4.9%' },
    { id: 'exchange-security', title: 'Exchange security', trend: '+3.3%' }
];

export const getArticlePath = (article) => `/featured-articles/${article.slug || slugifyArticle(article.title)}`;

export const getArticleUrl = (article) => `${SITE_URL}${getArticlePath(article)}`;

export const normalizeArticle = (article) => {
    let fullContent = article.fullContent || article.full_content || [];
    if (typeof fullContent === 'string') {
        try {
            fullContent = JSON.parse(fullContent);
        } catch (error) {
            fullContent = [fullContent];
        }
    }

    const normalized = {
        ...article,
        source: article.source || 'CryptoCardiac Editorial',
        author: article.author || 'CryptoCardiac Research Desk',
        fullContent: Array.isArray(fullContent) ? fullContent : [],
        slug: article.slug || slugifyArticle(article.title),
        created_at: article.created_at || updatedAt,
        updated_at: article.updated_at || updatedAt
    };

    normalized.readMinutes = article.readMinutes || Math.max(4, Math.ceil(normalized.fullContent.join(' ').split(/\s+/).length / 210));
    return normalized;
};

export const getPublicArticles = (apiArticles = []) => {
    const editorialSlugs = new Set(EDITORIAL_ARTICLES.map((article) => article.slug));
    const additionalArticles = Array.isArray(apiArticles)
        ? apiArticles
            .map(normalizeArticle)
            .filter((article) => {
                const wordCount = article.fullContent.join(' ').trim().split(/\s+/).filter(Boolean).length;
                const createdTime = new Date(article.created_at || article.updated_at || 0).getTime();
                const isRecentAdminArticle = Number.isFinite(createdTime) && createdTime >= adminArticleCutoff;
                const isCryptoCardiacArticle = article.source.toLowerCase().includes('cryptocardiac');

                return !editorialSlugs.has(article.slug) &&
                    wordCount >= 250 &&
                    (isCryptoCardiacArticle || isRecentAdminArticle);
            })
            .sort((a, b) => new Date(b.created_at || b.updated_at || 0) - new Date(a.created_at || a.updated_at || 0))
        : [];

    return [
        ...additionalArticles,
        ...EDITORIAL_ARTICLES.sort((a, b) => (a.sort_order || 999) - (b.sort_order || 999))
    ];
};

export const findArticleBySlug = (articles, slug) => {
    if (!slug) return null;
    return articles.find((article) => article.slug === slug || String(article.id) === slug) || null;
};
