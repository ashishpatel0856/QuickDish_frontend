import { useState, useRef, useEffect } from 'react';
import { X, Send, Trash2, Sparkles } from 'lucide-react';
import { useAi } from '../../context/AiContext';
import { useAiChat } from '../../hooks/useAiChat';
import AiChatMessage from './AiChatMessage';
import AiTypingIndicator from './AiTypingIndicator';

const AiChatModal = () => {
  const { isChatOpen, closeChat, clearMessages } = useAi();
  const { messages, isLoading, sendMessage } = useAiChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isChatOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isChatOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const msg = input.trim();
    setInput('');
    sendMessage(msg);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!isChatOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
        onClick={closeChat}
      />

      {/* Chat Modal */}
      <div className="fixed bottom-0 right-0 lg:bottom-4 lg:right-4 w-full lg:w-[420px] h-[100dvh] lg:h-[550px] bg-white lg:rounded-2xl shadow-2xl border-0 lg:border border-gray-200 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">QuickDish AI</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-orange-100">Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearMessages}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={closeChat}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/80">
          {messages.map((msg) => (
            <AiChatMessage key={msg.id} message={msg} />
          ))}
          {isLoading && <AiTypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions */}
        {!isLoading && messages.length <= 2 && (
          <div className="px-4 py-2 bg-white border-t border-gray-100 flex-shrink-0">
            <p className="text-xs text-gray-500 mb-2 font-medium">Quick suggestions:</p>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {[
                "Best biryani near me",
                "Cheap pizza under 300 rupees",
                "Track my order",
                "Vegan restaurants"
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => sendMessage(suggestion)}
                  className="flex-shrink-0 px-3 py-1.5 bg-orange-50 text-orange-600 text-xs rounded-full hover:bg-orange-100 transition-colors border border-orange-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <form 
          onSubmit={handleSubmit}
          className="p-4 bg-white border-t border-gray-100 flex-shrink-0"
        >
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about food, restaurants, orders..."
                className="w-full px-4 py-3 pr-10 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:bg-white transition-all"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-orange-500/30 active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-center">
            QuickDish AI may make mistakes. Verify important info.
          </p>
        </form>
      </div>
    </>
  );
};

export default AiChatModal;