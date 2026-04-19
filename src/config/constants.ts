// Trinity PCE — On-chain Constants
// x⁰ = 1 | The Tangible Zero

// ─── CONTRACT ──────────────────────────────────────────────────────────
export const TRINITY_CONTRACT = import.meta.env
  .VITE_CONTRACT_ADDRESS as `0x${string}`;

// ─── ASSETS (Base Mainnet) ─────────────────────────────────────────────
export const DONUTBNK_NFT =
  "0x318c81010D5fC11363f3A3C79Ee26B6EFe8D145B" as const;
export const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as const;
export const OWNER_COIN = "0xa331F6e88c9B0Aa77e01bc3738b5ad31E1a930Dc" as const;

// ─── ECONOMICS ─────────────────────────────────────────────────────────
export const FLOOR_PRICE_USDC = 3_300_000n; // 3.30 USDC (6 decimals)
export const REWARD_AMOUNT_OWNER = 1_300_000_000_000_000_000n; // 1.30 OWNER_COIN (18 decimals)
export const MAX_HOLD_PERIOD_SECS = 7 * 24 * 60 * 60; // 7 days
export const GRACE_PERIOD_SECS = 48 * 60 * 60; // 48 hours
export const PROTOCOL_FEE_BPS = 1000; // 10%

// ─── DECIMALS ──────────────────────────────────────────────────────────
export const USDC_DECIMALS = 6;
export const OWNER_COIN_DECIMALS = 18;

// ─── METADATA ──────────────────────────────────────────────────────────
export const APP_NAME = "Trinity PCE";
export const APP_DESCRIPTION = "The World's 1st RWA Absolute Mitotic Ladder";
export const APP_URL = "https://300.madeinathens.eth.limo";

// ─── DEPLOYMENT ────────────────────────────────────────────────────────
// Block where the Trinity contract was deployed on Base mainnet.
// Used as fromBlock for event log queries (RPC 10k-block limit safety).
export const GENESIS_BLOCK = 44805910n;

// Block where DONUTBNK NFT was deployed on Base mainnet.
// Used as fromBlock for Transfer event scanning.
export const DONUTBNK_GENESIS_BLOCK = 43564787n;
