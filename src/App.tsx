import React, { useState } from 'react';
import { TradingProvider, useTrading } from './context/TradingContext';
import { Header } from './components/Header';
import { TradingTerminal } from './components/TradingTerminal';
import { AIChatTab } from './components/AIChatTab';
import { KnowledgeBaseTab } from './components/KnowledgeBaseTab';
import { ExportProMasterTab } from './components/ExportProMasterTab';
import { WalletModal } from './components/WalletModal';
import { HashVerificationModal } from './components/HashVerificationModal';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

const MainApp: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'terminal' | 'chat' | 'knowledge' | 'wallet' | 'export'>('terminal');
  const {
    isWalletModalOpen,
    setIsWalletModalOpen,
    isHashVerifierOpen,
    selectedVerifyHash,
    closeHashVerifier,
    toasts,
    removeToast,
  } = useTrading();

  // If user clicks the wallet tab in header, open the wallet modal or view
  const handleTabChange = (tab: 'terminal' | 'chat' | 'knowledge' | 'wallet' | 'export') => {
    if (tab === 'wallet') {
      setIsWalletModalOpen(true);
    } else {
      setCurrentTab(tab);
    }
  };

  return (
    <div className="min-h-screen bg-[#070504] text-zinc-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      <Header currentTab={currentTab} setCurrentTab={handleTabChange} />

      {/* Main Content Area */}
      <main className="flex-1 p-3 sm:p-5 max-w-[1800px] w-full mx-auto">
        {currentTab === 'terminal' && <TradingTerminal />}
        {currentTab === 'chat' && <AIChatTab />}
        {currentTab === 'knowledge' && <KnowledgeBaseTab />}
        {currentTab === 'export' && <ExportProMasterTab />}
      </main>

      {/* Wallet Management Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />

      {/* Hash Verification Modal */}
      <HashVerificationModal
        isOpen={isHashVerifierOpen}
        onClose={closeHashVerifier}
        initialHash={selectedVerifyHash}
      />

      {/* Toast Notification Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl border shadow-2xl flex items-start space-x-3 text-xs font-mono transition-all animate-in slide-in-from-right duration-300 ${
              toast.type === 'success'
                ? 'bg-[#0f1d13] border-emerald-600/80 text-emerald-200'
                : toast.type === 'error'
                ? 'bg-[#220d0f] border-red-600/80 text-red-200'
                : toast.type === 'warning'
                ? 'bg-[#22160a] border-amber-600/80 text-amber-200'
                : 'bg-[#150f0c] border-[#3d2012] text-zinc-200'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
            {toast.type === 'error' && <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
            {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />}

            <div className="flex-1 space-y-0.5">
              <div className="font-bold uppercase tracking-wider">{toast.title}</div>
              <p className="text-[11px] text-zinc-300 leading-tight">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-zinc-500 hover:text-white p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <TradingProvider>
      <MainApp />
    </TradingProvider>
  );
}
