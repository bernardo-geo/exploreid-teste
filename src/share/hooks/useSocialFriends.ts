import { useState, useEffect } from 'react';
import { Friend } from '../types';
import { useSocialAuth } from './useSocialAuth';

export function useSocialFriends(platform: 'messenger' | 'instagram') {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isInitialized, isAuthenticated, login } = useSocialAuth();

  useEffect(() => {
    const fetchFriends = async () => {
      if (!isInitialized || !isAuthenticated) return;
      
      setLoading(true);
      setError(null);

      try {
        if (platform === 'messenger') {
          // @ts-ignore
          window.FB.api('/me/friends', { fields: 'id,name,picture' }, (response: any) => {
            if (response.error) {
              throw new Error(response.error.message);
            }

            const friendsList: Friend[] = response.data.map((friend: any) => ({
              id: friend.id,
              name: friend.name,
              picture: friend.picture.data.url,
              platform: 'messenger'
            }));

            setFriends(friendsList);
          });
        } else if (platform === 'instagram') {
          // @ts-ignore
          window.FB.api('/me/accounts', async (response: any) => {
            if (response.error) {
              throw new Error(response.error.message);
            }

            const instagramAccountId = response.data[0]?.instagram_business_account?.id;
            if (!instagramAccountId) {
              throw new Error('No Instagram account found');
            }

            // Get Instagram followers
            // @ts-ignore
            window.FB.api(
              `/${instagramAccountId}/followers`,
              { fields: 'id,username,profile_picture_url' },
              (followersResponse: any) => {
                if (followersResponse.error) {
                  throw new Error(followersResponse.error.message);
                }

                const friendsList: Friend[] = followersResponse.data.map((follower: any) => ({
                  id: follower.id,
                  name: follower.username,
                  picture: follower.profile_picture_url,
                  platform: 'instagram'
                }));

                setFriends(friendsList);
              }
            );
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch friends');
      } finally {
        setLoading(false);
      }
    };

    if (isInitialized && isAuthenticated) {
      fetchFriends();
    }
  }, [platform, isInitialized, isAuthenticated]);

  const handleLogin = async () => {
    const success = await login(platform);
    if (success) {
      // Refetch friends after successful login
      setLoading(true);
      setError(null);
      try {
        await fetchFriends();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch friends');
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    friends,
    loading,
    error,
    isAuthenticated,
    login: handleLogin
  };
}