// Trinity PCE — Sips Feed + Form
// Write a sip. Read historical sips. x⁰ = 1

import { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { TRINITY_ABI, SipType } from "../config/abi";
import type { SipTypeValue } from "../config/abi";
import { TRINITY_CONTRACT } from "../config/constants";
import { useSips } from "../hooks/useSips";
import type { SipEvent } from "../hooks/useSips";
import "./SipsFeed.css";

const SIP_LABELS: Record<number, string> = {
  [SipType.DonutBite]: "DonutBite",
  [SipType.BiteGPS]: "BiteGPS",
  [SipType.BiteDate]: "BiteDate",
  [SipType.BitePast]: "BitePast",
  [SipType.BitePrice]: "BitePrice",
};

function formatAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function formatTimestamp(ts: bigint): string {
  const date = new Date(Number(ts) * 1000);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function SipCard({ sip }: { sip: SipEvent }) {
  return (
    <div className="sip-card">
      <div className="sip-header">
        <span className="sip-type">
          [{SIP_LABELS[sip.sipType] ?? "Unknown"}]
        </span>
        <span className="sip-time">{formatTimestamp(sip.timestamp)}</span>
      </div>
      <div className="sip-sender">from {formatAddress(sip.sender)}</div>

      <div className="sip-user-message">» {sip.userMessage}</div>
      <div className="sip-response">← {sip.systemResponse}</div>

      <a
        href={`https://basescan.org/tx/${sip.txHash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="sip-tx"
      >
        view on-chain ↗
      </a>
    </div>
  );
}

export function SipsFeed() {
  const { isConnected } = useAccount();
  const { sips, isLoading, isError, refetch } = useSips();

  const [selectedType, setSelectedType] = useState<SipTypeValue>(
    SipType.DonutBite,
  );
  const [message, setMessage] = useState("");

  const { writeContract, data: txHash, isPending, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  function handleSubmit() {
    if (!message.trim()) return;
    writeContract({
      address: TRINITY_CONTRACT,
      abi: TRINITY_ABI,
      functionName: "writeSip",
      args: [selectedType, message],
    });
  }

  // Clear form on success
  if (isSuccess && message) {
    setMessage("");
    reset();
    refetch();
  }

  return (
    <section className="sips-section">
      <h2 className="section-title">
        ▓ SIPS FEED <span className="count">[{sips.length}]</span>
      </h2>

      {/* ─── Write Sip Form ─────────────────────────────────── */}
      {isConnected ? (
        <div className="sip-form">
          <div className="sip-form-label">WRITE A SIP</div>

          <select
            className="sip-select"
            value={selectedType}
            onChange={(e) =>
              setSelectedType(Number(e.target.value) as SipTypeValue)
            }
            disabled={isPending || isConfirming}
          >
            {Object.entries(SIP_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <textarea
            className="sip-textarea"
            placeholder="Your message to the Tangible Zero..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={500}
            disabled={isPending || isConfirming}
          />

          <div className="sip-form-footer">
            <span className="char-count">{message.length}/500</span>
            <button
              className="sip-submit"
              onClick={handleSubmit}
              disabled={!message.trim() || isPending || isConfirming}
            >
              {isPending
                ? "Confirm in wallet..."
                : isConfirming
                  ? "Etching on-chain..."
                  : "→ Write Sip (gas only)"}
            </button>
          </div>
        </div>
      ) : (
        <div className="sip-form-disabled">Connect wallet to write a sip.</div>
      )}

      {/* ─── History ────────────────────────────────────────── */}
      {isLoading ? (
        <p className="sips-loading">Scanning Base mainnet history...</p>
      ) : isError ? (
        <div className="sips-error">
          <p>Could not load sip history.</p>
          <button className="refresh-btn" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      ) : sips.length === 0 ? (
        <div className="sips-empty">
          <p>No sips yet.</p>
          <p className="axiom-small">The Tangible Zero awaits your message.</p>
        </div>
      ) : (
        <div className="sips-list">
          {sips.map((sip) => (
            <SipCard key={`${sip.txHash}-${sip.timestamp}`} sip={sip} />
          ))}
        </div>
      )}
    </section>
  );
}
