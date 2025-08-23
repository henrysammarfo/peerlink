import { Connection, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram, sendAndConfirmTransaction } from '@solana/web3.js';
import { Keypair } from '@solana/web3.js';

// Solana network configuration
const SOLANA_RPC_ENDPOINT = 'https://api.devnet.solana.com'; // Using devnet for testing
const connection = new Connection(SOLANA_RPC_ENDPOINT, 'confirmed');

export interface SolanaWallet {
  publicKey: string;
  balance: number;
  network: string;
}

export class SolanaWalletService {
  private static instance: SolanaWalletService;
  private wallet: Keypair | null = null;

  static getInstance(): SolanaWalletService {
    if (!SolanaWalletService.instance) {
      SolanaWalletService.instance = new SolanaWalletService();
    }
    return SolanaWalletService.instance;
  }

  // Create a new wallet for a user
  async createWallet(): Promise<SolanaWallet> {
    try {
      this.wallet = Keypair.generate();
      
      // Airdrop some SOL for testing (devnet only)
      const signature = await connection.requestAirdrop(
        this.wallet.publicKey,
        1 * LAMPORTS_PER_SOL // 1 SOL
      );
      
      await connection.confirmTransaction(signature);
      
      const balance = await this.getBalance();
      
      return {
        publicKey: this.wallet.publicKey.toString(),
        balance,
        network: 'devnet'
      };
    } catch (error) {
      console.error('Error creating Solana wallet:', error);
      throw new Error('Failed to create Solana wallet');
    }
  }

  // Get wallet balance
  async getBalance(): Promise<number> {
    if (!this.wallet) {
      throw new Error('No wallet available');
    }
    
    try {
      const balance = await connection.getBalance(this.wallet.publicKey);
      return balance / LAMPORTS_PER_SOL; // Convert lamports to SOL
    } catch (error) {
      console.error('Error getting balance:', error);
      return 0;
    }
  }

  // Send SOL to another address
  async sendTransaction(toAddress: string, amount: number): Promise<string> {
    if (!this.wallet) {
      throw new Error('No wallet available');
    }
    
    try {
      const toPublicKey = new PublicKey(toAddress);
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: this.wallet.publicKey,
          toPubkey: toPublicKey,
          lamports: amount * LAMPORTS_PER_SOL
        })
      );
      
      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [this.wallet]
      );
      
      return signature;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw new Error('Failed to send transaction');
    }
  }

  // Get wallet info
  getWalletInfo(): SolanaWallet | null {
    if (!this.wallet) return null;
    
    return {
      publicKey: this.wallet.publicKey.toString(),
      balance: 0, // Will be updated when getBalance is called
      network: 'devnet'
    };
  }

  // Check if wallet exists
  hasWallet(): boolean {
    return this.wallet !== null;
  }

  // Get public key as string
  getPublicKey(): string | null {
    return this.wallet?.publicKey.toString() || null;
  }
}

export default SolanaWalletService;
