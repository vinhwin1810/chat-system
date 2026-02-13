const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`py-6 px-4 ${isUser ? '' : 'bg-dark-sidebar'}`}>
      <div className="max-w-3xl mx-auto">
        <div className="flex gap-4">
          {/* Avatar/Label */}
          <div className="flex-shrink-0">
            <div className="text-xs font-semibold text-dark-text-secondary">
              {isUser ? 'You' : 'Assistant'}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="text-dark-text leading-relaxed whitespace-pre-wrap break-words">
              {message.content || (
                <span className="text-dark-text-secondary italic">Thinking...</span>
              )}
            </div>

            {/* Images */}
            {message.images && message.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {message.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={`http://localhost:5500${img.url}`}
                    alt="Uploaded"
                    className="max-w-xs max-h-64 rounded-lg object-cover border border-dark-border"
                  />
                ))}
              </div>
            )}

            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="flex flex-col gap-2 mt-3">
                {message.attachments.map((att, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-2 bg-dark-hover rounded-lg text-sm text-dark-text border border-dark-border"
                  >
                    <span>📄</span>
                    <span className="flex-1 truncate">{att.originalName}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Typing indicator */}
            {message.streaming && message.content && (
              <span className="inline-flex gap-1 mt-2">
                <span className="w-1 h-4 bg-dark-text-secondary animate-pulse"></span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
