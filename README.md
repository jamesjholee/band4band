# Band 4 Band

A peer-to-peer sports prediction market dApp built on Solana where users can issue or accept head-to-head predictions on sports outcomes.

## Project Overview

Band 4 Band is a non-custodial sports betting platform that eliminates traditional bookmaker rake. Users bet directly against each other with settlement handled by verified oracle data. The protocol generates revenue through LP yield skimming and oracle publisher bonds (future features).

### Key Features
- **Zero Rake**: Bettors pay no fees to the house
- **Peer-to-Peer**: Direct user-vs-user predictions
- **Oracle Verified**: Automated settlement via IPFS-pinned sports data
- **Mobile First**: Optimized for Seeker wallet and mobile devices
- **Devnet Only**: Safe testing environment with no real money

## Tech Stack

- **Blockchain**: Solana (Devnet)
- **Smart Contracts**: Anchor Framework (≥0.30)
- **Frontend**: Next.js 15 App Router + React 19
- **Styling**: Tailwind CSS (mobile-first, dark mode)
- **Wallet**: Solana wallet-adapter (Seeker compatible)
- **Oracle**: Node.js fetcher + IPFS (Pinata)
- **Package Manager**: pnpm workspaces

## Repository Structure

```
band4band/
├── packages/
│   ├── program/          # Anchor smart contracts
│   ├── sdk/              # TypeScript client library
│   ├── oracle-fetcher/   # Oracle data processor
│   ├── web/              # Next.js frontend
│   └── scripts/          # Development utilities
├── package.json
├── pnpm-workspace.yaml
└── .env.example
```

## Quick Start

```bash
# Install dependencies
pnpm install

# Build and deploy program
pnpm -C packages/program build
pnpm -C packages/program deploy

# Bootstrap localnet demo
pnpm -C packages/scripts localnet

# Start web app
pnpm -C packages/web dev
```

## MVP Features

- Single game moneyline betting (NFL)
- SOL-based escrow system
- Oracle-verified settlement
- Mobile-optimized interface
- Admin controls for market management

## Weekly Progress

### Week 1 (Current)
- [ ] Project setup and repository structure
- [ ] Anchor program foundation
- [ ] Basic SDK implementation
- [ ] Initial web interface

### Week 2 (Planned)
- [ ] Oracle integration
- [ ] Market creation and betting logic
- [ ] Frontend betting interface
- [ ] Testing framework setup

### Week 3 (Planned)
- [ ] Settlement and claim functionality
- [ ] Mobile optimization
- [ ] End-to-end testing
- [ ] Demo preparation

### Future Weeks
- [ ] AMM-lite implementation (stretch)
- [ ] Publisher bond system (stretch)
- [ ] Additional sports/markets (stretch)
- [ ] Push notifications (stretch)

## Development Commands

```bash
# Oracle operations
pnpm -C packages/oracle-fetcher dev:push -- --league=NFL --gameId=2025-NE-NYJ-001 --file=./stub/final.json

# Testing
pnpm test                    # All tests
pnpm -C packages/program test # Anchor tests
pnpm -C packages/sdk test    # SDK tests
```

## Environment Setup

Copy `.env.example` to `.env` and configure:
- `RPC_URL`: Solana devnet endpoint
- `WALLET_PATH`: Path to your wallet keypair
- `PINATA_JWT`: IPFS pinning service token

## Contributing

This is an MVP development project focused on core functionality. See `LEARNING.md` for technical explanations and development insights.

## License

MIT