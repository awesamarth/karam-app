// Database connection for backend script
// Uses the parent project's Prisma client

let PrismaClient: any;

try {
  // Try to import from parent project's node_modules
  PrismaClient = require('../node_modules/@prisma/client').PrismaClient;
} catch (error) {
  console.error('Failed to import PrismaClient:', error);
  process.exit(1);
}

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Database helper functions
export async function ensureUserExists(address: string) {
  await prisma.user.upsert({
    where: { address },
    update: {},
    create: { address }
  });
}

export async function storeKarmaTransaction(
  type: 'given' | 'slashed',
  fromAddress: string,
  toAddress: string,
  amount: string,
  reason: string,
  timestamp: Date,
  txHash?: string,
  blockNumber?: bigint
) {
  // Ensure both users exist
  await ensureUserExists(fromAddress);
  await ensureUserExists(toAddress);

  await prisma.karmaTransaction.create({
    data: {
      type,
      fromAddress,
      toAddress,
      amount,
      reason,
      timestamp,
      txHash,
      blockNumber
    }
  });
}