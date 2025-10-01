import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiTrash2, FiTrendingUp, FiDollarSign, FiBarChart2 } from "react-icons/fi";
import { getInvestmentAdvice } from "../services/aiChatService";

// Message Component
const ChatMessage = ({ message, isUser }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-[#1a1a1a] text-gray-100 border border-gray-700"
        }`}
      >
        {!isUser && message.isTyping ? (
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
        ) : (
          <p className="text-sm md:text-base whitespace-pre-wrap break-words">{message.text}</p>
        )}
        <span className="text-xs opacity-60 mt-1 block">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
    </motion.div>
  );
};

// Quick Action Button Component
const QuickActionButton = ({ icon: Icon, text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-[#252525] border border-gray-700 rounded-lg text-sm text-gray-300 transition-colors"
    >
      <Icon className="text-blue-400" />
      <span>{text}</span>
    </button>
  );
};

// Main AI Advisor Component
const AIAdvisor = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI Investment Advisor. I can help you with:\n\n• Stock market analysis\n• Investment strategies\n• Portfolio diversification advice\n• Risk assessment\n• Market trends and insights\n\nWhat would you like to know about investing today?",
      isUser: false,
      timestamp: Date.now(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState({
    isSet: false,
    message: "",
  });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check API key status on mount
  useEffect(() => {
    // Check if OpenAI API key is configured
    const checkApiKey = async () => {
      try {
        // This will be set when the user configures their API key
        const hasKey = import.meta.env.VITE_OPENAI_API_KEY &&
                      import.meta.env.VITE_OPENAI_API_KEY !== "your_api_key_here";

        setApiKeyStatus({
          isSet: hasKey,
          message: hasKey ? "" : "Please set your OpenAI API key in .env file",
        });
      } catch (error) {
        setApiKeyStatus({
          isSet: false,
          message: "API configuration error",
        });
      }
    };
    checkApiKey();
  }, []);

  // Handle sending messages
  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: messageText,
      isUser: true,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Show typing indicator
    const typingMessage = {
      id: Date.now() + 1,
      text: "",
      isUser: false,
      timestamp: Date.now(),
      isTyping: true,
    };
    setMessages((prev) => [...prev, typingMessage]);

    try {
      // Get AI response
      const response = await getInvestmentAdvice(messageText, messages);

      // Remove typing indicator and add actual response
      setMessages((prev) => {
        const filtered = prev.filter((msg) => !msg.isTyping);
        return [
          ...filtered,
          {
            id: Date.now() + 2,
            text: response,
            isUser: false,
            timestamp: Date.now(),
          },
        ];
      });
    } catch (error) {
      console.error("Error getting AI response:", error);

      // Remove typing indicator and show error
      setMessages((prev) => {
        const filtered = prev.filter((msg) => !msg.isTyping);
        return [
          ...filtered,
          {
            id: Date.now() + 2,
            text: "I apologize, but I'm having trouble connecting right now. Please make sure your API key is configured correctly in the .env file. Error: " + error.message,
            isUser: false,
            timestamp: Date.now(),
          },
        ];
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Clear chat
  const handleClearChat = () => {
    setMessages([
      {
        id: 1,
        text: "Chat cleared. What would you like to know about investing?",
        isUser: false,
        timestamp: Date.now(),
      },
    ]);
  };

  // Quick action handlers
  const quickActions = [
    {
      icon: FiTrendingUp,
      text: "Analyze market trends",
      prompt: "What are the current market trends I should be aware of?",
    },
    {
      icon: FiDollarSign,
      text: "Investment strategies",
      prompt: "What are some good investment strategies for a beginner with moderate risk tolerance?",
    },
    {
      icon: FiBarChart2,
      text: "Portfolio advice",
      prompt: "How should I diversify my investment portfolio?",
    },
  ];

  return (
    <section className="min-h-screen pt-24 pb-12 c-space">
      <div className="w-full max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="head-text mb-2">AI Investment Advisor</h1>
          <p className="text-gray-400 mb-6">
            Get personalized investment advice and market analysis powered by AI
          </p>

          {!apiKeyStatus.isSet && (
            <div className="bg-yellow-900 bg-opacity-30 border border-yellow-600 rounded-lg p-4 mb-6">
              <p className="text-yellow-400 text-sm">
                <strong>⚠️ API Key Required:</strong> {apiKeyStatus.message}
              </p>
              <p className="text-yellow-300 text-xs mt-2">
                Create a <code>.env</code> file in your project root and add: <code>VITE_OPENAI_API_KEY=your_key_here</code>
                <br />
                Get your API key from{" "}
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-yellow-200"
                >
                  OpenAI Platform
                </a>
              </p>
            </div>
          )}

          {/* Chat Container */}
          <div className="bg-[#111] rounded-xl shadow-2xl border border-gray-800 overflow-hidden">
            {/* Chat Header */}
            <div className="bg-[#1a1a1a] border-b border-gray-800 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-white">Investment Chat</h2>
                <p className="text-xs text-gray-400">Powered by OpenAI GPT-4</p>
              </div>
              <button
                onClick={handleClearChat}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white text-sm flex items-center gap-2 transition-colors"
              >
                <FiTrash2 />
                Clear
              </button>
            </div>

            {/* Messages Area */}
            <div className="h-[500px] overflow-y-auto px-6 py-4 bg-[#0a0a0a]">
              <AnimatePresence>
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} isUser={message.isUser} />
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length <= 2 && (
              <div className="px-6 py-3 border-t border-gray-800 bg-[#0d0d0d]">
                <p className="text-xs text-gray-400 mb-2">Quick actions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action, index) => (
                    <QuickActionButton
                      key={index}
                      icon={action.icon}
                      text={action.text}
                      onClick={() => handleSendMessage(action.prompt)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="border-t border-gray-800 px-6 py-4 bg-[#1a1a1a]">
              <div className="flex gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about investments, stocks, or market analysis..."
                  disabled={isLoading || !apiKeyStatus.isSet}
                  className="flex-1 px-4 py-3 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={isLoading || !inputMessage.trim() || !apiKeyStatus.isSet}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg text-white transition-colors flex items-center gap-2"
                >
                  <FiSend />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 text-center text-gray-500 text-xs">
            <p>
              ⚠️ <strong>Disclaimer:</strong> This AI advisor provides general information and educational content only.
              It is not financial advice. Always consult with a qualified financial advisor before making investment decisions.
              Past performance does not guarantee future results.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AIAdvisor;
