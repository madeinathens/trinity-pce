// Trinity PCE — User's DONUTBNK NFTs Hook
// Scans Transfer events to determine current ownership.
// Respects free will: no enumerable registry, users present themselves.
//
// Rate-limit strategy:
//   - 200ms delay between chunks (respects public RPC limits)
//   - Exponential backoff retry on 429 errors
//   - Progress state for UX feedback

import { useEffect, useState, useCallback } from "react";
import { useAccount, usePublicClient, useReadContract } from "wagmi";
import { ERC721_ABI } from "../config/abi";
import { DONUTBNK_NFT, DONUTBNK_GENESIS_BLOCK } from "../config/constants";

export interface UserNFTs {
  tokenIds: bigint[];
  balance: bigint;
  isLoading: boolean;
  isError: boolean;
  progress: { current: number; total: number };
  refetch: () => void;
}

// Sleep helper for throttling + retries
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Retry with exponential backoff on rate-limit errors
async function retryOn429<T>(
  fn: () => Promise<T>,
  maxAttempts = 5,
  baseDelayMs = 500,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      lastError = err;
      const message = err instanceof Error ? err.message.toLowerCase() : "";
      const isRateLimit =
        message.includes("rate limit") ||
        message.includes("429") ||
        message.includes("too many requests");

      if (!isRateLimit || attempt === maxAttempts - 1) {
        throw err;
      }

      const waitMs = baseDelayMs * Math.pow(2, attempt); // 500, 1000, 2000, 4000, 8000
      console.warn(
        `RPC rate-limited. Retrying in ${waitMs}ms (attempt ${attempt + 1}/${maxAttempts})`,
      );
      await sleep(waitMs);
    }
  }
  throw lastError;
}

export function useUserNFTs(): UserNFTs {
  const { address, isConnected } = useAccount();
  const client = usePublicClient();

  const [tokenIds, setTokenIds] = useState<bigint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  // Quick balance check (1 RPC call)
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: DONUTBNK_NFT,
    abi: ERC721_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: isConnected && !!address },
  });

  const scanOwnership = useCallback(async () => {
    if (!client || !address || !isConnected) {
      setTokenIds([]);
      setProgress({ current: 0, total: 0 });
      return;
    }

    // Wait for balance to be fetched
    if (balance === undefined) return;

    if (balance === 0n) {
      setTokenIds([]);
      return;
    }

    setIsLoading(true);
    setIsError(false);

    try {
      const currentBlock = await retryOn429(() => client.getBlockNumber());
      const CHUNK = 9500n;
      const DELAY_MS = 200; // polite throttle

      // Calculate total chunks for progress tracking
      const totalBlocks = currentBlock - DONUTBNK_GENESIS_BLOCK;
      const totalChunks = Number(totalBlocks / (CHUNK + 1n)) + 1;
      setProgress({ current: 0, total: totalChunks });

      const receivedTokens = new Map<string, number>();
      const sentTokens = new Map<string, number>();

      let chunkIndex = 0;
      for (
        let from = DONUTBNK_GENESIS_BLOCK;
        from <= currentBlock;
        from += CHUNK + 1n
      ) {
        const to = from + CHUNK > currentBlock ? currentBlock : from + CHUNK;

        // Throttle: wait between chunks (except first)
        if (chunkIndex > 0) {
          await sleep(DELAY_MS);
        }

        // Query 1: Transfers TO user
        const receivedLogs = await retryOn429(() =>
          client.getContractEvents({
            address: DONUTBNK_NFT,
            abi: ERC721_ABI,
            eventName: "Transfer",
            args: { to: address },
            fromBlock: from,
            toBlock: to,
          }),
        );

        for (const log of receivedLogs) {
          const tokenId = log.args.tokenId?.toString() ?? "";
          if (tokenId) {
            receivedTokens.set(tokenId, (receivedTokens.get(tokenId) ?? 0) + 1);
          }
        }

        // Small gap between paired queries
        await sleep(DELAY_MS);

        // Query 2: Transfers FROM user
        const sentLogs = await retryOn429(() =>
          client.getContractEvents({
            address: DONUTBNK_NFT,
            abi: ERC721_ABI,
            eventName: "Transfer",
            args: { from: address },
            fromBlock: from,
            toBlock: to,
          }),
        );

        for (const log of sentLogs) {
          const tokenId = log.args.tokenId?.toString() ?? "";
          if (tokenId) {
            sentTokens.set(tokenId, (sentTokens.get(tokenId) ?? 0) + 1);
          }
        }

        chunkIndex++;
        setProgress({ current: chunkIndex, total: totalChunks });
      }

      // Calculate net ownership: received > sent means still owns
      const owned: bigint[] = [];
      for (const [tokenId, recvCount] of receivedTokens.entries()) {
        const sentCount = sentTokens.get(tokenId) ?? 0;
        if (recvCount > sentCount) {
          owned.push(BigInt(tokenId));
        }
      }

      owned.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
      setTokenIds(owned);
    } catch (err) {
      console.error("Error scanning user NFTs:", err);
      setIsError(true);
      setTokenIds([]);
    } finally {
      setIsLoading(false);
    }
  }, [client, address, balance, isConnected]);

  useEffect(() => {
    const run = async () => {
      await Promise.resolve();
      await scanOwnership();
    };

    void run();
  }, [address, isConnected, balance, scanOwnership]);

  function refetch() {
    refetchBalance();
  }

  return {
    tokenIds,
    balance: balance ?? 0n,
    isLoading,
    isError,
    progress,
    refetch,
  };
}
