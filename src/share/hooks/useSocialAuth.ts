import { useState, useEffect } from 'react';

interface AuthState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export function useSocialAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isInitialized: false,
    isAuthenticated: false,
    error: null
  });

  useEffect(() => {
    const checkLoginStatus = () => {
      // @ts-ignore
      if (window.FB) {
        // @ts-ignore
        window.FB.getLoginStatus((response: any) => {
          setAuthState({
            isInitialized: true,
            isAuthenticated: response.status === 'connected',
            error: null
          });
        });
      }
    };

    // Check if FB SDK is already loaded
    // @ts-ignore
    if (window.FB) {
      checkLoginStatus();
    } else {
      // Wait for FB SDK to load
      window.fbAsyncInit = function() {
        // @ts-ignore
        window.FB.init({
          appId: import.meta.env.VITE_FACEBOOK_APP_ID,
          cookie: true,
          xfbml: true,
          version: 'v18.0'
        });
        checkLoginStatus();
      };
    }
  }, []);

  const login = async (platform: 'messenger' | 'instagram') => {
    try {
      // @ts-ignore
      const response = await new Promise((resolve) => {
        // @ts-ignore
        window.FB.login((response: any) => {
          resolve(response);
        }, {
          scope: platform === 'messenger' 
            ? 'public_profile,email,user_friends'
            : 'instagram_basic,instagram_manage_messages',
          auth_type: 'rerequest'
        });
      });

      setAuthState(prev => ({
        ...prev,
        isAuthenticated: response.status === 'connected',
        error: null
      }));

      return response.status === 'connected';
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        error: 'Failed to login'
      }));
      return false;
    }
  };

  return {
    ...authState,
    login
  };
}