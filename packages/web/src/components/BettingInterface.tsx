'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface BettingInterfaceProps {
  gameId: string;
  homeTeam: string;
  awayTeam: string;
  homeOdds?: number;
  awayOdds?: number;
  totalHomeStake?: number;
  totalAwayStake?: number;
  isActive?: boolean;
  onPlaceBet?: (side: 'home' | 'away', amount: number) => Promise<void>;
}

export function BettingInterface({
  gameId,
  homeTeam,
  awayTeam,
  homeOdds = 2.0,
  awayOdds = 2.0,
  totalHomeStake = 0,
  totalAwayStake = 0,
  isActive = true,
  onPlaceBet
}: BettingInterfaceProps) {
  const { connected } = useWallet();
  const [selectedSide, setSelectedSide] = useState<'home' | 'away' | null>(null);
  const [betAmount, setBetAmount] = useState('');
  const [isPlacing, setIsPlacing] = useState(false);

  const handlePlaceBet = async () => {
    if (!selectedSide || !betAmount || !onPlaceBet) return;

    setIsPlacing(true);
    try {
      await onPlaceBet(selectedSide, parseFloat(betAmount));
      setBetAmount('');
      setSelectedSide(null);
    } catch (error) {
      console.error('Failed to place bet:', error);
    } finally {
      setIsPlacing(false);
    }
  };

  const formatSOL = (lamports: number) => {
    return (lamports / 1_000_000_000).toFixed(3);
  };

  const totalPool = totalHomeStake + totalAwayStake;
  const homePercentage = totalPool > 0 ? (totalHomeStake / totalPool) * 100 : 50;
  const awayPercentage = totalPool > 0 ? (totalAwayStake / totalPool) * 100 : 50;

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Place Your Bet</h3>
        <p className="text-gray-400">Game ID: {gameId}</p>
      </div>

      {/* Team Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Home Team */}
        <button
          onClick={() => setSelectedSide('home')}
          disabled={!isActive || !connected}
          className={`p-4 rounded-lg border-2 transition-all ${
            selectedSide === 'home'
              ? 'border-primary-500 bg-primary-500/20'
              : 'border-gray-600 bg-gray-700'
          } ${
            !isActive || !connected
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:border-primary-400'
          }`}
        >
          <div className="text-center">
            <div className="text-lg font-bold text-white">{homeTeam}</div>
            <div className="text-primary-400 font-semibold">
              {homeOdds.toFixed(2)}x
            </div>
            <div className="text-sm text-gray-400">
              {formatSOL(totalHomeStake)} SOL ({homePercentage.toFixed(1)}%)
            </div>
          </div>
        </button>

        {/* Away Team */}
        <button
          onClick={() => setSelectedSide('away')}
          disabled={!isActive || !connected}
          className={`p-4 rounded-lg border-2 transition-all ${
            selectedSide === 'away'
              ? 'border-primary-500 bg-primary-500/20'
              : 'border-gray-600 bg-gray-700'
          } ${
            !isActive || !connected
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:border-primary-400'
          }`}
        >
          <div className="text-center">
            <div className="text-lg font-bold text-white">{awayTeam}</div>
            <div className="text-primary-400 font-semibold">
              {awayOdds.toFixed(2)}x
            </div>
            <div className="text-sm text-gray-400">
              {formatSOL(totalAwayStake)} SOL ({awayPercentage.toFixed(1)}%)
            </div>
          </div>
        </button>
      </div>

      {/* Pool Visualization */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Total Pool: {formatSOL(totalPool)} SOL</span>
          <span>{homeTeam} vs {awayTeam}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 flex overflow-hidden">
          <div
            className="bg-primary-500 transition-all duration-500"
            style={{ width: `${homePercentage}%` }}
          />
          <div
            className="bg-primary-300 transition-all duration-500"
            style={{ width: `${awayPercentage}%` }}
          />
        </div>
      </div>

      {/* Bet Amount Input */}
      {selectedSide && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Bet Amount (SOL)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              placeholder="0.1"
              step="0.001"
              min="0.001"
              className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <div className="flex gap-1">
              {['0.1', '0.5', '1.0'].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setBetAmount(amount)}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm text-gray-300 hover:bg-gray-600 transition-colors"
                >
                  {amount}
                </button>
              ))}
            </div>
          </div>
          {betAmount && selectedSide && (
            <div className="mt-2 text-sm text-gray-400">
              Potential payout: ~{(parseFloat(betAmount) * (selectedSide === 'home' ? homeOdds : awayOdds)).toFixed(3)} SOL
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {!connected ? (
          <div className="text-center py-4">
            <p className="text-gray-400 mb-3">Connect your wallet to place bets</p>
          </div>
        ) : !isActive ? (
          <div className="text-center py-4">
            <p className="text-gray-400">This market is not available for betting</p>
          </div>
        ) : selectedSide && betAmount ? (
          <button
            onClick={handlePlaceBet}
            disabled={isPlacing || parseFloat(betAmount) < 0.001}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {isPlacing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Placing Bet...
              </span>
            ) : (
              `Bet ${betAmount} SOL on ${selectedSide === 'home' ? homeTeam : awayTeam}`
            )}
          </button>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-400">Select a team and enter bet amount</p>
          </div>
        )}
      </div>

      {/* Demo Notice */}
      <div className="mt-6 p-3 bg-yellow-900/20 border border-yellow-600 rounded-lg">
        <p className="text-yellow-300 text-sm">
          🚧 <strong>Demo Mode:</strong> This is a demonstration interface.
          Program deployment required for actual betting functionality.
        </p>
      </div>
    </div>
  );
}