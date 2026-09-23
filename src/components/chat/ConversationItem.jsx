import { formatTime, getInitials } from "../../utils/chatUtils";

export function ConversationItem({ conversation, isActive, onClick }) {
  const initials = getInitials(conversation.firstName, conversation.lastName);

  return (
    <button
      onClick={onClick}
      className={`flex items-start w-full gap-3 px-4 py-3 text-left transition-colors rounded-xl ${
        isActive
          ? "bg-green-50 border-l-4 border-green-700"
          : "hover:bg-gray-50 border-l-4 border-transparent"
      }`}
    >
      <div className="relative shrink-0">
        <div className="flex items-center justify-center w-11 h-11 text-sm font-bold text-green-800 bg-green-100 rounded-full">
          {initials}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span
            className={`text-sm truncate ${
              conversation.unreadCount > 0
                ? "font-bold text-gray-900"
                : "font-semibold text-gray-900"
            }`}
          >
            {conversation.firstName} {conversation.lastName}
          </span>
          <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
            {formatTime(conversation.lastMessageTime)}
          </span>
        </div>
        <p className="text-xs text-gray-500 truncate leading-relaxed">
          {conversation.lastMessage}
        </p>
      </div>

      {conversation.unreadCount > 0 && (
        <span className="flex items-center justify-center w-5 h-5 mt-1 text-[10px] font-bold text-white bg-red-500 rounded-full shrink-0">
          {conversation.unreadCount}
        </span>
      )}
    </button>
  );
}
