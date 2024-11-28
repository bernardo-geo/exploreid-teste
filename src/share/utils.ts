import { ShareConfig, SocialShareResponse } from './types';

export const createShareUrl = ({ url, platform, message, recipientId }: ShareConfig): string => {
  const encodedMessage = encodeURIComponent(message);
  const encodedUrl = encodeURIComponent(url);

  switch (platform) {
    case 'whatsapp':
      return `https://wa.me/?text=${encodedMessage}%20${encodedUrl}`;
    case 'messenger':
      return `https://www.facebook.com/dialog/send?app_id=${import.meta.env.VITE_FACEBOOK_APP_ID}&link=${encodedUrl}&redirect_uri=${encodedUrl}`;
    case 'instagram':
      return `https://www.instagram.com/direct/new/?text=${encodedMessage}%20${encodedUrl}`;
    default:
      return '';
  }
};

export const handleSocialShare = async (config: ShareConfig): Promise<SocialShareResponse> => {
  try {
    const shareUrl = createShareUrl(config);

    if (config.platform === 'messenger') {
      // @ts-ignore
      FB.ui({
        method: 'send',
        link: config.url,
        quote: config.message,
      }, (response: any) => {
        if (response && !response.error_code) {
          return { success: true };
        } else {
          return {
            success: false,
            error: 'Failed to share on Messenger'
          };
        }
      });
    } else if (config.platform === 'instagram') {
      // Open Instagram sharing in a new window
      const width = 550;
      const height = 400;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      window.open(
        shareUrl,
        'Share on Instagram',
        `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
      );
    } else {
      window.open(shareUrl, '_blank');
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to share content'
    };
  }
};