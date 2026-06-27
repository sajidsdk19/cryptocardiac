const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');

const root = path.join(__dirname, 'build');
const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || '0.0.0.0';
const siteUrl = 'https://cryptocardiac.com';
const articleCutoff = new Date('2026-06-23').getTime();
const apiBaseUrl = (process.env.SITEMAP_API_URL || process.env.REACT_APP_API_URL || `${siteUrl}/api/api`).replace(/\/+$/, '');
const sitemapCacheMs = Number(process.env.SITEMAP_CACHE_MS) || 5 * 60 * 1000;

let sitemapCache = {
    expiresAt: 0,
    xml: ''
};

let articlesCache = {
    expiresAt: 0,
    articles: []
};

const mimeTypes = {
    '.css': 'text/css; charset=utf-8',
    '.gif': 'image/gif',
    '.html': 'text/html; charset=utf-8',
    '.ico': 'image/x-icon',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.map': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.txt': 'text/plain; charset=utf-8',
    '.webmanifest': 'application/manifest+json; charset=utf-8',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.xml': 'application/xml; charset=utf-8'
};

const staticRoutes = [
    { path: '/', lastmod: '2026-06-27', changefreq: 'daily', priority: '1.0' },
    { path: '/featured-articles', lastmod: '2026-06-27', changefreq: 'daily', priority: '0.9' },
    { path: '/coins', lastmod: '2026-06-27', changefreq: 'daily', priority: '0.8' },
    { path: '/coins/bitcoin', lastmod: '2026-06-27', changefreq: 'daily', priority: '0.7' },
    { path: '/coins/ethereum', lastmod: '2026-06-27', changefreq: 'daily', priority: '0.7' },
    { path: '/coins/solana', lastmod: '2026-06-27', changefreq: 'daily', priority: '0.7' },
    { path: '/about', lastmod: '2026-06-27', changefreq: 'monthly', priority: '0.7' },
    { path: '/contact', lastmod: '2026-06-27', changefreq: 'monthly', priority: '0.6' },
    { path: '/privacy-policy', lastmod: '2026-06-27', changefreq: 'yearly', priority: '0.5' },
    { path: '/terms', lastmod: '2026-06-27', changefreq: 'yearly', priority: '0.5' },
    { path: '/disclaimer', lastmod: '2026-06-27', changefreq: 'yearly', priority: '0.5' }
];

