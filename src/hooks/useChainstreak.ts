"use client";

import {
  useAccount, useReadContract, useReadContracts, useWriteContract,
  useWaitForTransactionReceipt, useChainId,
} from "wagmi";
import { useEffect } from "react";
import { CHAINSTREAK_ABI } from "@/lib/abi";
import { getContractAddress } from "@/lib/addresses";

export type Tier = 0 | 1 | 2 | 3;

export const TIER_COLOR: Record<Tier, string> = {
  0: "#E8E8E8",
  1: "#4FA3FF",
  2: "#C0C0C0",
  3: "#FFD700",
};

export const TIER_NAME: Record<Tier, string> = {
  0: "WHITE",
  1: "BLUE",
  2: "SILVER",
  3: "GOLD",
};

export const TIER_THRESHOLD = [0, 10, 50, 100];

// How many recent days to fetch for the activity heatmap
const HEATMAP_DAYS = 28;

export function useChainstreak() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const contractAddress = getContractAddress(chainId) ?? undefined;
  const enabled = isConnected && !!address && !!contractAddress;

  // ── Primary streak data ───────────────────────────────────────────────────
  const {
    data: streakData,
    isLoading: isStreakLoading,
    refetch: refetchStreak,
  } = useReadContract({
    address: contractAddress,
    abi: CHAINSTREAK_ABI,
    functionName: "streakOf",
    args: address ? [address] : undefined,
    query: { enabled, refetchInterval: 30_000 },
  });

  const { data: tierRaw } = useReadContract({
    address: contractAddress,
    abi: CHAINSTREAK_ABI,
    functionName: "tierOf",
    args: address ? [address] : undefined,
    query: { enabled },
  });

  const { data: consistencyRaw } = useReadContract({
    address: contractAddress,
    abi: CHAINSTREAK_ABI,
    functionName: "consistencyOf",
    args: address ? [address] : undefined,
    query: { enabled },
  });

  const { data: totalSupplyRaw } = useReadContract({
    address: contractAddress,
    abi: CHAINSTREAK_ABI,
    functionName: "totalSupply",
    query: { enabled: !!contractAddress },
  });

  // ── Recent activity for heatmap (28 days) ────────────────────────────────
  const { data: recentActivityRaw, refetch: refetchActivity } = useReadContract({
    address: contractAddress,
    abi: CHAINSTREAK_ABI,
    functionName: "recentActivity",
    args: address ? [address, BigInt(HEATMAP_DAYS)] : undefined,
    query: { enabled, refetchInterval: 60_000 },
  });

  // ── Write: checkIn ────────────────────────────────────────────────────────
  const {
    writeContract,
    data: txHash,
    isPending: isTxPending,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({ hash: txHash });

  // Refetch after confirmation
  useEffect(() => {
    if (isConfirmed) {
      refetchStreak();
      refetchActivity();
    }
  }, [isConfirmed, refetchStreak, refetchActivity]);

  // ── Derived values ────────────────────────────────────────────────────────
  const tokenId         = streakData?.[0] ?? 0n;
  const firstCheckIn    = streakData?.[1] ?? 0;
  const lastCheckIn     = streakData?.[2] ?? 0;
  const currentStreak   = Number(streakData?.[3] ?? 0);
  const highestStreak   = Number(streakData?.[4] ?? 0);
  const totalActiveDays = Number(streakData?.[5] ?? 0);
  const tier            = (tierRaw ?? 0) as Tier;
  const consistency     = Number(consistencyRaw ?? 0);
  const totalSupply     = Number(totalSupplyRaw ?? 0);
  const isMinted        = tokenId > 0n;

  // Has the wallet already checked in today (UTC)?
  const todayUtcSeconds = Math.floor(Date.now() / 86_400_000) * 86_400;
  const hasCheckedInToday = Number(lastCheckIn) >= todayUtcSeconds;

  const firstDate = firstCheckIn > 0
    ? new Date(Number(firstCheckIn) * 1000).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      })
    : null;

  // Progress to next tier (0–100)
  const nextThreshold = TIER_THRESHOLD[Math.min(tier + 1, 3)];
  const prevThreshold = TIER_THRESHOLD[tier];
  const tierProgress = tier === 3
    ? 100
    : Math.min(100, Math.round(((highestStreak - prevThreshold) / (nextThreshold - prevThreshold)) * 100));

  // Activity heatmap: array of 28 booleans, index 0 = today
  // Falls back to all-false if data not yet loaded
  const activityHeatmap: boolean[] = Array.from(
    { length: HEATMAP_DAYS },
    (_, i) => recentActivityRaw?.[i] ?? false
  );

  function checkIn() {
    if (!contractAddress) return;
    writeContract({
      address: contractAddress,
      abi: CHAINSTREAK_ABI,
      functionName: "checkIn",
    });
  }

  return {
    address, isConnected, chainId, contractAddress,
    isMinted, hasCheckedInToday,
    tokenId, firstDate,
    currentStreak, highestStreak, totalActiveDays,
    tier, tierColor: TIER_COLOR[tier], tierName: TIER_NAME[tier], tierProgress,
    consistency,
    totalSupply,
    activityHeatmap,
    isStreakLoading, isTxPending, isConfirming, isConfirmed,
    writeError, checkIn, refetchStreak, resetWrite,
  };
}
