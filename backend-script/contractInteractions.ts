import {
  worldchainWalletClient,
  optimismWalletClient,

} from './config';
import { KARAM_CONTRACT_ABI, OPSEPOlIA_REDISTRIBUTION_CONTRACT_ADDRESS, REDISTRIBUTION_CONTRACT_ABI, WORLDMAINNET_KARAM_CONTRACT_ADDRESS } from './constants';

// Contract interaction functions

export async function callDailyReset() {
  try {
    console.log('🔄 Calling dailyReset on Karam contract...');

    const hash = await worldchainWalletClient.writeContract({
      address: WORLDMAINNET_KARAM_CONTRACT_ADDRESS,
      abi: KARAM_CONTRACT_ABI,
      functionName: 'dailyReset',
      args: []
    });

    console.log('✅ DailyReset transaction sent:', hash);
    return hash;

  } catch (error) {
    console.error('❌ Error calling dailyReset:', error);
    throw error;
  }
}

export async function callRedistributeKarma() {
  try {
    console.log('💰 Calling redistibuteKarma on Karam contract...');

    const hash = await worldchainWalletClient.writeContract({
      address: WORLDMAINNET_KARAM_CONTRACT_ADDRESS,
      abi: KARAM_CONTRACT_ABI,
      functionName: 'redistibuteKarma',
      args: []
    });

    console.log('✅ RedistibuteKarma transaction sent:', hash);
    return hash;

  } catch (error) {
    console.error('❌ Error calling redistibuteKarma:', error);
    throw error;
  }
}

export async function requestRandomness() {
  try {
    console.log('🎲 Requesting randomness from Redistribution contract...');

    // TODO: Get the required fee from the contract first
    // For now, sending a small amount as fee
    const fee = BigInt('1000000000000000'); // 0.001 ETH

    const hash = await optimismWalletClient.writeContract({
      address: OPSEPOlIA_REDISTRIBUTION_CONTRACT_ADDRESS,
      abi: REDISTRIBUTION_CONTRACT_ABI,
      functionName: 'request',
      args: [],
      value: fee
    });

    console.log('✅ Request randomness transaction sent:', hash);
    return hash;

  } catch (error) {
    console.error('❌ Error requesting randomness:', error);
    throw error;
  }
}