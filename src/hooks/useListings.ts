// Trinity PCE — Listings Hook
// Reads active listings from the contract on Base mainnet.

import { useReadContract } from "wagmi";
import { TRINITY_ABI } from "../config/abi";
import { TRINITY_CONTRACT } from "../config/constants";

export interface Listing {
  holder: `0x${string}`;
  tokenId: bigint;
  depositTime: bigint;
  listedPrice: bigint;
  active: boolean;
}

export function useListings() {
  const { data, isLoading, isError, refetch } = useReadContract({
    address: TRINITY_CONTRACT,
    abi: TRINITY_ABI,
    functionName: "getActiveListings",
  });

  return {
    listings: (data ?? []) as Listing[],
    isLoading,
    isError,
    refetch,
  };
}

export function useTotalListings() {
  const { data, isLoading } = useReadContract({
    address: TRINITY_CONTRACT,
    abi: TRINITY_ABI,
    functionName: "totalActiveListings",
  });

  return {
    total: data ? Number(data) : 0,
    isLoading,
  };
}
