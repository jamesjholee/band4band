import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { AnchorProvider, Program, BN } from '@coral-xyz/anchor';
import { MarketState, MarketOutcome, BetSide } from './types';

// This will be populated with the actual IDL after program deployment
export interface Band4BandProgram {
  // Program method signatures - will be generated from IDL
  methods: {
    registryInit: (treasury: PublicKey) => any;
    registryAddPublisher: (publisher: PublicKey) => any;
    feedInit: (league: number[], gameId: number[]) => any;
    feedSubmitUpdate: (payloadHash: number[], ipfsCid: number[], ts: BN) => any;
    marketInit: (gameId: number[], marketKind: number, closeTime: BN, treasury: PublicKey) => any;
    marketPlacePosition: (side: number, stakeLamports: BN) => any;
    marketLock: () => any;
    marketResolve: (outcome: number) => any;
    marketClaim: () => any;
  };
  account: {
    registry: any;
    gameFeed: any;
    market: any;
    position: any;
  };
}

export class Band4BandClient {
  constructor(
    public readonly connection: Connection,
    public readonly program: Program<Band4BandProgram>,
    public readonly programId: PublicKey
  ) {}

  static create(connection: Connection, programId: PublicKey, provider: AnchorProvider) {
    // This will be implemented once we have the actual IDL
    throw new Error('Client creation will be implemented after program deployment');
  }

  // PDA helpers
  getRegistryPda(): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('registry')],
      this.programId
    );
  }

  getFeedPda(league: string, gameId: string): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from('feed'),
        Buffer.from(league.padEnd(8, '\0').slice(0, 8)),
        Buffer.from(gameId.padEnd(32, '\0').slice(0, 32))
      ],
      this.programId
    );
  }

  getMarketPda(gameId: string, marketKind: number): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from('mkt'),
        Buffer.from(gameId.padEnd(32, '\0').slice(0, 32)),
        Buffer.from([marketKind])
      ],
      this.programId
    );
  }

  getPositionPda(marketPda: PublicKey, user: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('pos'), marketPda.toBuffer(), user.toBuffer()],
      this.programId
    );
  }

  // Client methods (placeholders for when program is deployed)
  async getRegistry() {
    const [registryPda] = this.getRegistryPda();

    try {
      return await this.program.account.registry.fetch(registryPda);
    } catch (error) {
      return null; // Registry not initialized
    }
  }

  async getMarket(gameId: string, marketKind: number = 0) {
    const [marketPda] = this.getMarketPda(gameId, marketKind);

    try {
      const market = await this.program.account.market.fetch(marketPda);
      return {
        ...market,
        address: marketPda,
        gameIdString: gameId,
        odds: this.calculateOdds(market.totalHomeStake, market.totalAwayStake)
      };
    } catch (error) {
      return null; // Market doesn't exist
    }
  }

  async getUserPosition(marketPda: PublicKey, user: PublicKey) {
    const [positionPda] = this.getPositionPda(marketPda, user);

    try {
      const position = await this.program.account.position.fetch(positionPda);
      return {
        ...position,
        address: positionPda
      };
    } catch (error) {
      return null; // No position
    }
  }

  async getFeed(league: string, gameId: string) {
    const [feedPda] = this.getFeedPda(league, gameId);

    try {
      return await this.program.account.gameFeed.fetch(feedPda);
    } catch (error) {
      return null; // Feed doesn't exist
    }
  }

  // Helper methods
  calculateOdds(homeStake: number, awayStake: number) {
    const total = homeStake + awayStake;
    if (total === 0) {
      return { home: 1.0, away: 1.0 }; // Even odds when no bets
    }

    return {
      home: total / (homeStake || 1), // Avoid division by zero
      away: total / (awayStake || 1)
    };
  }

  formatGameId(gameId: string): number[] {
    const padded = gameId.padEnd(32, '\0').slice(0, 32);
    return Array.from(Buffer.from(padded));
  }

  formatLeague(league: string): number[] {
    const padded = league.padEnd(8, '\0').slice(0, 8);
    return Array.from(Buffer.from(padded));
  }

  // Transaction builders (will be implemented with actual program)
  async initializeRegistry(treasury: PublicKey, authority: PublicKey) {
    throw new Error('Registry initialization will be implemented after program deployment');
  }

  async createMarket(
    gameId: string,
    marketKind: number,
    closeTime: Date,
    treasury: PublicKey,
    authority: PublicKey
  ) {
    throw new Error('Market creation will be implemented after program deployment');
  }

  async placeBet(
    gameId: string,
    side: BetSide,
    lamports: number,
    user: PublicKey
  ) {
    throw new Error('Bet placement will be implemented after program deployment');
  }

  async claimWinnings(
    marketPda: PublicKey,
    user: PublicKey
  ) {
    throw new Error('Claim functionality will be implemented after program deployment');
  }
}