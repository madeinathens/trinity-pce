// Trinity PCE — Set Price Panel (My Listings)
// Shows the user's deposited NFTs with:
//   - Countdown timers (grace 48h, max hold 7d)
//   - Status badges (GRACE / LIVE / EXPIRED)
//   - Price input (set or update)
//   - Withdraw button (if within grace period)

import { useState, useEffect } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { TRINITY_ABI } from "../config/abi";
import { TRINITY_CONTRACT } from "../config/constants";
import { useMyListings } from "../hooks/useMyListings";
import type { Listing } from "../hooks/useMyListings";
import "./SetPricePanel.css";

// Constants matching the contract
const GRACE_PERIOD_SEC = 48n * 3600n; // 48 hours
const MAX_HOLD_SEC = 7n * 24n * 3600n; // 7 days
const FLOOR_PRICE_USDC = 3.3;

// ─── Utility: Format USDC (6 decimals) ──────────────────────────────
function formatUSDC(raw: bigint): string {
  return (Number(raw) / 1_000_000).toFixed(2);
}

function parseUSDCToRaw(input: string): bigint | null {
  const num = parseFloat(input);
  if (isNaN(num) || num < FLOOR_PRICE_USDC) return null;
  return BigInt(Math.round(num * 1_000_000));
}

// ─── Utility: Format countdown (seconds → Xd Yh Zm Ws) ──────────────
function formatCountdown(seconds: bigint): string {
  if (seconds <= 0n) return "expired";
  const s = Number(seconds);
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const secs = s % 60;

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
}

