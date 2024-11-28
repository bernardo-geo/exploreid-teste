import { ShareConfig, SocialShareResponse } from './types';

export const createShareUrl = ({ url, platform, message }: ShareConfig): string => {
  const encodedMessage = encodeURIComponent(message);
  const encodedUrl = encodeURIComponent(url);

  switch (platform) {
    case 'whatsapp':
      return `whatsapp://send?text=${encodedMessage}%20${encodedUrl}`;
    case 'telegram':
      return `tg://msg?text=${encodedMessage}%20${encodedUrl}`;
    default:
      return '';
  }
};

export const handleSocialShare = async (config: ShareConfig): Promise<SocialShareResponse> => {
  try {
    if (config.platform === 'copy') {
      await navigator.clipboard.writeText(`${config.message} ${config.url}`);
      return { success: true };
    }

    const shareUrl = createShareUrl(config);
    const fallbackUrl = createFallbackUrl(config);

    try {
      // Try to open native app first
      window.location.href = shareUrl;
      
      // If native app doesn't open within 100ms, open web version
      setTimeout(() => {
        window.location.href = fallbackUrl;
      }, 100);
    } catch (e) {
      // If native app fails, open web version
      window.location.href = fallbackUrl;
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to share content'
    };
  }
};

const createFallbackUrl = ({ url, platform, message }: ShareConfig): string => {
  const encodedMessage = encodeURIComponent(message);
  const encodedUrl = encodeURIComponent(url);

  switch (platform) {
    case 'whatsapp':
      return `https://web.whatsapp.com/send?text=${encodedMessage}%20${encodedUrl}`;
    case 'telegram':
      return `https://t.me/share/url?url=${encodedUrl}&text=${encodedMessage}`;
    default:
      return '';
  }
};