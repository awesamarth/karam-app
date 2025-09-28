import { Address } from 'viem';
import {
  worldchainPublicClient,
} from './config';
import { KARAM_CONTRACT_ABI, WORLDMAINNET_KARAM_CONTRACT_ADDRESS } from './constants';
import { prisma } from './database';

interface LeaderboardEntry {
  address: string;
  karma: bigint;
  rank: number;
}



interface Leaderboard {
  top3: LeaderboardEntry[];
  updated: Date;
}

let currentLeaderboard: Leaderboard | null = null;

export async function updateLeaderboard(): Promise<Leaderboard> {
  try {
    console.log('📊 Updating leaderboard...');

    // Step 1: Get all users from allUsers array directly
    const allUsers = await worldchainPublicClient.readContract({
      address: WORLDMAINNET_KARAM_CONTRACT_ADDRESS,
      abi: KARAM_CONTRACT_ABI,
      functionName: 'allUsers',
      args: []
    }) as string[];

    console.log(`📋 Found ${allUsers.length} registered users`);

    if (allUsers.length === 0) {
      console.log('⚠️  No users found, returning empty leaderboard');
      return { top3: [], updated: new Date() };
    }


    const karamContract = {
      address: WORLDMAINNET_KARAM_CONTRACT_ADDRESS,
      abi: KARAM_CONTRACT_ABI
    }
    // Step 2: Use multicall to get all karma balances efficiently
    const allUsersArray = await worldchainPublicClient.readContract({
      address: WORLDMAINNET_KARAM_CONTRACT_ADDRESS as `0x${string}`,
      abi: KARAM_CONTRACT_ABI,
      functionName: 'karma' as const,
    }) as Address[];

    let karmaArray:any = []

    for (let i=0; i < allUsersArray.length;i++){
      karmaArray.push({...karamContract, functionName:'karma', args:[allUsersArray[i]]})

    }



    console.log('🔍 Fetching karma balances via multicall...');

    const karmaResults = await worldchainPublicClient.multicall({
      contracts: karmaArray
    });

    // Step 3: Process results and create leaderboard entries
    const leaderboardEntries: LeaderboardEntry[] = [];

    karmaResults.forEach((result, index) => {
      if (result.status === 'success') {
        leaderboardEntries.push({
          address: allUsers[index],
          karma: result.result as bigint,
          rank: 0 // Will be set after sorting
        });
      } else {
        console.error(`❌ Failed to get karma for ${allUsers[index]}:`, result.error);
      }
    });

    // Step 4: Sort by karma (highest first) and assign ranks
    leaderboardEntries.sort((a, b) => {
      if (a.karma > b.karma) return -1;
      if (a.karma < b.karma) return 1;
      return 0;
    });

    // Assign ranks
    leaderboardEntries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    // Step 5: Get top 3
    const top3 = leaderboardEntries.slice(0, 3);

    const leaderboard: Leaderboard = {
      top3,
      updated: new Date()
    };

    currentLeaderboard = leaderboard;

    console.log('🏆 Leaderboard updated:');
    top3.forEach((entry, index) => {
      const karmaEther = Number(entry.karma) / 1e18;
      console.log(`  ${index + 1}. ${entry.address.slice(0, 6)}...${entry.address.slice(-4)} - ${karmaEther.toFixed(2)} karma`);
    });

    // Step 6: Update ENS subdomains (if there are changes)
    await updateENSSubdomains(top3);

    return leaderboard;

  } catch (error) {
    console.error('❌ Error updating leaderboard:', error);
    throw error;
  }
}

async function updateENSSubdomains(top3: LeaderboardEntry[]) {
  try {


    // TODO: Implement ENS subdomain updates
    // This would require:
    // 1. ENS domain ownership (karam.eth)
    // 2. ENS controller/registrar contract interactions
    // 3. Setting subdomain resolvers for 1st.karam.eth, 2nd.karam.eth, 3rd.karam.eth

    console.log('🚧 ENS subdomain updates not implemented yet');
    console.log('📝 Planned subdomains:');
    top3.forEach((entry, index) => {
      const subdomain = ['god', 'angel', 'saint'][index];
      console.log(`  ${subdomain}.karam.eth → ${entry.address}`);
    });

  } catch (error) {
    console.error('❌ Error updating ENS subdomains:', error);
  }
}

export function getCurrentLeaderboard(): Leaderboard | null {
  return currentLeaderboard;
}

export async function getLeaderboardWithUserRank(userAddress: string): Promise<{
  leaderboard: Leaderboard;
  userRank: number | null;
}> {
  const leaderboard = currentLeaderboard || await updateLeaderboard();

  // Find user's rank (would need to fetch full leaderboard for this)
  // For now, just return if they're in top 3
  const userInTop3 = leaderboard.top3.find(entry =>
    entry.address.toLowerCase() === userAddress.toLowerCase()
  );

  return {
    leaderboard,
    userRank: userInTop3?.rank || null
  };
}