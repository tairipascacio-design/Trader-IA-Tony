import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { Shield, Zap, TrendingUp, TrendingDown, AlertTriangle, ShieldCheck } from 'lucide-react';

export const OrderConsole: React.FC = () => {
  const {
    activeSymbol,
    markets,
    wallet,
    openManualPosition,
    isAutoBotActive,
    isLiveRealMode,
    toggleLiveRealMode,
    realWeb3Status,
    connectRealWeb3Wallet,
    positions,
    openHashVerifier,
  } = useTrading();
  const curMarket = markets[activeSymbol];

  const [side, setSide] = useState<'LONG' | 'SHORT'>('LONG');
  const [leverage, setLeverage] = useState<number>(10);
  const [marginUsdc, setMarginUsdc] = useState<string>('500');
  const [takeProfit, setTakeProfit] = useState<string>('');
  const [stopLoss, setStopLoss] = useState<string>('');

  const numMargin = parseFloat(marginUsdc) || 0;
  const notionalUsd = numMargin * leverage;
  const sizeInCoin = curMarket.price > 0 ? +(notionalUsd / curMarket.price).toFixed(4) : 0;

  // Calculate estimated liquidation price
  const maxLoss = numMargin * 0.9;
  const liqDiff = sizeInCoin > 0 ? maxLoss / sizeInCoin : 0;
  const estimatedLiq =
    side === 'LONG'
      ? Math.max(0, +(curMarket.price - liqDiff).toFixed(2))
      : +(curMarket.price + liqDiff).toFixed(2);

  const handlePercentageClick = (pct: number) => {
    const calculated = Math.floor(wallet.balances.USDC * (pct / 100));
    setMarginUsdc(calculated.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numMargin <= 0) return;

    openManualPosition({
      symbol: activeSymbol,
      side,
      margin: numMargin,
      leverage,
      takeProfit: takeProfit ? parseFloat(takeProfit) : undefined,
      stopLoss: stopLoss ? parseFloat(stopLoss) : undefined,
    });
  };

  return (
    <div className={`border rounded-xl overflow-hidden shadow-xl flex flex-col transition-all ${
      isLiveRealMode ? 'bg-[#0f0707] border-red-900/60 shadow-red-950/40 ring-1 ring-red-500/30' : 'bg-[#0e0a08] border-[#2e190e]'
    }`}>
      <div className={`px-4 py-2.5 border-b flex items-center justify-between ${
        isLiveRealMode ? 'bg-[#1a0a0a] border-red-900/40' : 'bg-[#140e0b] border-[#24150c]'
      }`}>
        <div className="flex items-center space-x-2">
          <Zap className={`w-4 h-4 ${isLiveRealMode ? 'text-red-400 animate-pulse' : 'text-amber-400'}`} />
          <span className="text-xs font-black uppercase text-amber-200 tracking-wider font-mono">
            {isLiveRealMode ? '🔴 Consola Real Hyperliquid L1' : 'Consola Cuántica de Órdenes'}
          </span>
        </div>
        <button
          type="button"
          onClick={toggleLiveRealMode}
          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
            isLiveRealMode
              ? 'bg-red-950 text-red-300 border border-red-500 hover:bg-red-900'
              : 'bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700'
          }`}
        >
          {isLiveRealMode ? '🔴 MODO REAL (CLICK: APAGAR)' : '🧪 SIMULACIÓN (CLICK: EN VIVO)'}
        </button>
      </div>

      {/* Mode Alert Banner */}
      <div className={`px-4 py-2 border-b text-[11px] font-mono flex items-center justify-between ${
        isLiveRealMode
          ? 'bg-gradient-to-r from-red-950/70 to-rose-950/50 border-red-900/40 text-red-200'
          : 'bg-[#15110d] border-amber-950/40 text-zinc-400'
      }`}>
        {isLiveRealMode ? (
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="font-bold">MODO REAL: Compras y ventas con liquidación en Hyperliquid L1</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Simulación segura. Para operar en vivo pulsa &quot;Apagar Simulación&quot;.</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4 text-xs font-mono">
        {/* Long / Short Switch */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setSide('LONG')}
            className={`py-2.5 rounded-lg font-black uppercase tracking-wider text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
              side === 'LONG'
                ? 'bg-gradient-to-r from-emerald-600 to-green-700 text-white shadow-lg shadow-emerald-900/50 border border-emerald-400'
                : 'bg-[#18110c] text-zinc-400 hover:text-white border border-[#2f1a0f]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>LONG (COMPRA)</span>
          </button>

          <button
            type="button"
            onClick={() => setSide('SHORT')}
            className={`py-2.5 rounded-lg font-black uppercase tracking-wider text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
              side === 'SHORT'
                ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-lg shadow-red-950/60 border border-red-400'
                : 'bg-[#18110c] text-zinc-400 hover:text-white border border-[#2f1a0f]'
            }`}
          >
            <TrendingDown className="w-4 h-4" />
            <span>SHORT (VENTA)</span>
          </button>
        </div>

        {/* Leverage Slider */}
        <div className="space-y-1.5 bg-[#140e0b] p-3 rounded-lg border border-[#2a170d]">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-zinc-400 uppercase font-bold">Apalancamiento Bélico</span>
            <span className="font-extrabold text-amber-300 text-sm">{leverage}x Cross</span>
          </div>
          <input
            type="range"
            min="1"
            max={curMarket.maxLeverage}
            value={leverage}
            onChange={(e) => setLeverage(parseInt(e.target.value, 10))}
            className="w-full accent-amber-500 cursor-pointer h-1.5 bg-[#29170e] rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
            <span>1x</span>
            <span>10x</span>
            <span>25x</span>
            <span>{curMarket.maxLeverage}x Max</span>
          </div>
        </div>

        {/* Margin Input */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px]">
            <span className="text-zinc-400 font-bold uppercase">Margen (USDC)</span>
            <span className="text-zinc-500">
              Disponible: <span className="text-emerald-400 font-bold">${wallet.balances.USDC.toLocaleString()}</span>
            </span>
          </div>
          <div className="relative">
            <input
              type="number"
              value={marginUsdc}
              onChange={(e) => setMarginUsdc(e.target.value)}
              step="10"
              min="10"
              max={wallet.balances.USDC}
              className="w-full bg-[#140e0b] border border-[#3b2012] focus:border-amber-400 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none"
              placeholder="0.00"
            />
            <span className="absolute right-3 top-2 text-zinc-500 text-xs">USDC</span>
          </div>

          {/* Quick % buttons */}
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {[25, 50, 75, 100].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => handlePercentageClick(pct)}
                className="py-1 text-[10px] bg-[#1a120c] hover:bg-[#2c180e] text-amber-200/80 rounded border border-[#341b0e] cursor-pointer"
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        {/* Take Profit & Stop Loss inputs */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <span className="text-[10px] text-amber-300 font-bold uppercase">Take Profit ($)</span>
            <input
              type="number"
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
              placeholder="Ej: 36.50"
              className="w-full bg-[#140e0b] border border-[#3b2012] focus:border-amber-400 rounded px-2.5 py-1.5 text-white text-xs font-mono focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-red-400 font-bold uppercase">Stop Loss ($)</span>
            <input
              type="number"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              placeholder="Ej: 31.00"
              className="w-full bg-[#140e0b] border border-[#3b2012] focus:border-red-400 rounded px-2.5 py-1.5 text-white text-xs font-mono focus:outline-none"
            />
          </div>
        </div>

        {/* Order Summary & Calculations */}
        <div className="p-3 bg-[#130d0a] rounded-lg border border-[#2b160d] space-y-1.5 text-[11px]">
          <div className="flex justify-between text-zinc-400">
            <span>Tamaño Nocional:</span>
            <span className="text-white font-bold">${notionalUsd.toLocaleString()} USD ({sizeInCoin} {activeSymbol.replace('-PERP', '')})</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Precio de Entrada:</span>
            <span className="text-amber-200">${curMarket.price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Precio Liq. Estimado:</span>
            <span className="text-red-400 font-bold font-mono">${estimatedLiq}</span>
          </div>
        </div>

        {/* Latest Position Hash Verifier Pill */}
        {positions.length > 0 && positions[0].txHash && (
          <div className="flex items-center justify-between p-2 rounded-lg bg-[#140b07] border border-[#2e170d] text-[11px] font-mono">
            <div className="flex items-center space-x-1.5 text-zinc-400 truncate mr-2">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Última TX:</span>
              <span className="text-amber-200 font-bold">{positions[0].txHash.slice(0, 10)}...</span>
            </div>
            <button
              type="button"
              onClick={() => openHashVerifier(positions[0].txHash)}
              className="shrink-0 text-amber-300 hover:text-white font-bold bg-[#26140b] hover:bg-[#3d1e10] px-2 py-0.5 rounded border border-amber-600/50 cursor-pointer text-[10px] transition-all"
            >
              Verificar Hash L1 🔍
            </button>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={numMargin <= 0 || numMargin > wallet.balances.USDC}
          className={`w-full py-3.5 rounded-lg font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-xl cursor-pointer ${
            isLiveRealMode
              ? side === 'LONG'
                ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 hover:brightness-110 text-white shadow-emerald-950/80 ring-2 ring-emerald-400'
                : 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:brightness-110 text-white shadow-red-950/80 ring-2 ring-red-400'
              : side === 'LONG'
              ? 'bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 hover:from-emerald-500 hover:to-green-600 text-white shadow-emerald-950/60'
              : 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white shadow-red-950/60'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLiveRealMode
            ? side === 'LONG'
              ? `🔴 ¡EJECUTAR COMPRA REAL LONG! (${leverage}x - $${numMargin} USDC)`
              : `🔴 ¡EJECUTAR VENTA REAL SHORT! (${leverage}x - $${numMargin} USDC)`
            : side === 'LONG'
            ? `💥 ¡ABRE FUEGO LONG (SIM)! (${leverage}x - $${numMargin} USDC)`
            : `🎯 ¡DISPARA SHORT (SIM)! (${leverage}x - $${numMargin} USDC)`}
        </button>

        {/* Tony Quote Footer */}
        <div className="text-[10px] text-zinc-500 italic text-center pt-1 font-mono">
          {isLiveRealMode
            ? '🔴 Orden con liquidación real on-chain en Hyperliquid L1.'
            : '&quot;Say hello to 50x leverage! El mundo no espera a los cobardes.&quot;'}
        </div>
      </form>
    </div>
  );
};
