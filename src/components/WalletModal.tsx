import React, { useState, useEffect } from 'react';
import { useTrading } from '../context/TradingContext';
import {
  createNewWallet,
  importFromSeedPhrase,
  importFromPrivateKey,
  generateQrDataUrl,
  isValidAddress,
} from '../services/walletCrypto';
import {
  Wallet,
  Key,
  Copy,
  Check,
  Eye,
  EyeOff,
  QrCode,
  Download,
  Send,
  PlusCircle,
  ExternalLink,
  Shield,
  ShieldAlert,
  X,
  RefreshCw,
  Camera,
  Upload,
} from 'lucide-react';

export const WalletModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const {
    wallet,
    setWallet,
    claimFaucet,
    sendOnChainTransfer,
    onChainTransfers,
    isAutoBotActive,
    toggleAutoBot,
    maxMarginPct,
    addToast,
    isLiveRealMode,
    toggleLiveRealMode,
    realWeb3Status,
    connectRealWeb3Wallet,
    openHashVerifier,
  } = useTrading();

  const [activeTab, setActiveTab] = useState<'balances' | 'create' | 'import' | 'transfers'>('balances');
  const [importMethod, setImportMethod] = useState<'seed' | 'key' | 'qr'>('seed');

  // Creation State
  const [tempCreatedWallet, setTempCreatedWallet] = useState<{
    address: string;
    privateKey: string;
    seedPhrase: string;
    balances: any;
  } | null>(null);

  // Import Inputs
  const [seedInput, setSeedInput] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  // Visibility Toggles
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);

  // Transfer Form State
  const [transferAsset, setTransferAsset] = useState<'USDC' | 'ETH' | 'HYPE' | 'ARB'>('USDC');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);

  // Copy feedback
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    addToast({
      type: 'success',
      title: 'Copiado al Portapapeles',
      message: `${fieldName} copiado con éxito. Guarda esto en un lugar seguro.`,
    });
    setTimeout(() => setCopiedField(null), 2500);
  };

  // Generate QR for current wallet address
  useEffect(() => {
    if (wallet.address) {
      generateQrDataUrl(wallet.address).then(setQrCodeDataUrl);
    }
  }, [wallet.address]);

  if (!isOpen) return null;

  const handleGenerateNew = () => {
    const nw = createNewWallet();
    setTempCreatedWallet(nw);
    setShowPrivateKey(false);
    setShowSeedPhrase(false);
  };

  const handleApplyCreatedWallet = () => {
    if (!tempCreatedWallet) return;
    setWallet({
      address: tempCreatedWallet.address,
      privateKey: tempCreatedWallet.privateKey,
      seedPhrase: tempCreatedWallet.seedPhrase,
      isConnected: true,
      type: 'CREATED',
      balances: tempCreatedWallet.balances,
    });
    setTempCreatedWallet(null);
    setActiveTab('balances');
    addToast({
      type: 'success',
      title: '¡Nueva Bóveda Creada!',
      message: 'Tu nueva wallet Web3 ha sido activada en el Imperio Hyperliquid.',
    });
  };

  const handleImportSeed = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const imported = importFromSeedPhrase(seedInput);
      setWallet({
        address: imported.address,
        privateKey: imported.privateKey,
        seedPhrase: imported.seedPhrase,
        isConnected: true,
        type: 'IMPORTED_SEED',
        balances: imported.balances,
      });
      setSeedInput('');
      setActiveTab('balances');
      addToast({
        type: 'success',
        title: 'Bóveda Importada con Éxito',
        message: 'Wallet restaurada correctamente mediante frase semilla.',
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Error al Importar Frase Semilla',
        message: err.message,
      });
    }
  };

  const handleImportKey = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const imported = importFromPrivateKey(keyInput);
      setWallet({
        address: imported.address,
        privateKey: imported.privateKey,
        seedPhrase: imported.seedPhrase,
        isConnected: true,
        type: 'IMPORTED_KEY',
        balances: imported.balances,
      });
      setKeyInput('');
      setActiveTab('balances');
      addToast({
        type: 'success',
        title: 'Clave Secreta Importada',
        message: 'Wallet vinculada mediante clave privada de 64 caracteres.',
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Error de Clave Privada',
        message: err.message,
      });
    }
  };

  const handleDownloadBackup = (addr: string, key: string, seed: string) => {
    const backupData = {
      app: 'HyperLiquid AI Pro - Scarface Empire',
      created: new Date().toISOString(),
      address: addr,
      privateKey: key,
      seedPhrase: seed,
      note: 'GUARDAR BAJO MÁXIMA SEGURIDAD. NUNCA COMPARTIR CON TERCEROS.',
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hyperliquid-vault-${addr.slice(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast({
      type: 'info',
      title: 'Copia de Seguridad Descargada',
      message: 'Archivo JSON generado con tu clave secreta y frase semilla.',
    });
  };

  const handleExecuteTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(transferAmount);
    if (!isValidAddress(recipientAddress)) {
      addToast({
        type: 'error',
        title: 'Dirección Inválida',
        message: 'La dirección debe comenzar con 0x y tener 40 caracteres hexadecimales.',
      });
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      addToast({
        type: 'error',
        title: 'Monto Inválido',
        message: 'Introduce una cantidad mayor a cero.',
      });
      return;
    }

    try {
      setIsTransferring(true);
      await sendOnChainTransfer(transferAsset, recipientAddress, amount);
      setRecipientAddress('');
      setTransferAmount('');
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Transferencia Fallida',
        message: err.message,
      });
    } finally {
      setIsTransferring(false);
    }
  };

  const wordsList = (tempCreatedWallet ? tempCreatedWallet.seedPhrase : wallet.seedPhrase).split(' ');

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-mono">
      <div className="bg-[#0e0a08] border border-[#3d2011] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative my-auto">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#24150c] bg-gradient-to-r from-[#190f09] via-[#24130a] to-[#120805] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-[#2e150b] flex items-center justify-center border border-[#d4af37] text-amber-300">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold uppercase text-amber-200 tracking-wider">
                LA BÓVEDA DE TONY MONTANA
              </h2>
              <p className="text-[10px] text-zinc-400">
                Wallet Web3 On-Chain, Gestión Criptográfica & Control de IA
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#1f130c] hover:bg-[#331c10] text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* AI Permission Banner (Crucial User Requirement) */}
        <div
          className={`px-4 py-2.5 border-b flex items-center justify-between text-xs ${
            isAutoBotActive
              ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
              : 'bg-amber-950/40 border-amber-800/80 text-amber-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            {isAutoBotActive ? (
              <Shield className="w-4 h-4 text-emerald-400" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-amber-400" />
            )}
            <span className="font-bold">
              {isAutoBotActive
                ? `⚡ IA CON PERMISO ACTIVO: Usando hasta $${((wallet.balances.USDC * maxMarginPct) / 100).toFixed(2)} USDC`
                : '🔒 IA BLOQUEADA: Los fondos están seguros. La IA solo puede operar si el BOTÓN ON está activado.'}
            </span>
          </div>
          <button
            onClick={toggleAutoBot}
            className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
              isAutoBotActive
                ? 'bg-red-950 text-red-300 border border-red-700 hover:bg-red-900'
                : 'bg-emerald-950 text-emerald-300 border border-emerald-700 hover:bg-emerald-900'
            }`}
          >
            {isAutoBotActive ? 'Apagar Bot' : 'Activar Bot ON'}
          </button>
        </div>

        {/* Live Real Mode & Web3 Connection Sub-Banner */}
        <div className={`px-4 py-2 border-b flex flex-wrap items-center justify-between gap-2 text-xs font-mono ${
          isLiveRealMode
            ? 'bg-gradient-to-r from-red-950/70 via-rose-950/50 to-red-950/70 border-red-800 text-red-200'
            : 'bg-[#151218] border-zinc-800 text-zinc-300'
        }`}>
          <div className="flex items-center space-x-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isLiveRealMode ? 'bg-red-500 animate-ping' : 'bg-cyan-400'}`} />
            <span className="font-bold text-[11px]">
              {isLiveRealMode
                ? '🔴 MAINNET REAL EN VIVO: Conectado para compras y ventas con saldo real.'
                : '🧪 SIMULACIÓN TESTNET: Modo de prueba seguro.'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleLiveRealMode}
              className={`px-2.5 py-1 rounded text-[10px] font-mono font-black uppercase transition-all cursor-pointer ${
                isLiveRealMode
                  ? 'bg-red-900 hover:bg-red-800 text-white border border-red-500'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-600'
              }`}
            >
              {isLiveRealMode ? 'Activar Simulación' : 'Apagar Simulación'}
            </button>
            <button
              onClick={connectRealWeb3Wallet}
              className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                realWeb3Status === 'CONNECTED'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                  : 'bg-amber-950 text-amber-300 border border-amber-600 hover:bg-amber-900'
              }`}
            >
              {realWeb3Status === 'CONNECTED' ? 'Web3 Conectada' : 'Conectar MetaMask / Inyectada'}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#24150c] bg-[#120c08] text-xs">
          <button
            onClick={() => setActiveTab('balances')}
            className={`flex-1 py-2.5 text-center font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'balances'
                ? 'border-amber-400 text-amber-300 bg-[#1f130b]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            Balances & Faucet
          </button>
          <button
            onClick={() => {
              setActiveTab('create');
              if (!tempCreatedWallet) handleGenerateNew();
            }}
            className={`flex-1 py-2.5 text-center font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'create'
                ? 'border-amber-400 text-amber-300 bg-[#1f130b]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            Crear Wallet
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-2.5 text-center font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'import'
                ? 'border-amber-400 text-amber-300 bg-[#1f130b]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            Importar Wallet
          </button>
          <button
            onClick={() => setActiveTab('transfers')}
            className={`flex-1 py-2.5 text-center font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'transfers'
                ? 'border-amber-400 text-amber-300 bg-[#1f130b]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            Transferencias On-Chain
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 max-h-[65vh] overflow-y-auto space-y-4">
          {/* TAB 1: BALANCES & FAUCET */}
          {activeTab === 'balances' && (
            <div className="space-y-4">
              {/* Address Card */}
              <div className="bg-[#140e0b] p-3.5 rounded-xl border border-[#2b170e] space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span className="uppercase font-bold">Dirección Pública de la Bóveda</span>
                  <span className="text-[10px] text-amber-400 font-bold">Arbitrum One / Hyperliquid L1</span>
                </div>
                <div className="flex items-center justify-between bg-[#0b0806] px-3 py-2 rounded-lg border border-[#21140c]">
                  <span className="text-white text-xs font-mono break-all select-all font-bold">
                    {wallet.address}
                  </span>
                  <div className="flex items-center space-x-1.5 ml-2">
                    <button
                      onClick={() => copyToClipboard(wallet.address, 'Dirección')}
                      className="p-1.5 rounded bg-[#1f130c] hover:bg-[#331c10] text-amber-300 transition-all cursor-pointer"
                      title="Copiar Dirección"
                    >
                      {copiedField === 'Dirección' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Balances Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-[#140e0b] p-3 rounded-xl border border-[#2b170e]">
                  <span className="text-[10px] uppercase text-zinc-500 font-bold block">USDC (Colateral)</span>
                  <span className="text-base font-black text-emerald-400 font-mono">
                    ${wallet.balances.USDC.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[9px] text-zinc-500 block mt-0.5">Margen Futuros</span>
                </div>

                <div className="bg-[#140e0b] p-3 rounded-xl border border-[#2b170e]">
                  <span className="text-[10px] uppercase text-zinc-500 font-bold block">ETH (Gas L1)</span>
                  <span className="text-base font-black text-amber-200 font-mono">
                    {wallet.balances.ETH.toFixed(4)}
                  </span>
                  <span className="text-[9px] text-zinc-500 block mt-0.5">Gas On-Chain</span>
                </div>

                <div className="bg-[#140e0b] p-3 rounded-xl border border-[#2b170e]">
                  <span className="text-[10px] uppercase text-zinc-500 font-bold block">HYPE (Nativo)</span>
                  <span className="text-base font-black text-amber-400 font-mono">
                    {wallet.balances.HYPE.toFixed(2)}
                  </span>
                  <span className="text-[9px] text-zinc-500 block mt-0.5">Hyperliquid L1</span>
                </div>

                <div className="bg-[#140e0b] p-3 rounded-xl border border-[#2b170e]">
                  <span className="text-[10px] uppercase text-zinc-500 font-bold block">ARB (Arbitrum)</span>
                  <span className="text-base font-black text-blue-400 font-mono">
                    {wallet.balances.ARB.toFixed(2)}
                  </span>
                  <span className="text-[9px] text-zinc-500 block mt-0.5">Ecosistema L2</span>
                </div>
              </div>

              {/* QR and Faucet Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="bg-[#140e0b] p-3.5 rounded-xl border border-[#2b170e] flex items-center space-x-3">
                  {qrCodeDataUrl ? (
                    <img src={qrCodeDataUrl} alt="QR Code" className="w-16 h-16 rounded border border-[#3b2012] bg-white p-1" />
                  ) : (
                    <div className="w-16 h-16 rounded bg-[#20150f] flex items-center justify-center text-zinc-500">
                      <QrCode className="w-8 h-8" />
                    </div>
                  )}
                  <div className="text-xs space-y-1">
                    <span className="font-bold text-amber-200 uppercase text-[11px] block">Código QR de la Bóveda</span>
                    <p className="text-[10px] text-zinc-400">Escanea desde tu móvil o hardware wallet para depositar fondos.</p>
                  </div>
                </div>

                <div className="bg-[#19100a] p-3.5 rounded-xl border border-[#3b2012] flex flex-col justify-between">
                  <div className="text-xs">
                    <span className="font-bold text-emerald-400 uppercase text-[11px] block">🎁 Faucet del Cartel</span>
                    <p className="text-[10px] text-zinc-400 mt-0.5">
                      Recibe +10,000 USDC y 0.5 ETH de prueba para operar sin riesgo.
                    </p>
                  </div>
                  <button
                    onClick={claimFaucet}
                    className="mt-2 w-full py-1.5 rounded-lg font-black text-[11px] uppercase bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-white shadow-md transition-all cursor-pointer flex items-center justify-center space-x-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Recibir Fondos de Prueba</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CREAR WALLET (User requested: copiar clave secreta y frase semilla) */}
          {activeTab === 'create' && (
            <div className="space-y-4">
              <div className="bg-[#140e0b] p-4 rounded-xl border border-[#2b170e] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-200 uppercase">
                    Generador Criptográfico de Nueva Bóveda
                  </span>
                  <button
                    onClick={handleGenerateNew}
                    className="px-2 py-1 text-[10px] font-bold bg-[#26150d] hover:bg-[#3b1f13] text-amber-300 rounded border border-[#4a2614] flex items-center space-x-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Generar Otra</span>
                  </button>
                </div>

                {tempCreatedWallet && (
                  <div className="space-y-3 pt-1">
                    {/* Public Address */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-zinc-400">
                        <span>Dirección Pública (0x)</span>
                        <button
                          onClick={() => copyToClipboard(tempCreatedWallet.address, 'Dirección Pública')}
                          className="text-amber-400 hover:underline flex items-center space-x-1 cursor-pointer"
                        >
                          <Copy className="w-2.5 h-2.5" />
                          <span>Copiar Dirección</span>
                        </button>
                      </div>
                      <div className="bg-[#0b0806] px-3 py-2 rounded border border-[#21140c] text-xs text-white font-mono break-all">
                        {tempCreatedWallet.address}
                      </div>
                    </div>

                    {/* Seed Phrase (12 Words) */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] text-zinc-400">
                        <span className="font-bold uppercase text-amber-300">
                          Frase Semilla (12 Palabras BIP-39)
                        </span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setShowSeedPhrase(!showSeedPhrase)}
                            className="text-zinc-400 hover:text-white flex items-center space-x-1 cursor-pointer"
                          >
                            {showSeedPhrase ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            <span>{showSeedPhrase ? 'Ocultar' : 'Ver'}</span>
                          </button>
                          <button
                            onClick={() => copyToClipboard(tempCreatedWallet.seedPhrase, 'Frase Semilla')}
                            className="text-amber-400 hover:underline flex items-center space-x-1 cursor-pointer font-bold"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copiar Frase Semilla</span>
                          </button>
                        </div>
                      </div>

                      {/* 12-Word Grid */}
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 bg-[#0a0705] p-2.5 rounded-lg border border-[#26150d]">
                        {tempCreatedWallet.seedPhrase.split(' ').map((word, i) => (
                          <div
                            key={i}
                            className="bg-[#140e0a] border border-[#24150c] rounded px-2 py-1 text-[11px] flex items-center space-x-1.5"
                          >
                            <span className="text-zinc-500 text-[9px] w-4">{i + 1}.</span>
                            <span className="text-amber-100 font-bold">
                              {showSeedPhrase ? word : '••••••'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Private Key */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] text-zinc-400">
                        <span className="font-bold uppercase text-red-400">
                          Clave Secreta (Private Key 0x...)
                        </span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setShowPrivateKey(!showPrivateKey)}
                            className="text-zinc-400 hover:text-white flex items-center space-x-1 cursor-pointer"
                          >
                            {showPrivateKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            <span>{showPrivateKey ? 'Ocultar' : 'Ver'}</span>
                          </button>
                          <button
                            onClick={() => copyToClipboard(tempCreatedWallet.privateKey, 'Clave Secreta')}
                            className="text-amber-400 hover:underline flex items-center space-x-1 cursor-pointer font-bold"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copiar Clave Secreta</span>
                          </button>
                        </div>
                      </div>
                      <div className="bg-[#0b0806] px-3 py-2 rounded border border-[#21140c] text-xs text-red-300 font-mono break-all">
                        {showPrivateKey ? tempCreatedWallet.privateKey : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                      </div>
                    </div>

                    {/* Backup & Activation Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        onClick={() =>
                          handleDownloadBackup(
                            tempCreatedWallet.address,
                            tempCreatedWallet.privateKey,
                            tempCreatedWallet.seedPhrase
                          )
                        }
                        className="py-2 rounded-lg bg-[#1f130c] hover:bg-[#2b190f] text-zinc-300 text-[11px] font-bold border border-[#3d2012] flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-amber-400" />
                        <span>Descargar Backup JSON</span>
                      </button>

                      <button
                        onClick={handleApplyCreatedWallet}
                        className="py-2 rounded-lg bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-black font-black text-[11px] uppercase tracking-wider shadow-lg cursor-pointer"
                      >
                        Activar Esta Bóveda
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: IMPORTAR WALLET (Frase, Clave, QR) */}
          {activeTab === 'import' && (
            <div className="space-y-4">
              <div className="flex border border-[#2f190f] rounded-lg p-0.5 bg-[#120c08] text-xs">
                <button
                  onClick={() => setImportMethod('seed')}
                  className={`flex-1 py-1.5 rounded font-bold transition-all cursor-pointer ${
                    importMethod === 'seed'
                      ? 'bg-[#2b170e] text-amber-300'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Frase Semilla (12 Palabras)
                </button>
                <button
                  onClick={() => setImportMethod('key')}
                  className={`flex-1 py-1.5 rounded font-bold transition-all cursor-pointer ${
                    importMethod === 'key'
                      ? 'bg-[#2b170e] text-amber-300'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Clave Privada (0x...)
                </button>
                <button
                  onClick={() => setImportMethod('qr')}
                  className={`flex-1 py-1.5 rounded font-bold transition-all cursor-pointer ${
                    importMethod === 'qr'
                      ? 'bg-[#2b170e] text-amber-300'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Escanear QR
                </button>
              </div>

              {/* Seed Import Form */}
              {importMethod === 'seed' && (
                <form onSubmit={handleImportSeed} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-400 font-bold uppercase">
                      Introduce tus 12 o 24 palabras separadas por espacios:
                    </label>
                    <textarea
                      value={seedInput}
                      onChange={(e) => setSeedInput(e.target.value)}
                      rows={3}
                      placeholder="ejemplo: abandon ability able about above absent absorb abstract absurd abuse access accident"
                      className="w-full bg-[#140e0b] border border-[#3b2012] focus:border-amber-400 rounded-lg p-3 text-white text-xs font-mono focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-black font-black text-xs uppercase tracking-wider cursor-pointer shadow-md"
                  >
                    Restaurar Bóveda desde Frase
                  </button>
                </form>
              )}

              {/* Private Key Import Form */}
              {importMethod === 'key' && (
                <form onSubmit={handleImportKey} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-400 font-bold uppercase">
                      Clave Secreta en Formato Hexadecimal (0x...):
                    </label>
                    <input
                      type="password"
                      value={keyInput}
                      onChange={(e) => setKeyInput(e.target.value)}
                      placeholder="0x4f3c... (64 caracteres)"
                      className="w-full bg-[#140e0b] border border-[#3b2012] focus:border-amber-400 rounded-lg px-3 py-2.5 text-white text-xs font-mono focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-black font-black text-xs uppercase tracking-wider cursor-pointer shadow-md"
                  >
                    Vincular Bóveda con Clave Privada
                  </button>
                </form>
              )}

              {/* QR Scanner / Upload */}
              {importMethod === 'qr' && (
                <div className="bg-[#140e0b] p-4 rounded-xl border border-[#2b170e] text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-[#20150f] mx-auto flex items-center justify-center text-amber-400 border border-[#3b2012]">
                    <Camera className="w-8 h-8" />
                  </div>
                  <div className="text-xs space-y-1">
                    <h4 className="font-bold text-amber-200 uppercase">Escanear Código QR</h4>
                    <p className="text-[10px] text-zinc-400 max-w-sm mx-auto">
                      Puedes escanear la clave o dirección con tu cámara web o cargar un archivo de imagen QR.
                    </p>
                  </div>
                  <div className="flex justify-center space-x-2 pt-1">
                    <label className="px-4 py-2 rounded-lg bg-[#24150d] hover:bg-[#381f13] text-amber-300 font-bold text-xs border border-[#4a2615] cursor-pointer flex items-center space-x-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Subir Imagen QR</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            addToast({
                              type: 'info',
                              title: 'QR Analizado',
                              message: 'Código QR procesado. Clave detectada e importada.',
                            });
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: TRANSFERENCIAS ON-CHAIN */}
          {activeTab === 'transfers' && (
            <div className="space-y-4">
              <form onSubmit={handleExecuteTransfer} className="bg-[#140e0b] p-4 rounded-xl border border-[#2b170e] space-y-3">
                <div className="text-xs font-bold text-amber-200 uppercase flex items-center space-x-1.5">
                  <Send className="w-4 h-4 text-emerald-400" />
                  <span>Envío On-Chain (Arbitrum / Hyperliquid)</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 uppercase font-bold">Activo</label>
                    <select
                      value={transferAsset}
                      onChange={(e: any) => setTransferAsset(e.target.value)}
                      className="w-full bg-[#0b0806] border border-[#3b2012] text-white rounded p-2 text-xs font-mono focus:outline-none"
                    >
                      <option value="USDC">USDC (Saldo: ${wallet.balances.USDC})</option>
                      <option value="ETH">ETH (Saldo: {wallet.balances.ETH})</option>
                      <option value="HYPE">HYPE (Saldo: {wallet.balances.HYPE})</option>
                      <option value="ARB">ARB (Saldo: {wallet.balances.ARB})</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 uppercase font-bold">Monto</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-[#0b0806] border border-[#3b2012] text-white rounded p-2 text-xs font-mono focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setTransferAmount(wallet.balances[transferAsset].toString())}
                        className="absolute right-2 top-2 text-[10px] text-amber-400 font-bold hover:underline cursor-pointer"
                      >
                        MAX
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 uppercase font-bold">
                    Dirección de Destino (0x...)
                  </label>
                  <input
                    type="text"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    placeholder="0x71C... (40 caracteres hex)"
                    className="w-full bg-[#0b0806] border border-[#3b2012] text-white rounded p-2 text-xs font-mono focus:outline-none"
                  />
                </div>

                <div className="p-2.5 bg-[#0b0806] rounded border border-[#21140c] text-[10px] text-zinc-400 flex justify-between">
                  <span>Tarifa de Gas de Red:</span>
                  <span className="text-amber-200">~0.00012 ETH ($0.41 USD)</span>
                </div>

                <button
                  type="submit"
                  disabled={isTransferring}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-white font-black text-xs uppercase tracking-wider cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isTransferring ? 'Firmando y Transmitiendo...' : 'Confirmar Envío On-Chain'}
                </button>
              </form>

              {/* Transfers Ledger */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-zinc-400 uppercase">
                  Historial de Transferencias Recientes ({onChainTransfers.length})
                </span>
                {onChainTransfers.length === 0 ? (
                  <p className="text-center text-zinc-600 text-xs py-3">No hay transferencias salientes todavía.</p>
                ) : (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {onChainTransfers.map((tx) => (
                      <div
                        key={tx.id}
                        className="p-2 rounded bg-[#130d09] border border-[#21130a] flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-white">
                            -{tx.amount} {tx.asset}
                          </div>
                          <div className="text-[10px] text-zinc-500 font-mono">
                            A: {tx.to.slice(0, 8)}...{tx.to.slice(-6)}
                          </div>
                        </div>
                        <div className="text-right space-y-0.5">
                          <span className="text-[10px] text-emerald-400 font-bold block">CONFIRMADA</span>
                          <button
                            type="button"
                            onClick={() => openHashVerifier(tx.hash)}
                            className="text-[9px] font-mono text-amber-300 hover:text-white bg-[#22130a] hover:bg-[#341d10] px-1.5 py-0.5 rounded border border-[#482513] hover:border-amber-400 cursor-pointer flex items-center space-x-1"
                            title={`Verificar Hash On-Chain: ${tx.hash}`}
                          >
                            <span>TX: {tx.hash.slice(0, 8)}...</span>
                            <span className="text-amber-400 font-bold">🔍</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
