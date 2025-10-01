import API_CONFIG from "../config/apiConfig";

// Cache storage
const cache = new Map();
let lastRequestTime = 0;

/**
 * Handles API request throttling to avoid hitting rate limits
 */
const throttleRequest = () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < API_CONFIG.requestDelay) {
    return new Promise(resolve => {
      setTimeout(resolve, API_CONFIG.requestDelay - timeSinceLastRequest);
    });
  }
  
  return Promise.resolve();
};

/**
 * Updates the last request timestamp
 */
const updateRequestTimestamp = () => {
  lastRequestTime = Date.now();
};

/**
 * Get cached data if available and not expired
 * @param {string} cacheKey - The cache key
 * @returns {Object|null} - Cached data or null if not available
 */
const getCachedData = (cacheKey) => {
  if (!API_CONFIG.enableCaching) return null;
  
  const cachedItem = cache.get(cacheKey);
  if (!cachedItem) return null;
  
  const isExpired = Date.now() - cachedItem.timestamp > API_CONFIG.cacheExpiration;
  return isExpired ? null : cachedItem.data;
};

/**
 * Store data in cache
 * @param {string} cacheKey - The cache key
 * @param {Object} data - The data to cache
 */
const setCachedData = (cacheKey, data) => {
  if (!API_CONFIG.enableCaching) return;
  
  cache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
};

/**
 * Fetches stock quote data from Alpha Vantage API
 * @param {string} symbol - Stock symbol (e.g., AAPL, MSFT)
 * @returns {Promise<Object>} - Stock data
 */
