import { Plus, Trash2, LogOut } from 'lucide-react';

const Sidebar = ({
  conversations,
  currentConversation,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onLogout,
  user,
}) => {
  return (
    <div className="w-64 bg-dark-sidebar border-r border-dark-border flex flex-col h-screen">
      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={onNewConversation}
          className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-dark-text hover:bg-dark-hover rounded-lg transition-colors"
        >
          <Plus size={18} />
          <span>New chat</span>
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-2">
        <div className="text-xs font-semibold text-dark-text-secondary px-3 py-2">Recents</div>
        {conversations.map((conv) => (
          <div
            key={conv._id}
            onClick={() => onSelectConversation(conv)}
            className={`group flex items-center justify-between px-3 py-2 mb-1 text-sm rounded-lg cursor-pointer transition-colors ${
              currentConversation?._id === conv._id
                ? 'bg-dark-hover text-dark-text'
                : 'text-dark-text-secondary hover:bg-dark-hover hover:text-dark-text'
            }`}
          >
            <span className="truncate flex-1">{conv.title}</span>
            {currentConversation?._id === conv._id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('Delete this conversation?')) {
                    onDeleteConversation(conv._id);
                  }
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-dark-bg rounded transition-all"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* User Section */}
      <div className="border-t border-dark-border p-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-dark-hover flex items-center justify-center text-sm font-semibold text-dark-text flex-shrink-0">
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-dark-text truncate">{user?.username}</div>
            <div className="text-xs text-dark-text-secondary truncate">{user?.email}</div>
          </div>
          <button
            onClick={onLogout}
            className="p-1.5 hover:bg-dark-hover rounded transition-colors text-dark-text-secondary hover:text-dark-text"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
