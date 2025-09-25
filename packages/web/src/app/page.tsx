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
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="text-center text-gray-400 py-12">
              <div className="text-6xl mb-4">🏈</div>
              <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
              <p className="max-w-md mx-auto">
                NFL prediction markets will be available once the program is deployed.
                Connect your wallet and check back soon!
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