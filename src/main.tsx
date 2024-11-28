import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Fix Leaflet default icon issue
import L from 'leaflet';
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Initialize Facebook SDK
function initFacebookSDK() {
  // @ts-ignore
  window.fbAsyncInit = function() {
    // @ts-ignore
    FB.init({
      appId: import.meta.env.VITE_FACEBOOK_APP_ID,
      cookie: true,
      xfbml: true,
      version: 'v18.0'
    });
  };
}

function Root() {
  useEffect(() => {
    initFacebookSDK();
  }, []);

  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<Root />);