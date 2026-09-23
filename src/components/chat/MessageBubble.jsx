import { formatMessageTime } from "../../utils/chatUtils";

export function MessageBubble({ message, currentUserId }) {
  const isMe = message.senderId === currentUserId;

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-3`}>
      <div className="max-w-[75%]">
        <div
          className={`px-4 py-2.5 text-sm leading-relaxed ${
            isMe
              ? "bg-green-700 text-white rounded-2xl rounded-br-md"
              : "bg-gray-100 text-gray-800 rounded-2xl rounded-bl-md"
          }`}
        >
          {message.content}
        </div>

        {message.showTime && (
          <p
            className={`mt-1 text-[10px] text-gray-400 ${
              isMe ? "text-right mr-1" : "ml-1"
            }`}
          >
            {formatMessageTime(message.timestamp)}
          </p>
        )}
      </div>
    </div>
  );
}
