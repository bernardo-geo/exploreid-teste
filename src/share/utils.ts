import { ShareConfig, SharePlatform } from './types';

export const createShareUrl = ({ url, platform, message }: ShareConfig): string => {
  const encodedMessage = encodeURIComponent(message);
  const encodedUrl = encodeURIComponent(url);

  switch (platform) {
    case 'whatsapp':
      return `https://wa.me/?text=${encodedMessage}%20${encodedUrl}`;
    case 'messenger':
      return `https://www.facebook.com/dialog/send?link=${encodedUrl}&app_id=${process.env.FACEBOOK_APP_ID || ''}&redirect_uri=${encodedUrl}`;
    case 'instagram':
      // Instagram sharing is limited to their app's native sharing functionality
      // We'll copy to clipboard instead
      return '';
    default:
      return '';
  }
};