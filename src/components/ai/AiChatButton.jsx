import { Bot, X } from 'lucide-react';
import { useAi } from '../../context/AiContext';

const AiChatButton = () => {
  const { isChatOpen, toggleChat, messages } = useAi();

  const unreadCount = messages.filter(m => m.role === 'ai').length;

  return (
    <button
      onClick={toggleChat}
      className={`relative p-2.5 rounded-full transition-all duration-300 ${
        isChatOpen
          ? 'bg-orange-100 text-orange-600 rotate-90'
          : 'bg-orange-50 text-orange-500 hover:bg-orange-100 hover:scale-110'
      }`}
      title="QuickDish AI Assistant"
    >
      {isChatOpen ? (
        <X className="w-5 h-5" />
      ) : (
        <Bot className="w-5 h-5" />
      )}
      
      {/* Notification Badge */}
      {!isChatOpen && unreadCount > 1 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}

      {/* Online indicator */}
      {!isChatOpen && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
      )}
    </button>
  );
};

export default AiChatButton;