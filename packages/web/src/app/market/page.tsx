'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { BettingInterface } from '../../components/BettingInterface';

// Mock data for demonstration
const sampleMarket = {
  id: '2025-NE-NYJ-001',
  homeTeam: 'New England Patriots',
  awayTeam: 'New York Jets',
  league: 'NFL',
  gameTime: '2025-01-15T18:00:00Z',
  status: 'upcoming',
  description: 'AFC East Division Matchup',
  totalHomeStake: 2_500_000_000, // 2.5 SOL in lamports
  totalAwayStake: 1_800_000_000, // 1.8 SOL in lamports
};

export default function MarketPage() {
  const { connected } = useWallet();
  const [userPositions, setUserPositions] = useState<any[]>([]);

  const handlePlaceBet = async (side: 'home' | 'away', amount: number) => {
    // This would integrate with the actual program
    console.log(`Placing bet: ${amount} SOL on ${side} for game ${sampleMarket.id}`);

    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock adding to user positions
    const newPosition = {
      id: Date.now(),
      side,
      amount,
      gameId: sampleMarket.id,
      timestamp: new Date()
    };

    setUserPositions(prev => [...prev, newPosition]);

    // Show success message (in real app, this would be a toast)
    alert(`Successfully placed ${amount} SOL bet on ${side === 'home' ? sampleMarket.homeTeam : sampleMarket.awayTeam}!`);
  };

  const calculateOdds = (homeStake: number, awayStake: number) => {
    const total = homeStake + awayStake;
    if (total === 0) return { home: 2.0, away: 2.0 };

    return {
      home: total / (homeStake || 1),
      away: total / (awayStake || 1)
    };
  };

  const odds = calculateOdds(sampleMarket.totalHomeStake, sampleMarket.totalAwayStake);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Sports Betting Market
              </h1>
              <p className="text-gray-400">
                {sampleMarket.league} • {new Date(sampleMarket.gameTime).toLocaleDateString()}
              </p>
            </div>
            <WalletMultiButton />
          </header>

          {/* Game Info */}
          <div className="bg-gray-800 rounded-xl p-6 mb-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                {sampleMarket.homeTeam} vs {sampleMarket.awayTeam}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-gray-400 text-sm">Game Time</div>
                  <div className="text-white font-semibold">
                    {new Date(sampleMarket.gameTime).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Total Pool</div>
                  <div className="text-white font-semibold">
                    {((sampleMarket.totalHomeStake + sampleMarket.totalAwayStake) / 1_000_000_000).toFixed(2)} SOL
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Status</div>
                  <div className="text-green-400 font-semibold capitalize">
                    {sampleMarket.status}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Betting Interface */}
          <div className="mb-8">
            <BettingInterface
              gameId={sampleMarket.id}
              homeTeam={sampleMarket.homeTeam}
              awayTeam={sampleMarket.awayTeam}
              homeOdds={odds.home}
              awayOdds={odds.away}
              totalHomeStake={sampleMarket.totalHomeStake}
              totalAwayStake={sampleMarket.totalAwayStake}
              isActive={sampleMarket.status === 'upcoming'}
              onPlaceBet={handlePlaceBet}
            />
          </div>

          {/* User Positions */}
          {connected && userPositions.length > 0 && (
            <div className="bg-gray-800 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Your Positions</h3>
              <div className="space-y-3">
                {userPositions.map((position) => (
                  <div
                    key={position.id}
                    className="flex justify-between items-center p-3 bg-gray-700 rounded-lg"
                  >
                    <div>
                      <div className="text-white font-semibold">
                        {position.amount} SOL on{' '}
                        {position.side === 'home' ? sampleMarket.homeTeam : sampleMarket.awayTeam}
                      </div>
                      <div className="text-gray-400 text-sm">
                        Placed at {position.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-primary-400 font-semibold">Active</div>
                      <div className="text-gray-400 text-sm">Pending game result</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Market Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Market Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Bets</span>
                  <span className="text-white">{userPositions.length + 47}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Betting Volume</span>
                  <span className="text-white">
                    {((sampleMarket.totalHomeStake + sampleMarket.totalAwayStake) / 1_000_000_000).toFixed(2)} SOL
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Market Odds</span>
                  <span className="text-white">
                    {odds.home.toFixed(2)} / {odds.away.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">How It Works</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p>• Connect your Solana wallet</p>
                <p>• Choose a team to bet on</p>
                <p>• Enter your bet amount in SOL</p>
                <p>• Confirm the transaction</p>
                <p>• Claim winnings after game resolution</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center text-gray-500 text-sm">
            <p>
              Band 4 Band • Peer-to-peer sports betting • Built on Solana Devnet
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}