const fallbackArticles = [
    ['from-speculation-to-market-design-the-new-finance-of-crypto-markets', 'FROM SPECULATION TO MARKET DESIGN: THE NEW FINANCE OF CRYPTO MARKETS', 'The newest top-tier finance research on cryptocurrency is moving toward market design, transaction ordering, liquidity provision, stablecoin fragility, retail speculation, manipulation, and crypto-specific asset pricing.', '2026-06-27'],
    ['what-cryptocurrency-is-and-what-blockchain-is', 'What Cryptocurrency Is and What Blockchain Is', 'A plain-English guide to cryptocurrency, blockchain, coins, tokens, smart contracts, and the practical risks that new readers should understand.', '2026-06-26'],
    ['crypto-world-regulation-is-now-more-important-than-memes', 'Crypto World: Regulation Is Now More Important Than Memes', 'Crypto is increasingly being reorganized by legal and supervisory architecture that determines which assets, firms, and products can survive.', '2026-06-24'],
    ['how-cryptocardiac-ranks-community-interest-without-giving-investment-advice', 'How CryptoCardiac Ranks Community Interest Without Giving Investment Advice', 'A plain-English explanation of how community voting, time windows, and transparent limits help readers understand crypto attention without treating votes as financial advice.', '2026-06-23'],
    ['what-crypto-market-trends-can-tell-you-and-what-they-cannot', 'What Crypto Market Trends Can Tell You and What They Cannot', 'Market trends can help readers notice changing attention, liquidity, and sentiment, but they have limits. This guide explains how to read them carefully.', '2026-06-23'],
    ['no-kyc-crypto-exchanges-privacy-benefits-practical-risks-and-safer-habits', 'No-KYC Crypto Exchanges: Privacy Benefits, Practical Risks, and Safer Habits', 'A neutral guide to No-KYC crypto exchanges, including why people use them, what risks to watch for, and how to think about privacy responsibly.', '2026-06-23'],
    ['xrp-and-the-xrp-ledger-a-plain-english-guide', 'XRP and the XRP Ledger: A Plain-English Guide', 'An educational overview of XRP, the XRP Ledger, payments use cases, validator concepts, and the difference between network utility and market price.', '2026-06-23'],
    ['why-proof-of-reserves-is-useful-but-not-a-complete-safety-check', 'Why Proof of Reserves Is Useful but Not a Complete Safety Check', 'Proof of reserves can improve transparency, but readers should understand assets, liabilities, audit scope, timing, and custody controls before trusting the headline.', '2026-06-23'],
    ['how-blockchain-tracking-works-and-what-it-means-for-wallet-privacy', 'How Blockchain Tracking Works and What It Means for Wallet Privacy', 'Public blockchains are transparent by design. This guide explains address clustering, exchange links, dusting, and practical privacy habits.', '2026-06-23'],
    ['bitcoin-as-digital-cash-digital-gold-and-community-signal', 'Bitcoin as Digital Cash, Digital Gold, and Community Signal', 'Bitcoin is discussed in several different ways. This article separates payment use, store-of-value narratives, network security, and community attention.', '2026-06-23'],
    ['solana-s-high-speed-design-benefits-tradeoffs-and-common-use-cases', "Solana's High-Speed Design: Benefits, Tradeoffs, and Common Use Cases", 'A balanced look at Solana, including fast settlement, low fees, application design, validator demands, and the tradeoffs that come with performance.', '2026-06-23'],
    ['meme-coins-community-energy-and-the-limits-of-hype', 'Meme Coins, Community Energy, and the Limits of Hype', 'Meme coins can build powerful communities, but hype can hide liquidity, supply, contract, and concentration risks. This guide explains how to read the signal.', '2026-06-23'],
    ['political-tokens-and-event-driven-crypto-communities', 'Political Tokens and Event-Driven Crypto Communities', 'Political and event-driven tokens can move with news cycles. This article explains why they attract attention and why readers should treat them carefully.', '2026-06-23']
].map(([slug, title, description, updatedAt]) => ({
    slug,
    title,
    description,
    source: 'CryptoCardiac Research Desk',
    author: 'CryptoCardiac Research Desk',
    created_at: updatedAt,
    updated_at: updatedAt
}));

const pageMeta = {
    '/': {
        title: 'Crypto Leaderboard | Vote & Rank Top Cryptocurrencies | CryptoCardiac',
        description: 'View the real-time community-driven cryptocurrency leaderboard. Vote for your favorite coins, track daily ranking trends, and explore top No-KYC exchanges.',
        type: 'website'
    },
    '/featured-articles': {
        title: 'Crypto Articles & Education | CryptoCardiac',
        description: 'Read original CryptoCardiac guides about cryptocurrency community signals, market trends, exchange risk, privacy, wallets, and blockchain education.',
        type: 'website'
    },
    '/privacy-policy': {
        title: 'Privacy Policy - CryptoCardiac | Data Protection & User Privacy',
        description: "CryptoCardiac's comprehensive privacy policy. Learn how we collect, use, and protect your data, including cookies, Google AdSense usage, and privacy rights.",
        type: 'website'
    },
    '/terms': {
        title: 'Terms & Conditions - CryptoCardiac | Platform Usage Rules',
        description: "CryptoCardiac's terms and conditions. Read our platform usage rules, voting guidelines, account policies, and user responsibilities.",
        type: 'website'
    },
    '/contact': {
        title: 'Contact CryptoCardiac | Get in Touch with Our Team',
        description: "Contact the CryptoCardiac team for support, feedback, or partnerships. Reach us via email or the contact form.",
        type: 'website'
    },
    '/disclaimer': {
        title: 'Disclaimer - CryptoCardiac | Important Risk Information',
        description: 'Important disclaimer for CryptoCardiac. Read about cryptocurrency risks, data accuracy, community voting limits, and educational-only content.',
        type: 'website'
    },
    '/about': {
        title: 'About CryptoCardiac | Community Crypto Rankings',
        description: 'Learn about CryptoCardiac, a community-powered cryptocurrency voting and education platform focused on transparent crypto attention signals.',
        type: 'website'
    },
    '/coins': {
        title: 'Crypto Coins | Live Market Data | CryptoCardiac',
        description: 'Explore cryptocurrency market data, price charts, and community voting signals for popular coins on CryptoCardiac.',
        type: 'website'
    }
};

