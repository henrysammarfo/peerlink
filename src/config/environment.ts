// Environment Configuration for PeerLink
export const ENV_CONFIG = {
  // Civic Auth
  CIVIC_APP_ID: import.meta.env.VITE_CIVIC_APP_ID || '5b74fab7-e455-4130-b150-56062fe80139',
  CIVIC_REDIRECT_URI: import.meta.env.VITE_CIVIC_REDIRECT_URI || 'http://localhost:5173',
  CIVIC_SCOPE: import.meta.env.VITE_CIVIC_SCOPE || 'openid profile email',
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  
  // Solana
  SOLANA_NETWORK: import.meta.env.VITE_SOLANA_NETWORK || 'devnet',
  SOLANA_RPC_URL: import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.devnet.solana.com',
  SOLANA_CUSTOM_RPC: import.meta.env.VITE_SOLANA_CUSTOM_RPC || null,
  
  // Ethereum
  DEFAULT_CHAIN: import.meta.env.VITE_DEFAULT_CHAIN || 'sepolia',
  ALCHEMY_API_KEY: import.meta.env.VITE_ALCHEMY_API_KEY || null,
  INFURA_API_KEY: import.meta.env.VITE_INFURA_API_KEY || null,
  
  // Development flags
  IS_DEV: import.meta.env.DEV || false,
  ENABLE_MOCK_WALLET: import.meta.env.VITE_ENABLE_MOCK_WALLET || 'true',
};

// Helper function to get RPC URLs with API keys
export const getRpcUrls = () => {
  const config = ENV_CONFIG;
  
  return {
    ethereum: config.ALCHEMY_API_KEY 
      ? `https://eth-mainnet.g.alchemy.com/v2/${config.ALCHEMY_API_KEY}`
      : 'https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY',
    sepolia: config.ALCHEMY_API_KEY 
      ? `https://eth-sepolia.g.alchemy.com/v2/${config.ALCHEMY_API_KEY}`
      : 'https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY',
    polygon: config.ALCHEMY_API_KEY 
      ? `https://polygon-mainnet.g.alchemy.com/v2/${config.ALCHEMY_API_KEY}`
      : 'https://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY',
  };
};

// Check if all required environment variables are set
export const validateEnvironment = () => {
  const warnings = [];
  
  if (!ENV_CONFIG.ALCHEMY_API_KEY && !ENV_CONFIG.INFURA_API_KEY) {
    warnings.push('No Ethereum RPC API key found. Add VITE_ALCHEMY_API_KEY or VITE_INFURA_API_KEY for better performance.');
  }
  
  if (ENV_CONFIG.IS_DEV) {
    warnings.push('Running in development mode. Mock wallets will be used if Civic Auth fails.');
  }
  
  return warnings;
};
