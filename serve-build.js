const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const vm = require('vm');
const { ARTICLE_ENHANCEMENTS_BY_ORDER } = require('./src/data/articleEnhancements.cjs');

const root = path.join(__dirname, 'build');
const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || '0.0.0.0';
const siteUrl = 'https://cryptocardiac.com';
const articleCutoff = new Date('2026-06-23').getTime();
const contentUpdatedAt = '2026-06-28';
const apiBaseUrl = (process.env.SITEMAP_API_URL || process.env.REACT_APP_API_URL || `${siteUrl}/api/api`).replace(/\/+$/, '');
const sitemapCacheMs = Number(process.env.SITEMAP_CACHE_MS) || 5 * 60 * 1000;
const defaultArticleSource = 'CryptoCardiac Research Desk';
const contactEmail = 'support@cryptocardiac.com';
const referenceSourcePattern = /(^|\|)\s*\d+\.\s+|coinbase\.com|bitcoin\.org|csrc\.nist\.gov|sec\.gov|fca\.org\.uk|public law|esma|federalregister|treasury\.gov|bis\.org|journal|review of financial studies/i;

let sitemapCache = {
    expiresAt: 0,
    xml: ''
};

let articlesCache = {
    expiresAt: 0,
    articles: []
};

let staticArticlesCache = null;

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
    { path: '/', lastmod: '2026-06-28', changefreq: 'daily', priority: '1.0' },
    { path: '/featured-articles', lastmod: '2026-06-28', changefreq: 'daily', priority: '0.9' },
    { path: '/coins', lastmod: '2026-06-28', changefreq: 'daily', priority: '0.8' },
    { path: '/coins/bitcoin', lastmod: '2026-06-28', changefreq: 'daily', priority: '0.7' },
    { path: '/coins/ethereum', lastmod: '2026-06-28', changefreq: 'daily', priority: '0.7' },
    { path: '/coins/solana', lastmod: '2026-06-28', changefreq: 'daily', priority: '0.7' },
    { path: '/about', lastmod: '2026-06-28', changefreq: 'monthly', priority: '0.7' },
    { path: '/contact', lastmod: '2026-06-28', changefreq: 'monthly', priority: '0.6' },
    { path: '/privacy-policy', lastmod: '2026-06-28', changefreq: 'yearly', priority: '0.5' },
    { path: '/terms', lastmod: '2026-06-28', changefreq: 'yearly', priority: '0.5' },
    { path: '/disclaimer', lastmod: '2026-06-28', changefreq: 'yearly', priority: '0.5' }
];

const apiFallbackArticles = [
    {
        slug: 'from-speculation-to-market-design-the-new-finance-of-crypto-markets',
        title: 'FROM SPECULATION TO MARKET DESIGN: THE NEW FINANCE OF CRYPTO MARKETS',
        description: 'The newest top-tier finance research on cryptocurrency is moving toward market design, transaction ordering, liquidity provision, stablecoin fragility, retail speculation, manipulation, and crypto-specific asset pricing.',
        source: defaultArticleSource,
        author: defaultArticleSource,
        created_at: '2026-06-27',
        updated_at: '2026-06-27'
    },
    {
        slug: 'what-cryptocurrency-is-and-what-blockchain-is',
        title: 'What Cryptocurrency Is and What Blockchain Is',
        description: 'A plain-English guide to cryptocurrency, blockchain, coins, tokens, smart contracts, and the practical risks that new readers should understand.',
        source: defaultArticleSource,
        author: defaultArticleSource,
        created_at: '2026-06-26',
        updated_at: '2026-06-26'
    },
    {
        slug: 'crypto-world-regulation-is-now-more-important-than-memes',
        title: 'Crypto World: Regulation Is Now More Important Than Memes',
        description: 'Crypto is increasingly being reorganized by legal and supervisory architecture that determines which assets, firms, and products can survive.',
        source: defaultArticleSource,
        author: defaultArticleSource,
        created_at: '2026-06-24',
        updated_at: '2026-06-24'
    }
];

