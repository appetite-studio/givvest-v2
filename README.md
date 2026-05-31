# Givvest

> Don't give, just Givvest.

Givvest is a no-loss charity protocol. Users deposit USDC. Their principal stays theirs and is always withdrawable in full. The deposited principal is supplied to Aave V3 to generate yield. Only the yield is donated to charity. A DAO decides how much harvested yield to send and to which charity wallet.

**Core promise: you never lose your money. You only donate the returns it generates.**

---

## Risk Disclosures

**Aave solvency and liquidity.** Principal lives in Aave V3. If Aave suffers bad debt or lacks liquidity, withdrawals can be impaired or delayed.

**Aave availability.** If Aave pauses the USDC market, users may temporarily be unable to withdraw. The `setStrategy` governance path is the escape hatch, but it is governance-gated.

**USDC centralization and peg.** USDC is a centralized, upgradeable token with an address freeze capability. A freeze on the vault or treasury, or a depeg, would affect funds.

**Asset assumptions.** Accounting assumes a standard ERC20 whose only balance growth is the aToken rebase. Do not point a strategy at a fee-on-transfer token; it breaks principal accounting.

**Governance is the trust center.** With no recipient allowlist, whoever controls the admin wallet can direct all harvested yield. Treat the admin wallet's private key as the most sensitive secret in the system.

---

## Architecture

### Contracts

| Contract | Purpose |
|---|---|
| `GivvestVault` | Principal accounting, owns a single `IYieldStrategy`, enforces the no-loss invariant |
| `AaveV3Strategy` | Wraps Aave V3 Pool. Only the vault may deposit/withdraw |
| `GivvestTreasury` | Receives harvested yield, distributes to charity wallets on DAO instruction |
| `IYieldStrategy` | Interface for swappable yield strategies |

### Accounting model

- `principalOf[user]`: USDC deposited and not yet withdrawn.
- `totalPrincipal`: sum of all principal.
- `totalAssets()`: current redeemable value from Aave (grows as interest accrues).
- `harvestable = totalAssets() - totalPrincipal` (floored at zero, never reverts).

Yield attribution uses a global accumulator (Synthetix StakingRewards pattern) at 1e27 precision. Yield is always credited to the principal that earned it, never diluted by later deposits.

### Chain selection

A single string in `.env` (`CHAIN=base`) selects the chain. Everything else derives from `supportedChains.ts`. Adding a new chain means adding one entry to that file and nothing else.

### Governance

An admin wallet (EOA) controls `GivvestVault` and `GivvestTreasury`. The admin approves each charity payout by calling `distribute` on the treasury. The project will transition to DAO governance in a future phase.

---

## Setup

Prerequisites: Node 20+, Yarn 1.x.

```bash
git clone <repo-url>
cd givvest
yarn install
```

Copy env files:

```bash
cp packages/hardhat/.env.example packages/hardhat/.env
cp packages/nextjs/.env.example packages/nextjs/.env.local
```

Set `CHAIN=base` (or another supported chain key) in `packages/hardhat/.env` and `NEXT_PUBLIC_CHAIN=base` in `packages/nextjs/.env.local`.

---

## Development

```bash
# Terminal 1: local Hardhat node
yarn chain

# Terminal 2: deploy contracts to local node
yarn deploy

# Terminal 3: frontend
yarn start
```

---

## Live deploy

1. Generate or import your admin deployer account:
   ```bash
   yarn account:generate   # or: yarn account:import
   ```
2. Set `ADMIN_WALLET=<your-admin-address>` in `packages/hardhat/.env`. This wallet will be the owner of all contracts. Keep its private key secure.
3. Deploy:
   ```bash
   yarn deploy --network base
   ```
   The script transfers ownership to the admin wallet in the same run.
4. Verify contracts on the explorer:
   ```bash
   yarn hardhat verify --network base <address> <constructor-args...>
   ```

---

## Static analysis

```bash
yarn solhint 'contracts/**/*.sol'
pip install slither-analyzer && slither .
```

---

## Supported chains

| Key | Chain |
|---|---|
| `base` | Base mainnet |
| `baseSepolia` | Base Sepolia (testnet) |
| `arbitrum` | Arbitrum One |
| `optimism` | Optimism |
| `ethereum` | Ethereum mainnet |

---

## Security checklist

- `SafeERC20` on every token transfer.
- `nonReentrant` on `deposit`, `withdraw`, and `harvest`.
- Checks-effects-interactions order throughout.
- No code path allows harvesting or strategy migration to reduce claimable principal.
- All privileged functions are owner-gated; owner is the admin wallet.
- No recipient allowlist; the admin wallet is the trust boundary.
- Strategy swaps validated with a post-migration solvency assert.
- Pause affects deposits only; withdrawals always work.
- USDC 6-decimal math throughout.
- Unknown `CHAIN` string throws at startup.
