export type SharePlatform = 'whatsapp' | 'messenger' | 'instagram' | 'telegram' | 'copy';

export interface ShareConfig {
  url: string;
  platform: SharePlatform;
  message: string;
}

export interface SocialShareResponse {
  success: boolean;
  error?: string;
}