import { MessageCircle, Instagram, X } from 'lucide-react';
import { POI } from '../../types/poi';
import { SHARE_MESSAGES } from '../constants';
import { createShareUrl } from '../utils';
import { SharePlatform } from '../types';

interface ShareMenuProps {
  poi: POI;
  onClose: () => void;
}

export default function ShareMenu({ poi, onClose }: ShareMenuProps) {
  const message = SHARE_MESSAGES[
    poi.category.includes('embaixador') ? 'embaixador' : 'ponto-interesse'
  ](poi.name);

  const handleShare = async (platform: SharePlatform) => {
    const shareConfig = {
      url: poi.url || window.location.href,
      platform,
      message
    };

    if (platform === 'instagram') {
      try {
        await navigator.clipboard.writeText(`${message} ${shareConfig.url}`);
        alert('Message copied! You can now share it on Instagram.');
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    } else {
      const shareUrl = createShareUrl(shareConfig);
      window.open(shareUrl, '_blank');
    }
    
    onClose();
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 p-3 w-64"
    >
      <div className="flex items-center justify-between mb-2 pb-2 border-b">
        <h3 className="text-sm font-semibold text-gray-900">Share this place</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={16} className="text-gray-500" />
        </button>
      </div>
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