const xmlEscape = (value = '') => value
    .toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const escapeHtml = (value = '') => value
    .toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const slugifyArticle = (value = '') => value
    .toString()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const requestJson = (url) => new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    const request = client.get(url, (response) => {
        let data = '';
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
            data += chunk;
        });
        response.on('end', () => {
            if (response.statusCode < 200 || response.statusCode >= 300) {
                reject(new Error(`Request returned ${response.statusCode}`));
                return;
            }

            try {
                resolve(JSON.parse(data));
            } catch (error) {
                reject(error);
            }
        });
    });

    request.on('error', reject);
    request.setTimeout(10000, () => {
        request.destroy(new Error('Request timed out'));
    });
});

const getWordCount = (article) => {
    const content = article.fullContent || article.full_content || [];
    const paragraphs = Array.isArray(content) ? content : [content];
    return paragraphs.join(' ').trim().split(/\s+/).filter(Boolean).length;
};

const normalizeArticle = (article) => ({
    title: article.title || '',
    description: article.description || '',
    slug: article.slug || slugifyArticle(article.title),
    source: article.source || 'CryptoCardiac Research Desk',
    author: article.author || 'CryptoCardiac Research Desk',
    created_at: article.created_at || article.updated_at || '2026-06-23',
    updated_at: article.updated_at || article.created_at || '2026-06-23',
    wordCount: getWordCount(article)
});

const isPublicArticle = (article) => {
    const createdTime = new Date(article.created_at || article.updated_at || 0).getTime();
    const isRecentAdminArticle = Number.isFinite(createdTime) && createdTime >= articleCutoff;
    const isCryptoCardiacArticle = article.source.toLowerCase().includes('cryptocardiac');
    return article.title && article.slug && article.wordCount >= 250 && (isCryptoCardiacArticle || isRecentAdminArticle);
};

