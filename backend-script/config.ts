import 'dotenv/config';
import { createPublicClient, createWalletClient, http } from 'viem';
import { worldchainSepolia, optimismSepolia, worldchain } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

// Environment variables
export const DATABASE_URL = process.env.DATABASE_URL!;
export const DEV_PRIVATE_KEY = process.env.DEV_PRIVATE_KEY! as `0x${string}`;

// Account from private key
export const account = privateKeyToAccount(DEV_PRIVATE_KEY);

// Public clients for reading events
export const worldchainPublicClient = createPublicClient({
  chain: worldchain,
  transport: http(),
});

export const optimismPublicClient = createPublicClient({
  chain: optimismSepolia,
  transport: http(),
});

// Wallet clients for sending transactions
export const worldchainWalletClient = createWalletClient({
  account,
  chain: worldchain,
  transport: http(),
}) as any;

export const optimismWalletClient = createWalletClient({
  account,
  chain: optimismSepolia,
  transport: http(),
}) as any;