const pageMeta = {
    '/': {
        title: 'Crypto Leaderboard | Vote & Rank Top Cryptocurrencies | CryptoCardiac',
        description: 'View the real-time community-driven cryptocurrency leaderboard. Vote for your favorite coins, track daily ranking trends, and read educational guides about crypto privacy and exchange risk.',
        type: 'website'
    },
    '/featured-articles': {
        title: 'Crypto Articles & Education | CryptoCardiac',
        description: 'Read original CryptoCardiac guides about cryptocurrency community signals, market trends, exchange risk, privacy, wallets, and blockchain education.',
        type: 'website'
    },
    '/privacy-policy': {
        title: 'Privacy Policy - CryptoCardiac | Data Protection & User Privacy',
        description: "CryptoCardiac's privacy policy explains account data, voting activity, cookies, analytics, Google AdSense, third-party ad serving, opt-out choices, and contact details.",
        type: 'website'
    },
    '/terms': {
        title: 'Terms & Conditions - CryptoCardiac | Platform Usage Rules',
        description: "CryptoCardiac's terms and conditions. Read our platform usage rules, voting guidelines, account policies, and user responsibilities.",
        type: 'website'
    },
    '/contact': {
        title: 'Contact CryptoCardiac | Get in Touch with Our Team',
        description: "Contact CryptoCardiac for support, corrections, privacy questions, editorial feedback, or platform inquiries at support@cryptocardiac.com.",
        type: 'website'
    },
    '/disclaimer': {
        title: 'Disclaimer - CryptoCardiac | Important Risk Information',
        description: 'Important disclaimer for CryptoCardiac. Read about cryptocurrency risks, data accuracy, community voting limits, and educational-only content.',
        type: 'website'
    },
    '/about': {
        title: 'About CryptoCardiac | Community Crypto Rankings and Editorial Methodology',
        description: "Learn about CryptoCardiac's community voting methodology, editorial standards, publisher contact details, and educational approach to cryptocurrency rankings.",
        type: 'website'
    },
    '/coins': {
        title: 'Crypto Coins | Live Market Data | CryptoCardiac',
        description: 'Explore cryptocurrency market data, price charts, and community voting signals for popular coins on CryptoCardiac.',
        type: 'website'
    }
};

const noIndexPaths = new Set(['/admin', '/login', '/signup', '/my-votes', '/404']);

const utilityPageMeta = {
    '/login': {
        title: 'Login | CryptoCardiac',
        description: 'Log in to CryptoCardiac to vote and view your account activity.',
        type: 'website',
        noIndex: true
    },
    '/signup': {
        title: 'Create Account | CryptoCardiac',
        description: 'Create a CryptoCardiac account to participate in daily community voting.',
        type: 'website',
        noIndex: true
    },
    '/admin': {
        title: 'Admin Dashboard | CryptoCardiac',
        description: 'CryptoCardiac administrator dashboard.',
        type: 'website',
        noIndex: true
    },
    '/my-votes': {
        title: 'My Votes | CryptoCardiac',
        description: 'Private CryptoCardiac voting history page for signed-in users.',
        type: 'website',
        noIndex: true
    },
    '/404': {
        title: 'Page Not Found | CryptoCardiac',
        description: 'The requested CryptoCardiac page could not be found.',
        type: 'website',
        noIndex: true
    }
};