const fetchApiArticles = async () => {
    if (typeof fetch !== 'function') {
        const data = await requestJson(`${apiBaseUrl}/articles`);
        return Array.isArray(data) ? data : [];
    }

    const response = await fetch(`${apiBaseUrl}/articles`);
    if (!response.ok) {
        throw new Error(`Article API returned ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
};

const getPublicArticles = async () => {
    const now = Date.now();
    if (articlesCache.expiresAt > now) {
        return articlesCache.articles;
    }

    try {
        const apiArticles = await fetchApiArticles();
        const articleMap = new Map();

        fallbackArticles.forEach((article) => {
            articleMap.set(article.slug, normalizeArticle({ ...article, fullContent: ['Fallback editorial article. '.repeat(250)] }));
        });

        apiArticles
            .map(normalizeArticle)
            .filter(isPublicArticle)
            .forEach((article) => articleMap.set(article.slug, article));

        const articles = Array.from(articleMap.values())
            .sort((a, b) => new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0));

        articlesCache = {
            expiresAt: now + sitemapCacheMs,
            articles
        };
        return articles;
    } catch (error) {
        console.warn(`Unable to fetch live articles for sitemap: ${error.message}`);
        return fallbackArticles.map((article) => normalizeArticle({ ...article, fullContent: ['Fallback editorial article. '.repeat(250)] }));
    }
};

const getArticleBySlug = async (slug) => {
    const articles = await getPublicArticles();
    return articles.find((article) => article.slug === slug) || null;
};

const buildSitemap = async () => {
    const now = Date.now();
    if (sitemapCache.expiresAt > now && sitemapCache.xml) {
        return sitemapCache.xml;
    }

    const articles = await getPublicArticles();
    const urls = [
        ...staticRoutes,
        ...articles.map((article) => ({
            path: `/featured-articles/${article.slug}`,
            lastmod: (article.updated_at || article.created_at || '2026-06-27').toString().slice(0, 10),
            changefreq: 'monthly',
            priority: '0.8'
        }))
    ];

    const dedupedUrls = Array.from(new Map(urls.map((item) => [item.path, item])).values());
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${dedupedUrls.map((item) => `  <url>
    <loc>${xmlEscape(`${siteUrl}${item.path}`)}</loc>
    <lastmod>${xmlEscape(item.lastmod)}</lastmod>
    <changefreq>${xmlEscape(item.changefreq)}</changefreq>
    <priority>${xmlEscape(item.priority)}</priority>
  </url>`).join('\n\n')}
</urlset>
`;

    sitemapCache = {
        expiresAt: now + sitemapCacheMs,
        xml
    };

    return xml;
};

const getMetaForPath = async (urlPath) => {
    const cleanPath = urlPath.replace(/\/+$/, '') || '/';

    if (cleanPath.startsWith('/featured-articles/')) {
        const slug = cleanPath.split('/').pop();
        const article = await getArticleBySlug(slug);
        if (article) {
            return {
                title: `${article.title} | CryptoCardiac`,
                description: article.description,
                type: 'article',
                canonicalPath: `/featured-articles/${article.slug}`,
                article
            };
        }
    }

    if (cleanPath.startsWith('/coins/')) {
        const coinName = cleanPath.split('/').pop().replace(/-/g, ' ');
        return {
            title: `${coinName.charAt(0).toUpperCase()}${coinName.slice(1)} Price, Chart & Community Votes | CryptoCardiac`,
            description: `Track ${coinName} market data, charts, and community voting signals on CryptoCardiac.`,
            type: 'website'
        };
    }

    return pageMeta[cleanPath] || pageMeta['/'];
};

const replaceOrInsertMeta = (html, selectorRegex, tag) => {
    if (selectorRegex.test(html)) {
        return html.replace(selectorRegex, tag);
    }
    return html.replace('</head>', `  ${tag}\n</head>`);
};

const injectMeta = (html, meta, urlPath) => {
    const canonicalPath = meta.canonicalPath || (urlPath.replace(/\/+$/, '') || '/');
    const canonicalUrl = `${siteUrl}${canonicalPath}`;
    const title = escapeHtml(meta.title);
    const description = escapeHtml(meta.description);
    const type = escapeHtml(meta.type || 'website');
    let output = html
        .replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`)
        .replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gi, '');

    const replacements = [
        [/<meta data-rh="true" name="description"[\s\S]*?\/>/i, `<meta data-rh="true" name="description" content="${description}" />`],
        [/<meta data-rh="true" name="keywords"[\s\S]*?\/>/i, '<meta data-rh="true" name="keywords" content="cryptocurrency education, crypto voting, blockchain guide, market trends, CryptoCardiac" />'],
        [/<meta data-rh="true" property="og:type"[\s\S]*?\/>/i, `<meta data-rh="true" property="og:type" content="${type}" />`],
        [/<meta data-rh="true" property="og:url"[\s\S]*?\/>/i, `<meta data-rh="true" property="og:url" content="${escapeHtml(canonicalUrl)}" />`],
        [/<meta data-rh="true" property="og:title"[\s\S]*?\/>/i, `<meta data-rh="true" property="og:title" content="${title}" />`],
        [/<meta data-rh="true" property="og:description"[\s\S]*?\/>/i, `<meta data-rh="true" property="og:description" content="${description}" />`],
        [/<meta data-rh="true" name="twitter:url"[\s\S]*?\/>/i, `<meta data-rh="true" name="twitter:url" content="${escapeHtml(canonicalUrl)}" />`],
        [/<meta data-rh="true" name="twitter:title"[\s\S]*?\/>/i, `<meta data-rh="true" name="twitter:title" content="${title}" />`],
        [/<meta data-rh="true" name="twitter:description"[\s\S]*?\/>/i, `<meta data-rh="true" name="twitter:description" content="${description}" />`]
    ];

    replacements.forEach(([regex, tag]) => {
        output = replaceOrInsertMeta(output, regex, tag);
    });

    output = output.replace('</head>', `  <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />\n</head>`);

    if (meta.article) {
        const articleJsonLd = {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: meta.article.title,
            description: meta.article.description,
            author: {
                '@type': 'Organization',
                name: meta.article.author || 'CryptoCardiac Research Desk'
            },
            publisher: {
                '@type': 'Organization',
                name: 'CryptoCardiac',
                url: siteUrl
            },
            datePublished: meta.article.created_at,
            dateModified: meta.article.updated_at,
            mainEntityOfPage: canonicalUrl
        };
        output = output.replace('</head>', `  <script type="application/ld+json">${JSON.stringify(articleJsonLd)}</script>\n</head>`);
    }

    return output;
};

const sendText = (res, statusCode, body, contentType, cacheControl = 'no-cache') => {
    res.writeHead(statusCode, {
        'Content-Type': contentType,
        'Cache-Control': cacheControl
    });
    res.end(body);
};

const sendFile = (res, filePath) => {
    fs.readFile(filePath, (error, data) => {
        if (error) {
            sendText(res, 500, 'Internal server error', 'text/plain; charset=utf-8');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const isStaticAsset = filePath.includes(`${path.sep}static${path.sep}`);

        res.writeHead(200, {
            'Content-Type': mimeTypes[ext] || 'application/octet-stream',
            'Cache-Control': isStaticAsset
                ? 'public, max-age=31536000, immutable'
                : 'no-cache'
        });
        res.end(data);
    });
};

const sendIndex = async (res, urlPath) => {
    try {
        const indexPath = path.join(root, 'index.html');
        const html = await fs.promises.readFile(indexPath, 'utf8');
        const meta = await getMetaForPath(urlPath);
        sendText(res, 200, injectMeta(html, meta, urlPath), 'text/html; charset=utf-8');
    } catch (error) {
        console.error(`Unable to serve index.html: ${error.message}`);
        sendText(res, 500, 'Internal server error', 'text/plain; charset=utf-8');
    }
};

const shouldRedirectToCanonical = (req) => {
    const hostHeader = (req.headers.host || '').toLowerCase();
    const hostname = hostHeader.split(':')[0];
    const forwardedProto = (req.headers['x-forwarded-proto'] || '').toString().split(',')[0].trim().toLowerCase();

    if (hostname === 'www.cryptocardiac.com') return true;
    return hostname === 'cryptocardiac.com' && forwardedProto === 'http';
};

const server = http.createServer(async (req, res) => {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);

    if (shouldRedirectToCanonical(req)) {
        res.writeHead(301, {
            Location: `${siteUrl}${req.url || '/'}`,
            'Cache-Control': 'public, max-age=3600'
        });
        res.end();
        return;
    }

    if (urlPath === '/sitemap.xml') {
        try {
            sendText(res, 200, await buildSitemap(), 'application/xml; charset=utf-8');
        } catch (error) {
            console.error(`Unable to build sitemap: ${error.message}`);
            sendFile(res, path.join(root, 'sitemap.xml'));
        }
        return;
    }

    const cleanPath = urlPath.replace(/^\/+/, '');
    const requestedPath = path.normalize(path.join(root, cleanPath));

    if (requestedPath !== root && !requestedPath.startsWith(`${root}${path.sep}`)) {
        sendText(res, 403, 'Forbidden', 'text/plain; charset=utf-8');
        return;
    }

    fs.stat(requestedPath, (statError, stats) => {
        if (!statError && stats.isFile()) {
            sendFile(res, requestedPath);
            return;
        }

        sendIndex(res, urlPath);
    });
});

server.listen(port, host, () => {
    console.log(`Serving production build at http://${host}:${port}`);
});
