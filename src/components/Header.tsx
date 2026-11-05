import React from 'react';
import { useTrading } from '../context/TradingContext';
import { MarketSymbol } from '../types/trading';
import {
  Flame,
  Wallet,
  Shield,
  ShieldAlert,
  Power,
  Zap,
  TrendingUp,
  MessageSquare,
  Database,
  FileText,
  Volume2,
  Activity,
  Cpu,
  Layers,
  ShieldCheck,
} from 'lucide-react';

interface HeaderProps {
  currentTab: 'terminal' | 'chat' | 'knowledge' | 'wallet' | 'export';
  setCurrentTab: (tab: 'terminal' | 'chat' | 'knowledge' | 'wallet' | 'export') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab }) => {
  const {
    activeSymbol,
    setActiveSymbol,
    markets,
    wallet,
    setIsWalletModalOpen,
    isAutoBotActive,
    toggleAutoBot,
    isTTSPlaying,
    isLiveRealMode,
    toggleLiveRealMode,
    realWeb3Status,
    connectRealWeb3Wallet,
    isLiveOrderFlowConnected,
    openHashVerifier,
    mevShield,
    arbitrageOpportunities,
  } = useTrading();

  const curMarket = markets[activeSymbol];
  const isPositive = curMarket.change24h >= 0;

  return (
    <header className="border-b border-amber-500/20 bg-[#07080c]/90 backdrop-blur-2xl text-white sticky top-0 z-40 select-none shadow-2xl scanline">
      {/* Top Banner Scarface Cyber Quote Ticker */}
      <div className="bg-gradient-to-r from-[#0c0908] via-[#1a1208] to-[#08070b] border-b border-white/5 px-4 py-1 text-xs flex items-center justify-between overflow-hidden">
        <div className="flex items-center space-x-3 text-amber-300 font-semibold tracking-wider">
          <span className="flex items-center space-x-1.5 text-amber-400">
            <Flame className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            <span className="uppercase text-[10px] font-black tracking-widest bg-gradient-to-r from-amber-300 to-yellow-500 bg-clip-text text-transparent">
              THE WORLD IS YOURS // HYPERLIQUID QUANT TERMINAL
            </span>
          </span>
          <span className="text-zinc-700">|</span>
          <span className="italic text-zinc-400 hidden md:inline text-[11px]">
            &quot;Todo lo que tengo en este mundo son mis cojones y mi palabra, y no los rompo por nadie.&quot;
          </span>
        </div>
        <div className="flex items-center space-x-3 text-[11px] text-zinc-400 font-mono">
          <span className="flex items-center space-x-1.5">
            <span className={`w-2 h-2 rounded-full inline-block ${isLiveOrderFlowConnected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
            <span className={isLiveOrderFlowConnected ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
              {isLiveOrderFlowConnected ? 'FLUJO L1 EN VIVO' : 'CONECTANDO L1...'}
            </span>
          </span>
          <span className="text-zinc-700">|</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wider ${
            isLiveRealMode
              ? 'bg-red-950 text-red-300 border border-red-500/60 animate-pulse'
              : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
          }`}>
            {isLiveRealMode ? '🔴 MAINNET REAL EN VIVO' : '🧪 SIMULADOR TESTNET'}
          </span>
          <span className="text-zinc-700">|</span>
          <span className="text-amber-300/90 font-mono">
            Funding 8h: <span className="text-emerald-400 font-bold">+{(curMarket.fundingRate * 100).toFixed(4)}%</span>
          </span>
          <span className="text-zinc-700 hidden sm:inline">|</span>
          <span className="text-cyan-300 font-mono hidden sm:inline">
            🛡️ MEV Saved <span className="text-emerald-400 font-bold">${mevShield.totalSavedUsd.toFixed(2)}</span>
          </span>
          <span className="text-zinc-700 hidden md:inline">|</span>
          <span className="text-amber-200 font-mono hidden md:inline">
            ⚖️ Spread {arbitrageOpportunities[0]?.basisSpreadPct.toFixed(2)}% APY <span className="text-emerald-400 font-bold">{arbitrageOpportunities[0]?.annualizedApy.toFixed(0)}%</span>
          </span>
        </div>
      </div>

      {/* Main Cyber Executive Bar */}
      <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3">
          <div
            className="relative group cursor-pointer"
            onClick={() => setCurrentTab('terminal')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 via-red-950/70 to-black p-0.5 shadow-lg shadow-amber-500/10 flex items-center justify-center border border-amber-400/80 group-hover:border-amber-300 transition-all">
              <div className="w-full h-full bg-[#08090d] rounded-[10px] flex items-center justify-center">
                <span className="text-amber-400 font-black text-lg tracking-tighter">TM</span>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-black animate-pulse" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-black text-base md:text-lg tracking-wider bg-gradient-to-r from-white via-amber-200 to-amber-500 bg-clip-text text-transparent uppercase font-mono">
                SCARFACE HYPERLIQUID
              </h1>
              <span className="px-2 py-0.5 rounded text-[9px] font-black bg-gradient-to-r from-red-950 to-amber-950 text-amber-300 border border-amber-500/40 uppercase tracking-widest shadow">
                IMPERIO BÉLICO
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 tracking-tight font-mono flex items-center space-x-1.5">
              <span>Terminal Cuántico Ejecutivo</span>
              <span className="text-zinc-600">●</span>
              <span className="text-cyan-400">Sabiduría Global & Botón ON</span>
            </p>
          </div>

          {/* Market Selector Tabs */}
          <div className="ml-2 hidden lg:flex items-center bg-black/60 border border-white/10 rounded-xl p-1 backdrop-blur-md">
            {(Object.keys(markets) as MarketSymbol[]).map((sym) => (
              <button
                key={sym}
                onClick={() => setActiveSymbol(sym)}
                className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                  activeSymbol === sym
                    ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-black shadow-md font-extrabold'
                    : 'text-zinc-400 hover:text-amber-200 hover:bg-white/5'
                }`}
              >
                {sym.replace('-PERP', '')}
              </button>
            ))}
          </div>
        </div>

        {/* Center / Ticker metrics in Cyber HUD */}
        <div className="hidden xl:flex items-center space-x-6 bg-black/60 border border-amber-500/20 px-5 py-2 rounded-xl backdrop-blur-md shadow-inner">
          <div>
            <div className="text-[10px] uppercase text-zinc-500 font-mono tracking-wider">Precio {activeSymbol}</div>
            <div className="text-base font-black font-mono text-white tracking-wide">
              ${curMarket.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="w-px h-7 bg-zinc-800" />
          <div>
            <div className="text-[10px] uppercase text-zinc-500 font-mono tracking-wider">Cambio 24h</div>
            <div className={`text-xs font-black font-mono flex items-center ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
              <TrendingUp className={`w-3.5 h-3.5 mr-1 ${!isPositive && 'rotate-180'}`} />
              {isPositive ? '+' : ''}{curMarket.change24h}%
            </div>
          </div>
          <div className="w-px h-7 bg-zinc-800" />
          <div>
            <div className="text-[10px] uppercase text-zinc-500 font-mono tracking-wider">Volumen L1</div>
            <div className="text-xs font-mono text-amber-300 font-bold">
              ${(curMarket.volume24h / 1e6).toFixed(1)}M
            </div>
          </div>
          <div className="w-px h-7 bg-zinc-800" />
          <div>
            <div className="text-[10px] uppercase text-zinc-500 font-mono tracking-wider">Max Lev</div>
            <div className="text-xs font-mono text-red-400 font-extrabold">
              {curMarket.maxLeverage}x Cross
            </div>
          </div>
        </div>

        {/* Action Controls: Simulation Off / Live Real Toggle, Master ON/OFF Switch & Wallet */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* APAGAR SIMULACIÓN / MODO REAL EN VIVO BUTTON */}
          <button
            onClick={toggleLiveRealMode}
            className={`relative px-3 py-2 rounded-xl font-mono text-xs tracking-wider transition-all duration-300 flex items-center space-x-2 border shadow-xl cursor-pointer ${
              isLiveRealMode
                ? 'bg-gradient-to-r from-red-950 via-rose-900 to-red-950 text-white border-red-500 shadow-red-900/50 ring-1 ring-red-400 animate-pulse'
                : 'bg-[#10121a] hover:bg-[#181c26] text-zinc-300 border-white/10 hover:border-amber-400/50'
            }`}
            title={isLiveRealMode ? 'Haz clic para volver a Simulación Testnet' : 'Haz clic para apagar la simulación y activar compras y ventas reales en vivo'}
          >
            <div className="relative">
              {isLiveRealMode ? (
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                </span>
              ) : (
                <span className="inline-flex rounded-full h-3 w-3 bg-cyan-400/80" />
              )}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold leading-none">
                {isLiveRealMode ? '🚨 SIMULACIÓN: OFF' : '🧪 SIMULACIÓN: ON'}
              </span>
              <span className={`text-[11px] font-black uppercase tracking-tight ${isLiveRealMode ? 'text-red-300' : 'text-cyan-300'}`}>
                {isLiveRealMode ? 'MODO REAL L1' : 'APAGAR SIMULACIÓN'}
              </span>
            </div>
          </button>

          {/* Web3 Connect Pill when in Real Live Mode */}
          {isLiveRealMode && (
            <button
              onClick={connectRealWeb3Wallet}
              className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-2 rounded-xl text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                realWeb3Status === 'CONNECTED'
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                  : 'bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border-amber-500/50'
              }`}
            >
              <Zap className="w-3 h-3" />
              <span>{realWeb3Status === 'CONNECTED' ? 'WEB3 CONECTADA' : 'CONECTAR EXTENSIÓN'}</span>
            </button>
          )}

          {/* THE MASTER AUTONOMOUS BOT BUTTON ("SAY HELLO TO MY LITTLE FRIEND") */}
          <button
            onClick={toggleAutoBot}
            className={`relative px-4 py-2 rounded-xl font-black text-xs tracking-wider transition-all duration-300 flex items-center space-x-2.5 border shadow-xl cursor-pointer ${
              isAutoBotActive
                ? 'bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-white border-amber-300 shadow-amber-500/30 animate-pulse'
                : 'bg-[#0f1118] hover:bg-[#151922] text-zinc-300 border-white/10 hover:border-amber-500/50'
            }`}
          >
            <Power className={`w-4 h-4 ${isAutoBotActive ? 'text-white' : 'text-zinc-500'}`} />
            <div className="flex flex-col text-left">
              <span className="text-[9px] uppercase tracking-widest text-amber-300 font-bold leading-none">
                {isAutoBotActive ? 'BOTÓN ON ● ACTIVO' : 'BOTÓN OFF ● BLOQUEADO'}
              </span>
              <span className="text-xs font-black uppercase tracking-tight">
                {isAutoBotActive ? '💥 LITTLE FRIEND' : 'MODO BÉLICO IA'}
              </span>
            </div>
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isAutoBotActive ? 'bg-emerald-400 ring-4 ring-emerald-950 animate-ping' : 'bg-zinc-600'
              }`}
            />
          </button>

          {/* Quick Wallet Button */}
          <button
            onClick={() => setIsWalletModalOpen(true)}
            className="flex items-center space-x-2.5 bg-black/60 hover:bg-black/90 border border-amber-500/30 hover:border-amber-400 px-3.5 py-2 rounded-xl text-left transition-all cursor-pointer group shadow-lg"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/30 group-hover:border-amber-400 transition-all">
              <Wallet className="w-4 h-4" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] text-zinc-500 font-mono">Bóveda:</span>
                <span className="text-xs font-mono font-black text-emerald-400">
                  ${wallet.balances.USDC.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="text-[9px] font-mono flex items-center space-x-1">
                {isAutoBotActive ? (
                  <span className="text-emerald-400 flex items-center font-bold">
                    <Shield className="w-2.5 h-2.5 mr-0.5" /> IA Con Permiso
                  </span>
                ) : (
                  <span className="text-amber-400/90 flex items-center font-bold">
                    <ShieldAlert className="w-2.5 h-2.5 mr-0.5" /> IA Bloqueada
                  </span>
                )}
              </div>
            </div>
          </button>

          {/* Quick Hash Verifier Button */}
          <button
            onClick={() => openHashVerifier()}
            className="flex items-center space-x-2 bg-gradient-to-r from-[#170e0a] to-[#24130a] hover:from-[#25150e] hover:to-[#351c0f] border border-amber-500/40 hover:border-amber-400 px-3 py-2 rounded-xl text-left transition-all cursor-pointer group shadow-lg"
            title="Abrir Verificador de Hash On-Chain de Hyperliquid L1"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/30 group-hover:border-amber-400 transition-all">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            </div>
            <div className="hidden lg:block">
              <div className="text-[9px] uppercase tracking-wider text-amber-300 font-bold leading-none">
                LIBRO L1
              </div>
              <div className="text-[11px] font-black uppercase tracking-tight text-white group-hover:text-amber-200">
                VERIFICAR HASH
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Cyber Sub-Header Navigation Tabs */}
      <div className="px-4 bg-black/80 border-t border-white/5 flex items-center justify-between overflow-x-auto no-scrollbar">
        <nav className="flex space-x-1.5 py-1.5">
          <button
            onClick={() => setCurrentTab('terminal')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer font-mono ${
              currentTab === 'terminal'
                ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-300 border border-amber-500/40 shadow-inner'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Terminal Bélico</span>
          </button>

          <button
            onClick={() => setCurrentTab('chat')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer font-mono ${
              currentTab === 'chat'
                ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-300 border border-amber-500/40 shadow-inner'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-red-400" />
            <span>Despacho de Tony (Chat IA)</span>
            {isTTSPlaying && <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-bounce" />}
          </button>

          <button
            onClick={() => setCurrentTab('knowledge')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer font-mono ${
              currentTab === 'knowledge'
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-cyan-300 border border-cyan-500/40 shadow-inner'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>Guía & Inteligencia Colectiva</span>
          </button>

          <button
            onClick={() => setCurrentTab('wallet')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer font-mono ${
              currentTab === 'wallet'
                ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-300 border border-amber-500/40 shadow-inner'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Wallet className="w-3.5 h-3.5 text-amber-400" />
            <span>La Bóveda & On-Chain</span>
          </button>

          <button
            onClick={() => setCurrentTab('export')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer font-mono ${
              currentTab === 'export'
                ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-300 border border-amber-500/40 shadow-inner'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-red-400" />
            <span>Dossier Pro Master</span>
          </button>

          <button
            onClick={() => openHashVerifier()}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer font-mono text-amber-300 hover:text-amber-100 bg-[#160d09] hover:bg-[#26150e] border border-[#3f2112] hover:border-amber-400/60 shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Verificador de Hash</span>
          </button>
        </nav>

        {/* Live System Frequency / Status */}
        <div className="hidden md:flex items-center space-x-3 text-[11px] font-mono text-zinc-400">
          <span className="flex items-center space-x-1 text-zinc-500">
            <Cpu className="w-3 h-3 text-cyan-400" />
            <span>Neural Engine:</span>
            <span className="text-cyan-300 font-bold">ONLINE</span>
          </span>
          <span className="text-zinc-700">|</span>
          {isAutoBotActive ? (
            <span className="text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/80 font-bold flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
              FUEGO AUTÓNOMO AUTORIZADO
            </span>
          ) : (
            <span className="text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-700/60 font-bold flex items-center">
              <span className="w-2 h-2 rounded-full bg-amber-400 mr-1.5" />
              STANDBY // FONDOS SEGUROS
            </span>
          )}
        </div>
      </div>
    </header>
  );
};
