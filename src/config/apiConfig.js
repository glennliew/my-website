/**
 * API Configuration File
 * 
 * This file contains all API keys and configuration settings for external services.
 * Update your API key in this single location to enable all market data features.
 */

const API_CONFIG = {
  // Alpha Vantage API Key (https://www.alphavantage.co/)
  ALPHA_VANTAGE_API_KEY: "E25XWDL49XIMY0TL",
  
  // API Base URLs
  ALPHA_VANTAGE_BASE_URL: "https://www.alphavantage.co/query",
  
  // Additional configurations
  enableCaching: true,
  cacheExpiration: 5 * 60 * 1000, // 5 minutes in milliseconds
  
  // Request throttling to avoid API limits
  requestDelay: 1000, // Delay between requests in milliseconds
};

export default API_CONFIG;