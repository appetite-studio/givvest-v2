import hre from "hardhat";

/**
 * Cancels all stuck pending transactions for the deployer by sending zero-value
 * self-transfers at each pending nonce with 3× the current fee estimate.
 *
 * Run with:
 *   yarn hardhat run scripts/cancelPendingTxs.ts --network baseSepolia
 */
async function main() {
  const { ethers } = hre;
  const [deployer] = await ethers.getSigners();
  const address = await deployer.getAddress();

  const confirmedNonce = await ethers.provider.getTransactionCount(address, "latest");
  const pendingNonce = await ethers.provider.getTransactionCount(address, "pending");

  if (pendingNonce <= confirmedNonce) {
    console.log(`No stuck transactions. Confirmed nonce: ${confirmedNonce}`);
    return;
  }

  console.log(`Confirmed nonce: ${confirmedNonce} | Pending nonce: ${pendingNonce}`);
  console.log(`Cancelling ${pendingNonce - confirmedNonce} stuck transaction(s)...\n`);

  const feeData = await ethers.provider.getFeeData();
  const maxFeePerGas = feeData.maxFeePerGas ? feeData.maxFeePerGas * 3n : ethers.parseUnits("1", "gwei");
  const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas
    ? feeData.maxPriorityFeePerGas * 3n
    : ethers.parseUnits("1", "gwei");

  for (let nonce = confirmedNonce; nonce < pendingNonce; nonce++) {
    console.log(`Cancelling nonce ${nonce}...`);
    const tx = await deployer.sendTransaction({
      to: address,
      value: 0n,
      nonce,
      maxFeePerGas,
      maxPriorityFeePerGas,
    });
    console.log(`  tx: ${tx.hash}`);
    await tx.wait();
    console.log(`  confirmed.\n`);
  }

  console.log("All stuck transactions cancelled. Ready to deploy.");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
