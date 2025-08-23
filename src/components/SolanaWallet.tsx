import React, { useState, useEffect } from 'react';
import { Wallet, Coins, Send, Plus } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import SolanaWalletService, { SolanaWallet } from '../services/solanaWallet';

interface SolanaWalletProps {
  userId: string;
}

export const SolanaWalletComponent: React.FC<SolanaWalletProps> = ({ userId }) => {
  const [wallet, setWallet] = useState<SolanaWallet | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateWallet, setShowCreateWallet] = useState(false);
  const [showSendForm, setShowSendForm] = useState(false);
  const [sendAmount, setSendAmount] = useState('');
  const [sendAddress, setSendAddress] = useState('');
  const [isSending, setIsSending] = useState(false);

  const walletService = SolanaWalletService.getInstance();

  useEffect(() => {
    // Check if user already has a wallet
    const existingWallet = walletService.getWalletInfo();
    if (existingWallet) {
      setWallet(existingWallet);
      updateBalance();
    }
  }, []);

  const updateBalance = async () => {
    try {
      const balance = await walletService.getBalance();
      setWallet(prev => prev ? { ...prev, balance } : null);
    } catch (error) {
      console.error('Error updating balance:', error);
    }
  };

  const handleCreateWallet = async () => {
    setIsLoading(true);
    try {
      const newWallet = await walletService.createWallet();
      setWallet(newWallet);
      setShowCreateWallet(false);
    } catch (error) {
      console.error('Error creating wallet:', error);
      alert('Failed to create wallet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendTransaction = async () => {
    if (!sendAmount || !sendAddress) {
      alert('Please enter both amount and address');
      return;
    }

    const amount = parseFloat(sendAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setIsSending(true);
    try {
      const signature = await walletService.sendTransaction(sendAddress, amount);
      alert(`Transaction sent! Signature: ${signature}`);
      setShowSendForm(false);
      setSendAmount('');
      setSendAddress('');
      updateBalance(); // Refresh balance
    } catch (error) {
      console.error('Error sending transaction:', error);
      alert('Failed to send transaction. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  if (!wallet) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No Solana Wallet
          </h3>
          <p className="text-gray-600 mb-4">
            Create a Solana wallet to start using Web3 features
          </p>
          <Button
            onClick={() => setShowCreateWallet(true)}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Creating...' : 'Create Wallet'}
          </Button>
        </div>

        {showCreateWallet && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 mb-3">
              This will create a new Solana wallet on devnet with 1 SOL for testing.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={handleCreateWallet}
                disabled={isLoading}
                size="sm"
              >
                Confirm Create
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateWallet(false)}
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Wallet className="w-5 h-5 mr-2 text-purple-600" />
          Solana Wallet
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={updateBalance}
        >
          <Coins className="w-4 h-4 mr-1" />
          Refresh
        </Button>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Network</p>
          <p className="font-medium text-gray-800">{wallet.network}</p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Public Key</p>
          <p className="font-mono text-sm text-gray-800 break-all">
            {wallet.publicKey}
          </p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Balance</p>
          <p className="font-medium text-gray-800">
            {wallet.balance.toFixed(4)} SOL
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setShowSendForm(!showSendForm)}
            variant="outline"
            className="flex-1"
          >
            <Send className="w-4 h-4 mr-1" />
            Send SOL
          </Button>
        </div>

        {showSendForm && (
          <div className="p-4 bg-blue-50 rounded-lg space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Address
              </label>
              <Input
                type="text"
                value={sendAddress}
                onChange={(e) => setSendAddress(e.target.value)}
                placeholder="Enter Solana address"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (SOL)
              </label>
              <Input
                type="number"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                placeholder="0.1"
                step="0.001"
                min="0"
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSendTransaction}
                disabled={isSending}
                size="sm"
                className="flex-1"
              >
                {isSending ? 'Sending...' : 'Send'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowSendForm(false)}
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
