export type SharePlatform = 'whatsapp' | 'messenger' | 'instagram';

export interface Friend {
  id: string;
  name: string;
  picture: string;
  platform: 'messenger' | 'instagram';
}

export interface ShareConfig {
  url: string;
  platform: SharePlatform;
  message: string;
  recipientId?: string;
}

export interface SocialShareResponse {
  success: boolean;
  error?: string;
}

export interface SharePermissions {
  messenger: boolean;
  instagram: boolean;
}