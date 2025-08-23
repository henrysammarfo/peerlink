import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Wallet, Coins, Send, RefreshCw, Plus, CheckCircle } from 'lucide-react';

interface Web3WalletProps {
  user: any;
}

export const Web3Wallet: React.FC<Web3WalletProps> = ({ user }) => {
  const [walletData, setWalletData] = useState({
    hasWallet: false,
    walletType: null as 'solana' | 'ethereum' | null,
    solanaPublicKey: '',
    solanaBalance: 0,
    ethereumAddress: '',
    ethereumBalance: '0',
    ethereumChainId: 11155111,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [lastTxHash, setLastTxHash] = useState('');
  const [message, setMessage] = useState('');

  // Check for existing wallet on component mount
  useEffect(() => {
    const storedWallet = localStorage.getItem('peerlink_wallet');
    if (storedWallet) {
      try {
        const wallet = JSON.parse(storedWallet);
        setWalletData(wallet);
      } catch (error) {
        console.error('Error parsing stored wallet:', error);
      }
    }
  }, []);

  const createSolanaWallet = async () => {
    setIsLoading(true);
    try {
      // Generate a mock Solana wallet
      const mockPublicKey = 'So' + '1'.repeat(43); // Mock Solana public key
      
      const newWalletData = {
        hasWallet: true,
        walletType: 'solana' as const,
        solanaPublicKey: mockPublicKey,
        solanaBalance: 0.5,
        ethereumAddress: '',
        ethereumBalance: '0',
        ethereumChainId: 11155111,
      };
      
      setWalletData(newWalletData);
      localStorage.setItem('peerlink_wallet', JSON.stringify(newWalletData));
      setMessage('Solana wallet created successfully!');
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to create Solana wallet:', error);
      setMessage('Failed to create Solana wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const createEthereumWallet = async () => {
    setIsLoading(true);
    try {
      // Generate a mock Ethereum wallet
      const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
      
      const newWalletData = {
        hasWallet: true,
        walletType: 'ethereum' as const,
        solanaPublicKey: '',
        solanaBalance: 0,
        ethereumAddress: mockAddress,
        ethereumBalance: '0.1',
        ethereumChainId: 11155111,
      };
      
      setWalletData(newWalletData);
      localStorage.setItem('peerlink_wallet', JSON.stringify(newWalletData));
      setMessage('Ethereum wallet created successfully!');
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to create Ethereum wallet:', error);
      setMessage('Failed to create Ethereum wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBalances = async () => {
    setIsLoading(true);
    try {
      // Simulate balance refresh
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (walletData.walletType === 'solana') {
        const newBalance = Math.random() * 2;
        const updatedWallet = { ...walletData, solanaBalance: parseFloat(newBalance.toFixed(4)) };
        setWalletData(updatedWallet);
        localStorage.setItem('peerlink_wallet', JSON.stringify(updatedWallet));
      } else if (walletData.walletType === 'ethereum') {
        const newBalance = (Math.random() * 0.5).toFixed(4);
        const updatedWallet = { ...walletData, ethereumBalance: newBalance };
        setWalletData(updatedWallet);
        localStorage.setItem('peerlink_wallet', JSON.stringify(updatedWallet));
      }
      
      setMessage('Balances refreshed!');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      console.error('Failed to refresh balances:', error);
      setMessage('Failed to refresh balances');
    } finally {
      setIsLoading(false);
    }
  };

  const sendTransaction = async () => {
    if (!recipient || !amount) {
      setMessage('Please enter recipient and amount');
      return;
    }

    setIsSending(true);
    try {
      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const txHash = '0x' + Math.random().toString(16).substr(2, 64);
      setLastTxHash(txHash);
      setMessage('Transaction sent successfully!');
      
      // Update balances
      if (walletData.walletType === 'solana') {
        const newBalance = Math.max(0, walletData.solanaBalance - parseFloat(amount));
        const updatedWallet = { ...walletData, solanaBalance: parseFloat(newBalance.toFixed(4)) };
        setWalletData(updatedWallet);
        localStorage.setItem('peerlink_wallet', JSON.stringify(updatedWallet));
      } else if (walletData.walletType === 'ethereum') {
        const newBalance = Math.max(0, parseFloat(walletData.ethereumBalance) - parseFloat(amount));
        const updatedWallet = { ...walletData, ethereumBalance: newBalance.toFixed(4) };
        setWalletData(updatedWallet);
        localStorage.setItem('peerlink_wallet', JSON.stringify(updatedWallet));
      }
      
      setRecipient('');
      setAmount('');
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Transaction failed:', error);
      setMessage('Transaction failed');
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading wallet...</span>
        </div>
      </Card>
    );
  }

  if (!walletData.hasWallet) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Wallet Found</h3>
          <p className="text-gray-600 mb-6">
            Create a wallet to start using Web3 features
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={createSolanaWallet} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Solana Wallet
            </Button>
            <Button onClick={createEthereumWallet} variant="outline" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Ethereum Wallet
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Info */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Wallet Information</h3>
          <Button onClick={refreshBalances} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
        
        {walletData.walletType === 'solana' ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Network</span>
              <span className="text-blue-600 font-medium">Solana</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Public Key</span>
              <span className="text-sm font-mono text-gray-600">
                {walletData.solanaPublicKey.slice(0, 8)}...{walletData.solanaPublicKey.slice(-8)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Balance</span>
              <span className="text-green-600 font-medium">{walletData.solanaBalance} SOL</span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Network</span>
              <span className="text-blue-600 font-medium">Ethereum (Sepolia)</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Address</span>
              <span className="text-sm font-mono text-gray-600">
                {walletData.ethereumAddress.slice(0, 8)}...{walletData.ethereumAddress.slice(-8)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Balance</span>
              <span className="text-green-600 font-medium">{walletData.ethereumBalance} ETH</span>
            </div>
          </div>
        )}
      </Card>

      {/* Send Transaction */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Send Transaction</h3>
        <div className="space-y-4">
          <Input
            label="Recipient Address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder={walletData.walletType === 'solana' ? 'Solana public key' : 'Ethereum address'}
          />
          <Input
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={walletData.walletType === 'solana' ? 'SOL amount' : 'ETH amount'}
            type="number"
            step="0.001"
          />
          <Button 
            onClick={sendTransaction} 
            disabled={isSending || !recipient || !amount}
            className="w-full"
          >
            {isSending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Transaction
              </>
            )}
          </Button>
        </div>
        
        {lastTxHash && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Transaction Hash:</span>
            </div>
            <p className="text-xs font-mono text-green-600 mt-1 break-all">
              {lastTxHash}
            </p>
          </div>
        )}
      </Card>

      {/* Status Messages */}
      {message && (
        <Card className="p-4 bg-blue-50 border border-blue-200">
          <p className="text-blue-700 text-center">{message}</p>
        </Card>
      )}
    </div>
  );
};
