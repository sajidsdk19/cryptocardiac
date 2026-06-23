export const FALLBACK_CRYPTOS = [
    {
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'btc',
        image: 'https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png',
        current_price: null,
        votes: 0
    },
    {
        id: 'ethereum',
        name: 'Ethereum',
        symbol: 'eth',
        image: 'https://coin-images.coingecko.com/coins/images/279/large/ethereum.png',
        current_price: null,
        votes: 0
    },
    {
        id: 'solana',
        name: 'Solana',
        symbol: 'sol',
        image: 'https://coin-images.coingecko.com/coins/images/4128/large/solana.png',
        current_price: null,
        votes: 0
    },
    {
        id: 'xrp',
        name: 'XRP',
        symbol: 'xrp',
        image: 'https://coin-images.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
        current_price: null,
        votes: 0
    },
    {
        id: 'dogecoin',
        name: 'Dogecoin',
        symbol: 'doge',
        image: 'https://coin-images.coingecko.com/coins/images/5/large/dogecoin.png',
        current_price: null,
        votes: 0
    },
    {
        id: 'shiba-inu',
        name: 'Shiba Inu',
        symbol: 'shib',
        image: 'https://coin-images.coingecko.com/coins/images/11939/large/shiba.png',
        current_price: null,
        votes: 0
    },
    {
        id: 'pepe',
        name: 'Pepe',
        symbol: 'pepe',
        image: 'https://coin-images.coingecko.com/coins/images/29850/large/pepe-token.jpeg',
        current_price: null,
        votes: 0
    },
    {
        id: 'monero',
        name: 'Monero',
        symbol: 'xmr',
        image: 'https://coin-images.coingecko.com/coins/images/69/large/monero_logo.png',
        current_price: null,
        votes: 0
    }
];

export const FALLBACK_TIME_VOTES = FALLBACK_CRYPTOS.reduce((acc, coin) => {
    acc[coin.id] = { votes_24h: 0, votes_7d: 0, votes_3m: 0 };
    return acc;
}, {});
