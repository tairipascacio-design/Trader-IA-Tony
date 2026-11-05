import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { MarketSymbol, MEVProvider, VaultStrategy } from '../types/trading';
import { requestYieldStrategyAnalysis, YieldStrategyAIAdvice } from '../services/api';
import {
  Scale,
  ShieldCheck,
  RefreshCw,
  Power,
  Sparkles,
  ArrowUpRight,
  Lock,
  Layers,
  Coins,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Wallet,
  Zap,
  Shield,
} from 'lucide-react';

export const YieldArbitrageVaultPanel: React.FC = () => {
  const {
    wallet,
    deltaPositions,
    arbitrageOpportunities,
    isDeltaArbBotEnabled,
    toggleDeltaArbBot,
    deltaArbMinFundingThreshold,
    setDeltaArbMinFundingThreshold,
    openDeltaNeutralPosition,
    closeDeltaNeutralPosition,
    triggerFundingHarvest,
    nextFundingEpochCountdown,
    mevShield,
    toggleMevShield,
    setMevProvider,
    mevLogs,
    vaultState,
    toggleAutoCompoundVault,
    setVaultStrategy,
    manualCompoundNow,
    depositToVault,
    withdrawFromVault,
    openHashVerifier,
  } = useTrading();

  const [selectedArbSymbol, setSelectedArbSymbol] = useState<MarketSymbol>('ETH-PERP');
  const [arbCapitalInput, setArbCapitalInput] = useState<string>('1000');
  const [vaultAmountInput, setVaultAmountInput] = useState<string>('500');
  const [aiAdvice, setAiAdvice] = useState<YieldStrategyAIAdvice | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const topOpp = arbitrageOpportunities[0];
  const selectedOpp =
    arbitrageOpportunities.find((o) => o.symbol === selectedArbSymbol) || topOpp;

  const totalDeltaAllocated = deltaPositions.reduce((acc, p) => acc + p.totalAllocatedUsd, 0);
  const totalDeltaFundingEarned = deltaPositions.reduce((acc, p) => acc + p.accruedFundingUsd, 0);

  const handleOpenDelta = async (e: React.FormEvent) => {
    e.preventDefault();
    const cap = parseFloat(arbCapitalInput);
    if (isNaN(cap) || cap <= 0) return;
    await openDeltaNeutralPosition(selectedArbSymbol, cap);
  };

  const handleVaultDeposit = async () => {
    const amt = parseFloat(vaultAmountInput);
    if (isNaN(amt) || amt <= 0) return;
    await depositToVault(amt);
  };

  const handleVaultWithdraw = async () => {
    const amt = parseFloat(vaultAmountInput);
    if (isNaN(amt) || amt <= 0) return;
    await withdrawFromVault(amt);
  };

  const handleAskAiYieldAdvisor = async () => {
    setIsLoadingAi(true);
    try {
      const res = await requestYieldStrategyAnalysis({
        opportunities: arbitrageOpportunities,
        deltaPositions,
        mevShield,
        vaultState,
      });
      setAiAdvice(res);
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="space-y-4 font-mono">
      {/* Top Executive Banner: Passive Yield & MEV Protection */}
      <div className="bg-gradient-to-r from-[#0e0a08] via-[#17100b] to-[#0b0d13] border border-amber-500/30 rounded-xl p-4 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-emerald-500/20 border border-amber-400/60 flex items-center justify-center">
              <Scale className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-amber-200">
                  MOTOR DE YIELD PASIVO: DELTA-NEUTRAL + MEV SHIELD + AUTO-COMPOUND
                </h2>
                <span className="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-950 text-emerald-300 border border-emerald-500/40 uppercase">
                  DELTA = 0 // SIN RIESGO DE PRECIO
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Genera APY mientras duermes aunque el mercado esté lateral: Spot Arbitrum (Uniswap) + Short 1x Hyperliquid + Ruta Privada MEV + Interés Compuesto
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleAskAiYieldAdvisor}
              disabled={isLoadingAi}
              className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-black text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow-lg cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isLoadingAi ? 'animate-spin' : ''}`} />
              <span>{isLoadingAi ? 'Analizando con Gemini...' : 'Auditar Yield con IA'}</span>
            </button>
          </div>
        </div>

        {/* AI Advisor Output Box */}
        {aiAdvice && (
          <div className="mt-3 p-3.5 rounded-lg bg-black/60 border border-amber-500/40 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-black text-amber-300 uppercase flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{aiAdvice.headline}</span>
              </span>
              <button
                type="button"
                onClick={() => openDeltaNeutralPosition(aiAdvice.optimalSymbol as MarketSymbol, aiAdvice.suggestedCapitalUsd || 1000)}
                className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] uppercase cursor-pointer"
              >
                Ejecutar {aiAdvice.optimalSymbol} (${aiAdvice.suggestedCapitalUsd || 1000})
              </button>
            </div>
            <p className="text-zinc-300 text-[11px] leading-relaxed">{aiAdvice.recommendation}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 text-[10px]">
              <div className="bg-cyan-950/30 border border-cyan-800/50 rounded p-2 text-cyan-200">
                🛡️ {aiAdvice.mevAdvice}
              </div>
              <div className="bg-emerald-950/30 border border-emerald-800/50 rounded p-2 text-emerald-200">
                🔄 {aiAdvice.vaultAdvice}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3-Column Core Architecture Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* 1. FUNDING ARBITRAGE DELTA-NEUTRAL (5 cols) */}
        <div className="xl:col-span-5 bg-[#0e0a08] border border-[#2e190e] rounded-xl overflow-hidden shadow-xl flex flex-col">
          <div className="px-4 py-3 border-b border-[#24150c] bg-gradient-to-r from-[#1a0f0a] to-[#120906] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Scale className="w-4 h-4 text-amber-400" />
              <div>
                <h3 className="text-xs font-black uppercase text-amber-200">
                  1. Funding Arbitrage Delta-Neutral
                </h3>
                <p className="text-[10px] text-zinc-400">
                  Spot Arbitrum (Uniswap) + Short 1x Hyperliquid
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleDeltaArbBot}
              className={`px-2.5 py-1 rounded text-[10px] font-black uppercase flex items-center space-x-1 border cursor-pointer ${
                isDeltaArbBotEnabled
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/60'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-700'
              }`}
            >
              <Power className="w-3 h-3" />
              <span>{isDeltaArbBotEnabled ? 'AUTO ON' : 'AUTO OFF'}</span>
            </button>
          </div>

          <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between">
            {/* Highlighted Spread & APY Banner */}
            <div className="p-3 rounded-lg bg-gradient-to-r from-emerald-950/50 via-[#131a14] to-amber-950/40 border border-emerald-500/40 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-zinc-400 uppercase">Mejor Oportunidad ({topOpp?.symbol})</div>
                <div className="text-sm sm:text-base font-black text-emerald-300">
                  Spread {topOpp?.basisSpreadPct.toFixed(2)}% • APY {topOpp?.annualizedApy.toFixed(0)}%
                </div>
                <div className="text-[10px] text-amber-300/90">
                  Funding 8h: +{(topOpp?.fundingRate8h * 100).toFixed(3)}% | Próximo cobro: {nextFundingEpochCountdown}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-zinc-400 uppercase">Delta Neto</div>
                <div className="text-base font-black text-cyan-300">0.00</div>
                <div className="text-[9px] text-zinc-500">100% Cubierto</div>
              </div>
            </div>

            {/* Opportunity Selector Table */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-zinc-400 uppercase">
                <span>Pares Disponibles (Spot Uniswap vs Perp HL)</span>
                <span>Umbral: +{(deltaArbMinFundingThreshold * 100).toFixed(2)}%</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {arbitrageOpportunities.slice(0, 4).map((opp) => (
                  <button
                    key={opp.symbol}
                    type="button"
                    onClick={() => setSelectedArbSymbol(opp.symbol)}
                    className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                      selectedArbSymbol === opp.symbol
                        ? 'bg-[#26160c] border-amber-400 text-white'
                        : 'bg-[#130d09] border-[#24150c] text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-amber-200">{opp.asset}</span>
                      <span className="text-[10px] font-black text-emerald-400">
                        APY {opp.annualizedApy.toFixed(0)}%
                      </span>
                    </div>
                    <div className="text-[10px] text-zinc-400 flex justify-between mt-0.5">
                      <span>Spread {opp.basisSpreadPct}%</span>
                      <span className="text-cyan-300">+{(opp.fundingRate8h * 100).toFixed(3)}%</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Execute Delta-Neutral Form */}
            <form onSubmit={handleOpenDelta} className="bg-[#130d09] p-3 rounded-lg border border-[#26150c] space-y-2.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-400">Capital Total (50% Spot + 50% Short):</span>
                <span className="text-emerald-400 font-bold">
                  Disp: ${wallet.balances.USDC.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex space-x-2">
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={arbCapitalInput}
                  onChange={(e) => setArbCapitalInput(e.target.value)}
                  className="flex-1 bg-[#090705] border border-[#381e10] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  placeholder="Ej: 1000 USDC"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider cursor-pointer shadow-lg"
                >
                  Abrir Delta-0
                </button>
              </div>
              {selectedOpp && (
                <div className="text-[10px] text-zinc-400 flex items-center justify-between pt-0.5">
                  <span>
                    Compra {((parseFloat(arbCapitalInput || '0') / 2) / selectedOpp.spotPrice).toFixed(3)} {selectedOpp.asset} Spot + Short {((parseFloat(arbCapitalInput || '0') / 2) / selectedOpp.spotPrice).toFixed(3)} {selectedOpp.asset}
                  </span>
                  <span className="text-emerald-400 font-bold">
                    +${((parseFloat(arbCapitalInput || '0') * selectedOpp.fundingRate8h)).toFixed(2)} / 8h
                  </span>
                </div>
              )}
            </form>

            {/* Active Delta-Neutral Positions */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-300 font-bold uppercase">
                  Posiciones Delta-0 Activas ({deltaPositions.length})
                </span>
                <button
                  type="button"
                  onClick={triggerFundingHarvest}
                  className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase cursor-pointer"
                >
                  🌾 Cosechar Funding 8h
                </button>
              </div>

              <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                {deltaPositions.length === 0 ? (
                  <div className="text-center py-3 text-[11px] text-zinc-500 bg-[#0b0806] rounded border border-[#1f120a]">
                    Sin posiciones delta-neutral activas. Abre una arriba para cobrar funding cada 8h.
                  </div>
                ) : (
                  deltaPositions.map((pos) => (
                    <div
                      key={pos.id}
                      className="p-2.5 rounded-lg bg-[#130d09] border border-[#2a180e] flex items-center justify-between text-[11px]"
                    >
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="font-black text-amber-300">{pos.asset} DELTA-0</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                            Spread {pos.basisSpreadPct}% • APY {pos.annualizedApy}%
                          </span>
                        </div>
                        <div className="text-[10px] text-zinc-400 mt-0.5">
                          Spot {pos.spotSize} {pos.asset} + Short {pos.perpShortSize} {pos.asset} | Cap: ${pos.totalAllocatedUsd.toFixed(0)}
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-emerald-400 font-black">+${pos.accruedFundingUsd.toFixed(2)}</div>
                        <button
                          type="button"
                          onClick={() => closeDeltaNeutralPosition(pos.id)}
                          className="px-2 py-0.5 rounded bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-700/60 text-[9px] font-bold uppercase cursor-pointer"
                        >
                          Cerrar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 2. MEV SHIELD (ARBITRUM PRIVATE RPC) (3 cols) */}
        <div className="xl:col-span-3 bg-[#0e0a08] border border-[#2e190e] rounded-xl overflow-hidden shadow-xl flex flex-col">
          <div className="px-4 py-3 border-b border-[#24150c] bg-gradient-to-r from-[#0b161c] to-[#0e0a08] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <div>
                <h3 className="text-xs font-black uppercase text-cyan-200">
                  2. MEV Shield
                </h3>
                <p className="text-[10px] text-zinc-400">
                  Ruta Privada Arbitrum (Anti-Sandwich)
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleMevShield}
              className={`px-2.5 py-1 rounded text-[10px] font-black uppercase border cursor-pointer ${
                mevShield.isEnabled
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-500/60'
                  : 'bg-red-950 text-red-300 border-red-600/60'
              }`}
            >
              {mevShield.isEnabled ? 'SHIELD ON' : 'EXPUESTO'}
            </button>
          </div>

          <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between">
            {/* MEV Saved Hero Metric */}
            <div className="p-3.5 rounded-lg bg-gradient-to-br from-cyan-950/50 via-[#0d151c] to-emerald-950/40 border border-cyan-500/40 text-center space-y-1">
              <div className="text-[10px] uppercase tracking-widest text-cyan-300 font-bold">
                Protección Mempool Privado
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">
                MEV Saved <span className="text-emerald-400">${mevShield.totalSavedUsd.toFixed(2)}</span>
              </div>
              <div className="text-[10px] text-zinc-400">
                {mevShield.sandwichAttacksBlocked} ataques sandwich bloqueados • {mevShield.frontrunsAverted} frontruns evitados
              </div>
            </div>

            {/* Private RPC Provider Selector */}
            <div className="space-y-1.5">
              <div className="text-[10px] text-zinc-400 uppercase font-bold">
                Enrutador Privado Arbitrum
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {(
                  [
                    { id: 'FLASHBOTS_PROTECT', label: 'Flashbots Protect RPC', desc: 'Bundles privados sin mempool público' },
                    { id: 'BEBOP_PRIVATE', label: 'Bebop PrivateRFQ', desc: 'Zero-slippage & protección MEV' },
                    { id: 'EDEN_NETWORK', label: 'Eden Network RPC', desc: 'Prioridad de bloque anti-frontrun' },
                  ] as { id: MEVProvider; label: string; desc: string }[]
                ).map((prov) => (
                  <button
                    key={prov.id}
                    type="button"
                    onClick={() => setMevProvider(prov.id)}
                    className={`p-2 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between ${
                      mevShield.provider === prov.id
                        ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200'
                        : 'bg-[#130d09] border-[#24150c] text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <div className="text-[11px] font-black">{prov.label}</div>
                      <div className="text-[9px] text-zinc-500">{prov.desc}</div>
                    </div>
                    {mevShield.provider === prov.id && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Protected Transactions Log */}
            <div className="space-y-1.5">
              <div className="text-[10px] text-zinc-400 uppercase font-bold">
                Últimos Bundles Privados ({mevLogs.length})
              </div>
              <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                {mevLogs.slice(0, 6).map((log) => (
                  <div
                    key={log.id}
                    className="p-2 rounded bg-[#130d09] border border-[#21130a] flex items-center justify-between text-[10px]"
                  >
                    <div>
                      <div className="font-bold text-cyan-300">
                        🛡️ {log.action.replace(/_/g, ' ')} ({log.asset})
                      </div>
                      <div className="text-[9px] text-zinc-500">
                        Vol: ${log.amountUsd.toFixed(0)} • {log.provider.split('_')[0]}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-400 font-black">+${log.mevSavedUsd.toFixed(2)}</div>
                      <button
                        type="button"
                        onClick={() => openHashVerifier(log.txHash)}
                        className="text-[9px] text-amber-400 hover:underline cursor-pointer"
                      >
                        Hash
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. AUTO-COMPOUND VAULT (USDC / ETH) (4 cols) */}
        <div className="xl:col-span-4 bg-[#0e0a08] border border-[#2e190e] rounded-xl overflow-hidden shadow-xl flex flex-col">
          <div className="px-4 py-3 border-b border-[#24150c] bg-gradient-to-r from-[#121a10] to-[#0e0a08] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <RefreshCw className={`w-4 h-4 text-emerald-400 ${vaultState.isEnabled ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
              <div>
                <h3 className="text-xs font-black uppercase text-emerald-200">
                  3. Auto-Compound Vault
                </h3>
                <p className="text-[10px] text-zinc-400">
                  Reinversión automática en USDC / ETH
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleAutoCompoundVault}
              className={`px-2.5 py-1 rounded text-[10px] font-black uppercase border cursor-pointer ${
                vaultState.isEnabled
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/60'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-700'
              }`}
            >
              {vaultState.isEnabled ? 'COMPOUND ON' : 'PAUSADO'}
            </button>
          </div>

          <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between">
            {/* Vault TVL & Yield Summary */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-lg bg-[#130d09] border border-[#26150c]">
                <div className="text-[9px] text-zinc-500 uppercase">TVL en Vault</div>
                <div className="text-sm font-black text-white">
                  ${vaultState.totalDepositedUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#130d09] border border-[#26150c]">
                <div className="text-[9px] text-zinc-500 uppercase">Yield Ganado</div>
                <div className="text-sm font-black text-emerald-400">
                  +${vaultState.totalYieldEarnedUsd.toFixed(2)}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#130d09] border border-[#26150c]">
                <div className="text-[9px] text-zinc-500 uppercase">APY Compuesto</div>
                <div className="text-sm font-black text-amber-300">
                  {vaultState.currentApy}%
                </div>
              </div>
            </div>

            {/* Strategy Allocation Presets */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-zinc-400 uppercase">
                <span>Estrategia de Reinversión</span>
                <span className="text-emerald-400 font-bold">
                  {vaultState.allocationUsdcPct}% USDC / {vaultState.allocationEthPct}% ETH
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    { id: 'MAX_USDC_YIELD', label: '90% USDC / 10% ETH', apy: '19.4% APY' },
                    { id: 'BALANCED_USDC_ETH', label: '70% USDC / 30% ETH', apy: '24.8% APY' },
                    { id: 'HYPERLIQUID_MARGIN_REINVEST', label: '50% USDC / 50% ETH', apy: '34.2% APY' },
                  ] as { id: VaultStrategy; label: string; apy: string }[]
                ).map((strat) => (
                  <button
                    key={strat.id}
                    type="button"
                    onClick={() => setVaultStrategy(strat.id)}
                    className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                      vaultState.targetStrategy === strat.id
                        ? 'bg-emerald-950/50 border-emerald-400 text-emerald-200'
                        : 'bg-[#130d09] border-[#24150c] text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="text-[10px] font-black">{strat.label}</div>
                    <div className="text-[9px] text-amber-300 mt-0.5">{strat.apy}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Deposit / Withdraw & Manual Compound */}
            <div className="bg-[#130d09] p-3 rounded-lg border border-[#26150c] space-y-2">
              <div className="flex space-x-2">
                <input
                  type="number"
                  min="10"
                  step="50"
                  value={vaultAmountInput}
                  onChange={(e) => setVaultAmountInput(e.target.value)}
                  className="w-28 bg-[#090705] border border-[#381e10] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                  placeholder="USDC"
                />
                <button
                  type="button"
                  onClick={handleVaultDeposit}
                  className="flex-1 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-black text-[11px] uppercase cursor-pointer"
                >
                  + Depositar
                </button>
                <button
                  type="button"
                  onClick={handleVaultWithdraw}
                  className="flex-1 py-1.5 rounded-lg bg-[#24150c] hover:bg-[#382012] text-amber-200 border border-[#4a2916] font-black text-[11px] uppercase cursor-pointer"
                >
                  - Retirar
                </button>
              </div>
              <button
                type="button"
                onClick={manualCompoundNow}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-amber-500/20 to-emerald-500/20 hover:from-amber-500/30 hover:to-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-black text-[11px] uppercase tracking-wider cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Ejecutar Interés Compuesto Ahora</span>
              </button>
            </div>

            {/* Compound History */}
            <div className="space-y-1.5">
              <div className="text-[10px] text-zinc-400 uppercase font-bold">
                Historial de Reinversión Compuesta
              </div>
              <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1">
                {vaultState.compoundHistory.slice(0, 6).map((ep) => (
                  <div
                    key={ep.id}
                    className="p-2 rounded bg-[#130d09] border border-[#21130a] flex items-center justify-between text-[10px]"
                  >
                    <div>
                      <div className="font-bold text-emerald-300">
                        +${ep.amountUsd.toFixed(2)} ({ep.source.replace('_', ' ')})
                      </div>
                      <div className="text-[9px] text-zinc-500">{ep.reinvestedInto}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">TVL ${ep.cumulativeTvlUsd.toFixed(0)}</div>
                      <button
                        type="button"
                        onClick={() => openHashVerifier(ep.txHash)}
                        className="text-[9px] text-amber-400 hover:underline cursor-pointer"
                      >
                        Verificar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
