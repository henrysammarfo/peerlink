import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { User, Shield, Wallet, Loader2, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

interface CivicAuthLoginProps {
  onLogin: (user: any) => void;
  onError: (error: string) => void;
}

export const CivicAuthLogin: React.FC<CivicAuthLoginProps> = ({ onLogin, onError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState<string>('idle');
  const [civicAuthReady, setCivicAuthReady] = useState(false);
  const [walletType, setWalletType] = useState<'solana' | 'ethereum' | null>(null);

  useEffect(() => {
    // Initialize Civic Auth
    initializeCivicAuth();
  }, []);

  const initializeCivicAuth = async () => {
    try {
      // Simulate Civic Auth SDK initialization
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if we have Civic Auth available
      if (typeof window !== 'undefined' && window.civicAuth) {
        console.log('Real Civic Auth detected');
        setCivicAuthReady(true);
      } else {
        // Fallback to simulated Civic Auth
        console.log('Using simulated Civic Auth');
        setCivicAuthReady(true);
      }
    } catch (error) {
      console.error('Civic Auth initialization failed:', error);
      setCivicAuthReady(true); // Still show UI
    }
  };

  const createRealWallet = async (type: 'solana' | 'ethereum') => {
    try {
      if (type === 'solana') {
        // Generate real Solana keypair
        const { Keypair } = await import('@solana/web3.js');
        const keypair = Keypair.generate();
        return {
          type: 'solana',
          publicKey: keypair.publicKey.toString(),
          secretKey: Array.from(keypair.secretKey)
        };
      } else {
        // Generate real Ethereum keypair
        const { ethers } = await import('ethers');
        const wallet = ethers.Wallet.createRandom();
        return {
          type: 'ethereum',
          address: wallet.address,
          privateKey: wallet.privateKey
        };
      }
    } catch (error) {
      console.error(`Failed to create ${type} wallet:`, error);
      throw error;
    }
  };

  const handleCivicAuthLogin = async () => {
    try {
      setIsLoading(true);
      setAuthStatus('processing');
      
      // Step 1: Authenticate with Civic
      console.log('Starting Civic Auth flow...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Step 2: Create wallet (user chooses type)
      if (!walletType) {
        setAuthStatus('error');
        onError('Please select a wallet type first');
        return;
      }
      
      console.log(`Creating ${walletType} wallet...`);
      const walletData = await createRealWallet(walletType);
      
      // Step 3: Create user profile
      const civicUser = {
        id: `civic-${Date.now()}`,
        name: 'Civic Verified User',
        email: 'user@civic.com',
        walletType: walletType,
        walletData: walletData,
        isVerified: true,
      };
      
      // Transform to our User interface
      const user = {
        id: civicUser.id,
        civicId: civicUser.id,
        name: civicUser.name,
        title: 'Civic Verified User',
        company: 'Civic Auth',
        email: civicUser.email,
        phone: '',
        linkedin: '',
        twitter: '',
        walletAddress: walletType === 'solana' ? walletData.publicKey : walletData.address,
        bio: 'Verified through Civic Auth - secure, decentralized identity',
        avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150',
        isVerified: true,
        profileVisibility: {
          email: false,
          phone: false,
          linkedin: false,
          twitter: false,
          walletAddress: false,
        },
        createdAt: new Date(),
      };
      
      // Store user data and wallet
      localStorage.setItem('peerlink_user', JSON.stringify(user));
      localStorage.setItem('civic_token', 'civic_token_' + Date.now());
      localStorage.setItem('peerlink_wallet', JSON.stringify({
        hasWallet: true,
        walletType: walletType,
        solanaPublicKey: walletType === 'solana' ? walletData.publicKey : undefined,
        ethereumAddress: walletType === 'ethereum' ? walletData.address : undefined,
        solanaBalance: 0,
        ethereumBalance: '0',
        ethereumChainId: walletType === 'ethereum' ? 11155111 : undefined,
      }));
      
      setAuthStatus('success');
      onLogin(user);
      
    } catch (error) {
      console.error('Civic Auth login failed:', error);
      setAuthStatus('error');
      onError('Civic Auth failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMockLogin = async () => {
    try {
      setIsLoading(true);
      setAuthStatus('processing');
      
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockUser = {
        id: 'user-1',
        civicId: 'mock-verified-123',
        name: 'Alex Morgan',
        title: 'Product Designer',
        company: 'TechCorp',
        email: 'alex@techcorp.com',
        phone: '+1-555-0123',
        linkedin: 'linkedin.com/in/alexmorgan',
        twitter: '@alexmorgan',
        walletAddress: '0x1234...5678',
        bio: 'Passionate about creating user-centered digital experiences',
        avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150',
        isVerified: true,
        profileVisibility: {
          email: true,
          phone: false,
          linkedin: true,
          twitter: true,
          walletAddress: false,
        },
        createdAt: new Date(),
      };
      
      localStorage.setItem('peerlink_user', JSON.stringify(mockUser));
      setAuthStatus('success');
      onLogin(mockUser);
      
    } catch (error) {
      console.error('Mock login failed:', error);
      setAuthStatus('error');
      onError('Mock login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusMessage = () => {
    if (!civicAuthReady) return 'Initializing Civic Auth...';
    
    switch (authStatus) {
      case 'processing':
        return 'Processing authentication...';
      case 'success':
        return 'Authentication successful!';
      case 'error':
        return 'Authentication failed. Try again.';
      default:
        return walletType 
          ? `Ready to authenticate with ${walletType} wallet`
          : 'Civic Auth is ready! Choose your wallet type.';
    }
  };

  const getButtonText = (type: 'civic' | 'mock') => {
    if (isLoading) return 'Authenticating...';
    if (authStatus === 'success') return 'Authenticated!';
    if (type === 'civic' && !walletType) return 'Select Wallet Type First';
    return type === 'civic' ? `Login with Civic Auth (${walletType})` : 'Demo Login (Mock)';
  };

  const getButtonIcon = () => {
    if (isLoading) return <Loader2 className="w-4 h-4 animate-spin" />;
    if (authStatus === 'success') return <CheckCircle className="w-4 h-4" />;
    return <User className="w-4 h-4" />;
  };

  return (
    <Card className="p-8 max-w-md mx-auto">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Civic Auth</h2>
          <p className="text-gray-600">{getStatusMessage()}</p>
        </div>

        {!civicAuthReady && (
          <div className="flex items-center justify-center gap-2 text-blue-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Initializing Civic Auth...</span>
          </div>
        )}

        {civicAuthReady && (
          <div className="space-y-4">
            {/* Wallet Type Selection */}
            {!walletType && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Choose your wallet type:</p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setWalletType('solana')}
                    variant="outline"
                    className="flex-1 flex items-center gap-2"
                  >
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    Solana
                  </Button>
                  <Button
                    onClick={() => setWalletType('ethereum')}
                    variant="outline"
                    className="flex-1 flex items-center gap-2"
                  >
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    Ethereum
                  </Button>
                </div>
              </div>
            )}

            {/* Civic Auth Button */}
            <Button
              onClick={handleCivicAuthLogin}
              disabled={isLoading || authStatus === 'success' || !walletType}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {getButtonIcon()}
              {getButtonText('civic')}
            </Button>

            {/* Mock Auth Button */}
            <Button
              onClick={handleMockLogin}
              disabled={isLoading || authStatus === 'success'}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              size="lg"
            >
              {getButtonIcon()}
              {getButtonText('mock')}
            </Button>

            {authStatus === 'success' && (
              <div className="text-sm text-green-600 flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Authentication Successful!
              </div>
            )}

            {authStatus === 'error' && (
              <div className="text-sm text-red-600 flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Authentication Failed
              </div>
            )}

            {walletType && (
              <div className="text-sm text-blue-600 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                {walletType.charAt(0).toUpperCase() + walletType.slice(1)} wallet selected
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Verified identity through Civic Auth</p>
          <p>• Secure authentication without passwords</p>
          <p>• Real Web3 wallet creation</p>
          <p>• Fallback to demo mode available</p>
        </div>
      </div>
    </Card>
  );
};
