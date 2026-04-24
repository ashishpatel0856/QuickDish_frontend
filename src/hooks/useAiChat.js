import { useCallback } from 'react';
import { useAi } from '../context/AiContext';
import { aiAPI } from '../api/ai';

export const useAiChat = () => {
  const {
    sessionId,
    messages,
    isLoading,
    addMessage,
    setChatSessionId,
    setChatLoading
  } = useAi();

  const sendMessage = useCallback(async (message) => {
    if (!message.trim() || isLoading) return;

    // Add user message immediately
    addMessage({
      role: 'user',
      content: message.trim(),
      timestamp: new Date().toISOString()
    });

    setChatLoading(true);

    try {
      const response = await aiAPI.chat(message.trim(), sessionId);
      const data = response.data;

      // Save session ID for conversation continuity
      if (data.sessionId) {
        setChatSessionId(data.sessionId);
      }

      // Add AI response
      addMessage({
        role: 'ai',
        content: data.response,
        timestamp: data.timestamp || new Date().toISOString()
      });

    } catch (error) {
      console.error('AI Chat Error:', error);
      addMessage({
        role: 'ai',
        content: " Sorry, I'm having trouble connecting right now. Please try again in a moment!",
        timestamp: new Date().toISOString(),
        isError: true
      });
    } finally {
      setChatLoading(false);
    }
  }, [sessionId, isLoading, addMessage, setChatSessionId, setChatLoading]);

  return {
    messages,
    isLoading,
    sendMessage,
    sessionId
  };
};

export default useAiChat;