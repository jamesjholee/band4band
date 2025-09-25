import { z } from 'zod';

// Oracle payload schema
export const GamePayloadSchema = z.object({
  league: z.string(),
  gameId: z.string(),
  timestamp: z.number(),
  score: z.object({
    home: z.number(),
    away: z.number(),
    quarter: z.number(),
    clock: z.string(),
  }),
  final: z.boolean(),
  players: z.array(z.object({
    id: z.string(),
    passingYds: z.number().optional(),
    passTD: z.number().optional(),
  })).optional(),
  source: z.array(z.string()),
  normalizerVersion: z.string(),
});

export type GamePayload = z.infer<typeof GamePayloadSchema>;

// Market types
export enum MarketState {
  Open = 0,
  Locked = 1,
  Resolved = 2,
  Void = 3,
}

export enum MarketOutcome {
  Pending = 0,
  Home = 1,
  Away = 2,
}

export enum BetSide {
  Home = 1,
  Away = 2,
}