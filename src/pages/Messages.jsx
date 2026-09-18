import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs";
import api from "@/api/axiosConfig";
import { useAuth } from "@/context/AuthContext";
import {
  Search,
  Edit,
  MoreVertical,
  Plus,
  Smile,
  Send,
  ArrowLeft,
  MessageCircle,
  X,
  UserPlus,
} from "lucide-react";

function formatTime(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: "long" });
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function formatMessageTime(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getInitials(firstName, lastName) {
  return `${(firstName || "")[0] || ""}${(lastName || "")[0] || ""}`.toUpperCase();
}

function ConversationItem({ conversation, isActive, onClick }) {
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

function MessageBubble({ message, currentUserId }) {
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

function NewConversationModal({
  isOpen,
  onClose,
  onSelectUser,
  currentUserId,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (searchQuery.trim().length < 2) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await api.get(
          `/users/search?query=${encodeURIComponent(searchQuery.trim())}`,
        );
        setResults(res.data.filter((u) => u.id !== currentUserId));
      } catch (err) {
        console.error("User search failed:", err);
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, currentUserId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">New Conversation</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 rounded-lg hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-5 py-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              autoFocus
              placeholder="Search users by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2.5 pl-9 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-300"
            />
          </div>
        </div>

        <div className="max-h-72 overflow-y-auto px-3 pb-4">
          {searching ? (
            <div className="flex items-center justify-center py-8 text-gray-400">
              <p className="text-sm">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            results.map((user) => (
              <button
                key={user.id}
                onClick={() => onSelectUser(user)}
                className="flex items-center w-full gap-3 px-3 py-3 text-left transition-colors rounded-xl hover:bg-green-50"
              >
                <div className="flex items-center justify-center w-10 h-10 text-sm font-bold text-green-800 bg-green-100 rounded-full shrink-0">
                  {getInitials(user.firstName, user.lastName)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user.city || user.email}
                  </p>
                </div>
              </button>
            ))
          ) : searchQuery.trim().length >= 2 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <UserPlus size={28} className="mb-2" />
              <p className="text-sm">No users found</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <Search size={28} className="mb-2" />
              <p className="text-sm">Type at least 2 characters to search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Messages() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversationState] = useState(() => {
    const chatWith = searchParams.get("chatWith");
    return chatWith ? Number(chatWith) : null;
  });
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [messageInput, setMessageInput] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(() => {
    return !!searchParams.get("chatWith");
  });
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const messagesEndRef = useRef(null);
  const stompClientRef = useRef(null);
  const urlParamsHandled = useRef(false);

  const setActiveConversation = useCallback(
    (valueOrFn) => {
      setActiveConversationState((prev) => {
        const newValue = typeof valueOrFn === "function" ? valueOrFn(prev) : valueOrFn;
        if (newValue) {
          setSearchParams((params) => {
            params.set("chatWith", String(newValue));
            return params;
          }, { replace: true });
        } else {
          setSearchParams((params) => {
            params.delete("chatWith");
            return params;
          }, { replace: true });
        }
        return newValue;
      });
    },
    [setSearchParams],
  );

  const filters = ["All", "Unread"];

  const loadConversations = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await api.get(`/chat/conversations?userId=${user.id}`);
        setConversations((prev) => {
          const fetched = res.data;
          const temps = prev.filter((c) => c.lastMessage === "");
          const merged = [...fetched];
          temps.forEach((tc) => {
            if (!merged.find((rc) => rc.userId === tc.userId)) {
              merged.unshift(tc);
            }
          });
          return merged;
        });
    } catch (err) {
      console.error("Failed to load conversations:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (urlParamsHandled.current) return;
    const targetUserId = searchParams.get("userId");
    const targetUserName = searchParams.get("userName");

    if (targetUserId && user?.id) {
      urlParamsHandled.current = true;
      const userId = Number(targetUserId);

      const existingConv = conversations.find((c) => c.userId === userId);
      if (existingConv) {
        setActiveConversation(userId);
        setShowMobileChat(true);
      } else {
        const nameParts = (targetUserName || "").split(" ");
        const tempConv = {
          userId: userId,
          firstName: nameParts[0] || "User",
          lastName: nameParts.slice(1).join(" ") || "",
          lastMessage: "",
          lastMessageTime: null,
          unreadCount: 0,
        };
        setConversations((prev) => {
          if (prev.find((c) => c.userId === userId)) return prev;
          return [tempConv, ...prev];
        });
        setActiveConversation(userId);
        setShowMobileChat(true);
      }

      setSearchParams((params) => {
        params.delete("userId");
        params.delete("userName");
        return params;
      }, { replace: true });
    }
  }, [searchParams, user, conversations, setSearchParams, setActiveConversation]);

  useEffect(() => {
    let ignore = false;
    const fetchConversations = async () => {
      if (!user?.id) return;
      try {
        const res = await api.get(`/chat/conversations?userId=${user.id}`);
        if (!ignore) {
          setConversations((prev) => {
            const fetched = res.data;
            const temps = prev.filter((c) => c.lastMessage === "");
            const merged = [...fetched];
            temps.forEach((tc) => {
              if (!merged.find((rc) => rc.userId === tc.userId)) {
                merged.unshift(tc);
              }
            });
            return merged;
          });
        }
      } catch (err) {
        console.error("Failed to load conversations:", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchConversations();
    return () => {
      ignore = true;
    };
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    let cancelled = false;
    let subscription = null;

    const client = new Client({
      webSocketFactory: () => new SockJS("/ws"),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      onConnect: () => {
        if (cancelled) return;

        subscription = client.subscribe(`/user/queue/messages`, (frame) => {
          if (cancelled) return;
          const incoming = JSON.parse(frame.body);

          if (incoming.senderId === user.id) {
            setMessages((prev) => {
              const optimisticIdx = prev.findIndex(
                (m) =>
                  m.senderId === user.id &&
                  m.recipientId === incoming.recipientId &&
                  m.content === incoming.content &&
                  !m.serverConfirmed,
              );
              if (optimisticIdx !== -1) {
                const updated = [...prev];
                updated[optimisticIdx] = { ...incoming, serverConfirmed: true };
                return updated;
              }
              if (prev.some((m) => m.id === incoming.id)) return prev;
              return [...prev, { ...incoming, serverConfirmed: true }];
            });
          } else {
            setActiveConversationState((currentActive) => {
              if (currentActive === incoming.senderId) {
                setMessages((prev) => {
                  if (prev.some((m) => m.id === incoming.id)) return prev;
                  return [...prev, incoming];
                });
                api
                  .put(
                    `/chat/mark-read?senderId=${incoming.senderId}&recipientId=${user.id}`,
                  )
                  .catch(() => {});
              }
              return currentActive;
            });
          }

          loadConversations();
        });
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame.headers?.message);
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      cancelled = true;
      if (subscription) {
        subscription.unsubscribe();
      }
      if (client.active) {
        client.deactivate();
      }
    };
  }, [user, loadConversations]);

  useEffect(() => {
    if (!activeConversation || !user?.id) return;

    const loadMessages = async () => {
      setMessagesLoading(true);
      try {
        const res = await api.get(
          `/chat/history?user1Id=${user.id}&user2Id=${activeConversation}`,
        );
        setMessages(res.data);

        await api
          .put(
            `/chat/mark-read?senderId=${activeConversation}&recipientId=${user.id}`,
          )
          .catch(() => {});

        loadConversations();
      } catch (err) {
        console.error("Failed to load messages:", err);
      } finally {
        setMessagesLoading(false);
      }
    };

    loadMessages();
  }, [activeConversation, user, loadConversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectedConv = conversations.find(
    (c) => c.userId === activeConversation,
  );

  const preparedMessages = messages.map((msg, idx) => ({
    ...msg,
    showTime: idx === messages.length - 1,
  }));

  const filteredConversations = conversations.filter((conv) => {
    const name = `${conv.firstName} ${conv.lastName}`.toLowerCase();
    const matchesSearch = name.includes(searchQuery.toLowerCase());
    if (activeFilter === "Unread") return matchesSearch && conv.unreadCount > 0;
    return matchesSearch;
  });

  const handleSelectConversation = (userId) => {
    setActiveConversation(userId);
    setShowMobileChat(true);
  };

  const handleSelectNewUser = (selectedUser) => {
    setShowNewConversation(false);

    const existingConv = conversations.find(
      (c) => c.userId === selectedUser.id,
    );
    if (existingConv) {
      setActiveConversation(selectedUser.id);
      setShowMobileChat(true);
      return;
    }

    const tempConv = {
      userId: selectedUser.id,
      firstName: selectedUser.firstName,
      lastName: selectedUser.lastName,
      lastMessage: "",
      lastMessageTime: null,
      unreadCount: 0,
    };
    setConversations((prev) => {
      if (prev.find((c) => c.userId === selectedUser.id)) return prev;
      return [tempConv, ...prev];
    });
    setActiveConversation(selectedUser.id);
    setShowMobileChat(true);
  };

  const handleSend = () => {
    if (!messageInput.trim() || !activeConversation) return;

    const client = stompClientRef.current;
    if (client && client.active) {
      const request = {
        recipientId: activeConversation,
        content: messageInput.trim(),
      };

      client.publish({
        destination: "/app/chat.send",
        body: JSON.stringify(request),
      });

      const optimisticMsg = {
        id: Date.now(),
        senderId: user.id,
        recipientId: activeConversation,
        content: messageInput.trim(),
        isRead: false,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimisticMsg]);
      setMessageInput("");

      setTimeout(loadConversations, 500);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50">
      <aside
        className={`${
          showMobileChat ? "hidden md:flex" : "flex"
        } flex-col w-full md:w-80 lg:w-96 bg-white border-r shrink-0`}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h1 className="text-xl font-bold text-gray-900">Messages</h1>
          <button
            onClick={() => setShowNewConversation(true)}
            className="p-2 text-gray-500 transition-colors rounded-lg hover:bg-gray-100 hover:text-green-700"
            title="New conversation"
          >
            <Edit size={18} />
          </button>
        </div>

        <div className="px-5 mb-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2.5 pl-9 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-300"
            />
          </div>
        </div>

        <div className="flex gap-2 px-5 mb-3">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                activeFilter === filter
                  ? "bg-green-700 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-2">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-gray-400">
              <p className="text-sm">Loading conversations...</p>
            </div>
          ) : filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => (
              <ConversationItem
                key={conv.userId}
                conversation={conv}
                isActive={activeConversation === conv.userId}
                onClick={() => handleSelectConversation(conv.userId)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <MessageCircle size={32} className="mb-2" />
              <p className="text-sm">
                {searchQuery
                  ? "No conversations found"
                  : "No conversations yet"}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setShowNewConversation(true)}
                  className="mt-3 px-4 py-2 text-xs font-semibold text-white bg-green-700 rounded-full hover:bg-green-800 transition-colors"
                >
                  Start a conversation
                </button>
              )}
            </div>
          )}
        </div>
      </aside>

      <section
        className={`${
          showMobileChat ? "flex" : "hidden md:flex"
        } flex-col flex-1 bg-white`}
      >
        {selectedConv ? (
          <>
            <div className="flex items-center justify-between px-5 py-3 border-b bg-white">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowMobileChat(false)}
                  className="p-1 mr-1 text-gray-500 md:hidden hover:text-gray-700"
                >
                  <ArrowLeft size={20} />
                </button>

                <div className="flex items-center justify-center w-10 h-10 text-sm font-bold text-green-800 bg-green-100 rounded-full">
                  {getInitials(selectedConv.firstName, selectedConv.lastName)}
                </div>

                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    {selectedConv.firstName} {selectedConv.lastName}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button className="p-2 text-gray-400 rounded-lg hover:bg-gray-100 hover:text-gray-600">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {messagesLoading ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <p className="text-sm">Loading messages...</p>
                </div>
              ) : preparedMessages.length > 0 ? (
                <>
                  {preparedMessages.map((msg) => (
                    <MessageBubble
                      key={msg.id}
                      message={msg}
                      currentUserId={user.id}
                    />
                  ))}
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <p className="text-sm">
                    No messages yet. Start the conversation!
                  </p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-4 py-3 border-t bg-white">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-full">
                <button className="p-1.5 text-gray-400 hover:text-green-700 transition-colors shrink-0">
                  <Plus size={20} />
                </button>

                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 text-sm bg-transparent border-none outline-none placeholder:text-gray-400"
                />

                <button className="p-1.5 text-gray-400 hover:text-green-700 transition-colors shrink-0">
                  <Smile size={20} />
                </button>

                <button
                  onClick={handleSend}
                  className="flex items-center justify-center w-8 h-8 text-white bg-green-700 rounded-full hover:bg-green-800 transition-colors shrink-0"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-gray-400">
            <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full">
              <MessageCircle size={28} />
            </div>
            <p className="text-sm font-medium">Select a conversation</p>
            <p className="text-xs mt-1">
              Choose a conversation from the sidebar to start chatting
            </p>
            <button
              onClick={() => setShowNewConversation(true)}
              className="mt-4 px-5 py-2.5 text-sm font-semibold text-white bg-green-700 rounded-full hover:bg-green-800 transition-colors"
            >
              New conversation
            </button>
          </div>
        )}
      </section>

      <NewConversationModal
        isOpen={showNewConversation}
        onClose={() => setShowNewConversation(false)}
        onSelectUser={handleSelectNewUser}
        currentUserId={user?.id}
      />
    </div>
  );
}