const crawlablePageContent = {
    '/featured-articles': {
        heading: 'CryptoCardiac Featured Articles',
        paragraphs: [
            'CryptoCardiac publishes educational cryptocurrency guides for readers who want context before reacting to market noise.',
            'The article library explains community voting, market sentiment, wallet safety, exchange risk, proof of reserves, regulation, blockchain privacy, and the limits of hype.',
            'Articles are written for general education only. Rankings, votes, articles, charts, and market data on CryptoCardiac are not financial, legal, tax, or investment advice.'
        ]
    },
    '/about': {
        heading: 'About CryptoCardiac',
        paragraphs: [
            'CryptoCardiac is a community-powered cryptocurrency voting and education platform. The site helps readers observe community attention while keeping a clear separation between popularity and investment quality.',
            'The leaderboard shows public attention signals, including daily and longer-term voting activity. These signals can be useful for discovery, but they do not prove that any coin is safe, undervalued, compliant, liquid, or suitable for purchase.',
            'CryptoCardiac articles are written for general education. They explain crypto concepts, exchange risk, wallet safety, regulation, community sentiment, and methodology without providing personal financial, legal, tax, or investment advice.',
            `Publisher and support contact: ${contactEmail}. Corrections, privacy requests, copyright concerns, and editorial feedback can be sent to this address.`
        ]
    },
    '/contact': {
        heading: 'Contact CryptoCardiac',
        paragraphs: [
            `Readers, project communities, and partners can contact CryptoCardiac at ${contactEmail} for support, feedback, corrections, privacy requests, copyright concerns, and general platform questions.`,
            'CryptoCardiac is the publisher and operator of cryptocardiac.com, a public cryptocurrency education and community-voting website.',
            'CryptoCardiac does not provide personal financial advice, portfolio recommendations, trading instructions, or guaranteed-return claims.',
            'For privacy, policy, or content concerns, users should include the relevant URL, account email, article title, or other details needed to investigate the issue.'
        ]
    },
    '/privacy-policy': {
        heading: 'CryptoCardiac Privacy Policy',
        paragraphs: [
            'Effective date: June 28, 2026. Last updated: June 28, 2026.',
            'CryptoCardiac collects information needed to operate the platform, including account information when users register, voting activity, device information, IP addresses, cookies, web beacons, log files, and similar identifiers.',
            'The site uses cookies and similar technologies for account sessions, security, analytics, user experience, advertising, and site performance. Users can control cookies through browser settings, though disabling cookies may affect site functionality.',
            'CryptoCardiac may display advertisements through Google AdSense. Google and its partners may use cookies, web beacons, IP addresses, device identifiers, and other data to serve ads, measure ad performance, limit repeated ads, detect abuse, and personalize ads where permitted.',
            'Google may use information from visits to CryptoCardiac and other websites or apps to provide advertising services. Users can review Google partner-site data use at https://policies.google.com/technologies/partner-sites.',
            `Users may contact CryptoCardiac at ${contactEmail} for privacy questions, advertising-policy concerns, corrections, or data requests.`
        ]
    },
    '/terms': {
        heading: 'CryptoCardiac Terms and Conditions',
        paragraphs: [
            'CryptoCardiac is a cryptocurrency community voting and education platform. By using the site, users agree to follow platform rules and use the information responsibly.',
            'Users may vote for cryptocurrency projects, view community rankings, read educational articles, and explore market information. Users may not abuse the system, attempt to manipulate votes, attack the service, or submit unlawful content.',
            'CryptoCardiac may display third-party advertisements and third-party cryptocurrency data. The site is not responsible for external advertisements, external websites, or the accuracy of third-party market data.',
            'Nothing on CryptoCardiac is financial, investment, legal, or tax advice. Users are responsible for their own research and decisions.'
        ]
    },
    '/disclaimer': {
        heading: 'CryptoCardiac Disclaimer',
        paragraphs: [
            'CryptoCardiac provides educational content, community voting data, rankings, and cryptocurrency information for general informational purposes only.',
            'Community votes show user interest and participation. High vote counts do not guarantee project quality, safety, liquidity, legal compliance, future performance, or investment suitability.',
            'Cryptocurrency assets are volatile and risky. Prices can change quickly, liquidity can disappear, platforms can fail, and users can lose money.',
            'Readers should verify information independently and consult qualified professionals where appropriate. CryptoCardiac does not provide personal financial, investment, tax, or legal advice.'
        ]
    },
    '/': {
        heading: 'CryptoCardiac Cryptocurrency Leaderboard',
        paragraphs: [
            'CryptoCardiac tracks public community voting signals for cryptocurrency projects and presents them as a real-time leaderboard.',
            'The leaderboard helps readers discover active crypto communities, compare time-based voting activity, and explore educational context around market attention.',
            'Votes represent community interest only. They are not recommendations to buy, sell, or hold any cryptocurrency.'
        ]
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

const normalizeArticleSource = (source = '') => {
    const cleanedSource = source.toString().trim();
    if (!cleanedSource) return defaultArticleSource;
    if (referenceSourcePattern.test(cleanedSource) || cleanedSource.length > 140) {
        return defaultArticleSource;
    }
    return cleanedSource;
};

const getReferencesFromSource = (source = '') => {
    const cleanedSource = source.toString().trim();
    if (!referenceSourcePattern.test(cleanedSource)) return [];

    return cleanedSource
        .split('|')
        .map((reference) => reference.trim())
        .filter(Boolean);
};

const parseArticleContent = (article) => {
    let content = article.fullContent || article.full_content || [];

    if (typeof content === 'string') {
        try {
            content = JSON.parse(content);
        } catch (error) {
            content = [content];
        }
    }

    if (!Array.isArray(content)) {
        content = [content];
    }

    return content
        .map((paragraph) => paragraph == null ? '' : paragraph.toString().trim())
        .filter(Boolean);
};

const loadStaticEditorialArticles = () => {
    if (staticArticlesCache) return staticArticlesCache;

    try {
        const sourcePath = path.join(__dirname, 'src', 'data', 'articles.js');
        const source = fs.readFileSync(sourcePath, 'utf8');
        const marker = 'export const EDITORIAL_ARTICLES =';
        const markerIndex = source.indexOf(marker);

        if (markerIndex === -1) {
            throw new Error('EDITORIAL_ARTICLES array not found');
        }

        const startIndex = source.indexOf('[', markerIndex);
        let endIndex = -1;
        let depth = 0;
        let quote = null;
        let escaped = false;

        for (let index = startIndex; index < source.length; index += 1) {
            const char = source[index];

            if (quote) {
                if (escaped) {
                    escaped = false;
                } else if (char === '\\') {
                    escaped = true;
                } else if (char === quote) {
                    quote = null;
                }
                continue;
            }

            if (char === '"' || char === "'" || char === '`') {
                quote = char;
                continue;
            }

            if (char === '[') depth += 1;
            if (char === ']') depth -= 1;

            if (depth === 0) {
                endIndex = index;
                break;
            }
        }

        if (startIndex === -1 || endIndex === -1) {
            throw new Error('EDITORIAL_ARTICLES array boundaries not found');
        }

        const articleArrayLiteral = source.slice(startIndex, endIndex + 1);
        const script = new vm.Script(`(${articleArrayLiteral})`);
        const articles = script.runInNewContext({
            updatedAt: '2026-06-23',
            contentUpdatedAt
        }, { timeout: 1000 });

        staticArticlesCache = Array.isArray(articles)
            ? articles.map((article) => {
                const fullContent = [
                    ...parseArticleContent(article),
                    ...(ARTICLE_ENHANCEMENTS_BY_ORDER[article.sort_order] || [])
                ];

                return {
                    ...article,
                    fullContent,
                    slug: slugifyArticle(article.title),
                    source: article.source || defaultArticleSource,
                    author: article.author || defaultArticleSource,
                    updated_at: article.updated_at === '2026-06-23' ? contentUpdatedAt : article.updated_at
                };
            })
            : [];
    } catch (error) {
        console.warn(`Unable to load static editorial articles: ${error.message}`);
        staticArticlesCache = [];
    }

    return staticArticlesCache;
};

const getFallbackArticles = () => {
    const articleMap = new Map();
    [...apiFallbackArticles, ...loadStaticEditorialArticles()].forEach((article) => {
        const slug = article.slug || slugifyArticle(article.title);
        articleMap.set(slug, { ...article, slug });
    });
    return Array.from(articleMap.values());
};

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
    const paragraphs = parseArticleContent(article);
    return paragraphs.join(' ').trim().split(/\s+/).filter(Boolean).length;
};

const getPublishedTime = (article) => {
    const time = new Date(article.created_at || article.updated_at || '2026-06-23').getTime();
    return Number.isFinite(time) ? time : 0;
};

const sortArticlesNewestFirst = (a, b) => {
    const dateDiff = getPublishedTime(b) - getPublishedTime(a);
    if (dateDiff !== 0) return dateDiff;

    const orderDiff = (a.sort_order || 999) - (b.sort_order || 999);
    if (orderDiff !== 0) return orderDiff;

    return String(a.title || '').localeCompare(String(b.title || ''));
};

const normalizeArticle = (article) => {
    const rawSource = article.source || '';
    const fullContent = parseArticleContent(article);

    return {
        ...article,
        title: article.title || '',
        description: article.description || fullContent[0] || '',
        slug: article.slug || slugifyArticle(article.title),
        source: normalizeArticleSource(rawSource),
        author: article.author || defaultArticleSource,
        references: Array.isArray(article.references) ? article.references : getReferencesFromSource(rawSource),
        fullContent,
        created_at: article.created_at || article.updated_at || '2026-06-23',
        updated_at: article.updated_at || article.created_at || '2026-06-23',
        wordCount: getWordCount(article)
    };
};

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

        getFallbackArticles().forEach((article) => {
            const normalized = normalizeArticle(article);
            articleMap.set(normalized.slug, normalized);
        });

        apiArticles
            .map(normalizeArticle)
            .filter(isPublicArticle)
            .forEach((article) => {
                if (!articleMap.has(article.slug)) {
                    articleMap.set(article.slug, article);
                }
            });

        const articles = Array.from(articleMap.values())
            .sort(sortArticlesNewestFirst);

        articlesCache = {
            expiresAt: now + sitemapCacheMs,
            articles
        };
        return articles;
    } catch (error) {
        console.warn(`Unable to fetch live articles for sitemap: ${error.message}`);
        return getFallbackArticles().map(normalizeArticle);
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

    if (cleanPath === '/featured-articles') {
        return {
            ...pageMeta[cleanPath],
            articleList: await getPublicArticles()
        };
    }

    if (utilityPageMeta[cleanPath]) {
        return utilityPageMeta[cleanPath];
    }

    return pageMeta[cleanPath] || pageMeta['/'];
};

