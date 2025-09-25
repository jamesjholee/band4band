#!/usr/bin/env node

import { Connection, clusterApiUrl } from '@solana/web3.js';
import { config } from 'dotenv';

// Load environment variables
config();

async function runDemo() {
  console.log('🎮 Starting Band 4 Band demo...');

  try {
    // Connect to devnet
    const connection = new Connection(
      process.env.SOLANA_RPC_URL || clusterApiUrl('devnet'),
      'confirmed'
    );

    console.log('✅ Connected to Solana devnet');

    // TODO: Implement full demo flow
    console.log('⏳ Full demo will be implemented after program deployment');
    console.log('');
    console.log('Demo flow will include:');
    console.log('1. Create a sample NFL market (NE vs NYJ)');
    console.log('2. Place opposing bets from two test wallets');
    console.log('3. Submit oracle data to resolve the market');
    console.log('4. Demonstrate winner claiming their payout');

    console.log('');
    console.log('For now, you can:');
    console.log('1. Start the web app: pnpm -C packages/web dev');
    console.log('2. Connect your wallet and explore the UI');

  } catch (error) {
    console.error('❌ Demo failed:', error);
    process.exit(1);
  }
}

runDemo();