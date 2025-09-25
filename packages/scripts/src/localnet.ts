#!/usr/bin/env node

import { Connection, clusterApiUrl } from '@solana/web3.js';
import { config } from 'dotenv';

// Load environment variables
config();

async function setupLocalnet() {
  console.log('🚀 Setting up Band 4 Band localnet environment...');

  try {
    // Connect to devnet
    const connection = new Connection(
      process.env.SOLANA_RPC_URL || clusterApiUrl('devnet'),
      'confirmed'
    );

    // Test connection
    const version = await connection.getVersion();
    console.log('✅ Connected to Solana cluster:', version);

    // TODO: Deploy program if not already deployed
    console.log('⏳ Program deployment will be implemented after Anchor setup');

    // TODO: Initialize protocol accounts
    console.log('⏳ Protocol initialization will be implemented after program deployment');

    // TODO: Create sample market
    console.log('⏳ Sample market creation will be implemented after protocol initialization');

    console.log('✨ Localnet setup completed!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Deploy the Anchor program: pnpm -C packages/program deploy');
    console.log('2. Start the web app: pnpm -C packages/web dev');
    console.log('3. Connect your wallet and start betting!');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

setupLocalnet();