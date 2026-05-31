import * as dotenv from "dotenv";
dotenv.config();
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-verify";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import { getChainConfig } from "./supportedChains";

// Scaffold-ETH 2's shared default Alchemy key. Works out of the box.
// Set ALCHEMY_API_KEY in .env for production to avoid rate limits.
const providerApiKey = process.env.ALCHEMY_API_KEY || "IZYEU2cWBgnFmgiTAgpWD";

// Deployer key: never stored in plaintext. Use `yarn account:generate` or `yarn account:import`.
// For local forks the hardhat default account is used (index 0).
const deployerPrivateKey =
  process.env.__RUNTIME_DEPLOYER_PRIVATE_KEY ?? "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const etherscanApiKey = process.env.ETHERSCAN_V2_API_KEY || "DNXJA8RX2Q3VZ4URQIWP7Z68CJXQZSC6AW";

// Resolve the chain the developer wants to fork / deploy to.
// Defaults to "base" if CHAIN is not set.
const CHAIN = process.env.CHAIN || "base";
const chainCfg = getChainConfig(CHAIN);

// Alchemy URL for the selected chain (fast, reliable for forking).
function alchemyUrl(chainName: string): string {
  const slugs: Record<string, string> = {
    base: "base-mainnet",
    baseSepolia: "base-sepolia",
    arbitrum: "arb-mainnet",
    optimism: "opt-mainnet",
    ethereum: "eth-mainnet",
  };
  const slug = slugs[chainName] || "base-mainnet";
  return `https://${slug}.g.alchemy.com/v2/${providerApiKey}`;
}

const forkUrl = alchemyUrl(CHAIN);

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.30",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          viaIR: true,
        },
      },
    ],
  },
  defaultNetwork: "localhost",
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  networks: {
    // Local fork of the chain set by CHAIN. Tests run here.
    hardhat: {
      forking: {
        url: forkUrl,
        // Enable forking when running tests with FORK=true, or always in test mode.
        enabled: process.env.FORK === "true" || process.env.NODE_ENV === "test",
      },
      chainId: chainCfg.chainId,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: chainCfg.chainId,
    },
    // Live networks -- SE-2 Alchemy-based URLs.
    base: {
      url: alchemyUrl("base"),
      accounts: [deployerPrivateKey],
      chainId: 8453,
    },
    arbitrum: {
      url: alchemyUrl("arbitrum"),
      accounts: [deployerPrivateKey],
      chainId: 42161,
    },
    optimism: {
      url: alchemyUrl("optimism"),
      accounts: [deployerPrivateKey],
      chainId: 10,
    },
    mainnet: {
      url: alchemyUrl("ethereum"),
      accounts: [deployerPrivateKey],
      chainId: 1,
    },
    // SE-2 standard networks retained for compatibility.
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    baseSepolia: {
      url: alchemyUrl("baseSepolia"),
      accounts: [deployerPrivateKey],
      chainId: 84532,
      // Fixed gas price prevents hardhat-deploy's retry logic from submitting
      // a replacement with a lower fee, which causes REPLACEMENT_UNDERPRICED.
      gasPrice: 1000000000, // 1 gwei — well above Base Sepolia's typical base fee
    },
  },
  etherscan: {
    apiKey: etherscanApiKey,
  },
  verify: {
    etherscan: {
      apiKey: etherscanApiKey,
    },
  },
  sourcify: {
    enabled: false,
  },
};

export default config;
