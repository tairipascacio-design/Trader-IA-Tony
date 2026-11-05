import React from 'react';
import { CandleChart } from './CandleChart';
import { OrderBook } from './OrderBook';
import { RecentTrades } from './RecentTrades';
import { OrderConsole } from './OrderConsole';
import { AutonomousBotPanel } from './AutonomousBotPanel';
import { YieldArbitrageVaultPanel } from './YieldArbitrageVaultPanel';
import { PositionsTable } from './PositionsTable';

export const TradingTerminal: React.FC = () => {
  return (
    <div className="space-y-4 max-w-[1700px] mx-auto pb-10">
      {/* Top Section: Chart, OrderBook, Tape */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Main Chart: 7 cols on desktop */}
        <div className="lg:col-span-7 xl:col-span-8">
          <CandleChart />
        </div>

        {/* Order Book: 3 cols */}
        <div className="lg:col-span-3 xl:col-span-2 h-[380px] lg:h-auto">
          <OrderBook />
        </div>

        {/* Tape / Recent Trades: 2 cols */}
        <div className="lg:col-span-2 xl:col-span-2 h-[380px] lg:h-auto">
          <RecentTrades />
        </div>
      </div>

      {/* Middle Section: Order Console & Autonomous Bot Cockpit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Order Execution Console: 5 cols */}
        <div className="lg:col-span-5">
          <OrderConsole />
        </div>

        {/* Autonomous Bot Cockpit: 7 cols */}
        <div className="lg:col-span-7">
          <AutonomousBotPanel />
        </div>
      </div>

      {/* Passive Yield & Protection Section: Delta-Neutral Arbitrage, MEV Shield & Auto-Compound Vault */}
      <div>
        <YieldArbitrageVaultPanel />
      </div>

      {/* Bottom Section: Positions & Trade Ledger */}
      <div>
        <PositionsTable />
      </div>
    </div>
  );
};
