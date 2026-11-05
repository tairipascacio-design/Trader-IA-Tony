import React from 'react';
import { useTrading } from '../context/TradingContext';

export const RecentTrades: React.FC = () => {
  const { recentTrades, activeSymbol, markets } = useTrading();
  const curMarket = markets[activeSymbol];

  return (
    <div className="bg-[#0e0a08] border border-[#2e190e] rounded-xl overflow-hidden flex flex-col h-full shadow-lg">
      <div className="px-3 py-2 border-b border-[#24150c] bg-[#140e0b] flex items-center justify-between">
        <span className="text-xs font-bold text-amber-200 uppercase tracking-wider font-mono">
          Cinta de Órdenes
        </span>
        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>L1 STREAM</span>
        </span>
      </div>

      <div className="grid grid-cols-3 px-3 py-1 text-[10px] font-mono text-zinc-500 uppercase border-b border-[#1c120b] bg-[#0c0806]">
        <span>Precio</span>
        <span className="text-right">Tamaño</span>
        <span className="text-right">Hora</span>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-1 space-y-0.5 text-[11px] font-mono">
        {recentTrades.slice(0, 16).map((trade) => {
          const isBuy = trade.side === 'buy';
          const timeStr = new Date(trade.time).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

          return (
            <div key={trade.id} className="grid grid-cols-3 px-2 py-0.5 hover:bg-[#1a110a] rounded">
              <span className={`font-semibold ${isBuy ? 'text-emerald-400' : 'text-red-400'}`}>
                ${trade.price.toFixed(curMarket.tickSize < 0.01 ? 3 : 2)}
              </span>
              <span className="text-right text-zinc-300">{trade.size.toFixed(2)}</span>
              <span className="text-right text-zinc-500 text-[10px]">{timeStr}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
