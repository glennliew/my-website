/**
 * AI Chat Service for Investment Advice
 *
 * This service handles communication with the OpenAI API
 * to provide investment advice and market analysis.
 */

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

/**
 * Get investment advice from OpenAI
 * @param {string} userMessage - The user's question or prompt
 * @param {Array} conversationHistory - Previous messages in the conversation
 * @returns {Promise<string>} - The AI's response
 */
export const getInvestmentAdvice = async (userMessage, conversationHistory = []) => {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === "your_api_key_here") {
    throw new Error("OpenAI API key not configured. Please set VITE_OPENAI_API_KEY in your .env file.");
  }

  // Build conversation context with system message first
  const messages = [
    {
      role: "system",
      content: `You are an expert AI investment advisor with deep knowledge of stock markets, investment strategies, portfolio management, and financial analysis. Your role is to:

1. Provide educational information about investing and financial markets
2. Analyze market trends and economic indicators
3. Suggest diversification strategies and risk management approaches
4. Explain investment concepts in clear, accessible language
5. Help users understand different asset classes and investment vehicles

Important guidelines:
- Always emphasize that you provide educational information, not personalized financial advice
- Remind users to consult with licensed financial advisors before making investment decisions
- Discuss both risks and potential rewards of investment strategies
- Base your analysis on fundamental and technical analysis principles
- Stay current with market trends and economic conditions
- Be objective and avoid promoting specific stocks or financial products
- Acknowledge uncertainty and market volatility
- Use disclaimers when discussing specific investments

Your responses should be informative, balanced, and help users make more informed investment decisions while understanding the risks involved.`
    }
  ];

  // Add conversation history
  conversationHistory
    .filter(msg => !msg.isTyping) // Remove typing indicators
    .slice(-10) // Keep last 10 messages for context
    .forEach(msg => {
      messages.push({
        role: msg.isUser ? "user" : "assistant",
        content: msg.text
      });
    });

  // Add current message
  messages.push({
    role: "user",
    content: userMessage
  });

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: messages,
        max_tokens: 1024,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      throw new Error("Invalid response format from API");
    }

    return data.choices[0].message.content;

  } catch (error) {
    console.error("Error calling OpenAI API:", error);

    if (error.message.includes("API key") || error.message.includes("401")) {
      throw new Error("Invalid API key. Please check your OpenAI API key configuration.");
    }

    if (error.message.includes("network") || error.message.includes("fetch")) {
      throw new Error("Network error. Please check your internet connection.");
    }

    throw error;
  }
};

/**
 * Get stock analysis from OpenAI
 * @param {string} stockSymbol - The stock symbol to analyze
 * @param {Object} marketData - Current market data for the stock
 * @returns {Promise<string>} - The AI's analysis
 */
export const getStockAnalysis = async (stockSymbol, marketData = {}) => {
  const prompt = `Please provide a brief analysis of ${stockSymbol} stock. ${
    marketData.price ? `Current price: $${marketData.price}. ` : ""
  }${
    marketData.change ? `Today's change: ${marketData.change}. ` : ""
  }Include key factors investors should consider, potential risks, and general market sentiment.`;

  return await getInvestmentAdvice(prompt, []);
};

/**
 * Get portfolio diversification advice
 * @param {Object} portfolioData - User's current portfolio information
 * @returns {Promise<string>} - Diversification recommendations
 */
export const getPortfolioAdvice = async (portfolioData) => {
  const prompt = `I'd like advice on diversifying my investment portfolio. ${
    portfolioData.riskTolerance ? `My risk tolerance is ${portfolioData.riskTolerance}. ` : ""
  }${
    portfolioData.timeHorizon ? `Investment time horizon: ${portfolioData.timeHorizon}. ` : ""
  }${
    portfolioData.currentAllocations ? `Current allocations: ${portfolioData.currentAllocations}. ` : ""
  }What diversification strategies would you recommend?`;

  return await getInvestmentAdvice(prompt, []);
};

export default {
  getInvestmentAdvice,
  getStockAnalysis,
  getPortfolioAdvice
};
