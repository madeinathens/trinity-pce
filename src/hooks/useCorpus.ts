// Trinity PCE — Corpus Hook
// Reads all on-chain axioms and ZKP constants in one batch.
// x⁰ = 1

import { useReadContracts } from "wagmi";
import { TRINITY_ABI } from "../config/abi";
import { TRINITY_CONTRACT } from "../config/constants";

export interface Corpus {
  // Axiom functions
  absoluteTrinityMitoticRelay: string;
  selfEvidentTruth2014: string;
  // ZKP strings
  zkpPhysicalPCE: string;
  zkpPhysicalTreePCE: string;
  zkpPastPresentOnchain: string;
  zkpOnchain: string;
  zeroDisclaimer: string;
  // Genesis markers
  genesisRoot: `0x${string}`;
  genesisTS: bigint;
}

export function useCorpus() {
  const { data, isLoading, isError, refetch } = useReadContracts({
    contracts: [
      {
        address: TRINITY_CONTRACT,
        abi: TRINITY_ABI,
        functionName: "Absolute_Trinity_Mitotic_Relay",
      },
      {
        address: TRINITY_CONTRACT,
        abi: TRINITY_ABI,
        functionName: "Self_Evident_Truth_2014",
      },
      {
        address: TRINITY_CONTRACT,
        abi: TRINITY_ABI,
        functionName: "ZKP_Physical_PCE",
      },
      {
        address: TRINITY_CONTRACT,
        abi: TRINITY_ABI,
        functionName: "ZKP_Physical_TREE_PCE",
      },
      {
        address: TRINITY_CONTRACT,
        abi: TRINITY_ABI,
        functionName: "ZKP_Past_Present_ONCHAIN",
      },
      {
        address: TRINITY_CONTRACT,
        abi: TRINITY_ABI,
        functionName: "ZKP_ONCHAIN",
      },
      {
        address: TRINITY_CONTRACT,
        abi: TRINITY_ABI,
        functionName: "ZERO_DISCLAIMER",
      },
      {
        address: TRINITY_CONTRACT,
        abi: TRINITY_ABI,
        functionName: "GENESIS_ROOT",
      },
      {
        address: TRINITY_CONTRACT,
        abi: TRINITY_ABI,
        functionName: "GENESIS_TS",
      },
    ],
  });

  const corpus: Corpus | null = data
    ? {
        absoluteTrinityMitoticRelay: (data[0]?.result ?? "") as string,
        selfEvidentTruth2014: (data[1]?.result ?? "") as string,
        zkpPhysicalPCE: (data[2]?.result ?? "") as string,
        zkpPhysicalTreePCE: (data[3]?.result ?? "") as string,
        zkpPastPresentOnchain: (data[4]?.result ?? "") as string,
        zkpOnchain: (data[5]?.result ?? "") as string,
        zeroDisclaimer: (data[6]?.result ?? "") as string,
        genesisRoot: (data[7]?.result ?? "0x0") as `0x${string}`,
        genesisTS: (data[8]?.result ?? 0n) as bigint,
      }
    : null;

  return { corpus, isLoading, isError, refetch };
}
