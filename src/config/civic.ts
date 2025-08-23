// Civic Auth Configuration
export const CIVIC_CONFIG = {
  appId: import.meta.env.VITE_CIVIC_APP_ID || '5b74fab7-e455-4130-b150-56062fe80139',
  redirectUri: import.meta.env.VITE_CIVIC_REDIRECT_URI || window.location.origin,
  scope: import.meta.env.VITE_CIVIC_SCOPE || 'openid profile email',
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000'
};

// For development, you can override these values
export const getCivicConfig = () => {
  if (import.meta.env.DEV) {
    return {
      ...CIVIC_CONFIG,
      appId: '5b74fab7-e455-4130-b150-56062fe80139', // Real Client ID
      redirectUri: 'http://localhost:5173'
    };
  }
  return CIVIC_CONFIG;
};
