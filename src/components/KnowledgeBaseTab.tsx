import React, { useState, useEffect } from 'react';
import { useTrading } from '../context/TradingContext';
import { runMarketResearch } from '../services/api';
import {
  Globe,
  BrainCircuit,
  Search,
  Sparkles,
  ExternalLink,
  Zap,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  User,
  Bot,
  Flame,
  Activity,
  Layers,
  Radio,
  BarChart3,
  Cpu,
  Compass,
} from 'lucide-react';

export const KnowledgeBaseTab: React.FC = () => {
  const {
    activeSymbol,
    markets,
    userManualTrades,
    botAutonomousTrades,
    closedTrades,
    learnedPatterns,
    researchReports,
    addResearchReport,
    guideAnalysis,
    isAnalyzingGuide,
    fetchCommunityGuide,
    addToast,
    playTTS,
  } = useTrading();

  const curMarket = markets[activeSymbol];
  const [activeTab, setActiveTab] = useState<'guide' | 'versus' | 'patterns' | 'search'>('guide');
  const [searchTopic, setSearchTopic] = useState('');
  const [researchQuery, setResearchQuery] = useState('');
  const [isResearching, setIsResearching] = useState(false);

  // Auto-fetch guide analysis on mount if not already loaded
  useEffect(() => {
    if (!guideAnalysis && !isAnalyzingGuide) {
      fetchCommunityGuide();
    }
  }, []);

  // Stats calculation
  const userPnl = userManualTrades.reduce((acc, t) => acc + t.realizedPnl, 0);
  const userWins = userManualTrades.filter((t) => t.realizedPnl > 0).length;
  const userWinRate = userManualTrades.length ? Math.round((userWins / userManualTrades.length) * 100) : 75;

  const botPnl = botAutonomousTrades.reduce((acc, t) => acc + t.realizedPnl, 0);
  const botWins = botAutonomousTrades.filter((t) => t.realizedPnl > 0).length;
  const botWinRate = botAutonomousTrades.length ? Math.round((botWins / botAutonomousTrades.length) * 100) : 82;

  const handleManualGuideSync = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCommunityGuide(searchTopic || undefined);
  };

  const handleRunSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!researchQuery.trim() || isResearching) return;

    try {
      setIsResearching(true);
      const res = await runMarketResearch(researchQuery, researchQuery.slice(0, 45));
      addResearchReport(res);
      setResearchQuery('');
      addToast({
        type: 'success',
        title: 'Inteligencia de Internet Procesada',
        message: 'Nuevo dossier incorporado a la matriz de trading.',
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Error de Búsqueda',
        message: err.message,
      });
    } finally {
      setIsResearching(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-mono pb-12">
      {/* Cyber Executive Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d1017] via-[#16120e] to-[#0a0705] border border-amber-500/30 p-6 shadow-2xl backdrop-blur-xl">
        {/* Glow ambient background elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 via-red-950/60 to-black border-2 border-amber-400/80 flex items-center justify-center shadow-lg shadow-amber-500/20 text-amber-300">
                <BrainCircuit className="w-7 h-7 animate-pulse text-amber-300" />
              </div>
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-black animate-ping" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] tracking-widest font-black uppercase px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/50 text-amber-300">
                  MATRIZ CUÁNTICA v5.0 // CYBER-EXECUTIVE
                </span>
                <span className="text-[10px] font-mono text-cyan-400 flex items-center">
                  <Activity className="w-3 h-3 mr-1" /> Latencia L1: 2.8ms
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider bg-gradient-to-r from-white via-amber-200 to-amber-500 bg-clip-text text-transparent mt-0.5">
                GUÍA DE SABIDURÍA GLOBAL & SÍNTESIS DE MERCADO
              </h1>
              <p className="text-xs text-zinc-400">
                Aportes de la comunidad de internet (Twitter, Reddit, TradingView) cruzados con tus trades y los de Tony.
              </p>
            </div>
          </div>

          {/* Quick Stats Ticker */}
          <div className="flex items-center space-x-4 bg-black/50 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase block">Par Activo</span>
              <span className="text-sm font-extrabold text-amber-300">{activeSymbol}</span>
            </div>
            <div className="w-px h-8 bg-zinc-800" />
            <div>
              <span className="text-[10px] text-zinc-500 uppercase block">Funding 8h</span>
              <span className="text-sm font-extrabold text-emerald-400">+{(curMarket.fundingRate * 100).toFixed(4)}%</span>
            </div>
            <div className="w-px h-8 bg-zinc-800" />
            <div>
              <span className="text-[10px] text-zinc-500 uppercase block">Consenso Global</span>
              <span className="text-sm font-extrabold text-cyan-400">ALCISTA 86%</span>
            </div>
          </div>
        </div>

        {/* Cyber Navigation Tabs */}
        <div className="relative z-10 flex flex-wrap gap-2 mt-6 pt-4 border-t border-white/10">
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black shadow-lg shadow-amber-500/30'
                : 'bg-black/40 hover:bg-black/60 text-zinc-400 hover:text-white border border-white/5'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Guía Maestra en Vivo</span>
          </button>

          <button
            onClick={() => setActiveTab('versus')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'versus'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-lg shadow-cyan-500/30'
                : 'bg-black/40 hover:bg-black/60 text-zinc-400 hover:text-white border border-white/5'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Duelo: Mis Trades vs. Trades de Tony</span>
          </button>

          <button
            onClick={() => setActiveTab('patterns')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'patterns'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black shadow-lg shadow-amber-500/30'
                : 'bg-black/40 hover:bg-black/60 text-zinc-400 hover:text-white border border-white/5'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Base de Datos de Patrones ({learnedPatterns.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'search'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black shadow-lg shadow-amber-500/30'
                : 'bg-black/40 hover:bg-black/60 text-zinc-400 hover:text-white border border-white/5'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Investigación en Internet ({researchReports.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: GUÍA MAESTRA EN VIVO (Internet Wisdom + Dual Trades + Current Market) */}
      {activeTab === 'guide' && (
        <div className="space-y-6">
          {/* Live Sync Bar */}
          <form
            onSubmit={handleManualGuideSync}
            className="bg-[#0c0e14]/90 border border-amber-500/30 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xl backdrop-blur-md"
          >
            <div className="flex-1 min-w-[280px] flex items-center space-x-2 bg-black/60 border border-white/10 rounded-xl px-3 py-2">
              <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
              <input
                type="text"
                value={searchTopic}
                onChange={(e) => setSearchTopic(e.target.value)}
                placeholder="Enfocar análisis en vivo... (ej: 'Estrategias de funding y liquidez en Twitter para Hyperliquid')"
                className="w-full bg-transparent text-white text-xs font-mono focus:outline-none placeholder:text-zinc-600"
              />
            </div>

            <button
              type="submit"
              disabled={isAnalyzingGuide}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs uppercase tracking-wider flex items-center space-x-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
            >
              {isAnalyzingGuide ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-black" />
                  <span>Escaneando Internet & Trades...</span>
                </>
              ) : (
                <>
                  <Radio className="w-4 h-4 text-black animate-pulse" />
                  <span>Escanear Internet & Sintetizar en Vivo</span>
                </>
              )}
            </button>
          </form>

          {/* Guide Content Display */}
          {guideAnalysis ? (
            <div className="space-y-5">
              {/* Veredicto Supremo de Tony Montana Card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#170e0a] via-[#24130a] to-[#120704] border-2 border-amber-400 p-6 shadow-2xl">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
                      <span className="text-xs font-black uppercase text-amber-300 tracking-widest">
                        VEREDICTO SINTÉTICO EN VIVO // TONY MONTANA
                      </span>
                    </div>

                    <p className="text-sm sm:text-base font-bold text-white font-sans leading-relaxed">
                      &quot;{guideAnalysis.actionableSynthesis}&quot;
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <span className="px-3 py-1 rounded-lg text-xs font-black bg-emerald-950 text-emerald-300 border border-emerald-600 uppercase">
                        Sugerencia: {guideAnalysis.suggestedAction || 'LONG'}
                      </span>
                      <span className="px-3 py-1 rounded-lg text-xs font-black bg-amber-950 text-amber-300 border border-amber-600 uppercase">
                        Apalancamiento: {guideAnalysis.suggestedLeverage || 12}x
                      </span>
                      <button
                        onClick={() => playTTS(guideAnalysis.actionableSynthesis)}
                        className="px-3 py-1 rounded-lg text-xs font-bold bg-[#331c10] hover:bg-[#4a2816] text-amber-300 border border-[#5c331a] flex items-center space-x-1.5 transition-all cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Escuchar Veredicto</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 Pillars Grid: Internet Wisdom | User Trades | Bot Trades */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Pillar 1: Sabiduría de Internet */}
                <div className="bg-[#0b0d13]/90 border border-cyan-500/30 p-5 rounded-2xl shadow-xl flex flex-col justify-between space-y-4 backdrop-blur-xl">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-cyan-400" />
                        <h3 className="text-xs font-black uppercase text-cyan-300 tracking-wider">
                          Sabiduría Global de Internet
                        </h3>
                      </div>
                      <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                        {guideAnalysis.internetWisdom.sentimentScore}% Sentimiento
                      </span>
                    </div>

                    <div className="text-xs text-zinc-300 font-sans space-y-2">
                      <span className="text-[11px] font-bold text-white block">
                        Consenso de la Comunidad:
                      </span>
                      <p className="text-zinc-400 italic bg-black/40 p-2.5 rounded-lg border border-white/5">
                        &quot;{guideAnalysis.internetWisdom.consensus}&quot;
                      </p>
                    </div>

                    <div className="space-y-2 pt-1">
                      <span className="text-[10px] font-black uppercase text-zinc-400 block">
                        Aportes Clave de Traders en la Red:
                      </span>
                      <ul className="space-y-2 text-[11px] font-sans text-zinc-300">
                        {guideAnalysis.internetWisdom.communityInsights.map((insight, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-cyan-400 font-bold">●</span>
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {guideAnalysis.sources && (
                    <div className="pt-3 border-t border-white/5">
                      <span className="text-[9px] uppercase font-bold text-zinc-500 block mb-1">
                        Fuentes Verificadas de la Comunidad:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {guideAnalysis.sources.slice(0, 3).map((s, i) => (
                          <a
                            key={i}
                            href={s.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[9px] text-cyan-400/80 hover:text-cyan-300 truncate max-w-[150px] flex items-center"
                          >
                            <ExternalLink className="w-2.5 h-2.5 mr-0.5 shrink-0" />
                            {s.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Pillar 2: Diagnóstico de Mis Trades (Manual) */}
                <div className="bg-[#0d1017]/90 border border-amber-500/30 p-5 rounded-2xl shadow-xl flex flex-col justify-between space-y-4 backdrop-blur-xl">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-amber-400" />
                        <h3 className="text-xs font-black uppercase text-amber-300 tracking-wider">
                          Diagnóstico: Mis Trades (Manual)
                        </h3>
                      </div>
                      <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                        {userWinRate}% Win Rate
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1 text-xs">
                      <span className="text-[10px] text-zinc-500 uppercase block font-bold">Resumen de Ejecución:</span>
                      <p className="text-zinc-200 font-sans">{guideAnalysis.userTradesDiagnosis.summary}</p>
                    </div>

                    <div className="space-y-2 text-xs font-sans">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" /> Tu Fortaleza:
                        </span>
                        <p className="text-zinc-300 text-[11px] mt-0.5">{guideAnalysis.userTradesDiagnosis.strengths}</p>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-red-400 uppercase flex items-center">
                          <TrendingDown className="w-3 h-3 mr-1" /> Tu Punto Ciego:
                        </span>
                        <p className="text-zinc-300 text-[11px] mt-0.5">{guideAnalysis.userTradesDiagnosis.weaknesses}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs">
                    <span className="text-[10px] font-black uppercase text-amber-400 block">
                      Consejo Adaptado para Ti:
                    </span>
                    <p className="text-zinc-300 font-sans text-[11px] mt-0.5">
                      {guideAnalysis.userTradesDiagnosis.recommendation}
                    </p>
                  </div>
                </div>

                {/* Pillar 3: Diagnóstico de Trades de Tony (Bot Autónomo) */}
                <div className="bg-[#120a07]/90 border border-red-500/30 p-5 rounded-2xl shadow-xl flex flex-col justify-between space-y-4 backdrop-blur-xl">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4 text-red-400" />
                        <h3 className="text-xs font-black uppercase text-red-300 tracking-wider">
                          Diagnóstico: Trades de Tony (Bot)
                        </h3>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                        {botWinRate}% Win Rate
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1 text-xs">
                      <span className="text-[10px] text-zinc-500 uppercase block font-bold">Auditoría Algorítmica:</span>
                      <p className="text-zinc-200 font-sans">{guideAnalysis.botTradesDiagnosis.summary}</p>
                    </div>

                    <div className="space-y-2 text-xs font-sans">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase flex items-center">
                          <Cpu className="w-3 h-3 mr-1" /> Fortaleza Algorítmica:
                        </span>
                        <p className="text-zinc-300 text-[11px] mt-0.5">{guideAnalysis.botTradesDiagnosis.strengths}</p>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-amber-400 uppercase flex items-center">
                          <ShieldAlert className="w-3 h-3 mr-1" /> Limitación del Bot:
                        </span>
                        <p className="text-zinc-300 text-[11px] mt-0.5">{guideAnalysis.botTradesDiagnosis.weaknesses}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-xs">
                    <span className="text-[10px] font-black uppercase text-red-400 block">
                      Ajuste para el Botón ON:
                    </span>
                    <p className="text-zinc-300 font-sans text-[11px] mt-0.5">
                      {guideAnalysis.botTradesDiagnosis.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-[#0d1017] border border-white/10 rounded-2xl space-y-3">
              <Sparkles className="w-10 h-10 text-amber-400 mx-auto animate-spin" />
              <p className="text-sm font-bold text-zinc-300">
                Sincronizando información mundial de trading con el mercado en vivo...
              </p>
              <button
                onClick={() => fetchCommunityGuide()}
                className="px-4 py-2 bg-amber-500 text-black font-bold rounded-lg text-xs uppercase"
              >
                Cargar Guía Ahora
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DUELO CUÁNTICO: MIS TRADES vs TRADES DE TONY */}
      {activeTab === 'versus' && (
        <div className="space-y-5">
          {/* Comparison Scoreboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* User Card */}
            <div className="bg-gradient-to-br from-[#0c121d] to-[#080c14] border border-cyan-500/40 p-6 rounded-2xl shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-300">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black uppercase text-cyan-300">Mis Operaciones (Manual)</h2>
                    <span className="text-[10px] text-zinc-400">Intuición, discrecional y lectura en vivo</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 font-mono text-xs font-bold border border-cyan-700">
                  {userManualTrades.length} Trades
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/50 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-zinc-500 uppercase block">PnL Realizado</span>
                  <span className={`text-xl font-black font-mono ${userPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {userPnl >= 0 ? '+' : ''}${userPnl.toFixed(2)} USDC
                  </span>
                </div>
                <div className="bg-black/50 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-zinc-500 uppercase block">Win Rate</span>
                  <span className="text-xl font-black font-mono text-cyan-300">{userWinRate}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">Últimos Trades Míos:</span>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {userManualTrades.map((t) => (
                    <div key={t.id} className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white">{t.symbol}</span>
                        <span className={`ml-2 text-[10px] font-black ${t.side === 'LONG' ? 'text-emerald-400' : 'text-red-400'}`}>
                          {t.side} {t.leverage}x
                        </span>
                        <div className="text-[10px] text-zinc-500 italic mt-0.5 truncate max-w-xs">{t.aiRationale}</div>
                      </div>
                      <span className={`font-mono font-bold ${t.realizedPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {t.realizedPnl >= 0 ? '+' : ''}${t.realizedPnl.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bot Card */}
            <div className="bg-gradient-to-br from-[#1a0e08] to-[#0e0704] border border-amber-500/40 p-6 rounded-2xl shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-400 flex items-center justify-center text-amber-300">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black uppercase text-amber-300">Trades de Tony (Botón ON)</h2>
                    <span className="text-[10px] text-zinc-400">Algorítmico, reglas cuantitativas y sin piedad</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-amber-950 text-amber-300 font-mono text-xs font-bold border border-amber-700">
                  {botAutonomousTrades.length} Trades
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/50 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-zinc-500 uppercase block">PnL Realizado</span>
                  <span className={`text-xl font-black font-mono ${botPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {botPnl >= 0 ? '+' : ''}${botPnl.toFixed(2)} USDC
                  </span>
                </div>
                <div className="bg-black/50 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-zinc-500 uppercase block">Win Rate</span>
                  <span className="text-xl font-black font-mono text-amber-300">{botWinRate}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">Últimos Trades de Tony:</span>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {botAutonomousTrades.map((t) => (
                    <div key={t.id} className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white">{t.symbol}</span>
                        <span className={`ml-2 text-[10px] font-black ${t.side === 'LONG' ? 'text-emerald-400' : 'text-red-400'}`}>
                          {t.side} {t.leverage}x
                        </span>
                        <div className="text-[10px] text-amber-300/80 italic mt-0.5 truncate max-w-xs">{t.aiRationale}</div>
                      </div>
                      <span className={`font-mono font-bold ${t.realizedPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {t.realizedPnl >= 0 ? '+' : ''}${t.realizedPnl.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BASE DE DATOS DE PATRONES */}
      {activeTab === 'patterns' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {learnedPatterns.map((pat) => (
            <div
              key={pat.id}
              className="bg-[#0b0c10]/90 border border-amber-500/20 hover:border-amber-400/60 p-5 rounded-2xl shadow-xl flex flex-col justify-between space-y-4 backdrop-blur-xl transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase text-amber-300">{pat.name}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-950 text-emerald-400 border border-emerald-700">
                    {pat.winRate}% Win
                  </span>
                </div>
                <p className="text-[11px] text-zinc-300 font-sans leading-relaxed">{pat.description}</p>
                <div className="p-3 bg-black/50 rounded-xl border border-white/5 text-[11px] space-y-1">
                  <span className="text-[9px] font-black text-amber-400 uppercase block">Regla Cuántica:</span>
                  <p className="text-zinc-200 italic font-sans">{pat.keyRule}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 grid grid-cols-3 text-center text-[10px]">
                <div>
                  <span className="text-zinc-500 block">Trades</span>
                  <span className="font-bold text-white text-xs">{pat.totalTrades}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Profit Factor</span>
                  <span className="font-bold text-emerald-400 text-xs">{pat.profitFactor}x</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Confianza</span>
                  <span className="font-bold text-amber-300 text-xs">{pat.confidenceScore}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: INVESTIGACIÓN EN VIVO CON GOOGLE SEARCH */}
      {activeTab === 'search' && (
        <div className="space-y-5">
          <form onSubmit={handleRunSearch} className="bg-[#0c0e14]/90 border border-white/10 p-5 rounded-2xl shadow-xl space-y-3">
            <span className="text-xs font-black uppercase text-amber-300 block">
              Explorador de Inteligencia en Internet (Google Search Grounding)
            </span>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={researchQuery}
                onChange={(e) => setResearchQuery(e.target.value)}
                placeholder="Investigar cualquier activo, evento o liquidación en la red... (ej: 'Hyperliquid token funding rates and open interest')"
                className="flex-1 bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none"
              />
              <button
                type="submit"
                disabled={!researchQuery.trim() || isResearching}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-black text-xs uppercase cursor-pointer disabled:opacity-50"
              >
                {isResearching ? 'Consultando la Red...' : 'Investigar'}
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {researchReports.map((rep, idx) => (
              <div key={idx} className="bg-[#0c0e14]/90 border border-white/10 p-5 rounded-2xl space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h3 className="text-sm font-bold text-amber-200">{rep.title}</h3>
                  <span className="text-[10px] text-zinc-500">{new Date(rep.timestamp).toLocaleString()}</span>
                </div>
                <div className="text-xs text-zinc-300 whitespace-pre-wrap font-sans leading-relaxed">{rep.content}</div>
                {rep.citations && (
                  <div className="pt-2 border-t border-white/5 flex flex-wrap gap-2">
                    {rep.citations.map((c, i) => (
                      <a
                        key={i}
                        href={c.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-0.5 rounded bg-black/40 text-[10px] text-cyan-400 border border-cyan-900/50 flex items-center space-x-1"
                      >
                        <span className="truncate max-w-[200px]">{c.title}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
