import * as fs from "fs";
import * as path from "path";
import hre from "hardhat";
import { getChainConfig } from "../supportedChains";
import generateTsAbis from "./generateTsAbis";

// Fixed gas price passed on every transaction so the fee never fluctuates
// between submission and any internal retry. 1 gwei is well above Base's typical base fee.
const GAS_PRICE = 1_000_000_000n;

function saveArtifact(
  networkName: string,
  chainId: number,
  contractName: string,
  address: string,
  abi: unknown[],
  blockNumber: number,
) {
  const dir = path.join(__dirname, `../deployments/${networkName}`);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, ".chainId"), chainId.toString());
  fs.writeFileSync(
    path.join(dir, `${contractName}.json`),
    JSON.stringify({ address, abi, receipt: { blockNumber } }, null, 2),
  );
}

async function main() {
  const { ethers } = hre;
  const [deployer] = await ethers.getSigners();
  const chain = process.env.CHAIN || "base";
  const networkName = hre.network.name;
  const chainId = hre.network.config.chainId!;
  const cfg = getChainConfig(chain);
  const adminWallet = process.env.ADMIN_WALLET || deployer.address;
  const overrides = { gasPrice: GAS_PRICE };

  console.log(`\nDeploying Givvest to ${chain} (chain id: ${chainId})`);
  console.log(`Deployer:      ${deployer.address}`);
  console.log(`USDC:          ${cfg.usdc}`);
  console.log(`aUSDC:         ${cfg.aUsdc}`);
  console.log(`Aave V3 Pool:  ${cfg.pool}`);
  console.log(`Admin wallet:  ${adminWallet}\n`);

  // 1. GivvestTreasury
  const TreasuryFactory = await ethers.getContractFactory("GivvestTreasury");
  const treasury = await TreasuryFactory.deploy(cfg.usdc, deployer.address, overrides);
  await treasury.waitForDeployment();
  const treasuryAddress = await treasury.getAddress();
  const treasuryBlock = (await treasury.deploymentTransaction()!.wait())!.blockNumber;
  console.log(`GivvestTreasury deployed at: ${treasuryAddress}`);

  // 2. AaveV3Strategy
  const StrategyFactory = await ethers.getContractFactory("AaveV3Strategy");
  const strategy = await StrategyFactory.deploy(cfg.pool, cfg.usdc, cfg.aUsdc, deployer.address, overrides);
  await strategy.waitForDeployment();
  const strategyAddress = await strategy.getAddress();
  const strategyBlock = (await strategy.deploymentTransaction()!.wait())!.blockNumber;
  console.log(`AaveV3Strategy deployed at:  ${strategyAddress}`);

  // 3. GivvestVault
  const VaultFactory = await ethers.getContractFactory("GivvestVault");
  const vault = await VaultFactory.deploy(cfg.usdc, strategyAddress, treasuryAddress, deployer.address, overrides);
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  const vaultBlock = (await vault.deploymentTransaction()!.wait())!.blockNumber;
  console.log(`GivvestVault deployed at:    ${vaultAddress}`);

  // 4. Wire strategy → vault
  await (await strategy.setVault(vaultAddress, overrides)).wait();
  console.log(`Strategy vault set.`);

  // 5. Transfer ownership if admin wallet differs from deployer
  if (adminWallet.toLowerCase() !== deployer.address.toLowerCase()) {
    await (await strategy.transferOwnership(adminWallet, overrides)).wait();
    await (await treasury.transferOwnership(adminWallet, overrides)).wait();
    await (await vault.transferOwnership(adminWallet, overrides)).wait();

    const [so, to, vo] = await Promise.all([strategy.owner(), treasury.owner(), vault.owner()]);
    if (so !== adminWallet || to !== adminWallet || vo !== adminWallet) {
      throw new Error("Ownership transfer assertion failed!");
    }
    console.log(`Ownership transferred to admin wallet: ${adminWallet}`);
  } else {
    console.log(`Local deploy: ownership retained by deployer.`);
  }

  // 6. Save deployment artifacts
  const treasuryAbi = (await hre.artifacts.readArtifact("GivvestTreasury")).abi;
  const strategyAbi = (await hre.artifacts.readArtifact("AaveV3Strategy")).abi;
  const vaultAbi = (await hre.artifacts.readArtifact("GivvestVault")).abi;

  saveArtifact(networkName, chainId, "GivvestTreasury", treasuryAddress, treasuryAbi, treasuryBlock);
  saveArtifact(networkName, chainId, "AaveV3Strategy", strategyAddress, strategyAbi, strategyBlock);
  saveArtifact(networkName, chainId, "GivvestVault", vaultAddress, vaultAbi, vaultBlock);

  console.log(`\nDeployment complete:`);
  console.log(`  GivvestVault:    ${vaultAddress}`);
  console.log(`  AaveV3Strategy:  ${strategyAddress}`);
  console.log(`  GivvestTreasury: ${treasuryAddress}`);
  console.log(`\nTo verify on explorer:`);
  console.log(
    `  yarn hardhat verify --network ${networkName} ${vaultAddress} ${cfg.usdc} ${strategyAddress} ${treasuryAddress} ${deployer.address}`,
  );

  // 7. Generate TypeScript ABIs for the frontend
  await generateTsAbis(hre as any);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
