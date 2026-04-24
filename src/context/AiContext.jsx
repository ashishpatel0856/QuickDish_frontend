import { createContext, useContext, useState, useCallback } from 'react';

const AiContext = createContext(null);

export const AiProvider = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'ai',
      content: "👋 Hi! I'm **QuickDish AI**\n\nI can help you with:\n• 🍕 Finding restaurants\n• 🛒 Ordering food  \n• 📍 Tracking deliveries\n• 💰 Finding best deals\n\nWhat would you like to eat today?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleChat = useCallback(() => {
    setIsChatOpen(prev => !prev);
  }, []);

  const closeChat = useCallback(() => {
    setIsChatOpen(false);
  }, []);

  const openChat = useCallback(() => {
    setIsChatOpen(true);
  }, []);

  const addMessage = useCallback((message) => {
    setMessages(prev => [...prev, { ...message, id: Date.now().toString() }]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'ai',
        content: "👋 Hi! I'm **QuickDish AI**\n\nI can help you with:\n• 🍕 Finding restaurants\n• 🛒 Ordering food\n• 📍 Tracking deliveries\n• 💰 Finding best deals\n\nWhat would you like to eat today?",
        timestamp: new Date().toISOString()
      }
    ]);
    setSessionId(null);
  }, []);

  const setChatSessionId = useCallback((id) => {
    setSessionId(id);
  }, []);

  const setChatLoading = useCallback((loading) => {
    setIsLoading(loading);
  }, []);

  return (
    <AiContext.Provider value={{
      isChatOpen,
      sessionId,
      messages,
      isLoading,
      toggleChat,
      closeChat,
      openChat,
      addMessage,
      clearMessages,
      setChatSessionId,
      setChatLoading
    }}>
      {children}
    </AiContext.Provider>
  );
};

export const useAi = () => {
  const context = useContext(AiContext);
  if (!context) {
    throw new Error('useAi must be used within AiProvider');
  }
  return context;
};

export default AiContext;