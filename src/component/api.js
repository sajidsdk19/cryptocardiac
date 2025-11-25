import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAllCurrencies = async (vs_currency = 'usd') => {
  try {
    // Use our backend proxy instead of direct CoinGecko call
    const response = await axios.get(`${API_URL}/coins`, {
      params: {
        vs_currency,
        order: 'market_cap_desc',
        per_page: 100,
        page: 1,
        sparkline: false
      }
    });

    // Cache the successful response
    localStorage.setItem('cachedCryptos', JSON.stringify({
      data: response.data,
      timestamp: Date.now()
    }));

    return response.data;
  } catch (error) {
    console.error('Error fetching currencies:', error);

    // Fallback to cache if available
    const cached = localStorage.getItem('cachedCryptos');
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      // Use cache if less than 1 hour old (extended fallback)
      if (Date.now() - timestamp < 60 * 60 * 1000) {
        console.log('Using cached data due to API error');
        return data;
      }
    }

    throw error;
  }
};

const getCoinData = async (coin) => {
  const apiLink = `https://api.coingecko.com/api/v3/coins/${coin}`;
  const response = await axios.get(apiLink);
  return response.data;
}

const search = async (searchValue) => {
  const apiLink = `https://api.coingecko.com/api/v3/search?query=${searchValue}`;
  const response = await axios.get(apiLink);
  return response.data;
}

const searchCoins = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/coins/search`, {
      params: { query }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching coins:', error);
    throw error;
  }
};

const getCoinDetails = async (coinIds, vs_currency = 'usd') => {
  try {
    const response = await axios.get(`${API_URL}/coins/details`, {
      params: {
        ids: coinIds,
        vs_currency
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching coin details:', error);
    throw error;
  }
};

export { getAllCurrencies, getCoinData, search, searchCoins, getCoinDetails };
