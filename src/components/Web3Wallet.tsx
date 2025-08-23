import React, { useState } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Wallet, Coins, Send, RefreshCw, Plus } from 'lucide-react';

export const Web3Wallet: React.FC = () => {
  const { 
    user, 
    isLoading, 
    createSolanaWallet, 
    createEthereumWallet, 
    refreshBalances,
    sendSolanaTransaction,
    sendEthereumTransaction
  } = useWeb3();

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [lastTxHash, setLastTxHash] = useState('');

  const handleCreateSolanaWallet = async () => {
    try {
      await createSolanaWallet();
    } catch (error) {
      console.error('Failed to create Solana wallet:', error);
    }
  };

  const handleCreateEthereumWallet = async () => {
    try {
      await createEthereumWallet();
    } catch (error) {
      console.error('Failed to create Ethereum wallet:', error);
    }
  };

  const handleSendTransaction = async () => {
    if (!recipient || !amount) return;

    setIsSending(true);
    try {
      let txHash = '';
      
      if (user.walletType === 'solana') {
        txHash = await sendSolanaTransaction(recipient, parseFloat(amount));
      } else if (user.walletType === 'ethereum') {
        txHash = await sendEthereumTransaction(recipient, amount);
      }
      
      setLastTxHash(txHash);
      setRecipient('');
      setAmount('');
    } catch (error) {
      console.error('Transaction failed:', error);
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

  if (!user.hasWallet) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Wallet Found</h3>
          <p className="text-gray-600 mb-6">
            Create a wallet to start using Web3 features
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={handleCreateSolanaWallet} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Solana Wallet
            </Button>
            <Button onClick={handleCreateEthereumWallet} variant="outline" className="flex items-center gap-2">
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
          <Button onClick={refreshBalances} variant="outline" size="sm" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user.walletType === 'solana' && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Wallet Type</label>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium">Solana</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Public Key</label>
                <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                  {user.solanaPublicKey?.slice(0, 8)}...{user.solanaPublicKey?.slice(-8)}
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Balance</label>
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-yellow-500" />
                  <span className="text-lg font-semibold">
                    {user.solanaBalance?.toFixed(4) || '0'} SOL
                  </span>
                </div>
              </div>
            </>
          )}
          
          {user.walletType === 'ethereum' && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Wallet Type</label>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Ethereum</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Address</label>
                <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                  {user.ethereumAddress?.slice(0, 8)}...{user.ethereumAddress?.slice(-8)}
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Balance</label>
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-yellow-500" />
                  <span className="text-lg font-semibold">
                    {user.ethereumBalance || '0'} ETH
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Network</label>
                <span className="text-sm">
                  Chain ID: {user.ethereumChainId}
                </span>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Send Transaction */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Send Transaction</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipient Address
            </label>
            <Input
              type="text"
              placeholder={user.walletType === 'solana' ? 'Solana Public Key' : 'Ethereum Address'}
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount ({user.walletType === 'solana' ? 'SOL' : 'ETH'})
            </label>
            <Input
              type="number"
              step="0.0001"
              placeholder="0.001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          
          <Button 
            onClick={handleSendTransaction} 
            disabled={!recipient || !amount || isSending}
            className="w-full flex items-center justify-center gap-2"
          >
            {isSending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Transaction
              </>
            )}
          </Button>
        </div>
        
        {lastTxHash && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Transaction successful!</strong> Hash: {lastTxHash}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};
