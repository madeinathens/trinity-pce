// Trinity PCE — Contract Assets Hook
// Reads USDC balance, OWNER_COIN pool, reward info in a single batch.

import { useReadContracts } from "wagmi";
import { TRINITY_ABI } from "../config/abi";
import { TRINITY_CONTRACT } from "../config/constants";

export function useContractAssets() {
  const { data, isLoading, isError, refetch } = useReadContracts({
    contracts: [
      {
        address: TRINITY_CONTRACT,
        abi: TRINITY_ABI,
        functionName: "usdcBalance",
      },
      {
        address: TRINITY_CONTRACT,
        abi: TRINITY_ABI,
        functionName: "ownerCoinPoolBalance",
      },
      {
        address: TRINITY_CONTRACT,
        abi: TRINITY_ABI,
        functionName: "remainingRewards",
      },
      {
        address: TRINITY_CONTRACT,
        abi: TRINITY_ABI,
        functionName: "REWARD_AMOUNT",
      },
    ],
  });

  return {
    usdcBalance: (data?.[0]?.result ?? 0n) as bigint,
    ownerCoinPool: (data?.[1]?.result ?? 0n) as bigint,
    remainingRewards: (data?.[2]?.result ?? 0n) as bigint,
    rewardAmount: (data?.[3]?.result ?? 0n) as bigint,
    isLoading,
    isError,
    refetch,
  };
}
