import { useState, useEffect, createContext, useContext } from 'react';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getSolanaConnection, getDefaultEthereumChain } from '../config/web3';

// Web3 User Types
export interface Web3User {
  hasWallet: boolean;
  walletType: 'solana' | 'ethereum' | null;
  // Solana specific
  solanaPublicKey?: string;
  solanaBalance?: number;
  // Ethereum specific
  ethereumAddress?: string;
  ethereumBalance?: string;
  ethereumChainId?: number;
}

interface Web3ContextType {
  user: Web3User;
  isLoading: boolean;
  createSolanaWallet: () => Promise<void>;
  createEthereumWallet: () => Promise<void>;
  refreshBalances: () => Promise<void>;
  sendSolanaTransaction: (to: string, amount: number) => Promise<string>;
  sendEthereumTransaction: (to: string, amount: string) => Promise<string>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

// Web3 Provider Component
export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Web3User>({
    hasWallet: false,
    walletType: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Check if user already has a wallet
  useEffect(() => {
    checkExistingWallet();
  }, []);

  const checkExistingWallet = async () => {
    try {
      // Check for existing wallet in localStorage
      const storedWallet = localStorage.getItem('peerlink_wallet');
      if (storedWallet) {
        const walletData = JSON.parse(storedWallet);
        setUser(walletData);
        await refreshBalances();
      }
    } catch (error) {
      console.error('Error checking existing wallet:', error);
    }
  };

  const createSolanaWallet = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would use Civic's embedded wallet
      // For now, we'll simulate wallet creation
      const connection = getSolanaConnection();
      
      // Generate a mock public key (in real app, this would come from Civic)
      const publicKey = new PublicKey('11111111111111111111111111111111');
      
      const newUser: Web3User = {
        hasWallet: true,
        walletType: 'solana',
        solanaPublicKey: publicKey.toString(),
        solanaBalance: 0,
      };

      // Store wallet data
      localStorage.setItem('peerlink_wallet', JSON.stringify(newUser));
      setUser(newUser);

      // Get initial balance
      await refreshBalances();
      
    } catch (error) {
      console.error('Error creating Solana wallet:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createEthereumWallet = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would use Civic's embedded wallet
      // For now, we'll simulate wallet creation
      const mockAddress = '0x' + '0'.repeat(40); // Mock address
      const defaultChain = getDefaultEthereumChain();
      
      const newUser: Web3User = {
        hasWallet: true,
        walletType: 'ethereum',
        ethereumAddress: mockAddress,
        ethereumBalance: '0',
        ethereumChainId: defaultChain?.id || 11155111,
      };

      // Store wallet data
      localStorage.setItem('peerlink_wallet', JSON.stringify(newUser));
      setUser(newUser);

      // Get initial balance
      await refreshBalances();
      
    } catch (error) {
      console.error('Error creating Ethereum wallet:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBalances = async () => {
    if (!user.hasWallet) return;

    try {
      if (user.walletType === 'solana' && user.solanaPublicKey) {
        const connection = getSolanaConnection();
        const publicKey = new PublicKey(user.solanaPublicKey);
        const balance = await connection.getBalance(publicKey);
        
        setUser(prev => ({
          ...prev,
          solanaBalance: balance / LAMPORTS_PER_SOL
        }));
      }
      
      if (user.walletType === 'ethereum' && user.ethereumAddress) {
        // In a real app, you'd query the blockchain here
        // For now, we'll simulate a balance
        const mockBalance = '0.001';
        setUser(prev => ({
          ...prev,
          ethereumBalance: mockBalance
        }));
      }
    } catch (error) {
      console.error('Error refreshing balances:', error);
    }
  };

  const sendSolanaTransaction = async (to: string, amount: number): Promise<string> => {
    try {
      // In a real app, this would create and send a transaction
      // For now, we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
      
      // Simulate transaction success
      const txHash = 'tx_' + Math.random().toString(36).substr(2, 9);
      
      // Update balance
      await refreshBalances();
      
      return txHash;
    } catch (error) {
      console.error('Error sending Solana transaction:', error);
      throw error;
    }
  };

  const sendEthereumTransaction = async (to: string, amount: string): Promise<string> => {
    try {
      // In a real app, this would create and send a transaction
      // For now, we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
      
      // Simulate transaction success
      const txHash = '0x' + Math.random().toString(36).substr(2, 64);
      
      // Update balance
      await refreshBalances();
      
      return txHash;
    } catch (error) {
      console.error('Error sending Ethereum transaction:', error);
      throw error;
    }
  };

  const value: Web3ContextType = {
    user,
    isLoading,
    createSolanaWallet,
    createEthereumWallet,
    refreshBalances,
    sendSolanaTransaction,
    sendEthereumTransaction,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
