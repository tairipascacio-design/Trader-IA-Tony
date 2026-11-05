import React, { useState, useRef, useEffect } from 'react';
import { useTrading } from '../context/TradingContext';
import { sendChatMessage } from '../services/api';
import {
  MessageSquare,
  Send,
  Volume2,
  VolumeX,
  Globe,
  Sparkles,
  Bot,
  User,
  ExternalLink,
  Flame,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface ChatMsg {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  groundingUrls?: { title: string; url: string }[];
}

export const AIChatTab: React.FC = () => {
  const {
    activeSymbol,
    markets,
    positions,
    wallet,
    isAutoBotActive,
    toggleAutoBot,
    openManualPosition,
    closeAllPositions,
    playTTS,
    isTTSPlaying,
    addToast,
  } = useTrading();

  const curMarket = markets[activeSymbol];

  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `¡Bienvenido a mi despacho privado, socio! Aquí Tony Montana, el Padrino de Hyperliquid.
      
¿Quieres saber cómo se domina este juego? *"Primero haces el dinero, luego obtienes el poder, y luego mandas en el libro de órdenes."*

Tengo acceso a la telemetría en tiempo real de Hyperliquid, los libros de órdenes L2, el funding rate y la conexión on-chain con tu Bóveda. Pregúntame lo que quieras, pídeme que investigue con Google Search o dame órdenes para apretar el gatillo con el bot autónomo.

**"THE WORLD IS YOURS."** ¿Cuál es nuestra próxima jugada?`,
      timestamp: Date.now(),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [enableSearch, setEnableSearch] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (userPrompt?: string) => {
    const textToSend = userPrompt || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMsg = {
      id: Math.random().toString(36).substring(2, 9),
      role: 'user',
      content: textToSend,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!userPrompt) setInput('');
    setLoading(true);

    try {
      const marketContext = {
        activeSymbol,
        price: curMarket.price,
        fundingRate: curMarket.fundingRate,
        change24h: curMarket.change24h,
        high24h: curMarket.high24h,
        low24h: curMarket.low24h,
        walletUsdc: wallet.balances.USDC,
        walletEth: wallet.balances.ETH,
        walletHype: wallet.balances.HYPE,
        openPositionsCount: positions.length,
        positions: positions.map((p) => ({
          symbol: p.symbol,
          side: p.side,
          size: p.size,
          leverage: p.leverage,
          pnl: p.unrealizedPnl,
        })),
        botActive: isAutoBotActive,
      };

      // Check if user is asking to toggle bot
      const lower = textToSend.toLowerCase();
      if (lower.includes('activa el bot') || lower.includes('enciende el bot') || lower.includes('say hello to my little friend')) {
        if (!isAutoBotActive) toggleAutoBot();
      } else if (lower.includes('apaga el bot') || lower.includes('detén el bot') || lower.includes('desactiva el bot')) {
        if (isAutoBotActive) toggleAutoBot();
      } else if (lower.includes('cierra todo') || lower.includes('cierra las posiciones')) {
        closeAllPositions();
      }

      const response = await sendChatMessage(
        messages.concat(userMsg).map((m) => ({ role: m.role, content: m.content })),
        marketContext,
        enableSearch
      );

      const botMsg: ChatMsg = {
        id: Math.random().toString(36).substring(2, 9),
        role: 'assistant',
        content: response.text,
        timestamp: Date.now(),
        groundingUrls: response.groundingUrls,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Error de Comunicación con Tony',
        message: err.message || 'No se pudo conectar con el servidor',
      });
    } finally {
      setLoading(false);
    }
  };

  const PRESET_PROMPTS = [
    '¿Cuál es la mejor jugada para hacernos ricos hoy en Hyperliquid?',
    'Analiza el funding y el libro de órdenes de HYPE-PERP',
    'Say Hello to My Little Friend: activa el bot autónomo en modo agresivo',
    'Investiga en Google con qué noticias se está moviendo Bitcoin hoy',
    'Dame un resumen de los fondos de mi Bóveda y el riesgo de mis posiciones',
  ];

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-[#0c0806] border border-[#2b160d] rounded-2xl overflow-hidden shadow-2xl font-mono">
      {/* Header of Chat */}
      <div className="px-5 py-3.5 border-b border-[#24150c] bg-gradient-to-r from-[#190f09] via-[#24130a] to-[#120805] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#991b1b] to-[#450a0a] flex items-center justify-center border border-[#d4af37] text-amber-300 shadow-md">
            <Flame className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm sm:text-base font-extrabold uppercase text-amber-200 tracking-wider">
                EL DESPACHO DE TONY MONTANA
              </h2>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-950 text-amber-400 border border-amber-700">
                PRO MASTER QUANT
              </span>
            </div>
            <p className="text-[10px] text-zinc-400">
              Gemini 3.8 Flash con Grounding de Google Search & Acceso a la Bóveda
            </p>
          </div>
        </div>

        {/* Search Grounding & Voice controls */}
        <div className="flex items-center space-x-3 text-xs">
          <button
            onClick={() => setEnableSearch(!enableSearch)}
            className={`px-3 py-1.5 rounded-lg border flex items-center space-x-1.5 transition-all cursor-pointer ${
              enableSearch
                ? 'bg-blue-950/60 text-blue-300 border-blue-700'
                : 'bg-[#18110b] text-zinc-500 border-[#2d180e]'
            }`}
            title="Activar/Desactivar búsqueda en vivo con Google Search"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">Google Search {enableSearch ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.map((msg) => {
          const isAssistant = msg.role === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
            >
              {isAssistant && (
                <div className="w-8 h-8 rounded-lg bg-[#2e140a] border border-[#d4af37] flex items-center justify-center text-amber-300 shrink-0 text-xs font-black shadow">
                  TM
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed space-y-2.5 shadow-md ${
                  isAssistant
                    ? 'bg-[#140e0b] border border-[#2e170e] text-zinc-200'
                    : 'bg-gradient-to-r from-red-900 to-amber-900 text-white border border-amber-700/60'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans text-[13px] leading-relaxed">
                  {msg.content}
                </div>

                {/* Grounding Source Links if present */}
                {msg.groundingUrls && msg.groundingUrls.length > 0 && (
                  <div className="pt-2 border-t border-[#29160d] space-y-1">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block flex items-center">
                      <Globe className="w-3 h-3 mr-1 text-blue-400" /> Fuentes de Inteligencia (Google Search):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.groundingUrls.map((g, i) => (
                        <a
                          key={i}
                          href={g.url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-0.5 rounded bg-[#1e120b] hover:bg-[#2c1a10] text-[10px] text-amber-300/90 border border-[#3b2012] flex items-center space-x-1"
                        >
                          <span className="truncate max-w-[180px]">{g.title || g.url}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message footer with timestamp and TTS button */}
                <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1">
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {isAssistant && (
                    <button
                      onClick={() => playTTS(msg.content)}
                      disabled={isTTSPlaying}
                      className="text-amber-400 hover:text-amber-300 flex items-center space-x-1 cursor-pointer font-bold"
                      title="Escuchar la voz de Tony Montana con TTS"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isTTSPlaying ? 'Hablando...' : 'Escuchar Voz'}</span>
                    </button>
                  )}
                </div>
              </div>

              {!isAssistant && (
                <div className="w-8 h-8 rounded-lg bg-[#3b1c10] border border-amber-600 flex items-center justify-center text-amber-200 shrink-0 text-xs font-black shadow">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#2e140a] border border-[#d4af37] flex items-center justify-center text-amber-300 shrink-0 text-xs font-black">
              TM
            </div>
            <div className="bg-[#140e0b] border border-[#2e170e] rounded-2xl p-3.5 text-xs text-amber-300/80 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
              <span>Tony está analizando el libro de órdenes y consultando el mercado...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Preset Command Chips */}
      <div className="px-4 py-2 border-t border-[#21130b] bg-[#110b08] flex items-center space-x-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] text-zinc-500 uppercase font-bold shrink-0">Órdenes Rápidas:</span>
        {PRESET_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="px-2.5 py-1 text-[11px] bg-[#1b120c] hover:bg-[#2b1b11] text-amber-200/90 rounded-full border border-[#382012] shrink-0 transition-all cursor-pointer truncate max-w-xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3.5 border-t border-[#24150c] bg-[#130d09]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe una orden a Tony Montana... (ej: 'Analiza SOL-PERP y dime dónde poner el Take Profit')"
            className="flex-1 bg-[#0b0806] border border-[#3b2012] focus:border-amber-400 rounded-xl px-4 py-3 text-white text-xs font-mono focus:outline-none placeholder:text-zinc-600"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-yellow-600 hover:from-red-500 hover:to-yellow-500 text-black font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-lg cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1.5"
          >
            <span>Disparar</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
