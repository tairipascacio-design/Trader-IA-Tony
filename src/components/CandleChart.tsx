import React, { useState, useMemo, useRef } from 'react';
import { useTrading } from '../context/TradingContext';
import { Candle } from '../types/trading';
import { TrendingUp, BarChart2, Eye } from 'lucide-react';

export const CandleChart: React.FC = () => {
  const { activeSymbol, markets, candles, timeframe, setTimeframe, positions } = useTrading();
  const curMarket = markets[activeSymbol];
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const TIMEFRAMES = ['1m', '5m', '15m', '1h', '4h', '1D'];

  // Calculate EMA helper
  const calculateEMA = (data: Candle[], period: number) => {
    const k = 2 / (period + 1);
    const emaArray: (number | null)[] = [];
    let prevEMA: number | null = null;

    data.forEach((c, i) => {
      if (i < period - 1) {
        emaArray.push(null);
      } else if (i === period - 1) {
        const sum = data.slice(0, period).reduce((acc, val) => acc + val.close, 0);
        prevEMA = sum / period;
        emaArray.push(prevEMA);
      } else if (prevEMA !== null) {
        prevEMA = c.close * k + prevEMA * (1 - k);
        emaArray.push(prevEMA);
      }
    });
    return emaArray;
  };

  const ema20 = useMemo(() => calculateEMA(candles, 14), [candles]);
  const ema50 = useMemo(() => calculateEMA(candles, 28), [candles]);

  // Chart bounds
  const { minPrice, maxPrice, priceRange, maxVol } = useMemo(() => {
    if (candles.length === 0) return { minPrice: 0, maxPrice: 1, priceRange: 1, maxVol: 1 };
    let min = Infinity;
    let max = -Infinity;
    let volMax = 0;

    candles.forEach((c) => {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
      if (c.volume > volMax) volMax = c.volume;
    });

    // Add padding
    const padding = (max - min) * 0.08 || 1;
    return {
      minPrice: min - padding,
      maxPrice: max + padding,
      priceRange: max - min + padding * 2,
      maxVol: volMax * 1.2 || 1,
    };
  }, [candles]);

  const chartHeight = 360;
  const chartWidth = 800; // viewBox width

  const getY = (price: number) => {
    if (priceRange === 0) return chartHeight / 2;
    return chartHeight - ((price - minPrice) / priceRange) * (chartHeight - 60) - 40;
  };

  const candleWidth = useMemo(() => {
    if (candles.length === 0) return 6;
    return Math.max(3, (chartWidth / candles.length) * 0.65);
  }, [candles.length]);

  const activeHoverCandle = hoverIndex !== null && candles[hoverIndex] ? candles[hoverIndex] : candles[candles.length - 1];

  return (
    <div className="bg-[#0e0a08] border border-[#2e190e] rounded-xl overflow-hidden flex flex-col shadow-xl">
      {/* Chart Toolbar */}
      <div className="px-3 sm:px-4 py-2 border-b border-[#24150c] bg-[#140e0b] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="flex items-center space-x-1.5 font-mono">
            <span className="font-extrabold text-sm sm:text-base text-amber-200">{activeSymbol}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-950 text-red-400 font-bold border border-red-800">
              PERP
            </span>
          </div>

          {/* Timeframe buttons */}
          <div className="flex items-center bg-[#1d120c] rounded-md p-0.5 border border-[#3b2012]">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-0.5 text-xs font-mono font-bold rounded transition-all cursor-pointer ${
                  timeframe === tf
                    ? 'bg-[#851e1e] text-amber-200 shadow'
                    : 'text-zinc-400 hover:text-white hover:bg-[#28160e]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Indicators legend */}
          <div className="hidden md:flex items-center space-x-3 text-[11px] font-mono">
            <span className="flex items-center space-x-1 text-[#eab308]">
              <span className="w-2 h-0.5 bg-[#eab308] rounded-full inline-block" />
              <span>EMA 14 (Oro)</span>
            </span>
            <span className="flex items-center space-x-1 text-[#ef4444]">
              <span className="w-2 h-0.5 bg-[#ef4444] rounded-full inline-block" />
              <span>EMA 28 (Sangre)</span>
            </span>
          </div>
        </div>

        {/* OHLC tooltip info */}
        {activeHoverCandle && (
          <div className="flex items-center space-x-2 sm:space-x-3 text-[11px] font-mono text-zinc-300">
            <span>O: <span className="text-white">${activeHoverCandle.open.toFixed(2)}</span></span>
            <span>H: <span className="text-emerald-400">${activeHoverCandle.high.toFixed(2)}</span></span>
            <span>L: <span className="text-red-400">${activeHoverCandle.low.toFixed(2)}</span></span>
            <span>C: <span className={activeHoverCandle.close >= activeHoverCandle.open ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
              ${activeHoverCandle.close.toFixed(2)}
            </span></span>
          </div>
        )}
      </div>

      {/* SVG Canvas Area */}
      <div
        ref={containerRef}
        className="relative w-full h-[320px] sm:h-[380px] bg-[#0b0806] cursor-crosshair select-none"
        onMouseLeave={() => setHoverIndex(null)}
      >
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-full"
          preserveAspectRatio="none"
          onMouseMove={(e) => {
            if (!containerRef.current || candles.length === 0) return;
            const rect = containerRef.current.getBoundingClientRect();
            const relX = e.clientX - rect.left;
            const idx = Math.floor((relX / rect.width) * candles.length);
            if (idx >= 0 && idx < candles.length) {
              setHoverIndex(idx);
            }
          }}
        >
          <defs>
            <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="goldGlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#d4af37" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Horizontal Price Grid Lines */}
          {[0.2, 0.4, 0.6, 0.8].map((ratio, i) => {
            const p = minPrice + priceRange * ratio;
            const y = getY(p);
            return (
              <g key={i}>
                <line x1="0" y1={y} x2={chartWidth} y2={y} stroke="#21150e" strokeDasharray="3 3" />
                <text x={chartWidth - 5} y={y - 3} fill="#6b7280" fontSize="10" textAnchor="end" fontFamily="monospace">
                  ${p.toFixed(curMarket.tickSize < 0.01 ? 3 : 2)}
                </text>
              </g>
            );
          })}

          {/* Volume bars in background */}
          {candles.map((c, i) => {
            const x = (i / candles.length) * chartWidth + candleWidth / 2;
            const volHeight = (c.volume / maxVol) * 60;
            const y = chartHeight - volHeight;
            const isGreen = c.close >= c.open;
            return (
              <rect
                key={`vol-${i}`}
                x={x - candleWidth / 2}
                y={y}
                width={candleWidth}
                height={volHeight}
                fill={isGreen ? '#059669' : '#dc2626'}
                opacity="0.25"
              />
            );
          })}

          {/* Candlesticks (Wick & Body) */}
          {candles.map((c, i) => {
            const x = (i / candles.length) * chartWidth + candleWidth / 2;
            const isGreen = c.close >= c.open;
            const bodyTop = getY(Math.max(c.open, c.close));
            const bodyBottom = getY(Math.min(c.open, c.close));
            const bodyHeight = Math.max(1.5, bodyBottom - bodyTop);
            const highY = getY(c.high);
            const lowY = getY(c.low);

            return (
              <g key={`candle-${i}`}>
                {/* Wick */}
                <line
                  x1={x}
                  y1={highY}
                  x2={x}
                  y2={lowY}
                  stroke={isGreen ? '#10b981' : '#ef4444'}
                  strokeWidth="1.2"
                />
                {/* Body */}
                <rect
                  x={x - candleWidth / 2}
                  y={bodyTop}
                  width={candleWidth}
                  height={bodyHeight}
                  fill={isGreen ? '#10b981' : '#ef4444'}
                  rx="1"
                />
              </g>
            );
          })}

          {/* EMA 14 (Gold) */}
          <path
            d={candles
              .map((_, i) => {
                const val = ema20[i];
                if (val === null) return null;
                const x = (i / candles.length) * chartWidth + candleWidth / 2;
                const y = getY(val);
                return `${i === 0 || ema20[i - 1] === null ? 'M' : 'L'} ${x} ${y}`;
              })
              .filter(Boolean)
              .join(' ')}
            fill="none"
            stroke="#eab308"
            strokeWidth="1.5"
            opacity="0.85"
          />

          {/* EMA 28 (Red) */}
          <path
            d={candles
              .map((_, i) => {
                const val = ema50[i];
                if (val === null) return null;
                const x = (i / candles.length) * chartWidth + candleWidth / 2;
                const y = getY(val);
                return `${i === 0 || ema50[i - 1] === null ? 'M' : 'L'} ${x} ${y}`;
              })
              .filter(Boolean)
              .join(' ')}
            fill="none"
            stroke="#ef4444"
            strokeWidth="1.5"
            opacity="0.85"
          />

          {/* Active Positions Overlay Lines (Entry, TP, SL) */}
          {positions
            .filter((p) => p.symbol === activeSymbol)
            .map((pos) => {
              const entryY = getY(pos.entryPrice);
              const tpY = pos.takeProfit ? getY(pos.takeProfit) : null;
              const slY = pos.stopLoss ? getY(pos.stopLoss) : null;
              const isLong = pos.side === 'LONG';

              return (
                <g key={pos.id}>
                  {/* Entry Line */}
                  <line
                    x1="0"
                    y1={entryY}
                    x2={chartWidth}
                    y2={entryY}
                    stroke={isLong ? '#10b981' : '#f43f5e'}
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />
                  <rect x="5" y={entryY - 10} width="110" height="18" fill="#140e0b" rx="3" stroke={isLong ? '#10b981' : '#f43f5e'} />
                  <text x="10" y={entryY + 3} fill={isLong ? '#10b981' : '#f43f5e'} fontSize="10" fontWeight="bold" fontFamily="monospace">
                    {pos.side} @ ${pos.entryPrice.toFixed(2)}
                  </text>

                  {/* Take Profit Line */}
                  {tpY !== null && (
                    <>
                      <line x1="0" y1={tpY} x2={chartWidth} y2={tpY} stroke="#facc15" strokeWidth="1" strokeDasharray="2 2" />
                      <rect x="125" y={tpY - 9} width="95" height="16" fill="#1f1807" rx="3" stroke="#facc15" />
                      <text x="130" y={tpY + 3} fill="#facc15" fontSize="9" fontWeight="bold" fontFamily="monospace">
                        TP: ${pos.takeProfit?.toFixed(2)}
                      </text>
                    </>
                  )}

                  {/* Stop Loss Line */}
                  {slY !== null && (
                    <>
                      <line x1="0" y1={slY} x2={chartWidth} y2={slY} stroke="#dc2626" strokeWidth="1" strokeDasharray="2 2" />
                      <rect x="125" y={slY - 9} width="95" height="16" fill="#240707" rx="3" stroke="#dc2626" />
                      <text x="130" y={slY + 3} fill="#dc2626" fontSize="9" fontWeight="bold" fontFamily="monospace">
                        SL: ${pos.stopLoss?.toFixed(2)}
                      </text>
                    </>
                  )}
                </g>
              );
            })}

          {/* Current Live Price Line */}
          {(() => {
            const curY = getY(curMarket.price);
            return (
              <g>
                <line x1="0" y1={curY} x2={chartWidth} y2={curY} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2 2" />
                <rect x={chartWidth - 85} y={curY - 10} width="85" height="20" fill="#78350f" rx="3" />
                <text x={chartWidth - 80} y={curY + 4} fill="#fef08a" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  ${curMarket.price.toFixed(curMarket.tickSize < 0.01 ? 3 : 2)}
                </text>
              </g>
            );
          })()}

          {/* Crosshair Cursor on Hover */}
          {hoverIndex !== null && (
            <g>
              <line
                x1={(hoverIndex / candles.length) * chartWidth + candleWidth / 2}
                y1="0"
                x2={(hoverIndex / candles.length) * chartWidth + candleWidth / 2}
                y2={chartHeight}
                stroke="#d4af37"
                strokeWidth="0.8"
                strokeDasharray="2 2"
              />
            </g>
          )}
        </svg>

        {/* Scarface Watermark in background */}
        <div className="absolute bottom-3 left-4 pointer-events-none opacity-20 flex items-center space-x-2">
          <span className="text-3xl font-black text-[#d4af37] tracking-widest uppercase">THE WORLD IS YOURS</span>
        </div>
      </div>
    </div>
  );
};
