import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { getChainConfig } from "../supportedChains";

/**
 * Deploys AaveV3Strategy, GivvestTreasury, and GivvestVault.
 *
 * On a live deploy pass ADMIN_WALLET in the environment to transfer ownership
 * away from the deployer EOA immediately. The script asserts ownership at the end.
 *
 * Usage:
 *   yarn deploy                    -- deploys to localhost
 *   yarn deploy --network base    -- deploys to Base mainnet (CHAIN set in .env)
 */
const deployGivvest: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const chain = process.env.CHAIN || "base";

  console.log(`\nDeploying Givvest to ${chain} (chain id: ${hre.network.config.chainId})`);
  console.log(`Deployer: ${deployer}`);

  // Resolve chain-specific addresses from the config map.
  const cfg = getChainConfig(chain);
  console.log(`USDC:     ${cfg.usdc}`);
  console.log(`aUSDC:    ${cfg.aUsdc}`);
  console.log(`Aave V3 Pool: ${cfg.pool}`);

  // On live deploys, ownership is transferred to ADMIN_WALLET.
  // Falls back to deployer for local development.
  const adminWallet = process.env.ADMIN_WALLET || deployer;
  console.log(`Admin wallet: ${adminWallet}`);

  // 1. Deploy GivvestTreasury (placeholder vault address; set after vault deploy).
  const treasury = await deploy("GivvestTreasury", {
    from: deployer,
    args: [cfg.usdc, deployer], // temporary owner; transferred to admin wallet below
    log: true,
    autoMine: true,
  });

  // 2. Deploy AaveV3Strategy (vault not set yet; set via setVault after vault deploy).
  const strategy = await deploy("AaveV3Strategy", {
    from: deployer,
    args: [cfg.pool, cfg.usdc, cfg.aUsdc, deployer],
    log: true,
    autoMine: true,
  });

  // 3. Deploy GivvestVault, wiring in strategy and treasury.
  const vault = await deploy("GivvestVault", {
    from: deployer,
    args: [cfg.usdc, strategy.address, treasury.address, deployer],
    log: true,
    autoMine: true,
  });

  // 4. Wire: tell the strategy which vault is allowed to call it.
  const strategyContract = await hre.ethers.getContractAt("AaveV3Strategy", strategy.address);
  const tx1 = await strategyContract.setVault(vault.address);
  await tx1.wait();
  console.log(`Strategy vault set to: ${vault.address}`);

  // 5. Transfer ownership of all contracts to the admin wallet.
  const treasuryContract = await hre.ethers.getContractAt("GivvestTreasury", treasury.address);
  const vaultContract = await hre.ethers.getContractAt("GivvestVault", vault.address);

  if (adminWallet !== deployer) {
    const tx2 = await strategyContract.transferOwnership(adminWallet);
    await tx2.wait();
    const tx3 = await treasuryContract.transferOwnership(adminWallet);
    await tx3.wait();
    const tx4 = await vaultContract.transferOwnership(adminWallet);
    await tx4.wait();
    console.log(`All contracts transferred to admin wallet: ${adminWallet}`);

    // Assert ownership is correctly set (fail loudly if not).
    const stratOwner = await strategyContract.owner();
    const treasOwner = await treasuryContract.owner();
    const vaultOwner = await vaultContract.owner();
    if (stratOwner !== adminWallet || treasOwner !== adminWallet || vaultOwner !== adminWallet) {
      throw new Error("Ownership transfer assertion failed! Deployer EOA may still be owner.");
    }
    console.log("Ownership assertion passed: all contracts owned by admin wallet.");
  } else {
    console.log("Local deploy: ownership retained by deployer for testing.");
  }

  console.log(`\nDeployment complete:`);
  console.log(`  GivvestVault:    ${vault.address}`);
  console.log(`  AaveV3Strategy:  ${strategy.address}`);
  console.log(`  GivvestTreasury: ${treasury.address}`);
  console.log(`\nTo verify on explorer:`);
  console.log(
    `  yarn hardhat verify --network ${chain} ${vault.address} ${cfg.usdc} ${strategy.address} ${treasury.address} ${deployer}`,
  );
};

export default deployGivvest;
deployGivvest.tags = ["Givvest"];
