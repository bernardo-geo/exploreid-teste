export type SharePlatform = 'whatsapp' | 'messenger' | 'instagram';

export interface ShareConfig {
  url: string;
  platform: SharePlatform;
  message: string;
}