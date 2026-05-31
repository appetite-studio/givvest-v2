import * as chains from "viem/chains";

export type BaseConfig = {
  targetNetworks: readonly chains.Chain[];
  pollingInterval: number;
  alchemyApiKey: string;
  rpcOverrides?: Record<number, string>;
  burnerWalletMode: "localNetworksOnly" | "allNetworks" | "disabled";
};

export type ScaffoldConfig = BaseConfig;

export const DEFAULT_ALCHEMY_API_KEY = "IZYEU2cWBgnFmgiTAgpWD";

// Chain string from env. Must match a key in supportedChains.ts.
// Defaults to "base" so the frontend works out of the box.
const CHAIN_KEY = process.env.NEXT_PUBLIC_CHAIN || "base";

// Map chain key to viem chain object.
const chainMap: Record<string, chains.Chain> = {
  base: chains.base,
  baseSepolia: chains.baseSepolia,
  arbitrum: chains.arbitrum,
  optimism: chains.optimism,
  ethereum: chains.mainnet,
};

const targetChain = chainMap[CHAIN_KEY] ?? chains.base;

const scaffoldConfig = {
  // The frontend connects to this network.
  // On local development, the Hardhat node forks this chain.
  targetNetworks: [targetChain],
  pollingInterval: 4000,
  // SE-2's Alchemy integration. Set NEXT_PUBLIC_ALCHEMY_API_KEY in .env.local for production.
  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || DEFAULT_ALCHEMY_API_KEY,
  rpcOverrides: {},
  // Show burner wallet only on local networks.
  burnerWalletMode: "localNetworksOnly",
} as const satisfies ScaffoldConfig;

export default scaffoldConfig;
