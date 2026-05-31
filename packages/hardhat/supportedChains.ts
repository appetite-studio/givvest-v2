/**
 * supportedChains.ts
 *
 * Single source of truth for chain selection in Givvest.
 * The CHAIN environment variable (e.g. "base") is the only chain-selection input.
 * Everything else -- chain id, explorer, USDC address, Aave pool -- derives from this map.
 * The RPC comes from Scaffold-ETH 2's native Alchemy integration, not from this file.
 *
 * To add a new chain: add one entry here and nothing else.
 */

import { type Chain, base, baseSepolia, arbitrum, optimism, mainnet } from "viem/chains";

// Aave address book types (resolved at runtime, not hardcoded).
// We import dynamically to keep this module side-effect-free.
// Each entry is: { POOL, ASSETS: { USDC: { UNDERLYING, A_TOKEN } } }

// Note on USDC keys per chain:
//   Base     -- uses USDC (native Circle USDC, not bridged).
//   Arbitrum -- uses USDC (native Circle USDC). Some older builds used USDCn; verify at runtime.
//   Optimism -- uses USDC (native Circle USDC).
//   Ethereum -- uses USDC (native Circle USDC).

export interface ChainAssets {
  USDC: {
    UNDERLYING: string;
    A_TOKEN: string;
  };
}

export interface AaveMarket {
  POOL: string;
  ASSETS: ChainAssets;
}

export interface ChainEntry {
  chain: Chain;
  aave: any;
}

export interface ChainConfig {
  viemChain: Chain;
  chainId: number;
  /** Fallback public RPC. Prefer SE-2's Alchemy URL everywhere the framework provides one. */
  rpcUrl: string;
  explorerUrl: string | undefined;
  pool: string;
  usdc: string;
  aUsdc: string;
}

export type ChainKey = "base" | "baseSepolia" | "arbitrum" | "optimism" | "ethereum";

// We import the address-book lazily so HardhatUserConfig can reference this
// synchronously after a top-level await in ESM, or inline in CommonJS via require().
// In practice, the deploy scripts and hardhat config call getChainConfig at module
// evaluation time after the imports have resolved, so this is fine.
import {
  AaveV3Base,
  AaveV3BaseSepolia,
  AaveV3Arbitrum,
  AaveV3Optimism,
  AaveV3Ethereum,
} from "@bgd-labs/aave-address-book";

const SUPPORTED: Record<ChainKey, ChainEntry> = {
  base: { chain: base, aave: AaveV3Base },
  baseSepolia: { chain: baseSepolia, aave: AaveV3BaseSepolia },
  arbitrum: { chain: arbitrum, aave: AaveV3Arbitrum },
  optimism: { chain: optimism, aave: AaveV3Optimism },
  ethereum: { chain: mainnet, aave: AaveV3Ethereum },
};

/**
 * Resolve the full chain configuration for a given chain-name string.
 * Throws a descriptive error if the key is not in SUPPORTED, so a bad .env
 * fails loudly at startup rather than silently deploying against wrong addresses.
 */
export function getChainConfig(key: string): ChainConfig {
  const cfg = SUPPORTED[key as ChainKey];
  if (!cfg) {
    throw new Error(`Unsupported CHAIN "${key}". Supported values: ${Object.keys(SUPPORTED).join(", ")}`);
  }
  return {
    viemChain: cfg.chain,
    chainId: cfg.chain.id,
    rpcUrl: cfg.chain.rpcUrls.default.http[0],
    explorerUrl: cfg.chain.blockExplorers?.default.url,
    pool: cfg.aave.POOL,
    usdc: cfg.aave.ASSETS.USDC.UNDERLYING,
    aUsdc: cfg.aave.ASSETS.USDC.A_TOKEN,
  };
}
