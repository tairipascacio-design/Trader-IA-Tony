import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { Bot, User, XCircle, TrendingUp, TrendingDown, Clock, ShieldAlert, ShieldCheck } from 'lucide-react';

export const PositionsTable: React.FC = () => {
  const { positions, closedTrades, closePosition, closeAllPositions, openHashVerifier } = useTrading();
  const [tab, setTab] = useState<'open' | 'history'>('open');

  return (
    <div className="bg-[#0e0a08] border border-[#2e190e] rounded-xl overflow-hidden shadow-xl flex flex-col">
      <div className="px-4 py-2 border-b border-[#24150c] bg-[#140e0b] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setTab('open')}
            className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
              tab === 'open'
                ? 'bg-[#29170e] text-amber-300 border border-[#4d2815]'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Posiciones Abiertas ({positions.length})
          </button>
          <button
            onClick={() => setTab('history')}
            className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
              tab === 'history'
                ? 'bg-[#29170e] text-amber-300 border border-[#4d2815]'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Historial de Operaciones ({closedTrades.length})
          </button>
        </div>

        {tab === 'open' && positions.length > 0 && (
          <button
            onClick={closeAllPositions}
            className="px-2.5 py-1 text-[11px] font-mono font-bold text-red-400 hover:text-red-300 bg-red-950/60 hover:bg-red-900/60 rounded border border-red-800 transition-all cursor-pointer flex items-center space-x-1"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Cerrar Todo</span>
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        {tab === 'open' ? (
          positions.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 font-mono text-xs">
              <ShieldAlert className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
              <p>No hay posiciones activas en este momento.</p>
              <p className="text-[11px] text-zinc-600 mt-1">
                Abre una orden manual o activa el botón ON para que el bot de Tony opere con el saldo de tu wallet.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#120c09] text-[10px] text-zinc-500 uppercase border-b border-[#21140c]">
                <tr>
                  <th className="py-2.5 px-3">Par & Operador</th>
                  <th className="py-2.5 px-3">Lado</th>
                  <th className="py-2.5 px-3">Tamaño</th>
                  <th className="py-2.5 px-3">Entrada</th>
                  <th className="py-2.5 px-3">Precio Mark</th>
                  <th className="py-2.5 px-3">Liq. Estimada</th>
                  <th className="py-2.5 px-3">Margen</th>
                  <th className="py-2.5 px-3">PnL No Realizado</th>
                  <th className="py-2.5 px-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e130c]">
                {positions.map((pos) => {
                  const isProfit = pos.unrealizedPnl >= 0;
                  const isLong = pos.side === 'LONG';

                  return (
                    <tr key={pos.id} className="hover:bg-[#160f0b] transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-amber-200">{pos.symbol}</span>
                          {pos.isRealLive ? (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-red-950 text-red-300 border border-red-700">
                              🔴 REAL L1
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono text-cyan-300 bg-cyan-950/50 border border-cyan-800">
                              🧪 SIM
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1.5 text-[10px] mt-0.5">
                          {pos.openedBy === 'AI_BOT' ? (
                            <span className="text-amber-400 flex items-center font-bold">
                              <Bot className="w-3 h-3 mr-0.5" /> IA Little Friend
                            </span>
                          ) : (
                            <span className="text-zinc-400 flex items-center">
                              <User className="w-3 h-3 mr-0.5" /> Manual
                            </span>
                          )}
                          {pos.txHash && (
                            <button
                              type="button"
                              onClick={() => openHashVerifier(pos.txHash)}
                              className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-950/70 hover:bg-amber-900 text-amber-300 border border-amber-600/70 hover:border-amber-400 transition-all cursor-pointer shadow-sm group"
                              title={`Haz clic para ver la verificación on-chain del Hash: ${pos.txHash}`}
                            >
                              <ShieldCheck className="w-2.5 h-2.5 text-amber-400 group-hover:scale-110" />
                              <span>TX: {pos.txHash.substring(0, 6)}... (Verificar)</span>
                            </button>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            isLong ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'
                          }`}
                        >
                          {pos.side} {pos.leverage}x
                        </span>
                      </td>

                      <td className="py-3 px-3 text-zinc-300 font-bold">{pos.size}</td>
                      <td className="py-3 px-3 text-zinc-400">${pos.entryPrice.toFixed(2)}</td>
                      <td className="py-3 px-3 text-amber-200 font-bold">${pos.currentPrice.toFixed(2)}</td>
                      <td className="py-3 px-3 text-red-400 font-bold">${pos.liquidationPrice.toFixed(2)}</td>
                      <td className="py-3 px-3 text-zinc-300">${pos.margin.toFixed(2)} USDC</td>

                      <td className="py-3 px-3">
                        <div className={`font-black ${isProfit ? 'text-emerald-400' : 'text-red-400'} flex items-center`}>
                          {isProfit ? '+' : ''}${pos.unrealizedPnl.toFixed(2)}
                          <span className="ml-1 text-[10px]">({isProfit ? '+' : ''}{pos.unrealizedPnlPercent.toFixed(2)}%)</span>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => closePosition(pos.id, 'MANUAL_CLOSE')}
                          className="px-2.5 py-1 text-[11px] font-bold bg-[#26150d] hover:bg-[#3d1d10] text-amber-300 rounded border border-[#522916] transition-all cursor-pointer"
                        >
                          Cerrar Mercado
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )
        ) : closedTrades.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 font-mono text-xs">
            <Clock className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
            <p>No hay operaciones cerradas registradas todavía.</p>
          </div>
        ) : (
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#120c09] text-[10px] text-zinc-500 uppercase border-b border-[#21140c]">
              <tr>
                <th className="py-2.5 px-3">Par & Motivo</th>
                <th className="py-2.5 px-3">Lado</th>
                <th className="py-2.5 px-3">Entrada / Salida</th>
                <th className="py-2.5 px-3">Margen</th>
                <th className="py-2.5 px-3">PnL Realizado</th>
                <th className="py-2.5 px-3">Aprendizaje del Cartel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e130c]">
              {closedTrades.slice(0, 15).map((ct) => {
                const isProfit = ct.realizedPnl >= 0;
                return (
                  <tr key={ct.id} className="hover:bg-[#160f0b] transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-amber-200">{ct.symbol}</span>
                        {ct.isRealLive ? (
                          <span className="px-1 py-0.2 rounded text-[8px] font-black bg-red-950 text-red-300 border border-red-700">
                            🔴 REAL L1
                          </span>
                        ) : (
                          <span className="px-1 py-0.2 rounded text-[8px] font-mono text-cyan-300 bg-cyan-950/40">
                            🧪 SIM
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-zinc-500 flex items-center space-x-1">
                        <span>{ct.closedReason}</span>
                        {ct.txHash && (
                          <button
                            type="button"
                            onClick={() => openHashVerifier(ct.txHash)}
                            className="inline-flex items-center space-x-1 px-1.5 py-0.2 rounded text-[8px] font-mono font-bold bg-[#24140b] hover:bg-[#381e10] text-amber-300 border border-[#4a2614] hover:border-amber-400 transition-all cursor-pointer ml-1"
                            title={`Verificar Hash: ${ct.txHash}`}
                          >
                            <ShieldCheck className="w-2.5 h-2.5 text-amber-400" />
                            <span>Ver Hash</span>
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${ct.side === 'LONG' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {ct.side} {ct.leverage}x
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-zinc-400">
                      ${ct.entryPrice.toFixed(2)} → ${ct.exitPrice.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-zinc-400">${ct.margin.toFixed(2)} USDC</td>
                    <td className="py-2.5 px-3">
                      <span className={`font-bold ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isProfit ? '+' : ''}${ct.realizedPnl.toFixed(2)} ({isProfit ? '+' : ''}{ct.realizedPnlPercent.toFixed(2)}%)
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-zinc-300 text-[11px] max-w-xs truncate" title={ct.aiLessonLearned}>
                      {ct.aiLessonLearned || 'Optimizando pesos de liquidez institucional.'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
