import {
  worldchainPublicClient,
  optimismPublicClient,
} from './config';
import { formatEther, parseEventLogs } from 'viem';
import { storeKarmaTransaction } from './database';
import { notifyKarmaReceived, notifyKarmaSlashed } from './notifications';
import {
  KARAM_CONTRACT_ABI,
  OPSEPOlIA_REDISTRIBUTION_CONTRACT_ADDRESS,
  REDISTRIBUTION_CONTRACT_ABI,
  WORLDMAINNET_KARAM_CONTRACT_ADDRESS
} from './constants';

// Event listeners
export function setupKarmaEventListeners() {
  console.log('🎯 Setting up Karma event listeners on Worldchain...');

  // Listen for KarmaGiven events
  worldchainPublicClient.watchContractEvent({
    address: WORLDMAINNET_KARAM_CONTRACT_ADDRESS as `0x${string}`,
    abi: KARAM_CONTRACT_ABI,
    eventName: 'KarmaGiven',
    onLogs: async (logs) => {
      for (const log of logs) {
        try {
          const { from, to, amount, reason, timestamp } = (log as any).args;

          console.log('📈 KarmaGiven event:', {
            from,
            to,
            amount: formatEther(amount),
            reason,
            txHash: log.transactionHash
          });

          await storeKarmaTransaction(
            'given',
            from,
            to,
            amount.toString(),
            reason,
            new Date(Number(timestamp) * 1000),
            log.transactionHash!,
            log.blockNumber!
          );

          // Send notification to user
          await notifyKarmaReceived(
            to,
            formatEther(amount),
            from,
            reason
          );

        } catch (error) {
          console.error('❌ Error processing KarmaGiven event:', error);
        }
      }
    }
  });

  // Listen for KarmaSlashed events
  worldchainPublicClient.watchContractEvent({
    address: WORLDMAINNET_KARAM_CONTRACT_ADDRESS as `0x${string}`,
    abi: KARAM_CONTRACT_ABI,
    eventName: 'KarmaSlashed',
    onLogs: async (logs) => {
      for (const log of logs) {
        try {
          const { slasher, victim, amount, reason, timestamp } = (log as any).args;

          console.log('📉 KarmaSlashed event:', {
            slasher,
            victim,
            amount: formatEther(amount),
            reason,
            txHash: log.transactionHash
          });

          await storeKarmaTransaction(
            'slashed',
            slasher,
            victim,
            amount.toString(),
            reason,
            new Date(Number(timestamp) * 1000),
            log.transactionHash!,
            log.blockNumber!
          );

          // Send notification to user
          await notifyKarmaSlashed(
            victim,
            formatEther(amount),
            slasher,
            reason
          );

        } catch (error) {
          console.error('❌ Error processing KarmaSlashed event:', error);
        }
      }
    }
  });

  console.log('✅ Karma event listeners active');
}

export function setupRedistributionEventListeners() {
  console.log('🎲 Setting up Redistribution event listeners on Optimism Sepolia...');

  // Listen for EntropyResult events
  optimismPublicClient.watchContractEvent({
    address: OPSEPOlIA_REDISTRIBUTION_CONTRACT_ADDRESS as `0x${string}`,
    abi: REDISTRIBUTION_CONTRACT_ABI,
    eventName: 'EntropyResult',
    onLogs: async (logs) => {
      for (const log of logs) {
        try {
          const { sequenceNumber, result } = (log as any).args;

          console.log('🎲 EntropyResult event:', {
            sequenceNumber,
            result: result.toString(),
            txHash: log.transactionHash
          });

          // Check if redistribution should happen (result === 0)
          if (result === 0n) {
            console.log('🎉 REDISTRIBUTION TRIGGERED! Result is 0');

            // Import and call the redistribution function
            const { triggerRedistribution } = await import('./index');
            await triggerRedistribution();

          } else {
            console.log(`⏭️  No redistribution. Result: ${result.toString()}`);
          }

        } catch (error) {
          console.error('❌ Error processing EntropyResult event:', error);
        }
      }
    }
  });

  console.log('✅ Redistribution event listeners active');
}

export async function startEventListeners() {
  console.log('🚀 Starting all event listeners...');

  setupKarmaEventListeners();
  setupRedistributionEventListeners();

  console.log('🎯 All event listeners started successfully');
}