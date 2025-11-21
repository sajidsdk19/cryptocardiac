import axios from 'axios';

const getAllCurrencies = async (vsCurrency) => {
  const cacheKey = `cryptos_${vsCurrency}`;
  const cachedData = localStorage.getItem(cacheKey);
  const cacheTime = localStorage.getItem(`${cacheKey}_time`);

  // Use cache if less than 5 minutes old
  if (cachedData && cacheTime && (Date.now() - parseInt(cacheTime) < 5 * 60 * 1000)) {
    return JSON.parse(cachedData);
  }

  try {
    const apiLink = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vsCurrency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;
    const response = await axios.get(apiLink);

    // Update cache
    localStorage.setItem(cacheKey, JSON.stringify(response.data));
    localStorage.setItem(`${cacheKey}_time`, Date.now().toString());

    return response.data;
  } catch (error) {
    console.error('CoinGecko API Error:', error);
    // Fallback to cache if available, even if old
    if (cachedData) {
      console.warn('Using stale cache data due to API error');
      return JSON.parse(cachedData);
    }
    throw error;
  }
}

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

export { getAllCurrencies, getCoinData, search };