// ─── Single listing card ────────────────────────────────────────────
function ListingCard({
  listing,
  onActionComplete,
}: {
  listing: Listing;
  onActionComplete: () => void;
}) {
  const [now, setNow] = useState(() => BigInt(Math.floor(Date.now() / 1000)));
  const [priceInput, setPriceInput] = useState("");

  // Tick every second for countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(BigInt(Math.floor(Date.now() / 1000)));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const graceExpiresAt = listing.depositTime + GRACE_PERIOD_SEC;
  const holdExpiresAt = listing.depositTime + MAX_HOLD_SEC;

  const inGrace = now <= graceExpiresAt;
  const expired = now > holdExpiresAt;
  const hasPrice = listing.listedPrice > 0n;

  const timeUntilGraceEnds = graceExpiresAt > now ? graceExpiresAt - now : 0n;
  const timeUntilForceBuy = holdExpiresAt > now ? holdExpiresAt - now : 0n;

  // ─── Set/Update price transaction ──────────────────────────────────
  const {
    writeContract: writePrice,
    data: priceTxHash,
    isPending: isPricePending,
    reset: resetPrice,
  } = useWriteContract();

  const { isLoading: isPriceConfirming, isSuccess: isPriceSuccess } =
    useWaitForTransactionReceipt({ hash: priceTxHash });

  useEffect(() => {
    if (isPriceSuccess) {
      resetPrice();
      onActionComplete();
    }
  }, [isPriceSuccess, resetPrice, onActionComplete]);

  // ─── Withdraw transaction ──────────────────────────────────────────
  const {
    writeContract: writeWithdraw,
    data: withdrawTxHash,
    isPending: isWithdrawPending,
    reset: resetWithdraw,
  } = useWriteContract();

  const { isLoading: isWithdrawConfirming, isSuccess: isWithdrawSuccess } =
    useWaitForTransactionReceipt({ hash: withdrawTxHash });

  useEffect(() => {
    if (isWithdrawSuccess) {
      resetWithdraw();
      onActionComplete();
    }
  }, [isWithdrawSuccess, resetWithdraw, onActionComplete]);

  function handleSetPrice() {
    const rawPrice = parseUSDCToRaw(priceInput);
    if (rawPrice === null) return;
    writePrice({
      address: TRINITY_CONTRACT,
      abi: TRINITY_ABI,
      functionName: "setListingPrice",
      args: [listing.tokenId, rawPrice],
    });
  }

  function handleWithdraw() {
    writeWithdraw({
      address: TRINITY_CONTRACT,
      abi: TRINITY_ABI,
      functionName: "withdrawNFT",
      args: [listing.tokenId],
    });
  }

  const isTxActive =
    isPricePending ||
    isPriceConfirming ||
    isWithdrawPending ||
    isWithdrawConfirming;

  // ─── Status badge logic ────────────────────────────────────────────
  let statusBadge: { label: string; className: string };
  if (expired) {
    statusBadge = {
      label: "EXPIRED · FORCE-BUYABLE",
      className: "badge-expired",
    };
  } else if (inGrace) {
    statusBadge = { label: "GRACE PERIOD", className: "badge-grace" };
  } else {
    statusBadge = { label: "LIVE · LOCKED", className: "badge-live" };
  }

  // ─── Render ────────────────────────────────────────────────────────
  return (
    <div className="listing-card">
      <div className="listing-header">
        <span className="listing-id">#{listing.tokenId.toString()}</span>
        <span className={`listing-badge ${statusBadge.className}`}>
          {statusBadge.label}
        </span>
      </div>

      {/* ─── Price Display ─────────────────────────────────────────── */}
      <div className="listing-price">
        {hasPrice ? (
          <>
            <span className="price-label">Listed at</span>
            <span className="price-value">
              {formatUSDC(listing.listedPrice)} USDC
            </span>
          </>
        ) : (
          <>
            <span className="price-label">Not priced yet</span>
            <span className="price-value dimmed">— USDC</span>
          </>
        )}
      </div>

      {/* ─── Timers ────────────────────────────────────────────────── */}
      <div className="listing-timers">
        {inGrace && (
          <div className="timer-row">
            <span className="timer-label">Grace ends in:</span>
            <span className="timer-value">
              {formatCountdown(timeUntilGraceEnds)}
            </span>
          </div>
        )}
        {!expired && (
          <div className="timer-row">
            <span className="timer-label">Force-buy in:</span>
            <span className="timer-value">
              {formatCountdown(timeUntilForceBuy)}
            </span>
          </div>
        )}
        {expired && (
          <div className="timer-row">
            <span className="timer-label expired">
              Anyone can buy at{" "}
              {hasPrice ? formatUSDC(listing.listedPrice) : "3.30"} USDC
            </span>
          </div>
        )}
      </div>

      {/* ─── Price Action (if not expired) ─────────────────────────── */}
      {!expired && (
        <div className="listing-actions">
          <div className="price-input-row">
            <input
              type="number"
              className="price-input"
              placeholder={hasPrice ? "New price" : "Price (min 3.30)"}
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              step="0.10"
              min="3.30"
              disabled={isTxActive}
            />
            <span className="price-unit">USDC</span>
            <button
              className="action-btn small"
              onClick={handleSetPrice}
              disabled={isTxActive || parseUSDCToRaw(priceInput) === null}
            >
              {isPricePending
                ? "Confirm..."
                : isPriceConfirming
                  ? "Setting..."
                  : hasPrice
                    ? "Update"
                    : "Set"}
            </button>
          </div>

          {/* ─── Withdraw (grace period only) ─────────────────────── */}
          {inGrace && (
            <button
              className="action-btn withdraw"
              onClick={handleWithdraw}
              disabled={isTxActive}
            >
              {isWithdrawPending
                ? "Confirm withdraw..."
                : isWithdrawConfirming
                  ? "Withdrawing..."
                  : "↶ Withdraw NFT"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main panel ─────────────────────────────────────────────────────
export function SetPricePanel() {
  const { isConnected } = useAccount();
  const { myListings, isLoading, isError, refetch } = useMyListings();

  if (!isConnected) {
    return null; // Don't show section if not connected
  }

  if (isLoading && myListings.length === 0) {
    return (
      <section className="myprice-section">
        <h2 className="section-title">▓ MY LISTINGS</h2>
        <div className="myprice-loading">
          Loading your listings from chain...
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="myprice-section">
        <h2 className="section-title">▓ MY LISTINGS</h2>
        <div className="myprice-error">
          <p>Could not load your listings.</p>
          <button className="retry-btn" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      </section>
    );
  }

  if (myListings.length === 0) {
    return null; // Don't clutter UI if user has no listings
  }

  return (
    <section className="myprice-section">
      <h2 className="section-title">
        ▓ MY LISTINGS <span className="count">[{myListings.length}]</span>
      </h2>

      <p className="myprice-intro">
        Your deposited NFTs. Set a price within 48h (grace period). After 7
        days, anyone can force-buy.
      </p>

      <div className="listings-stack">
        {myListings.map((listing) => (
          <ListingCard
            key={listing.tokenId.toString()}
            listing={listing}
            onActionComplete={() => refetch()}
          />
        ))}
      </div>
    </section>
  );
}
