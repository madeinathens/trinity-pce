// Trinity PCE — Sips Hook
// Reads historical SipConsumed events + listens for new ones.

import { useEffect, useState } from "react";
import { usePublicClient, useWatchContractEvent } from "wagmi";
import { TRINITY_ABI } from "../config/abi";
import { TRINITY_CONTRACT, GENESIS_BLOCK } from "../config/constants";

export interface SipEvent {
  sender: `0x${string}`;
  sipType: number;
  userMessage: string;
  systemResponse: string;
  timestamp: bigint;
  blockNumber: bigint;
  txHash: `0x${string}`;
}

export function useSips() {
  const client = usePublicClient();
  const [sips, setSips] = useState<SipEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  async function fetchSips() {
    if (!client) return;
    setIsLoading(true);
    setIsError(false);

    try {
      // Get current block
      const currentBlock = await client.getBlockNumber();

      // Chunk requests into 9,500-block windows (safety under 10k limit)
      const CHUNK = 9500n;
      const allEvents: SipEvent[] = [];

      for (let from = GENESIS_BLOCK; from <= currentBlock; from += CHUNK + 1n) {
        const to = from + CHUNK > currentBlock ? currentBlock : from + CHUNK;

        const logs = await client.getContractEvents({
          address: TRINITY_CONTRACT,
          abi: TRINITY_ABI,
          eventName: "SipConsumed",
          fromBlock: from,
          toBlock: to,
        });

        for (const log of logs) {
          allEvents.push({
            sender: log.args.sender!,
            sipType: Number(log.args.sipType!),
            userMessage: log.args.userMessage!,
            systemResponse: log.args.systemResponse!,
            timestamp: log.args.timestamp!,
            blockNumber: log.blockNumber,
            txHash: log.transactionHash,
          });
        }
      }

      // Newest first
      allEvents.sort((a, b) => Number(b.timestamp - a.timestamp));
      setSips(allEvents);
    } catch (err) {
      console.error("Error fetching sips:", err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      await fetchSips();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  // Listen for new sips in real-time
  useWatchContractEvent({
    address: TRINITY_CONTRACT,
    abi: TRINITY_ABI,
    eventName: "SipConsumed",
    onLogs(logs) {
      const newSips: SipEvent[] = logs.map((log) => ({
        sender: log.args.sender!,
        sipType: Number(log.args.sipType!),
        userMessage: log.args.userMessage!,
        systemResponse: log.args.systemResponse!,
        timestamp: log.args.timestamp!,
        blockNumber: log.blockNumber,
        txHash: log.transactionHash,
      }));
      setSips((prev) => [...newSips, ...prev]);
    },
  });

  return { sips, isLoading, isError, refetch: fetchSips };
}
