// Web3 Configuration for Solana and Ethereum
import { Connection, clusterApiUrl } from '@solana/web3.js';
import { ENV_CONFIG, getRpcUrls } from './environment';

// Solana Configuration
export const SOLANA_CONFIG = {
  network: ENV_CONFIG.SOLANA_NETWORK,
  rpcUrl: ENV_CONFIG.SOLANA_CUSTOM_RPC || ENV_CONFIG.SOLANA_RPC_URL,
};

// Ethereum Configuration
export const ETHEREUM_CONFIG = {
  chains: [
    {
      id: 1,
      name: 'Ethereum',
      network: 'ethereum',
      nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: {
        default: { http: [getRpcUrls().ethereum] },
        public: { http: [getRpcUrls().ethereum] },
      },
    },
    {
      id: 11155111,
      name: 'Sepolia',
      network: 'sepolia',
      nativeCurrency: {
        name: 'Sepolia Ether',
        symbol: 'SEP',
        decimals: 18,
      },
      rpcUrls: {
        default: { http: [getRpcUrls().sepolia] },
        public: { http: [getRpcUrls().sepolia] },
      },
    },
    {
      id: 137,
      name: 'Polygon',
      network: 'polygon',
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18,
      },
      rpcUrls: {
        default: { http: [getRpcUrls().polygon] },
        public: { http: [getRpcUrls().polygon] },
      },
    },
  ],
  defaultChain: ENV_CONFIG.DEFAULT_CHAIN,
};

// Get Solana connection
export const getSolanaConnection = () => {
  const rpcUrl = SOLANA_CONFIG.rpcUrl;
  return new Connection(rpcUrl, 'confirmed');
};

// Get Ethereum chain by ID
export const getEthereumChain = (chainId: number) => {
  return ETHEREUM_CONFIG.chains.find(chain => chain.id === chainId);
};

// Get default Ethereum chain
export const getDefaultEthereumChain = () => {
  const defaultChainName = ETHEREUM_CONFIG.defaultChain;
  return ETHEREUM_CONFIG.chains.find(chain => chain.network === defaultChainName) || ETHEREUM_CONFIG.chains[1]; // Default to Sepolia
};