const replaceOrInsertMeta = (html, selectorRegex, tag) => {
    if (selectorRegex.test(html)) {
        return html.replace(selectorRegex, tag);
    }
    return html.replace('</head>', `  ${tag}\n</head>`);
};

const renderParagraphs = (paragraphs = []) => paragraphs
    .map((paragraph) => `      <p>${escapeHtml(paragraph)}</p>`)
    .join('\n');

const buildCrawlerContent = (meta, canonicalUrl, canonicalPath) => {
    if (meta.article) {
        const article = meta.article;
        const paragraphs = article.fullContent && article.fullContent.length
            ? article.fullContent
            : [article.description];
        const references = Array.isArray(article.references) && article.references.length
            ? `\n      <h2>References</h2>\n      <ol>\n${article.references.map((reference) => `        <li>${escapeHtml(reference)}</li>`).join('\n')}\n      </ol>`
            : '';

        return `  <noscript id="route-crawler-content">
    <article>
      <h1>${escapeHtml(article.title)}</h1>
      <p><strong>Source:</strong> ${escapeHtml(article.source || defaultArticleSource)}</p>
      <p><strong>Canonical URL:</strong> <a href="${escapeHtml(canonicalUrl)}">${escapeHtml(canonicalUrl)}</a></p>
${renderParagraphs(paragraphs)}
      <p><strong>Important:</strong> CryptoCardiac publishes educational content only. Community votes, rankings, articles, and market data are not financial, investment, legal, or tax advice.</p>${references}
    </article>
  </noscript>`;
    }

    if (Array.isArray(meta.articleList) && meta.articleList.length) {
        const links = meta.articleList
            .map((article) => `        <li><a href="${escapeHtml(`${siteUrl}/featured-articles/${article.slug}`)}">${escapeHtml(article.title)}</a></li>`)
            .join('\n');

        const pageContent = crawlablePageContent[canonicalPath] || {};
        return `  <noscript id="route-crawler-content">
    <section>
      <h1>${escapeHtml(pageContent.heading || meta.title)}</h1>
      <p><strong>Canonical URL:</strong> <a href="${escapeHtml(canonicalUrl)}">${escapeHtml(canonicalUrl)}</a></p>
${renderParagraphs(pageContent.paragraphs || [])}
      <h2>Educational article library</h2>
      <ul>
${links}
      </ul>
    </section>
  </noscript>`;
    }

    const pageContent = crawlablePageContent[canonicalPath];
    if (!pageContent) return '';

    return `  <noscript id="route-crawler-content">
    <section>
      <h1>${escapeHtml(pageContent.heading)}</h1>
      <p><strong>Canonical URL:</strong> <a href="${escapeHtml(canonicalUrl)}">${escapeHtml(canonicalUrl)}</a></p>
${renderParagraphs(pageContent.paragraphs)}
    </section>
  </noscript>`;
};

