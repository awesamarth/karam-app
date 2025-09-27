import 'dotenv/config';
import { createPublicClient, createWalletClient, http } from 'viem';
import { worldchainSepolia, optimismSepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

// Environment variables
export const DATABASE_URL = process.env.DATABASE_URL!;
export const DEV_PRIVATE_KEY = process.env.DEV_PRIVATE_KEY! as `0x${string}`;
export const KARAM_CONTRACT_ADDRESS = process.env.WORLDSEPOLIA_KARAM_CONTRACT_ADDRESS! as `0x${string}`;
export const REDISTRIBUTION_CONTRACT_ADDRESS = process.env.OPSEPOLIA_REDISTRIBUTION_CONTRACT_ADDRESS! as `0x${string}`;

// Account from private key
export const account = privateKeyToAccount(DEV_PRIVATE_KEY);

// Public clients for reading events
export const worldchainPublicClient = createPublicClient({
  chain: worldchainSepolia,
  transport: http(),
});

export const optimismPublicClient = createPublicClient({
  chain: optimismSepolia,
  transport: http(),
});

// Wallet clients for sending transactions
export const worldchainWalletClient = createWalletClient({
  account,
  chain: worldchainSepolia,
  transport: http(),
}) as any;

export const optimismWalletClient = createWalletClient({
  account,
  chain: optimismSepolia,
  transport: http(),
}) as any;

// Contract ABIs
export const KARAM_ABI = [
  {
    "type": "function",
    "name": "allUsers",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "karma",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "dailyReset",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "redistibuteKarma",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "KarmaGiven",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "reason",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "timestamp",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "KarmaSlashed",
    "inputs": [
      {
        "name": "slasher",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "victim",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "reason",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "timestamp",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
] as const;

export const REDISTRIBUTION_ABI = [
  {
    "type": "function",
    "name": "request",
    "inputs": [],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "event",
    "name": "EntropyResult",
    "inputs": [
      {
        "name": "sequenceNumber",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      },
      {
        "name": "result",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
] as const;