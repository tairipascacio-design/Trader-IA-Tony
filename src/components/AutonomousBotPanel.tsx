import React from 'react';
import { useTrading } from '../context/TradingContext';
import {
  Power,
  Zap,
  Shield,
  ShieldAlert,
  Flame,
  Activity,
  Sliders,
  Radio,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

export const AutonomousBotPanel: React.FC = () => {
  const {
    isAutoBotActive,
    toggleAutoBot,
    riskProfile,
    setRiskProfile,
    maxMarginPct,
    setMaxMarginPct,
    wallet,
    aiLogs,
    triggerManualAIScan,
    openHashVerifier,
  } = useTrading();

  const allowedMarginUsd = ((wallet.balances.USDC * maxMarginPct) / 100).toFixed(2);

  return (
    <div className="bg-[#0e0a08] border border-[#2e190e] rounded-xl overflow-hidden shadow-xl flex flex-col font-mono">
      {/* Cockpit Header */}
      <div className="px-4 py-3 border-b border-[#24150c] bg-gradient-to-r from-[#1a0f0a] via-[#24130a] to-[#120906] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-950 flex items-center justify-center border border-red-700 shadow-md">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black uppercase text-amber-200 tracking-wider">
              MOTOR DE IA AUTÓNOMO: &quot;LITTLE FRIEND&quot;
            </h3>
            <p className="text-[10px] text-zinc-400">
              Gestión algorítmica autónoma de futuros perpetuos en Hyperliquid
            </p>
          </div>
        </div>

        {/* Master ON/OFF Button */}
        <button
          onClick={toggleAutoBot}
          className={`px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider flex items-center space-x-2 transition-all duration-300 border shadow-lg cursor-pointer ${
            isAutoBotActive
              ? 'bg-gradient-to-r from-red-600 via-amber-600 to-red-600 text-white border-amber-300 shadow-red-700/50 animate-pulse'
              : 'bg-[#18100b] text-zinc-400 hover:text-white border-[#381e10] hover:border-amber-600'
          }`}
        >
          <Power className="w-4 h-4" />
          <span>{isAutoBotActive ? 'BOTÓN ON ● FUEGO ACTIVO' : 'BOTÓN OFF ● INACTIVO'}</span>
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Status Callout Box */}
        <div
          className={`p-3.5 rounded-lg border flex items-start space-x-3 transition-all ${
            isAutoBotActive
              ? 'bg-emerald-950/30 border-emerald-700/60 text-emerald-200'
              : 'bg-amber-950/20 border-amber-800/50 text-amber-300'
          }`}
        >
          {isAutoBotActive ? (
            <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          )}
          <div className="text-xs space-y-1">
            <div className="font-extrabold uppercase tracking-wide">
              {isAutoBotActive
                ? 'ACCESO AUTORIZADO A BALANCES DE LA WALLET'
                : 'ACCESO BLOQUEADO: TUS BALANCES ESTÁN SEGUROS (BOTÓN OFF)'}
            </div>
            <p className="text-[11px] text-zinc-300">
              {isAutoBotActive
                ? `La IA está autorizada a asignar hasta $${allowedMarginUsd} USDC (${maxMarginPct}% de tu wallet) en operaciones calculadas con ratio R:R mínimo de 2.5:1.`
                : 'La IA no tiene autorización para abrir órdenes ni retener fondos. Para que el bot gestione el imperio, presiona el BOTÓN ON.'}
            </p>
          </div>
        </div>

        {/* Controls Grid: Risk Profile & Max Allocation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Risk Profile */}
          <div className="bg-[#130d09] p-3 rounded-lg border border-[#26150c] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-300 uppercase">
              <span className="flex items-center space-x-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>Perfil de Riesgo Bélico</span>
              </span>
              <span className="text-amber-300">{riskProfile}</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {(['Conservative', 'Balanced', 'Aggressive'] as const).map((prof) => (
                <button
                  key={prof}
                  type="button"
                  onClick={() => setRiskProfile(prof)}
                  className={`py-2 px-1 text-[10px] font-black uppercase rounded border transition-all cursor-pointer text-center ${
                    riskProfile === prof
                      ? 'bg-[#3b1d10] text-amber-200 border-[#d4af37]'
                      : 'bg-[#18100b] text-zinc-500 hover:text-zinc-300 border-[#24130a]'
                  }`}
                >
                  {prof === 'Conservative' ? 'Conservador' : prof === 'Balanced' ? 'Capo' : 'Imperio 50x'}
                </button>
              ))}
            </div>
            <div className="text-[10px] text-zinc-500 pt-1">
              {riskProfile === 'Conservative' && 'Apalancamiento 3x-5x, 2% riesgo por trade, SL ajustado.'}
              {riskProfile === 'Balanced' && 'Apalancamiento 10x-15x, 5% riesgo por trade, setups A+.'}
              {riskProfile === 'Aggressive' && 'Apalancamiento 25x-50x, 10% riesgo, caza agresiva de liquidaciones.'}
            </div>
          </div>

          {/* Allocation Slider */}
          <div className="bg-[#130d09] p-3 rounded-lg border border-[#26150c] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-300 uppercase">
              <span>Asignación Máx. de la Bóveda</span>
              <span className="text-emerald-400 font-extrabold">{maxMarginPct}% (${allowedMarginUsd} USDC)</span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              value={maxMarginPct}
              onChange={(e) => setMaxMarginPct(parseInt(e.target.value, 10))}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-[#26150c] rounded"
            />
            <div className="flex justify-between text-[10px] text-zinc-500">
              <span>5% (Mínimo)</span>
              <span>30% (Recomendado)</span>
              <span>60% (Máximo Seguro)</span>
            </div>
            <div className="pt-1 flex items-center justify-between">
              <button
                type="button"
                onClick={triggerManualAIScan}
                disabled={!isAutoBotActive}
                className="w-full py-1.5 rounded bg-[#2b170e] hover:bg-[#3d1f12] text-amber-300 font-bold text-[11px] border border-[#522a16] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center space-x-1.5"
              >
                <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                <span>Escanear Mercado & Disparar Ahora</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live AI Telemetry & Reasoning Log */}
        <div className="bg-[#0b0806] rounded-lg border border-[#24150c] p-3 space-y-2">
          <div className="flex items-center justify-between text-xs border-b border-[#1f120a] pb-1.5">
            <div className="flex items-center space-x-2 text-zinc-400 font-bold uppercase">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Telemetría y Razonamiento Cuántico de Tony</span>
            </div>
            <span className="text-[10px] text-zinc-500">{aiLogs.length} eventos</span>
          </div>

          <div className="h-44 overflow-y-auto space-y-1.5 text-xs pr-1">
            {aiLogs.length === 0 ? (
              <div className="h-full flex items-center justify-center text-zinc-600 text-xs">
                Esperando primera señal. Presiona el botón ON para comenzar el monitoreo autónomo.
              </div>
            ) : (
              aiLogs.map((log) => {
                const timeStr = new Date(log.timestamp).toLocaleTimeString();
                return (
                  <div
                    key={log.id}
                    className="p-2 rounded bg-[#130d09] border border-[#21130a] space-y-1 text-[11px]"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-amber-400">[{log.type}] {log.symbol}</span>
                      <span className="text-zinc-500">{timeStr}</span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed">{log.message}</p>
                    {log.details?.txHash && (
                      <div className="pt-1 flex items-center justify-between border-t border-[#1e1007]">
                        <span className="text-[9px] text-zinc-500 font-mono">
                          TX: {log.details.txHash.slice(0, 8)}...{log.details.txHash.slice(-6)}
                        </span>
                        <button
                          type="button"
                          onClick={() => openHashVerifier(log.details.txHash)}
                          className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#26150c] hover:bg-[#3b1f13] text-amber-300 border border-[#4d2817] hover:border-amber-400 cursor-pointer transition-all"
                        >
                          <ShieldCheck className="w-2.5 h-2.5 text-amber-400" />
                          <span>Verificar Hash</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
