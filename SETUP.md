# Band 4 Band Setup Guide

This guide will walk you through setting up your development environment and deploying Band 4 Band for your hackathon submission.

## Prerequisites

### 1. Install Node.js and pnpm
```bash
# Install Node.js 22+ (using nvm recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 22
nvm use 22

# Install pnpm
npm install -g pnpm
```

### 2. Install Rust and Solana CLI
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.18.0/install)"

# Add to PATH (add this to your shell profile)
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
```

### 3. Install Anchor CLI
```bash
# Install Anchor CLI
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

## Solana Wallet Setup

### 1. Create a New Wallet
```bash
# Generate a new keypair (this will be your wallet)
solana-keygen new --outfile ~/.config/solana/id.json

# Set CLI to use devnet
solana config set --url https://api.devnet.solana.com

# Verify configuration
solana config get
```

### 2. Fund Your Wallet
```bash
# Request devnet SOL (can run multiple times for more SOL)
solana airdrop 5

# Check balance
solana balance
```

**Important**: Keep your wallet secure and never commit the keypair file to git!

## Project Setup

### 1. Clone and Install Dependencies
```bash
# Navigate to the project
cd /Users/appleuser/Desktop/band-4-band

# Install all dependencies
pnpm install
```

### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your settings
# The defaults should work for most setups
```

### 3. Build and Deploy the Program
```bash
# Build the Anchor program
pnpm -C packages/program build

# Deploy to devnet
pnpm -C packages/program deploy

# Note: This will output a Program ID - you'll need this for the web app
```

### 4. Update Web App Configuration
After deployment, update your `.env` file with the program ID:
```bash
# Add the Program ID from the deployment output
NEXT_PUBLIC_PROGRAM_ID=YourProgramIdFromDeploymentOutput
```

### 5. Start Development
```bash
# Start the web application
pnpm -C packages/web dev

# Open http://localhost:3000 in your browser
```

## Testing Your Setup

### 1. Run Tests
```bash
# Test the SDK utilities
pnpm -C packages/sdk test

# Test the Anchor program (requires deployed program)
pnpm -C packages/program test
```

### 2. Test Oracle CLI
```bash
# Validate sample game data
pnpm -C packages/oracle-fetcher dev:push -- validate --file=./src/stub/final.json

# Test oracle data processing
pnpm -C packages/oracle-fetcher dev:push -- --league=NFL --gameId=2025-NE-NYJ-001 --file=./src/stub/final.json
```

### 3. Web Wallet Connection
1. Open http://localhost:3000
2. Click "Select Wallet"
3. Choose your preferred wallet (Phantom recommended)
4. Connect and approve the connection

## Hackathon Deployment

### For Demo/Presentation
1. **Keep it on Devnet**: Perfect for hackathon demos - no real money risk
2. **Fund Demo Wallets**: Create 2-3 test wallets with devnet SOL for live demos
3. **Prepare Sample Data**: Use the stub data in `packages/oracle-fetcher/src/stub/`

### Production Considerations (Post-Hackathon)
- Switch to mainnet-beta for real deployment
- Implement proper oracle data sources
- Add comprehensive error handling
- Set up monitoring and alerts

## Troubleshooting

### Common Issues

#### "Program not found" error
```bash
# Make sure you've deployed the program
pnpm -C packages/program deploy

# Update NEXT_PUBLIC_PROGRAM_ID in .env
```

#### Wallet connection issues
```bash
# Check Solana CLI configuration
solana config get

# Ensure you have devnet SOL
solana balance
solana airdrop 2
```

#### Build failures
```bash
# Clean and rebuild
pnpm -C packages/program clean
pnpm -C packages/program build
```

#### TypeScript errors in web app
```bash
# Make sure SDK is built
pnpm -C packages/sdk build

# Reinstall dependencies if needed
pnpm install
```

## Development Workflow

### Daily Development
```bash
# Terminal 1: Start web app with hot reload
pnpm -C packages/web dev

# Terminal 2: Build SDK when making changes
pnpm -C packages/sdk dev

# Terminal 3: Rebuild/redeploy program when needed
pnpm -C packages/program build && pnpm -C packages/program deploy
```

### Testing Workflow
```bash
# Run all tests
pnpm test

# Test specific package
pnpm -C packages/sdk test
pnpm -C packages/program test
```

## Resources

- [Solana Documentation](https://docs.solana.com/)
- [Anchor Book](https://book.anchor-lang.com/)
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)
- [Phantom Wallet](https://phantom.app/)

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the logs in your terminal
3. Ensure all prerequisites are installed correctly
4. Verify your wallet has devnet SOL

Good luck with your hackathon! 🚀