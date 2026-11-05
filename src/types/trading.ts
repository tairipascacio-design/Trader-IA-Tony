export type MarketSymbol = 'BTC-PERP' | 'ETH-PERP' | 'SOL-PERP' | 'HYPE-PERP' | 'ARB-PERP' | 'SUI-PERP' | 'TIA-PERP';

export interface MarketData {
  symbol: MarketSymbol;
  name: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  fundingRate: number; // e.g. 0.00012 = 0.012%
  openInterest: number;
  maxLeverage: number;
  tickSize: number;
  stepSize: number;
}

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OrderBookEntry {
  price: number;
  size: number;
  total: number;
}

export interface RecentTrade {
  id: string;
  price: number;
  size: number;
  side: 'buy' | 'sell';
  time: number;
}

export interface Position {
  id: string;
  symbol: MarketSymbol;
  side: 'LONG' | 'SHORT';
  entryPrice: number;
  currentPrice: number;
  size: number; // in coin
  margin: number; // in USDC
  leverage: number;
  liquidationPrice: number;
  takeProfit?: number;
  stopLoss?: number;
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
  openedAt: number;
  openedBy: 'MANUAL' | 'AI_BOT';
  aiRationale?: string;
  isRealLive?: boolean;
  txHash?: string;
}

export interface ClosedTrade {
  id: string;
  symbol: MarketSymbol;
  side: 'LONG' | 'SHORT';
  entryPrice: number;
  exitPrice: number;
  size: number;
  margin: number;
  leverage: number;
  realizedPnl: number;
  realizedPnlPercent: number;
  openedAt: number;
  closedAt: number;
  closedReason: 'TP_HIT' | 'SL_HIT' | 'MANUAL_CLOSE' | 'AI_CLOSE' | 'LIQUIDATED';
  openedBy: 'MANUAL' | 'AI_BOT';
  aiRationale?: string;
  aiLessonLearned?: string;
  strategyUsed?: string;
  isRealLive?: boolean;
  txHash?: string;
}

export interface WalletState {
  address: string;
  privateKey: string;
  seedPhrase: string;
  isConnected: boolean;
  type: 'CREATED' | 'IMPORTED_KEY' | 'IMPORTED_SEED' | 'INJECTED_WEB3';
  balances: {
    USDC: number; // Primary perps collateral
    ETH: number;  // L1 & gas
    HYPE: number; // Native Hyperliquid
    ARB: number;  // Arbitrum
  };
}

export interface OnChainTransfer {
  id: string;
  hash: string;
  asset: 'USDC' | 'ETH' | 'HYPE' | 'ARB';
  amount: number;
  from: string;
  to: string;
  timestamp: number;
  status: 'CONFIRMED' | 'PENDING';
  gasUsed: string;
  blockNumber: number;
}

export interface HashVerificationRecord {
  hash: string;
  timestamp: number;
  type: 'REAL_ORDER' | 'SIM_ORDER' | 'AI_ORDER' | 'ONCHAIN_TRANSFER' | 'CLOSE_POSITION' | 'CUSTOM_HASH';
  symbol?: MarketSymbol;
  side?: 'LONG' | 'SHORT';
  amountOrSize?: number;
  margin?: number;
  leverage?: number;
  executionPrice?: number;
  fromAddress?: string;
  toAddress?: string;
  blockNumber: number;
  slot: number;
  status: 'CONFIRMED' | 'FINALIZED';
  validatorQuorum: string;
  consensusTimeMs: number;
  gasFee: string;
  stateRoot: string;
  signature: {
    r: string;
    s: string;
    v: number;
  };
  merkleProofVerified: boolean;
  notes?: string;
}

export interface LearnedPattern {
  id: string;
  name: string;
  description: string;
  totalTrades: number;
  winRate: number;
  profitFactor: number;
  avgReturnPct: number;
  lastUpdated: number;
  keyRule: string;
  confidenceScore: number;
}

export interface AILogEntry {
  id: string;
  timestamp: number;
  type: 'SIGNAL' | 'EXECUTION' | 'CLOSE' | 'RISK_CHECK' | 'LEARN';
  symbol: MarketSymbol;
  message: string;
  details?: any;
}

export interface MarketResearchReport {
  title: string;
  content: string;
  citations: { title: string; url: string }[];
  timestamp: string;
}