const injectMeta = (html, meta, urlPath) => {
    const canonicalPath = meta.canonicalPath || (urlPath.replace(/\/+$/, '') || '/');
    const canonicalUrl = `${siteUrl}${canonicalPath}`;
    const title = escapeHtml(meta.title);
    const description = escapeHtml(meta.description);
    const type = escapeHtml(meta.type || 'website');
    let output = html
        .replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`)
        .replace(/<meta\s+name=["']robots["'][^>]*>\s*/gi, '')
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

    const robotsContent = meta.noIndex || noIndexPaths.has(canonicalPath)
        ? 'noindex, follow'
        : 'index, follow, max-snippet:-1, max-image-preview:large';

    output = output.replace('</head>', `  <meta name="robots" content="${robotsContent}" />\n</head>`);
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
            articleSection: meta.article.category || 'Cryptocurrency Education',
            wordCount: getWordCount(meta.article),
            articleBody: Array.isArray(meta.article.fullContent) ? meta.article.fullContent.join('\n\n') : '',
            mainEntityOfPage: canonicalUrl
        };
        output = output.replace('</head>', `  <script type="application/ld+json">${JSON.stringify(articleJsonLd)}</script>\n</head>`);
    }

    const crawlerContent = buildCrawlerContent(meta, canonicalUrl, canonicalPath);
    if (crawlerContent) {
        output = output.replace(/<body([^>]*)>/i, `<body$1>\n${crawlerContent}`);
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
