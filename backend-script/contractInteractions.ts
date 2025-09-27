import {
  worldchainWalletClient,
  optimismWalletClient,
  KARAM_CONTRACT_ADDRESS,
  REDISTRIBUTION_CONTRACT_ADDRESS,
  KARAM_ABI,
  REDISTRIBUTION_ABI
} from './config';

// Contract interaction functions

export async function callDailyReset() {
  try {
    console.log('🔄 Calling dailyReset on Karam contract...');

    const hash = await worldchainWalletClient.writeContract({
      address: KARAM_CONTRACT_ADDRESS,
      abi: KARAM_ABI,
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
      address: KARAM_CONTRACT_ADDRESS,
      abi: KARAM_ABI,
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
      address: REDISTRIBUTION_CONTRACT_ADDRESS,
      abi: REDISTRIBUTION_ABI,
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