import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  fetchMarketIndices, 
  fetchPopularStocks, 
  fetchCryptoData, 
  fetchMarketNews,
  calculateMarketSentiment
} from "../services/marketApiService";
import API_CONFIG from "../config/apiConfig";

// Dashboard Card Component
const DashboardCard = ({ title, children, className = "", isLoading = false }) => {
  return (
    <motion.div 
      className={`bg-[#111] rounded-xl p-4 shadow-lg ${className} relative`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      <h3 className="text-lg font-semibold mb-3 text-white border-b border-gray-700 pb-2">{title}</h3>
      {children}
    </motion.div>
  );
};

// Market Dashboard Component
const MarketDashboard = () => {
  const [marketData, setMarketData] = useState({
    indices: [],
    popularStocks: [],
    crypto: [],
    news: [],
    sentiment: {
      overall: "Loading...",
      fear: 50,
      volatility: "Moderate",
      trend: "Analyzing"
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [sectionLoading, setSectionLoading] = useState({
    indices: true,
    stocks: true,
    crypto: true,
    news: true
  });
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [apiKeyStatus, setApiKeyStatus] = useState({
    isSet: API_CONFIG.ALPHA_VANTAGE_API_KEY !== "YOUR_API_KEY_HERE",
    message: ""
  });

  // Function to fetch all market data
  const fetchAllMarketData = async () => {
    setIsLoading(true);
    
    // Check if API key is set
    if (!apiKeyStatus.isSet) {
      setApiKeyStatus({
        isSet: false,
        message: "Please set your API key in src/config/apiConfig.js"
      });
      setIsLoading(false);
      return;
    }
    
    try {
      // Fetch indices
      setSectionLoading(prev => ({ ...prev, indices: true }));
      const indicesData = await fetchMarketIndices().catch(err => {
        console.error("Error fetching indices:", err);
        return [];
      });
      setSectionLoading(prev => ({ ...prev, indices: false }));
      
      // Fetch stocks
      setSectionLoading(prev => ({ ...prev, stocks: true }));
      const stocksData = await fetchPopularStocks().catch(err => {
        console.error("Error fetching stocks:", err);
        return [];
      });
      setSectionLoading(prev => ({ ...prev, stocks: false }));
      
      // Fetch crypto
      setSectionLoading(prev => ({ ...prev, crypto: true }));
      const cryptoData = await fetchCryptoData().catch(err => {
        console.error("Error fetching crypto:", err);
        return [];
      });
      setSectionLoading(prev => ({ ...prev, crypto: false }));
      
      // Fetch news
      setSectionLoading(prev => ({ ...prev, news: true }));
      const newsData = await fetchMarketNews().catch(err => {
        console.error("Error fetching news:", err);
        return [];
      });
      setSectionLoading(prev => ({ ...prev, news: false }));
      
      // Calculate sentiment
      const sentimentData = calculateMarketSentiment(indicesData, stocksData);
      
      // Update state with all data
      setMarketData({
        indices: indicesData,
        popularStocks: stocksData,
        crypto: cryptoData,
        news: newsData,
        sentiment: sentimentData
      });
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching market data:", error);
      setApiKeyStatus({
        isSet: true,
        message: "API error: " + error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    if (apiKeyStatus.isSet) {
      fetchAllMarketData();
    }
  }, [apiKeyStatus.isSet]);

  // Format timestamp
  const formatLastUpdated = () => {
    return lastUpdated.toLocaleTimeString();
  };

  return (
    <section className="min-h-screen pt-24 pb-12 c-space">
      <div className="w-full">
        <h1 className="head-text mb-2">Market Dashboard</h1>
        
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <p className="text-gray-400">
              Last updated: {formatLastUpdated()}
            </p>
            {!apiKeyStatus.isSet && (
              <p className="text-red-500 text-sm mt-1">
                {apiKeyStatus.message || "Please set your API key in src/config/apiConfig.js"}
              </p>
            )}
            {apiKeyStatus.isSet && apiKeyStatus.message && (
              <p className="text-yellow-500 text-sm mt-1">{apiKeyStatus.message}</p>
            )}
          </div>
          <button 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white flex items-center w-full sm:w-auto justify-center"
            onClick={fetchAllMarketData}
            disabled={isLoading || !apiKeyStatus.isSet}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Refreshing...
              </>
            ) : "Refresh Data"}
          </button>
        </div>
        
        {/* Market Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <DashboardCard 
            title="Market Indices" 
            className="lg:col-span-2"
            isLoading={sectionLoading.indices}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {marketData.indices.length > 0 ? (
                marketData.indices.map((index) => (
                  <div key={index.symbol} className="bg-[#1a1a1a] p-3 rounded-lg">
                    <p className="text-lg font-medium text-white">{index.name}</p>
                    <p className="text-xl font-bold text-white">{index.price}</p>
                    <p className={`${index.color} font-medium`}>{index.change}</p>
                  </div>
                ))
              ) : !sectionLoading.indices ? (
                <div className="col-span-full text-center py-4 text-gray-300">
                  {apiKeyStatus.isSet ? "No index data available" : "Enter your API key to load data"}
                </div>
              ) : null}
            </div>
          </DashboardCard>
          
          <DashboardCard 
            title="Market Sentiment"
            isLoading={sectionLoading.indices || sectionLoading.stocks}
          >
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Overall:</span>
                <span className={`font-bold ${
                  marketData.sentiment.overall.includes("Bullish") ? "text-green-500" :
                  marketData.sentiment.overall.includes("Bearish") ? "text-red-500" :
                  "text-yellow-500"
                }`}>
                  {marketData.sentiment.overall}
                </span>
              </div>
              <div>
                <p className="text-gray-300 mb-1">Fear & Greed Index: {marketData.sentiment.fear}/100</p>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      marketData.sentiment.fear < 25 ? "bg-red-600" : 
                      marketData.sentiment.fear < 45 ? "bg-orange-500" :
                      marketData.sentiment.fear < 55 ? "bg-yellow-400" :
                      marketData.sentiment.fear < 75 ? "bg-lime-500" : "bg-green-500"
                    }`} 
                    style={{ width: `${marketData.sentiment.fear}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Volatility:</span>
                <span className={`${
                  marketData.sentiment.volatility === "High" ? "text-red-500" :
                  marketData.sentiment.volatility === "Moderate" ? "text-yellow-500" :
                  "text-green-500"
                }`}>
                  {marketData.sentiment.volatility}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Trend:</span>
                <span className={`${
                  marketData.sentiment.trend === "Upward" ? "text-green-500" :
                  marketData.sentiment.trend === "Downward" ? "text-red-500" :
                  "text-yellow-500"
                }`}>
                  {marketData.sentiment.trend}
                </span>
              </div>
            </div>
          </DashboardCard>
        </div>
        
        {/* Popular Stocks */}
        <DashboardCard 
          title="Popular Stocks" 
          className="mb-8"
          isLoading={sectionLoading.stocks}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 px-3 text-white">Symbol</th>
                  <th className="text-left py-2 px-3 text-white">Name</th>
                  <th className="text-right py-2 px-3 text-white">Price</th>
                  <th className="text-right py-2 px-3 text-white">Change</th>
                </tr>
              </thead>
              <tbody>
                {marketData.popularStocks.length > 0 ? (
                  marketData.popularStocks.map((stock) => (
                    !stock.error && (
                      <tr key={stock.symbol} className="border-b border-gray-800 hover:bg-gray-800">
                        <td className="py-2 px-3 font-medium text-white">{stock.symbol}</td>
                        <td className="py-2 px-3 text-gray-300">{stock.name}</td>
                        <td className="py-2 px-3 text-right text-white">${stock.price}</td>
                        <td className={`py-2 px-3 text-right ${stock.color}`}>{stock.change}</td>
                      </tr>
                    )
                  ))
                ) : !sectionLoading.stocks ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-300">
                      {apiKeyStatus.isSet ? "No stock data available" : "Enter your API key to load data"}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </DashboardCard>
        
        {/* News and Cryptocurrency */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardCard 
            title="Latest Market News"
            isLoading={sectionLoading.news}
          >
            <div className="space-y-4">
              {marketData.news.length > 0 ? (
                marketData.news.map((item, index) => (
                  <a 
                    key={index} 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block p-3 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <h4 className="font-medium text-white">{item.title}</h4>
                    <div className="flex justify-between mt-2 text-sm">
                      <span className="text-gray-400">{item.source}</span>
                      <span className="text-gray-500">{item.time}</span>
                    </div>
                  </a>
                ))
              ) : !sectionLoading.news ? (
                <div className="text-center py-4 text-gray-300">
                  {apiKeyStatus.isSet ? "No news available" : "Enter your API key to load news"}
                </div>
              ) : null}
            </div>
          </DashboardCard>
          
          <DashboardCard 
            title="Cryptocurrency Markets"
            isLoading={sectionLoading.crypto}
          >
            <div className="overflow-y-auto max-h-96">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 px-3 text-white">Name</th>
                    <th className="text-right py-2 px-3 text-white">Price</th>
                    <th className="text-right py-2 px-3 text-white">24h</th>
                  </tr>
                </thead>
                <tbody>
                  {marketData.crypto.length > 0 ? (
                    marketData.crypto.map((crypto) => (
                      <tr key={crypto.symbol} className="border-b border-gray-800 hover:bg-gray-800">
                        <td className="py-2 px-3">
                          <div className="flex items-center">
                            <span className="ml-2 text-white">{crypto.name}</span>
                            <span className="ml-1 text-gray-400 text-xs">({crypto.symbol})</span>
                          </div>
                        </td>
                        <td className="py-2 px-3 text-right text-white">${crypto.price}</td>
                        <td className={`py-2 px-3 text-right ${crypto.color}`}>{crypto.change}</td>
                      </tr>
                    ))
                  ) : !sectionLoading.crypto ? (
                    <tr>
                      <td colSpan="3" className="text-center py-4 text-gray-300">
                        {apiKeyStatus.isSet ? "No cryptocurrency data available" : "Enter your API key to load data"}
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </DashboardCard>
        </div>
        
        <div className="mt-10 text-center text-gray-400 text-sm">
          <p>This dashboard uses the Alpha Vantage API for financial market data.</p>
          {!apiKeyStatus.isSet && (
            <a 
              href="https://www.alphavantage.co/support/#api-key" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-block mt-2 text-blue-400 hover:underline"
            >
              Get a free Alpha Vantage API key →
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default MarketDashboard; 