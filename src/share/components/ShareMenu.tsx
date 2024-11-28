import { MessageCircle, Instagram, X, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { POI } from '../../types/poi';
import { SHARE_MESSAGES } from '../constants';
import { handleSocialShare } from '../utils';
import { Friend, SharePlatform } from '../types';
import { useSocialFriends } from '../hooks/useSocialFriends';
import FriendsList from './FriendsList';

interface ShareMenuProps {
  poi: POI;
  onClose: () => void;
}

export default function ShareMenu({ poi, onClose }: ShareMenuProps) {
  const [error, setError] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<'messenger' | 'instagram' | null>(null);
  const { friends, loading, error: friendsError, isAuthenticated, login } = 
    useSocialFriends(selectedPlatform || 'messenger');
  
  const message = SHARE_MESSAGES[
    poi.category.includes('embaixador') ? 'embaixador' : 'ponto-interesse'
  ](poi.name);

  const handleShare = async (platform: SharePlatform, friend?: Friend) => {
    try {
      if ((platform === 'messenger' || platform === 'instagram') && !isAuthenticated) {
        const success = await login();
        if (!success) {
          setError('Please login to share');
          return;
        }
      }

      const shareConfig = {
        url: poi.url || window.location.href,
        platform,
        message,
        recipientId: friend?.id
      };

      const result = await handleSocialShare(shareConfig);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to share');
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 p-3 w-80">
      <div className="flex items-center justify-between mb-2 pb-2 border-b">
        {selectedPlatform ? (
          <>
            <button
              onClick={() => setSelectedPlatform(null)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={16} className="text-gray-500" />
            </button>
            <h3 className="text-sm font-semibold text-gray-900">
              Share via {selectedPlatform}
            </h3>
          </>
        ) : (
          <h3 className="text-sm font-semibold text-gray-900">
            Share this place
          </h3>
        )}
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={16} className="text-gray-500" />
        </button>
      </div>
      
      {error && (
        <div className="mb-2 p-2 bg-red-50 text-red-600 text-xs rounded-lg">
          {error}
        </div>
      )}
      
      <div className="space-y-1">
        <button
          onClick={() => handleShare('whatsapp')}
          className="flex items-center gap-2 w-full p-2 text-left text-sm text-gray-700 
            hover:bg-gray-50 rounded-lg transition-colors"
        >
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
            alt="WhatsApp"
            className="w-4 h-4"
          />
          WhatsApp
        </button>
        
        <button
          onClick={() => handleShare('messenger')}
          className="flex items-center gap-2 w-full p-2 text-left text-sm text-gray-700 
            hover:bg-gray-50 rounded-lg transition-colors"
        >
          <MessageCircle size={16} className="text-blue-500" />
          Messenger
        </button>
        
        <button
          onClick={() => handleShare('instagram')}
          className="flex items-center gap-2 w-full p-2 text-left text-sm text-gray-700 
            hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Instagram size={16} className="text-pink-500" />
          Instagram
        </button>
      </div>
    </div>
  );
}