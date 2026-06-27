import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useMediaQuery, useTheme } from '@mui/material';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import {
    EDITORIAL_ARTICLES,
    TRENDING_TOPICS,
    findArticleBySlug,
    getArticlePath,
    getArticleUrl,
    getPublicArticles,
    SITE_URL
} from '../data/articles';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const formatDate = (dateValue) => {
    if (!dateValue) return 'Updated guide';
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return 'Updated guide';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getWordCount = (article) => article.fullContent
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length;

const pageShell = {
    background: 'rgb(21,21,32)',
    color: '#fff',
    minHeight: '100vh'
};

const ArticleCard = ({ article, isMobile }) => (
    <Link to={getArticlePath(article)} style={{ textDecoration: 'none', display: 'block' }}>
        <article
            className="cc-article-card"
            style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: isMobile ? '20px' : '24px',
                marginBottom: '24px',
                transition: 'transform 0.2s, background 0.2s, border-color 0.2s',
                minHeight: isMobile ? 'auto' : '260px',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start', marginBottom: '14px' }}>
                <span style={{
                    background: 'rgba(206, 52, 234, 0.12)',
                    color: '#CE34EA',
                    padding: '5px 12px',
                    borderRadius: '999px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase'
                }}>
                    {article.category}
                </span>
                <span style={{ color: '#777', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                    {formatDate(article.updated_at || article.created_at)}
                </span>
            </div>

            <h2 style={{
                color: '#fff',
                fontSize: isMobile ? '1.18rem' : '1.38rem',
                margin: '0 0 12px',
                lineHeight: 1.35
            }}>
                {article.title}
            </h2>

            <p style={{ color: '#CE34EA', fontSize: '0.86rem', fontWeight: 700, margin: '0 0 12px' }}>
                {article.source}
            </p>

            <p style={{ color: '#aaa', fontSize: isMobile ? '0.94rem' : '1rem', lineHeight: 1.65, margin: 0, flex: 1 }}>
                {article.description}
            </p>

            <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', color: '#fff', fontSize: '0.9rem', fontWeight: 700 }}>
                <span>Read full guide</span>
                <span>{article.readMinutes} min</span>
            </div>
        </article>
    </Link>
);

const ArticleDetail = ({ article, isMobile }) => {
    const articleUrl = getArticleUrl(article);
    const publishDate = article.created_at || '2026-06-23';
    const modifiedDate = article.updated_at || publishDate;

    const shareOnX = () => {
        const text = encodeURIComponent(`${article.title} via CryptoCardiac`);
        const url = encodeURIComponent(articleUrl);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
    };

    const shareOnTelegram = () => {
        const text = encodeURIComponent(`${article.title} via CryptoCardiac`);
        window.open(`https://t.me/share/url?url=${encodeURIComponent(articleUrl)}&text=${text}`, '_blank', 'noopener,noreferrer');
    };

    return (
        <>
            <Helmet>
                <title>{article.title} | CryptoCardiac</title>
                <meta name="description" content={article.description} />
                <meta name="keywords" content={`${article.category}, crypto education, cryptocurrency risk, blockchain guide, CryptoCardiac`} />
                <meta property="og:title" content={`${article.title} | CryptoCardiac`} />
                <meta property="og:description" content={article.description} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={articleUrl} />
                <meta property="article:published_time" content={publishDate} />
                <meta property="article:modified_time" content={modifiedDate} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${article.title} | CryptoCardiac`} />
                <meta name="twitter:description" content={article.description} />
                <link rel="canonical" href={articleUrl} />
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Article',
                        headline: article.title,
                        description: article.description,
                        author: {
                            '@type': 'Organization',
                            name: article.author
                        },
                        publisher: {
                            '@type': 'Organization',
                            name: 'CryptoCardiac',
                            url: SITE_URL
                        },
                        articleSection: article.category,
                        wordCount: getWordCount(article),
                        articleBody: article.fullContent.join('\n\n'),
                        datePublished: publishDate,
                        dateModified: modifiedDate,
                        mainEntityOfPage: articleUrl
                    })}
                </script>
            </Helmet>

            <article style={{ maxWidth: '860px', margin: '0 auto' }}>
                <Link to="/featured-articles" style={{ color: '#CE34EA', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 700 }}>
                    Back to articles
                </Link>

                <div style={{ marginTop: isMobile ? '24px' : '34px' }}>
                    <span style={{
                        background: 'rgba(206, 52, 234, 0.12)',
                        color: '#CE34EA',
                        padding: '6px 14px',
                        borderRadius: '999px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        display: 'inline-block',
                        marginBottom: '18px'
                    }}>
                        {article.category}
                    </span>

                    <h1 style={{
                        color: '#fff',
                        fontSize: isMobile ? '2rem' : '2.85rem',
                        fontWeight: 900,
                        lineHeight: 1.15,
                        margin: '0 0 18px'
                    }}>
                        {article.title}
                    </h1>

                    <p style={{ color: '#cfcfe8', fontSize: isMobile ? '1rem' : '1.12rem', lineHeight: 1.75, margin: '0 0 22px' }}>
                        {article.description}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 14px', color: '#888', fontSize: '0.88rem', marginBottom: isMobile ? '34px' : '44px' }}>
                        <span style={{ color: '#CE34EA', fontWeight: 700 }}>{article.source}</span>
                        <span>{formatDate(article.updated_at || article.created_at)}</span>
                        <span>{article.readMinutes} min read</span>
                    </div>
                </div>

                <div style={{
                    color: '#d7d7e8',
                    fontSize: isMobile ? '1rem' : '1.08rem',
                    lineHeight: 1.85
                }}>
                    {article.fullContent.map((paragraph, index) => (
                        <p key={index} style={{ margin: '0 0 1.45rem' }}>
                            {paragraph}
                        </p>
                    ))}
                </div>

                {Array.isArray(article.references) && article.references.length > 0 && (
                    <aside style={{
                        marginTop: isMobile ? '30px' : '40px',
                        padding: isMobile ? '20px' : '24px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(255,255,255,0.035)'
                    }}>
                        <h2 style={{ fontSize: '1.05rem', margin: '0 0 12px', color: '#fff' }}>References</h2>
                        <ol style={{ color: '#bbb', lineHeight: 1.7, paddingLeft: '20px', margin: 0, fontSize: '0.94rem' }}>
                            {article.references.map((reference, index) => (
                                <li key={index} style={{ marginBottom: '8px' }}>{reference}</li>
                            ))}
                        </ol>
                    </aside>
                )}

                <aside style={{
                    marginTop: isMobile ? '34px' : '48px',
                    padding: isMobile ? '22px' : '28px',
                    borderRadius: '12px',
                    border: '1px solid rgba(206,52,234,0.22)',
                    background: 'rgba(206,52,234,0.06)'
                }}>
                    <h2 style={{ fontSize: '1.05rem', margin: '0 0 10px', color: '#fff' }}>Important risk note</h2>
                    <p style={{ color: '#bbb', lineHeight: 1.7, margin: 0, fontSize: '0.95rem' }}>
                        CryptoCardiac publishes educational content only. Community votes, articles, rankings, and market data are not financial, investment, legal, or tax advice.
                    </p>
                </aside>

                <div style={{ marginTop: '32px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button onClick={shareOnX} style={shareButtonStyle('#1DA1F2')}>Share on X</button>
                    <button onClick={shareOnTelegram} style={shareButtonStyle('#0088cc')}>Share on Telegram</button>
                </div>
            </article>
        </>
    );
};

const shareButtonStyle = (background) => ({
    padding: '12px 18px',
    borderRadius: '8px',
    border: 'none',
    background,
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: '0.92rem'
});

const ArticleNotFound = () => (
    <>
        <Helmet>
            <title>Article Not Found | CryptoCardiac</title>
            <meta name="description" content="The requested CryptoCardiac article could not be found." />
            <meta name="robots" content="noindex, follow" />
        </Helmet>
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center', padding: '80px 20px' }}>
            <h1 style={{ color: '#fff', fontSize: '2rem', marginBottom: '12px' }}>Article not found</h1>
            <p style={{ color: '#aaa', lineHeight: 1.7, marginBottom: '28px' }}>
                This article may have moved or been unpublished.
            </p>
            <Link to="/featured-articles" style={{ color: '#CE34EA', fontWeight: 700, textDecoration: 'none' }}>
                View all articles
            </Link>
        </div>
    </>
);

const TrendingTopic = ({ title, trend }) => (
    <div style={{
        padding: '12px 0',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        gap: '16px',
        alignItems: 'center'
    }}>
        <span style={{ color: '#ccc', fontSize: '0.92rem' }}>{title}</span>
        <span style={{ color: trend.startsWith('+') ? '#56d364' : '#ff7b72', fontSize: '0.82rem', fontWeight: 700 }}>{trend}</span>
    </div>
);

const Articles = () => {
    const { slug } = useParams();
    const [articles, setArticles] = useState(EDITORIAL_ARTICLES);
    const [trendingTopics, setTrendingTopics] = useState(TRENDING_TOPICS);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        fetch(`${API_URL}/articles`)
            .then((response) => response.ok ? response.json() : Promise.reject(new Error('Article API unavailable')))
            .then((data) => setArticles(getPublicArticles(data)))
            .catch(() => setArticles(getPublicArticles([])));
    }, []);

    useEffect(() => {
        fetch(`${API_URL}/trending-topics`)
            .then((response) => response.ok ? response.json() : Promise.reject(new Error('Trending API unavailable')))
            .then((data) => setTrendingTopics(Array.isArray(data) && data.length ? data : TRENDING_TOPICS))
            .catch(() => setTrendingTopics(TRENDING_TOPICS));
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    const selectedArticle = useMemo(() => findArticleBySlug(articles, slug), [articles, slug]);
    const listJsonLd = useMemo(() => ({
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'CryptoCardiac Articles',
        url: `${SITE_URL}/featured-articles`,
        description: 'Original cryptocurrency education, risk explainers, and community-signal guides from CryptoCardiac.',
        publisher: {
            '@type': 'Organization',
            name: 'CryptoCardiac',
            url: SITE_URL
        },
        blogPost: articles.map((article) => ({
            '@type': 'BlogPosting',
            headline: article.title,
            url: getArticleUrl(article),
            dateModified: article.updated_at
        }))
    }), [articles]);

    return (
        <div style={pageShell}>
            <style>{`
                .cc-article-card:hover {
                    transform: translateY(-4px);
                    background: rgba(255,255,255,0.065) !important;
                    border-color: rgba(206,52,234,0.28) !important;
                }
                @media (prefers-reduced-motion: reduce) {
                    .cc-article-card { transition: none !important; }
                    .cc-article-card:hover { transform: none !important; }
                }
            `}</style>

            {!slug && (
                <Helmet>
                    <title>Crypto Articles & Education | CryptoCardiac</title>
                    <meta name="description" content="Read original CryptoCardiac guides about cryptocurrency community signals, market trends, exchange risk, privacy, wallets, and blockchain education." />
                    <meta name="keywords" content="crypto articles, cryptocurrency education, crypto risk, blockchain privacy, crypto voting, market trends" />
                    <meta property="og:title" content="Crypto Articles & Education | CryptoCardiac" />
                    <meta property="og:description" content="Original educational crypto guides from CryptoCardiac, written for readers who want context before chasing market noise." />
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content={`${SITE_URL}/featured-articles`} />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content="Crypto Articles & Education | CryptoCardiac" />
                    <meta name="twitter:description" content="Original cryptocurrency education, privacy, exchange, and risk guides from CryptoCardiac." />
                    <link rel="canonical" href={`${SITE_URL}/featured-articles`} />
                    <script type="application/ld+json">{JSON.stringify(listJsonLd)}</script>
                </Helmet>
            )}

            <Navbar />

            {!slug && (
                <header style={{
                    background: 'linear-gradient(135deg, #5700F9 0%, #CE34EA 100%)',
                    padding: isMobile ? '58px 20px' : '78px 20px',
                    textAlign: 'center',
                    borderBottom: '1px solid rgba(255,255,255,0.08)'
                }}>
                    <h1 style={{ color: '#fff', fontSize: isMobile ? '2.15rem' : '3rem', fontWeight: 900, margin: '0 0 16px', lineHeight: 1.12 }}>
                        CryptoCardiac Articles
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.92)', fontSize: isMobile ? '1rem' : '1.18rem', maxWidth: '760px', margin: '0 auto', lineHeight: 1.6 }}>
                        Original guides for understanding crypto communities, market signals, privacy, exchange risk, and safer research habits.
                    </p>
                </header>
            )}

            <main style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: slug ? (isMobile ? '42px 16px 80px' : '64px 20px 90px') : (isMobile ? '34px 16px 70px' : '46px 20px 90px'),
                display: slug || isMobile ? 'block' : 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) 340px',
                gap: '42px'
            }}>
                {slug ? (
                    selectedArticle ? <ArticleDetail article={selectedArticle} isMobile={isMobile} /> : <ArticleNotFound />
                ) : (
                    <>
                        <section>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '26px' }}>
                                <span style={{ width: '4px', height: '28px', background: '#CE34EA', borderRadius: '2px', display: 'inline-block' }} />
                                <h2 style={{ color: '#fff', fontSize: isMobile ? '1.42rem' : '1.85rem', margin: 0 }}>
                                    Original Crypto Guides
                                </h2>
                            </div>

                            {articles.map((article) => (
                                <ArticleCard key={article.slug} article={article} isMobile={isMobile} />
                            ))}
                        </section>

                        <aside style={{ marginTop: isMobile ? '42px' : 0 }}>
                            <div style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '12px',
                                padding: '24px',
                                position: isMobile ? 'static' : 'sticky',
                                top: '100px'
                            }}>
                                <h2 style={{ color: '#fff', fontSize: '1.08rem', margin: '0 0 18px' }}>Trending Topics</h2>
                                {trendingTopics.map((topic) => (
                                    <TrendingTopic key={topic.id || topic.title} title={topic.title} trend={topic.trend} />
                                ))}

                                <div style={{
                                    marginTop: '34px',
                                    paddingTop: '24px',
                                    borderTop: '1px solid rgba(255,255,255,0.08)'
                                }}>
                                    <h2 style={{ color: '#fff', fontSize: '1.08rem', margin: '0 0 14px' }}>Editorial Standards</h2>
                                    <p style={{ color: '#aaa', lineHeight: 1.7, fontSize: '0.92rem', margin: '0 0 14px' }}>
                                        CryptoCardiac articles are written for education, not promotion. We avoid guaranteed-return language and separate community attention from investment advice.
                                    </p>
                                    <Link to="/disclaimer" style={{ color: '#CE34EA', fontWeight: 700, textDecoration: 'none', fontSize: '0.92rem' }}>
                                        Read the full disclaimer
                                    </Link>
                                </div>

                                <div style={{
                                    marginTop: '26px',
                                    paddingTop: '24px',
                                    borderTop: '1px solid rgba(255,255,255,0.08)'
                                }}>
                                    <h2 style={{ color: '#fff', fontSize: '1.08rem', margin: '0 0 14px' }}>Research Checklist</h2>
                                    <ul style={{ color: '#aaa', lineHeight: 1.75, paddingLeft: '18px', margin: 0, fontSize: '0.92rem' }}>
                                        <li>Check liquidity and token distribution.</li>
                                        <li>Read project docs before trusting social claims.</li>
                                        <li>Compare short-term hype with longer-term activity.</li>
                                        <li>Never treat rankings as financial advice.</li>
                                    </ul>
                                </div>
                            </div>
                        </aside>
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Articles;
