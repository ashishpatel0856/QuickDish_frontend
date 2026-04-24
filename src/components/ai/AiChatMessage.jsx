import { Bot, User, AlertCircle } from 'lucide-react';

const AiChatMessage = ({ message }) => {
  const { role, content, isError } = message;
  const isAi = role === 'ai';

  const formatContent = (text) => {
    return text
      .split('\n')
      .map((line, i) => {
        // Bold text
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Bullet points
        if (line.trim().startsWith('•')) {
          return `<li class="ml-4 my-1">${line.trim().substring(1)}</li>`;
        }
        return `<p class="my-1">${line}</p>`;
      })
      .join('');
  };

  return (
    <div className={`flex gap-3 ${isAi ? '' : 'flex-row-reverse'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isAi 
          ? 'bg-gradient-to-br from-orange-400 to-orange-600' 
          : 'bg-gradient-to-br from-gray-600 to-gray-800'
      }`}>
        {isAi ? (
          <Bot className="w-4 h-4 text-white" />
        ) : (
          <User className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Message Bubble */}
      <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
        isAi
          ? isError
            ? 'bg-red-50 text-red-700 border border-red-200'
            : 'bg-white text-gray-800 shadow-sm border border-gray-100'
          : 'bg-orange-500 text-white'
      } ${isAi ? 'rounded-tl-sm' : 'rounded-tr-sm'}`}>
        {isError && (
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4" />
            <span className="font-semibold">Error</span>
          </div>
        )}
        <div 
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: formatContent(content) }}
        />
      </div>
    </div>
  );
};

export default AiChatMessage;