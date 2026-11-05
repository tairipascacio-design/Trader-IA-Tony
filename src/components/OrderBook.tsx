import React from 'react';
import { useTrading } from '../context/TradingContext';

export const OrderBook: React.FC = () => {
  const { orderBook, activeSymbol, markets } = useTrading();
  const curMarket = markets[activeSymbol];

  const maxTotal = Math.max(
    ...orderBook.bids.map((b) => b.total),
    ...orderBook.asks.map((a) => a.total),
    1
  );

  return (
    <div className="bg-[#0e0a08] border border-[#2e190e] rounded-xl overflow-hidden flex flex-col h-full shadow-lg">
      <div className="px-3 py-2 border-b border-[#24150c] bg-[#140e0b] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-amber-200 uppercase tracking-wider font-mono">
            Libro L2
          </span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>EN VIVO</span>
          </span>
        </div>
        <div className="text-[10px] font-mono text-zinc-400">
          Spread: <span className="text-amber-400 font-bold">${orderBook.spread.toFixed(curMarket.tickSize < 0.01 ? 3 : 2)}</span>
        </div>
      </div>

      {/* Table Headers */}
      <div className="grid grid-cols-3 px-3 py-1 text-[10px] font-mono text-zinc-500 uppercase border-b border-[#1c120b] bg-[#0c0806]">
        <span>Precio (USD)</span>
        <span className="text-right">Tamaño</span>
        <span className="text-right">Total Acum.</span>
      </div>

      <div className="flex-1 flex flex-col justify-between overflow-hidden p-1 text-[11px] font-mono">
        {/* Asks (Sell Orders) in descending order */}
        <div className="flex flex-col-reverse justify-end space-y-reverse space-y-0.5 overflow-hidden">
          {orderBook.asks.slice(0, 7).map((ask, i) => {
            const depthPct = Math.min(100, (ask.total / maxTotal) * 100);
            return (
              <div key={`ask-${i}`} className="relative grid grid-cols-3 px-2 py-0.5 group hover:bg-red-950/30">
                <div
                  className="absolute right-0 top-0 bottom-0 bg-red-900/20 pointer-events-none transition-all"
                  style={{ width: `${depthPct}%` }}
                />
                <span className="text-red-400 font-semibold relative z-10">
                  ${ask.price.toFixed(curMarket.tickSize < 0.01 ? 3 : 2)}
                </span>
                <span className="text-right text-zinc-300 relative z-10">{ask.size.toFixed(2)}</span>
                <span className="text-right text-zinc-400 relative z-10">{ask.total.toFixed(2)}</span>
              </div>
            );
          })}
        </div>

        {/* Current Mid Price Banner */}
        <div className="my-1.5 py-1 px-3 bg-[#19100a] border-y border-[#3a2012] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-extrabold text-amber-300">
              ${curMarket.price.toFixed(curMarket.tickSize < 0.01 ? 3 : 2)}
            </span>
            <span className="text-[10px] text-zinc-400">Mark Price</span>
          </div>
          <span className="text-[10px] text-zinc-500 italic">
            &quot;En este negocio, manda la liquidez.&quot;
          </span>
        </div>

        {/* Bids (Buy Orders) */}
        <div className="flex flex-col space-y-0.5 overflow-hidden">
          {orderBook.bids.slice(0, 7).map((bid, i) => {
            const depthPct = Math.min(100, (bid.total / maxTotal) * 100);
            return (
              <div key={`bid-${i}`} className="relative grid grid-cols-3 px-2 py-0.5 group hover:bg-emerald-950/30">
                <div
                  className="absolute right-0 top-0 bottom-0 bg-emerald-900/20 pointer-events-none transition-all"
                  style={{ width: `${depthPct}%` }}
                />
                <span className="text-emerald-400 font-semibold relative z-10">
                  ${bid.price.toFixed(curMarket.tickSize < 0.01 ? 3 : 2)}
                </span>
                <span className="text-right text-zinc-300 relative z-10">{bid.size.toFixed(2)}</span>
                <span className="text-right text-zinc-400 relative z-10">{bid.total.toFixed(2)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
