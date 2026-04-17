// Trinity PCE — Listings Feed Component
// x⁰ = 1

import { formatUnits } from "viem";
import { useListings } from "../hooks/useListings";
import { USDC_DECIMALS, FLOOR_PRICE_USDC } from "../config/constants";
import type { Listing } from "../hooks/useListings";
import "./ListingsFeed.css";

function formatAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function formatTimeRemaining(depositTime: bigint): string {
  const MAX_HOLD = 7 * 24 * 60 * 60; // 7 days in seconds
  const now = BigInt(Math.floor(Date.now() / 1000));
  const expiry = depositTime + BigInt(MAX_HOLD);
  const remaining = expiry - now;

  if (remaining <= 0n) return "EXPIRED — force-buyable";

  const days = Number(remaining / 86400n);
  const hours = Number((remaining % 86400n) / 3600n);
  const minutes = Number((remaining % 3600n) / 60n);

  if (days > 0) return `${days}d ${hours}h remaining`;
  if (hours > 0) return `${hours}h ${minutes}m remaining`;
  return `${minutes}m remaining`;
}

function getStatus(listing: Listing): { label: string; color: string } {
  const GRACE = 48 * 60 * 60; // 48h
  const MAX_HOLD = 7 * 24 * 60 * 60; // 7d
  const now = BigInt(Math.floor(Date.now() / 1000));
  const age = now - listing.depositTime;

  if (age > BigInt(MAX_HOLD)) return { label: "EXPIRED", color: "#ff4444" };
  if (age <= BigInt(GRACE)) return { label: "GRACE", color: "#ffaa00" };
  return { label: "LIVE", color: "#00ff88" };
}

function ListingCard({ listing }: { listing: Listing }) {
  const price =
    listing.listedPrice > 0n ? listing.listedPrice : FLOOR_PRICE_USDC;
  const priceUSDC = formatUnits(price, USDC_DECIMALS);
  const isFloor = listing.listedPrice === 0n;
  const status = getStatus(listing);

  return (
    <div className="listing-card">
      <div className="listing-header">
        <span className="token-id">#{listing.tokenId.toString()}</span>
        <span
          className="status-badge"
          style={{ color: status.color, borderColor: status.color }}
        >
          {status.label}
        </span>
      </div>

      <div className="listing-row">
        <span className="listing-label">HOLDER</span>
        <span className="listing-value mono">
          {formatAddress(listing.holder)}
        </span>
      </div>

      <div className="listing-row">
        <span className="listing-label">PRICE</span>
        <span className="listing-value">
          {priceUSDC} USDC
          {isFloor && <span className="floor-badge"> (floor)</span>}
        </span>
      </div>

      <div className="listing-row">
        <span className="listing-label">TIME</span>
        <span className="listing-value mono">
          {formatTimeRemaining(listing.depositTime)}
        </span>
      </div>
    </div>
  );
}

export function ListingsFeed() {
  const { listings, isLoading, isError, refetch } = useListings();

  if (isLoading) {
    return (
      <section className="listings-section">
        <h2 className="section-title">▓ ACTIVE LISTINGS</h2>
        <p className="listings-empty">Loading from Base mainnet...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="listings-section">
        <h2 className="section-title">▓ ACTIVE LISTINGS</h2>
        <p className="listings-error">
          Could not fetch listings. Network issue or contract not responding.
        </p>
        <button className="refresh-btn" onClick={() => refetch()}>
          Retry
        </button>
      </section>
    );
  }

  return (
    <section className="listings-section">
      <h2 className="section-title">
        ▓ ACTIVE LISTINGS <span className="count">[{listings.length}]</span>
      </h2>

      {listings.length === 0 ? (
        <div className="listings-empty">
          <p>No active listings at this moment.</p>
          <p className="axiom-small">
            The mitotic ladder awaits instantiation.
          </p>
        </div>
      ) : (
        <div className="listings-grid">
          {listings.map((listing) => (
            <ListingCard key={listing.tokenId.toString()} listing={listing} />
          ))}
        </div>
      )}

      <button className="refresh-btn" onClick={() => refetch()}>
        ↻ Refresh
      </button>
    </section>
  );
}
