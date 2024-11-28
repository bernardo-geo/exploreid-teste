import { Friend } from '../types';
import { Search } from 'lucide-react';
import { useState, useMemo } from 'react';

interface FriendsListProps {
  friends: Friend[];
  loading: boolean;
  error: string | null;
  onSelect: (friend: Friend) => void;
  platform: 'messenger' | 'instagram';
}

export default function FriendsList({
  friends,
  loading,
  error,
  onSelect,
  platform
}: FriendsListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFriends = useMemo(() => {
    return friends.filter(friend =>
      friend.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [friends, searchQuery]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search friends..."
          className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg
            placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500
            focus:border-transparent text-sm"
        />
        <Search 
          className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" 
          size={16}
        />
      </div>

      <div className="space-y-1 max-h-48 overflow-y-auto">
        {filteredFriends.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No friends found
          </div>
        ) : (
          filteredFriends.map(friend => (
            <button
              key={friend.id}
              onClick={() => onSelect(friend)}
              className="flex items-center gap-3 w-full p-2 hover:bg-gray-50 
                rounded-lg transition-colors"
            >
              <img
                src={friend.picture}
                alt={friend.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm font-medium text-gray-700">
                {friend.name}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}