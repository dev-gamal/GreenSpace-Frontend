import { useState, useRef, useEffect, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';
import api from '@/api/axiosConfig';
import { useAuth } from '@/context/AuthContext';
import {
  Search,
  Edit,
  MoreVertical,
  Plus,
  Smile,
  Send,
  ArrowLeft,
  MessageCircle,
} from 'lucide-react';

// ─── Helpers ─────────────────────────────────────────────────

function formatTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: 'long' });
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function formatMessageTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getInitials(firstName, lastName) {
  return `${(firstName || '')[0] || ''}${(lastName || '')[0] || ''}`.toUpperCase();
}

// ─── Sub-components ──────────────────────────────────────────

function ConversationItem({ conversation, isActive, onClick }) {
  const initials = getInitials(conversation.firstName, conversation.lastName);

  return (
    <button
      onClick={onClick}
      className={`flex items-start w-full gap-3 px-4 py-3 text-left transition-colors rounded-xl ${
        isActive
          ? 'bg-green-50 border-l-4 border-green-700'
          : 'hover:bg-gray-50 border-l-4 border-transparent'
      }`}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="flex items-center justify-center w-11 h-11 text-sm font-bold text-green-800 bg-green-100 rounded-full">
          {initials}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span
            className={`text-sm truncate ${
              conversation.unreadCount > 0
                ? 'font-bold text-gray-900'
                : 'font-semibold text-gray-900'
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

      {/* Unread badge */}
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
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className="max-w-[75%]">
        {/* Text bubble */}
        <div
          className={`px-4 py-2.5 text-sm leading-relaxed ${
            isMe
              ? 'bg-green-700 text-white rounded-2xl rounded-br-md'
              : 'bg-gray-100 text-gray-800 rounded-2xl rounded-bl-md'
          }`}
        >
          {message.content}
        </div>

        {/* Timestamp */}
        {message.showTime && (
          <p
            className={`mt-1 text-[10px] text-gray-400 ${
              isMe ? 'text-right mr-1' : 'ml-1'
            }`}
          >
            {formatMessageTime(message.timestamp)}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────

export default function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [messageInput, setMessageInput] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const stompClientRef = useRef(null);

  const filters = ['All', 'Unread'];

  // ─── Load conversations ────────────────────────────────
  const loadConversations = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await api.get(`/chat/conversations?userId=${user.id}`);
      setConversations(res.data);
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // ─── WebSocket connection ──────────────────────────────
  useEffect(() => {
    if (!user?.id) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const client = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/user/${user.id}/queue/messages`, (frame) => {
          const incoming = JSON.parse(frame.body);

          // If we're viewing this conversation, add the message
          setActiveConversation((currentActive) => {
            if (currentActive === incoming.senderId) {
              setMessages((prev) => [...prev, incoming]);
              // Mark as read
              api.put(
                `/chat/mark-read?senderId=${incoming.senderId}&recipientId=${user.id}`
              ).catch(() => {});
            }
            return currentActive;
          });

          // Refresh conversations list
          loadConversations();
        });
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame.headers?.message);
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, [user?.id, loadConversations]);

  // ─── Load messages for selected conversation ───────────
  useEffect(() => {
    if (!activeConversation || !user?.id) return;

    const loadMessages = async () => {
      setMessagesLoading(true);
      try {
        const res = await api.get(
          `/chat/history?user1Id=${user.id}&user2Id=${activeConversation}`
        );
        setMessages(res.data);

        // Mark messages as read
        await api
          .put(
            `/chat/mark-read?senderId=${activeConversation}&recipientId=${user.id}`
          )
          .catch(() => {});

        // Refresh conversations to update unread counts
        loadConversations();
      } catch (err) {
        console.error('Failed to load messages:', err);
      } finally {
        setMessagesLoading(false);
      }
    };

    loadMessages();
  }, [activeConversation, user?.id, loadConversations]);

  // ─── Scroll to bottom ─────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ─── Selected conversation info ────────────────────────
  const selectedConv = conversations.find(
    (c) => c.userId === activeConversation
  );

  // ─── Prepare messages with showTime flag ───────────────
  const preparedMessages = messages.map((msg, idx) => ({
    ...msg,
    showTime: idx === messages.length - 1,
  }));

  // ─── Filter conversations ─────────────────────────────
  const filteredConversations = conversations.filter((conv) => {
    const name = `${conv.firstName} ${conv.lastName}`.toLowerCase();
    const matchesSearch = name.includes(searchQuery.toLowerCase());
    if (activeFilter === 'Unread') return matchesSearch && conv.unreadCount > 0;
    return matchesSearch;
  });

  // ─── Handlers ─────────────────────────────────────────
  const handleSelectConversation = (userId) => {
    setActiveConversation(userId);
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
        destination: '/app/chat.send',
        body: JSON.stringify(request),
      });

      // Optimistically add the message
      const optimisticMsg = {
        id: Date.now(),
        senderId: user.id,
        recipientId: activeConversation,
        content: messageInput.trim(),
        isRead: false,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimisticMsg]);
      setMessageInput('');

      // Refresh conversations list after a short delay
      setTimeout(loadConversations, 500);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50">
      {/* ─── Left: Conversations Sidebar ─────────────────── */}
      <aside
        className={`${
          showMobileChat ? 'hidden md:flex' : 'flex'
        } flex-col w-full md:w-80 lg:w-96 bg-white border-r shrink-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h1 className="text-xl font-bold text-gray-900">Messages</h1>
          <button className="p-2 text-gray-500 transition-colors rounded-lg hover:bg-gray-100 hover:text-green-700">
            <Edit size={18} />
          </button>
        </div>

        {/* Search */}
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

        {/* Filter tabs */}
        <div className="flex gap-2 px-5 mb-3">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                activeFilter === filter
                  ? 'bg-green-700 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Conversation list */}
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
                {searchQuery ? 'No conversations found' : 'No conversations yet'}
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* ─── Right: Chat Area ────────────────────────────── */}
      <section
        className={`${
          showMobileChat ? 'flex' : 'hidden md:flex'
        } flex-col flex-1 bg-white`}
      >
        {selectedConv ? (
          <>
            {/* Chat header */}
            <div className="flex items-center justify-between px-5 py-3 border-b bg-white">
              <div className="flex items-center gap-3">
                {/* Mobile back button */}
                <button
                  onClick={() => setShowMobileChat(false)}
                  className="p-1 mr-1 text-gray-500 md:hidden hover:text-gray-700"
                >
                  <ArrowLeft size={20} />
                </button>

                {/* Avatar */}
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

            {/* Messages area */}
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

            {/* Message input */}
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
          /* Empty state */
          <div className="flex flex-col items-center justify-center flex-1 text-gray-400">
            <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full">
              <MessageCircle size={28} />
            </div>
            <p className="text-sm font-medium">Select a conversation</p>
            <p className="text-xs mt-1">
              Choose a conversation from the sidebar to start chatting
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
