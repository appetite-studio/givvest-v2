"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { erc20Abi, formatUnits, parseUnits } from "viem";
import { useAccount, useWriteContract } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import {
  useDeployedContractInfo,
  useScaffoldEventHistory,
  useScaffoldReadContract,
  useScaffoldWriteContract,
} from "~~/hooks/scaffold-eth";

const USDC_DECIMALS = 6;

function fmt(value: bigint | undefined): string {
  if (value === undefined || value === null) return "0.00";
  return Number(formatUnits(value, USDC_DECIMALS)).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function fmtDate(timestamp: bigint): string {
  return new Date(Number(timestamp) * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const BENEFITS = [
  {
    icon: "🔒",
    title: "Principal protected",
    body: "Your deposit is always yours. Withdraw 100% at any moment, no fees, no lock-up.",
  },
  {
    icon: "📈",
    title: "Passive impact",
    body: "Once deposited, your money generates donations automatically. No recurring action needed.",
  },
  {
    icon: "🌍",
    title: "Transparent on-chain",
    body: "Every deposit, donation, and withdrawal is recorded on the blockchain — anyone can verify.",
  },
];

export default function ImpactPage() {
  const { address, isConnected } = useAccount();
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [showWithdraw, setShowWithdraw] = useState(false);

  const { data: principal } = useScaffoldReadContract({
    contractName: "GivvestVault",
    functionName: "principalOf",
    args: [address],
  });

  const { data: donated } = useScaffoldReadContract({
    contractName: "GivvestVault",
    functionName: "donatedBy",
    args: [address],
  });

  const { data: projectedAnnual } = useScaffoldReadContract({
    contractName: "GivvestVault",
    functionName: "projectedAnnualDonation",
    args: [address],
  });

  const { writeContractAsync: writeVault } = useScaffoldWriteContract({ contractName: "GivvestVault" });
  const { writeContractAsync: writeErc20 } = useWriteContract();

  const { data: vaultInfo } = useDeployedContractInfo({ contractName: "GivvestVault" });
  const { data: usdcAddress } = useScaffoldReadContract({ contractName: "GivvestVault", functionName: "usdc" });

  const { data: depositEvents } = useScaffoldEventHistory({
    contractName: "GivvestVault",
    eventName: "Deposited",
    fromBlock: 0n,
    filters: { user: address },
    watch: true,
  });

  const { data: withdrawEvents } = useScaffoldEventHistory({
    contractName: "GivvestVault",
    eventName: "Withdrawn",
    fromBlock: 0n,
    filters: { user: address },
    watch: true,
  });

  const hasDeposit = (principal ?? 0n) > 0n;

  const handleDeposit = async () => {
    if (!depositAmount || Number(depositAmount) <= 0 || !usdcAddress || !vaultInfo?.address) return;
    const amount = parseUnits(depositAmount, USDC_DECIMALS);
    const tid = toast.loading("Step 1/2: Approving USDC…");
    try {
      await writeErc20({
        address: usdcAddress,
        abi: erc20Abi,
        functionName: "approve",
        args: [vaultInfo.address, amount],
      });
      toast.loading("Step 2/2: Depositing…", { id: tid });
      await writeVault({ functionName: "deposit", args: [amount] });
      toast.success(`Deposited $${depositAmount} USDC`, { id: tid });
      setDepositAmount("");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Deposit failed", { id: tid });
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || Number(withdrawAmount) <= 0) return;
    const amount = parseUnits(withdrawAmount, USDC_DECIMALS);
    const tid = toast.loading("Withdrawing…");
    try {
      await writeVault({ functionName: "withdraw", args: [amount] });
      toast.success(`Withdrawn $${withdrawAmount} USDC`, { id: tid });
      setWithdrawAmount("");
      setShowWithdraw(false);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Withdraw failed", { id: tid });
    }
  };

  type ActivityItem = {
    type: "deposit" | "withdrawal";
    amount: bigint;
    timestamp: bigint;
  };

  const activity: ActivityItem[] = [
    ...(depositEvents ?? []).map(e => ({
      type: "deposit" as const,
      amount: e.args.amount ?? 0n,
      timestamp: e.args.timestamp ?? 0n,
    })),
    ...(withdrawEvents ?? []).map(e => ({
      type: "withdrawal" as const,
      amount: e.args.amount ?? 0n,
      timestamp: e.args.timestamp ?? 0n,
    })),
  ].sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1));

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#faf9f7]">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="max-w-md">
            <h1 className="text-3xl font-bold text-[#1a1a18] mb-3">My Impact</h1>
            <p className="text-[#6b6b62] mb-8 leading-relaxed">
              Connect your wallet to see your stake, track your donations, and deposit USDC to start generating impact.
            </p>
            <RainbowKitCustomConnectButton />

            {/* Benefits preview — visible even without wallet */}
            <div className="mt-16">
              <p className="text-xs font-semibold text-[#3d6b4f] mb-6 tracking-widest uppercase">Why Givvest</p>
              <div className="space-y-4">
                {BENEFITS.map(b => (
                  <div key={b.title} className="flex gap-4 bg-white border border-[#e8e6e0] rounded-lg p-5">
                    <span className="text-2xl shrink-0">{b.icon}</span>
                    <div>
                      <p className="font-semibold text-[#1a1a18] mb-1">{b.title}</p>
                      <p className="text-sm text-[#6b6b62] leading-relaxed">{b.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-[#1a1a18] mb-2">My Impact</h1>
        <p className="text-[#6b6b62] mb-12">Your stake and the donations it generates — live from the blockchain.</p>

        {!hasDeposit ? (
          /* ── First deposit ── */
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <div className="bg-white border border-[#e8e6e0] rounded-lg p-8 mb-6">
                <p className="text-sm text-[#6b6b62] mb-1">Your current stake</p>
                <p className="text-4xl font-bold text-[#1a1a18] tabular-nums money mb-1">$0.00</p>
                <p className="text-xs text-[#6b6b62] mb-6">No deposits yet</p>

                <h3 className="font-semibold text-[#1a1a18] mb-1 text-sm">Make your first deposit</h3>
                <p className="text-xs text-[#6b6b62] mb-4 leading-relaxed">
                  You&rsquo;ll need to approve USDC spending first, then deposit. Both steps happen in your wallet.
                </p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b6b62] text-sm pointer-events-none">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={depositAmount}
                      onChange={e => setDepositAmount(e.target.value)}
                      className="w-full pl-7 pr-3 py-2.5 border border-[#e8e6e0] rounded-md text-sm bg-[#faf9f7] focus:outline-none focus:border-[#3d6b4f] transition-colors"
                      min="0"
                      step="1"
                    />
                  </div>
                  <button
                    onClick={handleDeposit}
                    disabled={!depositAmount || Number(depositAmount) <= 0}
                    className="px-5 py-2.5 bg-[#3d6b4f] text-white text-sm font-semibold rounded-md hover:bg-[#4a8060] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Deposit
                  </button>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div>
              <p className="text-xs font-semibold text-[#3d6b4f] mb-4 tracking-widest uppercase">Why Givvest</p>
              <div className="space-y-4">
                {BENEFITS.map(b => (
                  <div key={b.title} className="flex gap-4 bg-white border border-[#e8e6e0] rounded-lg p-5">
                    <span className="text-2xl shrink-0">{b.icon}</span>
                    <div>
                      <p className="font-semibold text-[#1a1a18] mb-1">{b.title}</p>
                      <p className="text-sm text-[#6b6b62] leading-relaxed">{b.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ── Active depositor ── */
          <>
            {/* Position */}
            <div className="grid sm:grid-cols-3 gap-6 mb-10">
              <div className="bg-white border border-[#e8e6e0] rounded-lg p-6">
                <p className="text-xs text-[#6b6b62] uppercase tracking-widest mb-2">Your stake</p>
                <p className="text-3xl font-bold text-[#1a1a18] tabular-nums money">${fmt(principal)}</p>
                <p className="text-xs text-[#6b6b62] mt-1">Always 100% withdrawable</p>
              </div>
              <div className="bg-white border border-[#3d6b4f]/25 rounded-lg p-6">
                <p className="text-xs text-[#3d6b4f] uppercase tracking-widest mb-2">Donated so far</p>
                <p className="text-3xl font-bold text-[#3d6b4f] tabular-nums money">${fmt(donated)}</p>
                <p className="text-xs text-[#6b6b62] mt-1">Generated by your deposit</p>
              </div>
              <div className="bg-white border border-[#e8e6e0] rounded-lg p-6">
                <p className="text-xs text-[#6b6b62] uppercase tracking-widest mb-2">Annual donation rate</p>
                <p className="text-3xl font-bold text-[#1a1a18] tabular-nums money">${fmt(projectedAnnual)}</p>
                <p className="text-xs text-[#6b6b62] mt-1">At current yield</p>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white border border-[#e8e6e0] rounded-lg p-8 mb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-[#1a1a18]">Manage your deposit</h2>
                <button
                  onClick={() => setShowWithdraw(v => !v)}
                  className="text-xs text-[#6b6b62] hover:text-[#1a1a18] underline transition-colors"
                >
                  {showWithdraw ? "Add instead" : "Withdraw instead"}
                </button>
              </div>

              {!showWithdraw ? (
                <>
                  <p className="text-xs text-[#6b6b62] mb-3 leading-relaxed">
                    Add more USDC to increase your donation rate. You&rsquo;ll approve the amount in your wallet first.
                  </p>
                  <div className="flex gap-2 max-w-sm">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b6b62] text-sm pointer-events-none">
                        $
                      </span>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={depositAmount}
                        onChange={e => setDepositAmount(e.target.value)}
                        className="w-full pl-7 pr-3 py-2.5 border border-[#e8e6e0] rounded-md text-sm bg-[#faf9f7] focus:outline-none focus:border-[#3d6b4f] transition-colors"
                        min="0"
                        step="1"
                      />
                    </div>
                    <button
                      onClick={handleDeposit}
                      disabled={!depositAmount || Number(depositAmount) <= 0}
                      className="px-5 py-2.5 bg-[#3d6b4f] text-white text-sm font-semibold rounded-md hover:bg-[#4a8060] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Add donation
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-xs text-[#6b6b62] mb-3 leading-relaxed">
                    Available to withdraw:{" "}
                    <span className="font-semibold text-[#1a1a18] tabular-nums">${fmt(principal)}</span>. Your donated
                    interest stays with charity — you receive your original deposit back.
                  </p>
                  <div className="flex gap-2 max-w-sm">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b6b62] text-sm pointer-events-none">
                        $
                      </span>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={withdrawAmount}
                        onChange={e => setWithdrawAmount(e.target.value)}
                        className="w-full pl-7 pr-3 py-2.5 border border-[#e8e6e0] rounded-md text-sm bg-[#faf9f7] focus:outline-none focus:border-[#3d6b4f] transition-colors"
                        min="0"
                        step="1"
                      />
                    </div>
                    <button
                      onClick={() => principal && setWithdrawAmount(formatUnits(principal, USDC_DECIMALS))}
                      className="px-3 py-2.5 border border-[#e8e6e0] text-[#6b6b62] text-xs rounded-md hover:border-[#1a1a18] hover:text-[#1a1a18] transition-colors"
                    >
                      Max
                    </button>
                    <button
                      onClick={handleWithdraw}
                      disabled={!withdrawAmount || !principal || principal === 0n}
                      className="px-5 py-2.5 border border-[#1a1a18] text-[#1a1a18] text-sm font-semibold rounded-md hover:bg-[#1a1a18] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Withdraw
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Activity log */}
            <div>
              <h2 className="font-semibold text-[#1a1a18] mb-4">Activity log</h2>
              {activity.length === 0 ? (
                <p className="text-sm text-[#6b6b62]">No activity yet.</p>
              ) : (
                <div className="bg-white border border-[#e8e6e0] rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="border-b border-[#e8e6e0]">
                      <tr>
                        <th className="text-left px-6 py-3 text-xs text-[#6b6b62] uppercase tracking-widest font-medium">
                          Type
                        </th>
                        <th className="text-right px-6 py-3 text-xs text-[#6b6b62] uppercase tracking-widest font-medium">
                          Amount
                        </th>
                        <th className="text-right px-6 py-3 text-xs text-[#6b6b62] uppercase tracking-widest font-medium">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {activity.map((item, i) => (
                        <tr key={i} className="border-b border-[#e8e6e0] last:border-0">
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${
                                item.type === "deposit" ? "bg-[#f4f8f5] text-[#3d6b4f]" : "bg-[#f4f2ed] text-[#6b6b62]"
                              }`}
                            >
                              {item.type === "deposit" ? "Deposit" : "Withdrawal"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-medium text-[#1a1a18] tabular-nums money">
                            ${fmt(item.amount)}
                          </td>
                          <td className="px-6 py-4 text-right text-[#6b6b62]">
                            {item.timestamp > 0n ? fmtDate(item.timestamp) : "Pending"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* Learn more */}
        <div className="mt-16 pt-10 border-t border-[#e8e6e0]">
          <p className="text-sm text-[#6b6b62]">
            Want to understand exactly how this works?{" "}
            <Link href="/about" className="text-[#3d6b4f] hover:underline font-medium">
              Read the full explanation &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
