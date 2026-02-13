import { useState, useRef } from "react";
import { ArrowUp, Paperclip } from "lucide-react";

const ChatInput = ({ onSend, disabled }) => {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() || files.length > 0) {
      onSend(message, files);
      setMessage("");
      setFiles([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInput = (e) => {
    setMessage(e.target.value);
    // Auto-resize textarea
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  return (
    <div className="border-t border-dark-border bg-dark-bg">
      <div className="max-w-3xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end gap-2 bg-dark-sidebar border border-dark-border rounded-2xl p-2 focus-within:border-dark-text-secondary transition-colors">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*,.txt,.pdf,.doc,.docx,.md"
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="p-2 text-dark-text-secondary hover:text-dark-text transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Attach files"
            >
              <Paperclip size={20} />
            </button>
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Message..."
              rows={1}
              disabled={disabled}
              className="flex-1 bg-transparent text-dark-text placeholder-dark-text-secondary resize-none outline-none max-h-32 py-2 disabled:opacity-50"
              style={{ minHeight: "24px" }}
            />

            <button
              type="submit"
              disabled={disabled || (!message.trim() && files.length === 0)}
              className="p-2 bg-dark-text text-dark-bg rounded-lg hover:bg-dark-text-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-dark-text flex-shrink-0"
            >
              <ArrowUp size={18} />
            </button>
          </div>

          {/* File preview */}
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2 px-2">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1.5 bg-dark-hover rounded-lg text-xs text-dark-text border border-dark-border"
                >
                  <span className="truncate max-w-[150px]">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                    className="text-dark-text-secondary hover:text-dark-text"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </form>

        <div className="text-xs text-center text-dark-text-secondary mt-2">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
