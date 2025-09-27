import * as cron from 'node-cron';
import { startEventListeners } from './eventListeners';
import {
  callDailyReset,
  callRedistributeKarma,
  requestRandomness
} from './contractInteractions';
import { updateLeaderboard } from './leaderboard';

// Day counter state (starts at 25, increments daily, resets to 25 on redistribution)
let currentDay = 25;

// Redistribution trigger function
export async function triggerRedistribution() {
  try {
    console.log('🎉 TRIGGERING REDISTRIBUTION PROCESS...');

    // Call redistibuteKarma on Karam contract
    await callRedistributeKarma();

    // Reset day counter
    currentDay = 25;
    console.log('🔄 Day counter reset to 25');

    console.log('✅ Redistribution process completed');

  } catch (error) {
    console.error('❌ Error in redistribution process:', error);
  }
}

// Daily automation function
async function runDailyTasks() {
  try {
    console.log(`📅 Running daily tasks... Current day: ${currentDay}`);

    // Call dailyReset on Karam contract
    await callDailyReset();

    // Request randomness from Redistribution contract
    await requestRandomness();

    // Update leaderboard and ENS subdomains
    await updateLeaderboard();

    // Increment day counter
    currentDay += 1;
    console.log(`📈 Day counter incremented to: ${currentDay}`);

    console.log('✅ Daily tasks completed successfully');

  } catch (error) {
    console.error('❌ Error in daily tasks:', error);
  }
}

// Setup cron job for daily automation
function setupDailyAutomation() {
  console.log('⏰ Setting up daily automation...');

  // Run every day at midnight (00:00)
  // For testing, you can change this to run more frequently like '*/5 * * * * *' for every 5 seconds
  cron.schedule('0 0 * * *', async () => {
    console.log('🕛 Daily cron job triggered');
    await runDailyTasks();
  });

  console.log('✅ Daily automation scheduled (midnight UTC)');
}

// triggerRedistribution function is already exported above

// Main function
async function main() {
  console.log('🚀 Starting Karam Backend Script...');
  console.log('📊 Initial day counter:', currentDay);

  try {
    // Start event listeners
    await startEventListeners();

    // Setup daily automation
    setupDailyAutomation();

    console.log('✅ Karam Backend Script is running successfully!');
    console.log('🎯 Monitoring events and ready for daily automation...');

    // Keep the process alive
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down gracefully...');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Failed to start backend script:', error);
    process.exit(1);
  }
}

// Start the script
main().catch(console.error);