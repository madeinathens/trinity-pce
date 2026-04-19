// Trinity PCE — Buy Button
// Handles USDC approval + buyNFT() flow with front-run protection.
// Shows appropriate state based on:
//   - Wallet connection
//   - Ownership (can't buy your own listing)
//   - USDC balance
//   - USDC allowance to Trinity
//   - Transaction progress

import { useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { TRINITY_ABI, ERC20_ABI } from "../config/abi";
import { TRINITY_CONTRACT, USDC_BASE } from "../config/constants";
import "./BuyButton.css";

interface BuyButtonProps {
  tokenId: bigint;
  seller: `0x${string}`;
  price: bigint; // in USDC raw (6 decimals)
  isExpired: boolean;
  onSuccess?: () => void;
}

function formatUSDC(raw: bigint): string {
  return (Number(raw) / 1_000_000).toFixed(2);
}

export function BuyButton({
  tokenId,
  seller,
  price,
  isExpired,
  onSuccess,
}: BuyButtonProps) {
  const { address, isConnected } = useAccount();

  // ─── USDC balance check ─────────────────────────────────────────────
  const { data: usdcBalance } = useReadContract({
    address: USDC_BASE,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address,
      refetchInterval: 15_000,
    },
  });

  // ─── USDC allowance to Trinity ──────────────────────────────────────
  const { data: usdcAllowance, refetch: refetchAllowance } = useReadContract({
    address: USDC_BASE,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address ? [address, TRINITY_CONTRACT] : undefined,
    query: {
      enabled: isConnected && !!address,
      refetchInterval: 15_000,
    },
  });

  // ─── Transactions ───────────────────────────────────────────────────
  const {
    writeContract: writeApprove,
    data: approveTxHash,
    isPending: isApprovePending,
    reset: resetApprove,
  } = useWriteContract();

  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } =
    useWaitForTransactionReceipt({ hash: approveTxHash });

  const {
    writeContract: writeBuy,
    data: buyTxHash,
    isPending: isBuyPending,
    reset: resetBuy,
  } = useWriteContract();

  const { isLoading: isBuyConfirming, isSuccess: isBuySuccess } =
    useWaitForTransactionReceipt({ hash: buyTxHash });

  // ─── Post-success cleanup ───────────────────────────────────────────
  useEffect(() => {
    if (isApproveSuccess) {
      resetApprove();
      refetchAllowance();
    }
  }, [isApproveSuccess, resetApprove, refetchAllowance]);

  useEffect(() => {
    if (isBuySuccess) {
      resetBuy();
      onSuccess?.();
    }
  }, [isBuySuccess, resetBuy, onSuccess]);

  // ─── Handlers ───────────────────────────────────────────────────────
  function handleApprove() {
    // Approve exact amount (safer than max)
    writeApprove({
      address: USDC_BASE,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [TRINITY_CONTRACT, price],
    });
  }

  function handleBuy() {
    const fn = isExpired ? "buyExpiredNFT" : "buyNFT";
    writeBuy({
      address: TRINITY_CONTRACT,
      abi: TRINITY_ABI,
      functionName: fn,
      args: [tokenId, price],
    });
  }

  // ─── Determine button state ─────────────────────────────────────────
  const isTxActive =
    isApprovePending || isApproveConfirming || isBuyPending || isBuyConfirming;

  // Not connected
  if (!isConnected) {
    return (
      <div className="buy-btn-container">
        <button className="buy-btn disabled" disabled>
          Connect wallet to buy
        </button>
      </div>
    );
  }

  // User is the seller
  const isOwnListing =
    address && seller.toLowerCase() === address.toLowerCase();
  if (isOwnListing) {
    return (
      <div className="buy-btn-container">
        <button className="buy-btn disabled own" disabled>
          This is your listing
        </button>
      </div>
    );
  }

  // Insufficient USDC
  if (usdcBalance !== undefined && usdcBalance < price) {
    return (
      <div className="buy-btn-container">
        <button className="buy-btn disabled insufficient" disabled>
          Insufficient USDC ({formatUSDC(usdcBalance)} / {formatUSDC(price)})
        </button>
      </div>
    );
  }

  // Need approval
  const needsApproval = usdcAllowance !== undefined && usdcAllowance < price;

  if (needsApproval) {
    return (
      <div className="buy-btn-container">
        <button
          className="buy-btn approve"
          onClick={handleApprove}
          disabled={isTxActive}
        >
          {isApprovePending
            ? "Confirm in wallet..."
            : isApproveConfirming
              ? "Approving USDC..."
              : `→ Approve ${formatUSDC(price)} USDC`}
        </button>
        <p className="buy-btn-hint">
          Step 1/2: One-time approval for the Trinity contract.
        </p>
      </div>
    );
  }

  // Ready to buy
  return (
    <div className="buy-btn-container">
      <button
        className={`buy-btn primary ${isExpired ? "expired" : ""}`}
        onClick={handleBuy}
        disabled={isTxActive}
      >
        {isBuyPending
          ? "Confirm in wallet..."
          : isBuyConfirming
            ? isExpired
              ? "Force-buying..."
              : "Buying..."
            : isExpired
              ? `⚡ Force-buy for ${formatUSDC(price)} USDC`
              : `→ Buy for ${formatUSDC(price)} USDC`}
      </button>
      {isBuySuccess && (
        <p className="buy-success">
          ✓ Purchased. NFT + 1.30 OWNER_COIN reward in your wallet.
        </p>
      )}
    </div>
  );
}
