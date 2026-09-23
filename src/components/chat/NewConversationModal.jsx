import { useState, useRef, useEffect } from "react";
import { Search, X, UserPlus } from "lucide-react";
import { searchUsers } from "../../api/userService";
import { getInitials } from "../../utils/chatUtils";

export function NewConversationModal({
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
        const data = await searchUsers(searchQuery.trim());
        setResults(data.filter((u) => u.id !== currentUserId));
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