export const fetchStockQuote = async (symbol) => {
  const cacheKey = `stock-quote-${symbol}`;
  const cachedData = getCachedData(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }
  
  await throttleRequest();
  
  try {
    const url = `${API_CONFIG.ALPHA_VANTAGE_BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_CONFIG.ALPHA_VANTAGE_API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    updateRequestTimestamp();
    
    // Format the data
    const formattedData = formatStockQuote(data);
    setCachedData(cacheKey, formattedData);
    
    return formattedData;
  } catch (error) {
    console.error(`Error fetching stock quote for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Fetches market indices data
 * @returns {Promise<Array>} - Array of index data
 */
export const fetchMarketIndices = async () => {
  const indices = ["SPY", "DIA", "QQQ", "IWM"]; // ETFs that track major indices
  const cacheKey = "market-indices";
  const cachedData = getCachedData(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }
  
  try {
    const indicesData = await Promise.all(
      indices.map(async (symbol) => {
        await throttleRequest();
        const url = `${API_CONFIG.ALPHA_VANTAGE_BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_CONFIG.ALPHA_VANTAGE_API_KEY}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        updateRequestTimestamp();
        return data;
      })
    );
    
    // Map the ETFs to their corresponding indices for display
    const indexMap = {
      SPY: { name: "S&P 500", symbol: "SPX" },
      DIA: { name: "Dow Jones", symbol: "DJI" },
      QQQ: { name: "Nasdaq", symbol: "IXIC" },
      IWM: { name: "Russell 2000", symbol: "RUT" }
    };
    
    // Format the data
    const formattedData = indicesData.map((data, index) => {
      const symbol = indices[index];
      const indexInfo = indexMap[symbol];
      return formatIndexData(data, indexInfo);
    });
    
    setCachedData(cacheKey, formattedData);
    return formattedData;
  } catch (error) {
    console.error("Error fetching market indices:", error);
    throw error;
  }
};

/**
 * Fetches cryptocurrency data
 * @returns {Promise<Array>} - Array of cryptocurrency data
 */
export const fetchCryptoData = async () => {
  const cryptos = ["BTC", "ETH", "BNB", "XRP", "SOL", "ADA", "DOGE", "MATIC", "SHIB", "DOT"];
  const cacheKey = "crypto-data";
  const cachedData = getCachedData(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }
  
  try {
    const cryptoData = await Promise.all(
      cryptos.map(async (symbol) => {
        await throttleRequest();
        const url = `${API_CONFIG.ALPHA_VANTAGE_BASE_URL}?function=CURRENCY_EXCHANGE_RATE&from_currency=${symbol}&to_currency=USD&apikey=${API_CONFIG.ALPHA_VANTAGE_API_KEY}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        updateRequestTimestamp();
        return { symbol, data };
      })
    );
    
    // Format the data
    const formattedData = cryptoData.map(({ symbol, data }) => formatCryptoData(data, symbol));
    setCachedData(cacheKey, formattedData);
    
    return formattedData;
  } catch (error) {
    console.error("Error fetching crypto data:", error);
    throw error;
  }
};

/**
 * Fetches latest market news
 * @returns {Promise<Array>} - Array of news items
 */
export const fetchMarketNews = async () => {
  const cacheKey = "market-news";
  const cachedData = getCachedData(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }
  
  await throttleRequest();
  
  try {
    const url = `${API_CONFIG.ALPHA_VANTAGE_BASE_URL}?function=NEWS_SENTIMENT&topics=financial_markets&apikey=${API_CONFIG.ALPHA_VANTAGE_API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    updateRequestTimestamp();
    
    // Format the news data
    const formattedData = formatNewsData(data);
    setCachedData(cacheKey, formattedData);
    
    return formattedData;
  } catch (error) {
    console.error("Error fetching market news:", error);
    throw error;
  }
};

/**
 * Fetches data for all popular stocks
 * @param {Array} symbols - Array of stock symbols
 * @returns {Promise<Array>} - Array of stock data
 */
export const fetchPopularStocks = async (symbols = ["AAPL", "MSFT", "AMZN", "NVDA", "TSLA", "VOO", "VVV", "META"]) => {
  const cacheKey = "popular-stocks";
  const cachedData = getCachedData(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }
  
  try {
    const stockData = await Promise.all(
      symbols.map(symbol => fetchStockQuote(symbol))
    );
    
    setCachedData(cacheKey, stockData);
    return stockData;
  } catch (error) {
    console.error("Error fetching popular stocks:", error);
    throw error;
  }
};

// Helper functions to format API responses

/**
 * Formats stock quote data from Alpha Vantage
 * @param {Object} data - Raw API response
 * @returns {Object} - Formatted stock data
 */
const formatStockQuote = (data) => {
  try {
    const quote = data["Global Quote"];
    
    if (!quote || Object.keys(quote).length === 0) {
      return { error: "No data available" };
    }
    
    const price = parseFloat(quote["05. price"]).toFixed(2);
    const change = parseFloat(quote["09. change"]).toFixed(2);
    const changePercent = quote["10. change percent"].replace("%", "");
    
    // Determine if the stock is up or down
    const isPositive = parseFloat(change) >= 0;
    
    return {
      symbol: quote["01. symbol"],
      name: getCompanyNameFromSymbol(quote["01. symbol"]),
      price: price,
      change: `${isPositive ? "+" : ""}${changePercent}%`,
      color: isPositive ? "text-green-500" : "text-red-500"
    };
  } catch (error) {
    console.error("Error formatting stock quote:", error);
    return { error: "Failed to format data" };
  }
};

/**
 * Formats index data from Alpha Vantage
 * @param {Object} data - Raw API response
 * @param {Object} indexInfo - Index name and symbol information
 * @returns {Object} - Formatted index data
 */
const formatIndexData = (data, indexInfo) => {
  try {
    const quote = data["Global Quote"];
    
    if (!quote || Object.keys(quote).length === 0) {
      return {
        name: indexInfo.name,
        symbol: indexInfo.symbol,
        price: "N/A",
        change: "N/A",
        color: "text-gray-500"
      };
    }
    
    const price = parseFloat(quote["05. price"]).toFixed(2);
    const change = parseFloat(quote["09. change"]).toFixed(2);
    const changePercent = quote["10. change percent"].replace("%", "");
    
    // Determine if the index is up or down
    const isPositive = parseFloat(change) >= 0;
    
    return {
      name: indexInfo.name,
      symbol: indexInfo.symbol,
      price: addCommasToNumber(price),
      change: `${isPositive ? "+" : ""}${changePercent}%`,
      color: isPositive ? "text-green-500" : "text-red-500"
    };
  } catch (error) {
    console.error("Error formatting index data:", error);
    return {
      name: indexInfo.name,
      symbol: indexInfo.symbol,
      price: "N/A",
      change: "N/A",
      color: "text-gray-500"
    };
  }
};

/**
 * Formats cryptocurrency data from Alpha Vantage
 * @param {Object} data - Raw API response
 * @param {string} symbol - Cryptocurrency symbol
 * @returns {Object} - Formatted cryptocurrency data
 */
const formatCryptoData = (data, symbol) => {
  try {
    const exchangeRate = data["Realtime Currency Exchange Rate"];
    
    if (!exchangeRate || Object.keys(exchangeRate).length === 0) {
      return {
        name: getCryptoNameFromSymbol(symbol),
        symbol: symbol,
        price: "N/A",
        change: "N/A",
        color: "text-gray-500"
      };
    }
    
    const price = parseFloat(exchangeRate["5. Exchange Rate"]);
    
    // Alpha Vantage doesn't provide 24h change in this endpoint
    // In a real implementation, you would need to make additional API calls
    // or use a different endpoint/service for change data
    // For now, we'll generate mock change data
    const mockChange = generateMockChangeData();
    
    return {
      name: exchangeRate["2. From_Currency Name"] || getCryptoNameFromSymbol(symbol),
      symbol: symbol,
      price: formatCryptoPrice(price),
      change: mockChange.change,
      color: mockChange.color
    };
  } catch (error) {
    console.error("Error formatting crypto data:", error);
    return {
      name: getCryptoNameFromSymbol(symbol),
      symbol: symbol,
      price: "N/A",
      change: "N/A",
      color: "text-gray-500"
    };
  }
};

/**
 * Formats news data from Alpha Vantage
 * @param {Object} data - Raw API response
 * @returns {Array} - Formatted news articles
 */
const formatNewsData = (data) => {
  try {
    const articles = data.feed || [];
    
    return articles.slice(0, 5).map(article => ({
      title: article.title,
      source: article.source,
      url: article.url,
      time: formatTimeAgo(new Date(article.time_published))
    }));
  } catch (error) {
    console.error("Error formatting news data:", error);
    return [];
  }
};

// Utility functions

/**
 * Adds commas to large numbers for display
 * @param {string|number} number - Number to format
 * @returns {string} - Formatted number with commas
 */
const addCommasToNumber = (number) => {
  return Number(number).toLocaleString('en-US');
};

/**
 * Formats cryptocurrency prices based on value
 * @param {number} price - Cryptocurrency price
 * @returns {string} - Formatted price
 */
const formatCryptoPrice = (price) => {
  if (price >= 1000) {
    return addCommasToNumber(price.toFixed(2));
  } else if (price >= 1) {
    return price.toFixed(4);
  } else if (price >= 0.0001) {
    return price.toFixed(6);
  } else {
    return price.toExponential(4);
  }
};

/**
 * Generates mock change data (positive or negative)
 * @returns {Object} - Change value and color
 */
const generateMockChangeData = () => {
  const isPositive = Math.random() > 0.3; // 70% chance of positive
  const changeValue = (Math.random() * (isPositive ? 5 : 3)).toFixed(2);
  
  return {
    change: `${isPositive ? "+" : "-"}${changeValue}%`,
    color: isPositive ? "text-green-500" : "text-red-500"
  };
};

/**
 * Formats time difference as "X time ago"
 * @param {Date} date - The date to format
 * @returns {string} - Formatted time ago string
 */
const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  
  return Math.floor(seconds) + " seconds ago";
};

/**
 * Maps stock symbols to company names
 * @param {string} symbol - Stock symbol
 * @returns {string} - Company name
 */
const getCompanyNameFromSymbol = (symbol) => {
  const companyMap = {
    "AAPL": "Apple Inc.",
    "MSFT": "Microsoft",
    "AMZN": "Amazon",
    "NVDA": "NVIDIA",
    "TSLA": "Tesla",
    "VOO": "Vanguard S&P 500 ETF",
    "VVV": "Vanguard Value ETF",
    "META": "Meta Platforms",
    // Add more as needed
  };
  
  return companyMap[symbol] || symbol;
};

/**
 * Maps crypto symbols to full names
 * @param {string} symbol - Crypto symbol
 * @returns {string} - Cryptocurrency name
 */
const getCryptoNameFromSymbol = (symbol) => {
  const cryptoMap = {
    "BTC": "Bitcoin",
    "ETH": "Ethereum",
    "BNB": "Binance Coin",
    "XRP": "XRP",
    "SOL": "Solana",
    "ADA": "Cardano",
    "DOGE": "Dogecoin",
    "MATIC": "Polygon",
    "SHIB": "Shiba Inu",
    "DOT": "Polkadot",
    // Add more as needed
  };
  
  return cryptoMap[symbol] || symbol;
};

/**
 * Calculates market sentiment based on available data
 * This is a simplified mock implementation
 * @param {Array} indices - Market indices data
 * @param {Array} stocks - Popular stocks data
 * @returns {Object} - Market sentiment data
 */
export const calculateMarketSentiment = (indices, stocks) => {
  try {
    // Count positive vs. negative changes
    const allData = [...indices, ...stocks].filter(item => !item.error);
    const positiveChanges = allData.filter(item => item.change?.startsWith("+")).length;
    const totalChanges = allData.length;
    
    const positivePercentage = (positiveChanges / totalChanges) * 100;
    
    let sentiment = "Neutral";
    if (positivePercentage >= 70) sentiment = "Bullish";
    else if (positivePercentage >= 55) sentiment = "Slightly Bullish";
    else if (positivePercentage <= 30) sentiment = "Bearish";
    else if (positivePercentage <= 45) sentiment = "Slightly Bearish";
    
    // Calculate the Fear & Greed value (0-100)
    // This is highly simplified - a real indicator would be much more complex
    const fearAndGreed = Math.round(positivePercentage);
    
    // Determine market volatility based on the changes
    const changeValues = allData
      .map(item => parseFloat(item.change?.replace("%", "").replace("+", "")))
      .filter(value => !isNaN(value));
    
    const avgChange = changeValues.reduce((sum, value) => sum + Math.abs(value), 0) / changeValues.length;
    
    let volatility = "Low";
    if (avgChange > 3) volatility = "High";
    else if (avgChange > 1.5) volatility = "Moderate";
    
    // Determine market trend
    const trend = positivePercentage > 50 ? "Upward" : "Downward";
    
    return {
      overall: sentiment,
      fear: fearAndGreed,
      volatility,
      trend
    };
  } catch (error) {
    console.error("Error calculating market sentiment:", error);
    return {
      overall: "Neutral",
      fear: 50,
      volatility: "Moderate",
      trend: "Stable"
    };
  }
}; 