export interface CommunityGuideAnalysis {
  title: string;
  internetWisdom: {
    consensus: string;
    communityInsights: string[];
    sentimentScore: number;
  };
  userTradesDiagnosis: {
    summary: string;
    strengths: string;
    weaknesses: string;
    recommendation: string;
  };
  botTradesDiagnosis: {
    summary: string;
    strengths: string;
    weaknesses: string;
    recommendation: string;
  };
  actionableSynthesis: string;
  suggestedAction?: 'LONG' | 'SHORT' | 'WAIT_PULLBACK';
  suggestedLeverage?: number;
  sources?: { title: string; url: string }[];
}

// 1. Funding Arbitrage Delta-Neutral Types
export interface DeltaNeutralPosition {
  id: string;
  symbol: MarketSymbol;
  asset: string; // e.g. 'ETH', 'SOL', 'HYPE', 'BTC'
  spotSize: number; // bought on Arbitrum Uniswap v3
  perpShortSize: number; // shorted on Hyperliquid L1
  spotEntryPrice: number;
  perpEntryPrice: number;
  basisSpreadPct: number; // e.g. 0.34%
  fundingRate8h: number; // e.g. 0.0008 = +0.08%
  annualizedApy: number; // e.g. 127.4%
  totalAllocatedUsd: number; // Combined capital (spot + short margin)
  accruedFundingUsd: number; // Accumulated funding fees collected
  epochsCollected: number; // 8h epochs passed
  openedAt: number;
  lastFundingSettledAt: number;
  status: 'ACTIVE' | 'CLOSED';
  mevShieldUsed: boolean;
  spotTxHash: string;
  perpTxHash: string;
}

export interface ArbitrageOpportunity {
  symbol: MarketSymbol;
  asset: string;
  spotDex: string; // 'Uniswap v3 (Arbitrum)'
  spotPrice: number;
  perpPrice: number;
  basisSpreadPct: number; // e.g. 0.34%
  fundingRate8h: number; // e.g. 0.0008 = +0.080%
  annualizedApy: number; // e.g. 127%
  estimated8hYieldUsd: number; // based on $1000 size
  liquidityDepthUsd: number;
  isRecommended: boolean;
}

// 2. MEV Shield (Arbitrum Private RPC / Flashbots / Bebop)
export type MEVProvider = 'FLASHBOTS_PROTECT' | 'BEBOP_PRIVATE' | 'EDEN_NETWORK';

export interface MEVShieldConfig {
  isEnabled: boolean;
  provider: MEVProvider;
  rpcUrl: string;
  totalSavedUsd: number;
  sandwichAttacksBlocked: number;
  frontrunsAverted: number;
  transactionsShielded: number;
}

export interface MEVShieldLog {
  id: string;
  timestamp: number;
  action: 'UNISWAP_SPOT_BUY' | 'ONCHAIN_TRANSFER' | 'ARBITRAGE_REBALANCE' | 'VAULT_COMPOUND';
  asset: string;
  amountUsd: number;
  provider: MEVProvider;
  txHash: string;
  mevSavedUsd: number;
  sandwichRiskAverted: boolean;
  blockNumber: number;
  status: 'PROTECTED_PRIVATE_BUNDLE';
}

// 3. Auto-Compound Vault
export type VaultStrategy = 'BALANCED_USDC_ETH' | 'MAX_USDC_YIELD' | 'HYPERLIQUID_MARGIN_REINVEST';

export interface AutoCompoundEpoch {
  id: string;
  timestamp: number;
  source: 'FUNDING_HARVEST' | 'TRADING_PROFIT' | 'MANUAL_DEPOSIT';
  amountUsd: number;
  reinvestedInto: string;
  cumulativeTvlUsd: number;
  txHash: string;
}

export interface AutoCompoundVaultState {
  isEnabled: boolean;
  totalDepositedUsd: number;
  totalYieldEarnedUsd: number;
  compoundFrequencyHours: number; // e.g. 8h
  targetStrategy: VaultStrategy;
  allocationUsdcPct: number; // e.g. 70
  allocationEthPct: number;  // e.g. 30
  currentApy: number; // e.g. 24.8%
  lastCompoundedAt: number;
  nextEpochCountdownMs: number;
  compoundHistory: AutoCompoundEpoch[];
}


