'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Band 4 Band
            </h1>
            <p className="text-gray-400">
              Peer-to-peer sports prediction market on Solana
            </p>
          </div>
          <WalletMultiButton />
        </header>

        {/* Hero Section */}
        <div className="bg-gray-800 rounded-xl p-8 mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Bet Against Other Users, Not the House
          </h2>
          <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
            Zero rake, oracle-verified outcomes, and instant settlements on Solana devnet.
            Connect your wallet to start betting on sports events.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-primary-400 mb-2">No House Edge</h3>
              <p className="text-gray-300 text-sm">
                Bet directly against other users with zero platform fees
              </p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-primary-400 mb-2">Oracle Verified</h3>
              <p className="text-gray-300 text-sm">
                Outcomes verified by trusted sports data oracles
              </p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-primary-400 mb-2">Instant Settlement</h3>
              <p className="text-gray-300 text-sm">
                Automated payouts on Solana's fast, low-cost network
              </p>
            </div>
          </div>
        </div>

        {/* Markets Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Available Markets</h2>

          {/* Sample Market */}
          <div className="bg-gray-800 rounded-xl p-6 mb-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  New England Patriots vs New York Jets
                </h3>
                <div className="flex gap-4 text-sm text-gray-400">
                  <span>NFL • Jan 15, 2025</span>
                  <span>Total Pool: 4.3 SOL</span>
                  <span className="text-green-400">Live Demo</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400 mb-2">Odds</div>
                <div className="text-primary-400 font-bold">1.74x / 2.39x</div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <div className="text-gray-300">
                  Experience the full betting interface with wallet integration
                </div>
                <a
                  href="/market"
                  className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  View Market
                </a>
              </div>
            </div>
          </div>

          {/* Coming Soon */}
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="text-center text-gray-400 py-8">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="text-lg font-semibold mb-2">More Markets Coming Soon</h3>
              <p className="max-w-md mx-auto">
                Additional NFL games and other sports will be added after program deployment to devnet.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm">
          <p>Built on Solana Devnet • No real money involved • For demonstration purposes only</p>
        </footer>
      </div>
    </div>
  );
}