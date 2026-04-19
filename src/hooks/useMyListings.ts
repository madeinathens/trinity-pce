// Trinity PCE — My Listings Hook
// Filters active listings to show only those belonging to the current user.

import { useReadContract, useAccount } from "wagmi";
import { TRINITY_ABI } from "../config/abi";
import { TRINITY_CONTRACT } from "../config/constants";

export interface Listing {
  holder: `0x${string}`;
  tokenId: bigint;
  depositTime: bigint;
  listedPrice: bigint;
  active: boolean;
}

export function useMyListings() {
  const { address, isConnected } = useAccount();

  const { data, isLoading, isError, refetch } = useReadContract({
    address: TRINITY_CONTRACT,
    abi: TRINITY_ABI,
    functionName: "getActiveListings",
    query: {
      enabled: isConnected,
      refetchInterval: 10_000, // refresh every 10s
    },
  });

  const allListings = (data ?? []) as Listing[];

  const myListings = address
    ? allListings.filter(
        (l) => l.holder.toLowerCase() === address.toLowerCase(),
      )
    : [];

  return {
    myListings,
    isLoading,
    isError,
    refetch,
  };
}
