// Trinity PCE — Assets Display Component
// x⁰ = 1

import { formatUnits } from "viem";
import { useContractAssets } from "../hooks/useContractAssets";
import { USDC_DECIMALS, OWNER_COIN_DECIMALS } from "../config/constants";
import "./AssetsDisplay.css";

function formatBigInt(
  value: bigint,
  decimals: number,
  maxFractionDigits = 2,
): string {
  const formatted = formatUnits(value, decimals);
  const num = parseFloat(formatted);
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxFractionDigits,
  });
}

export function AssetsDisplay() {
  const {
    usdcBalance,
    ownerCoinPool,
    remainingRewards,
    rewardAmount,
    isLoading,
    isError,
    refetch,
  } = useContractAssets();

  if (isLoading) {
    return (
      <section className="assets-section">
        <h2 className="section-title">▓ CONTRACT ASSETS</h2>
        <p className="assets-loading">Reading from Base mainnet...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="assets-section">
        <h2 className="section-title">▓ CONTRACT ASSETS</h2>
        <p className="assets-error">Could not fetch assets.</p>
        <button className="refresh-btn" onClick={() => refetch()}>
          Retry
        </button>
      </section>
    );
  }

  return (
    <section className="assets-section">
      <h2 className="section-title">▓ CONTRACT ASSETS</h2>

      <div className="assets-grid">
        <div className="asset-tile">
          <div className="asset-label">USDC POOL</div>
          <div className="asset-value">
            <span className="asset-number">
              {formatBigInt(usdcBalance, USDC_DECIMALS)}
            </span>
            <span className="asset-unit">USDC</span>
          </div>
          <div className="asset-hint">Flows through contract per sale</div>
        </div>

        <div className="asset-tile">
          <div className="asset-label">OWNER_COIN POOL</div>
          <div className="asset-value">
            <span className="asset-number">
              {formatBigInt(ownerCoinPool, OWNER_COIN_DECIMALS)}
            </span>
            <span className="asset-unit">OWNER</span>
          </div>
          <div className="asset-hint">Reward reservoir for next buyers</div>
        </div>

        <div className="asset-tile">
          <div className="asset-label">REMAINING REWARDS</div>
          <div className="asset-value">
            <span className="asset-number">{remainingRewards.toString()}</span>
            <span className="asset-unit">buyers</span>
          </div>
          <div className="asset-hint">
            Purchases still funded at current pool
          </div>
        </div>

        <div className="asset-tile">
          <div className="asset-label">REWARD PER PURCHASE</div>
          <div className="asset-value">
            <span className="asset-number">
              {formatBigInt(rewardAmount, OWNER_COIN_DECIMALS)}
            </span>
            <span className="asset-unit">OWNER</span>
          </div>
          <div className="asset-hint">Fixed · x⁰ = 1</div>
        </div>
      </div>

      <button className="refresh-btn" onClick={() => refetch()}>
        ↻ Refresh
      </button>
    </section>
  );
}
