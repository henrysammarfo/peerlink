// Environment Configuration for PeerLink
export const ENV_CONFIG = {
  // Civic Auth - Production Configuration
  CIVIC_APP_ID: import.meta.env.VITE_CIVIC_APP_ID || 'your_civic_app_id_here',
  CIVIC_REDIRECT_URI: import.meta.env.VITE_CIVIC_REDIRECT_URI || 'http://localhost:5173/callback',
  CIVIC_SCOPE: import.meta.env.VITE_CIVIC_SCOPE || 'openid profile email',
  CIVIC_AUTH_URL: import.meta.env.VITE_CIVIC_AUTH_URL || 'https://auth.civic.com',
  
  // Google OAuth Configuration - PLACEHOLDER VALUES
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your_google_client_id_here',
  GOOGLE_CLIENT_SECRET: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || 'your_google_client_secret_here',
  GOOGLE_JAVASCRIPT_ORIGIN: import.meta.env.VITE_GOOGLE_JAVASCRIPT_ORIGIN || 'http://localhost:5173',
  GOOGLE_REDIRECT_URI: import.meta.env.VITE_GOOGLE_REDIRECT_URI || 'http://localhost:5173/callback',
  
  // Discord OAuth Configuration - PLACEHOLDER VALUES
  DISCORD_CLIENT_ID: import.meta.env.VITE_DISCORD_CLIENT_ID || 'your_discord_client_id_here',
  DISCORD_CLIENT_SECRET: import.meta.env.VITE_DISCORD_CLIENT_SECRET || 'your_discord_client_secret_here',
  DISCORD_JAVASCRIPT_ORIGIN: import.meta.env.VITE_DISCORD_JAVASCRIPT_ORIGIN || 'http://localhost:5173',
  DISCORD_REDIRECT_URI: import.meta.env.VITE_DISCORD_REDIRECT_URI || 'http://localhost:5173/callback',
  DISCORD_SCOPE: import.meta.env.VITE_DISCORD_SCOPE || 'identify email',
  
  // X (Twitter) OAuth Configuration - PLACEHOLDER VALUES
  X_CLIENT_ID: import.meta.env.VITE_X_CLIENT_ID || 'your_x_client_id_here',
  X_CLIENT_SECRET: import.meta.env.VITE_X_CLIENT_SECRET || 'your_x_client_secret_here',
  X_JAVASCRIPT_ORIGIN: import.meta.env.VITE_X_JAVASCRIPT_ORIGIN || 'http://localhost:5173',
  X_REDIRECT_URI: import.meta.env.VITE_X_REDIRECT_URI || 'http://localhost:5173/callback',
  X_SCOPE: import.meta.env.VITE_X_SCOPE || 'tweet.read users.read offline.access',
  
  // API Configuration
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  NODE_ENV: import.meta.env.NODE_ENV || 'development',

  // Solana Configuration
  SOLANA_NETWORK: import.meta.env.VITE_SOLANA_NETWORK || 'devnet',
  SOLANA_RPC_URL: import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.devnet.solana.com',
  SOLANA_CUSTOM_RPC: import.meta.env.VITE_SOLANA_CUSTOM_RPC || null,

  // Ethereum Configuration
  DEFAULT_CHAIN: import.meta.env.VITE_DEFAULT_CHAIN || 'sepolia',
  ALCHEMY_API_KEY: import.meta.env.VITE_ALCHEMY_API_KEY || null,
  INFURA_API_KEY: import.meta.env.VITE_INFURA_API_KEY || null,

  // Development flags
  IS_DEV: import.meta.env.DEV || false,
  ENABLE_MOCK_WALLET: import.meta.env.VITE_ENABLE_MOCK_WALLET || 'false',
  USE_CIVIC_AUTH: import.meta.env.VITE_USE_CIVIC_AUTH || 'true',
};

// Helper function to get RPC URLs with API keys
export const getRpcUrls = () => {
  const urls: Record<string, string> = {
    ethereum: 'https://eth-mainnet.g.alchemy.com/v2/',
    sepolia: 'https://eth-sepolia.g.alchemy.com/v2/',
    polygon: 'https://polygon-mainnet.g.alchemy.com/v2/',
  };

  if (ENV_CONFIG.ALCHEMY_API_KEY) {
    Object.keys(urls).forEach(key => {
      urls[key] += ENV_CONFIG.ALCHEMY_API_KEY;
    });
  }

  return urls;
};

// Check if all required environment variables are set
export const validateEnvironment = () => {
  const required = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'DISCORD_CLIENT_ID',
    'DISCORD_CLIENT_SECRET',
    'X_CLIENT_ID',
    'X_CLIENT_SECRET',
    'CIVIC_APP_ID'
  ];

  const missing = required.filter(key => !ENV_CONFIG[key as keyof typeof ENV_CONFIG]);
  
  if (missing.length > 0) {
    console.warn(`Missing required environment variables: ${missing.join(', ')}`);
    return false;
  }
  
  return true;
};

// Check if we're in production mode
export const isProduction = () => ENV_CONFIG.NODE_ENV === 'production';

// Check if Civic Auth is enabled
export const isCivicAuthEnabled = () => ENV_CONFIG.USE_CIVIC_AUTH === 'true';
