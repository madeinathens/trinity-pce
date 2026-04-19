// Trinity PCE — Deposit Panel
// User selects a DONUTBNK NFT and deposits it into the Trinity contract.
// Two-step flow: approval (once) + deposit (per NFT).

import { useState } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { TRINITY_ABI, ERC721_ABI } from "../config/abi";
import { TRINITY_CONTRACT, DONUTBNK_NFT } from "../config/constants";
import { useUserNFTs } from "../hooks/useUserNFTs";
import "./DepositPanel.css";

export function DepositPanel() {
  const { address, isConnected } = useAccount();
  const { tokenIds, balance, isLoading, isError, progress, refetch } =
    useUserNFTs();

  const [selectedTokenId, setSelectedTokenId] = useState<bigint | null>(null);
  const [txStage, setTxStage] = useState<"idle" | "approving" | "depositing">(
    "idle",
  );

  // ─── Check if user has already approved Trinity contract ───────────
  const { data: isApprovedForAll, refetch: refetchApproval } = useReadContract({
    address: DONUTBNK_NFT,
    abi: ERC721_ABI,
    functionName: "isApprovedForAll",
    args: address ? [address, TRINITY_CONTRACT] : undefined,
    query: { enabled: isConnected && !!address },
  });

  // ─── Write hooks ───────────────────────────────────────────────────
  const {
    writeContract: writeApproval,
    data: approvalTxHash,
    isPending: isApprovalPending,
    reset: resetApproval,
  } = useWriteContract();

  const {
    writeContract: writeDeposit,
    data: depositTxHash,
    isPending: isDepositPending,
    reset: resetDeposit,
  } = useWriteContract();

  // ─── Wait for confirmations ────────────────────────────────────────
  const { isLoading: isApprovalConfirming, isSuccess: isApprovalSuccess } =
    useWaitForTransactionReceipt({ hash: approvalTxHash });

  const { isLoading: isDepositConfirming, isSuccess: isDepositSuccess } =
    useWaitForTransactionReceipt({ hash: depositTxHash });

  // ─── Approval handler ──────────────────────────────────────────────
  function handleApprove() {
    setTxStage("approving");
    writeApproval({
      address: DONUTBNK_NFT,
      abi: ERC721_ABI,
      functionName: "setApprovalForAll",
      args: [TRINITY_CONTRACT, true],
    });
  }

  // ─── Deposit handler ───────────────────────────────────────────────
  function handleDeposit() {
    if (selectedTokenId === null) return;
    setTxStage("depositing");
    writeDeposit({
      address: TRINITY_CONTRACT,
      abi: TRINITY_ABI,
      functionName: "depositNFT",
      args: [selectedTokenId],
    });
  }

  // ─── Post-success cleanup ──────────────────────────────────────────
  if (isApprovalSuccess && txStage === "approving") {
    setTxStage("idle");
    resetApproval();
    refetchApproval();
  }

  if (isDepositSuccess && txStage === "depositing") {
    setTxStage("idle");
    resetDeposit();
    setSelectedTokenId(null);
    refetch(); // refresh NFT list
  }

  // ─── Render guards ─────────────────────────────────────────────────
  if (!isConnected) {
    return (
      <section className="deposit-section">
        <h2 className="section-title">▓ DEPOSIT YOUR DONUTBNK</h2>
        <div className="deposit-disabled">Connect wallet to deposit NFTs.</div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="deposit-section">
        <h2 className="section-title">▓ DEPOSIT YOUR DONUTBNK</h2>
        <div className="deposit-loading">
          <p>Scanning your wallet for DONUTBNK NFTs...</p>
          {progress.total > 0 && (
            <p className="progress-text">
              Chunk {progress.current}/{progress.total} ·{" "}
              {Math.round((progress.current / progress.total) * 100)}%
            </p>
          )}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="deposit-section">
        <h2 className="section-title">▓ DEPOSIT YOUR DONUTBNK</h2>
        <div className="deposit-error">
          <p>Could not scan your NFTs. RPC may be rate-limited.</p>
          <button className="retry-btn" onClick={refetch}>
            Retry
          </button>
        </div>
      </section>
    );
  }

  if (balance === 0n || tokenIds.length === 0) {
    return (
      <section className="deposit-section">
        <h2 className="section-title">▓ DEPOSIT YOUR DONUTBNK</h2>
        <div className="deposit-empty">
          <p>You hold 0 DONUTBNK NFTs.</p>
          <p className="axiom-small">
            Acquire a DONUTBNK first, then return to instantiate the mitotic
            ladder.
          </p>
        </div>
      </section>
    );
  }

  // ─── Main render ───────────────────────────────────────────────────
  const approved = isApprovedForAll === true;
  const canDeposit = approved && selectedTokenId !== null;

  const isApproveDisabled = isApprovalPending || isApprovalConfirming;
  const isDepositDisabled =
    !canDeposit || isDepositPending || isDepositConfirming;

  return (
    <section className="deposit-section">
      <h2 className="section-title">▓ DEPOSIT YOUR DONUTBNK</h2>

      <div className="deposit-intro">
        <p>
          You hold <strong>{tokenIds.length}</strong> DONUTBNK NFTs.
        </p>
        <p className="intro-sub">Select one to enter the mitotic ladder.</p>
      </div>

      {/* ─── Token Grid ─────────────────────────────────────────────── */}
      <div className="token-grid">
        {tokenIds.map((tokenId) => {
          const isSelected = selectedTokenId === tokenId;
          return (
            <button
              key={tokenId.toString()}
              className={`token-card ${isSelected ? "selected" : ""}`}
              onClick={() => setSelectedTokenId(tokenId)}
              disabled={
                isApprovalPending ||
                isApprovalConfirming ||
                isDepositPending ||
                isDepositConfirming
              }
            >
              <div className="token-id">#{tokenId.toString()}</div>
              <div className="token-label">DONUTBNK</div>
            </button>
          );
        })}
      </div>

      {/* ─── Action Area ─────────────────────────────────────────────── */}
      {selectedTokenId !== null && (
        <div className="deposit-actions">
          <div className="selected-label">
            Selected: <strong>#{selectedTokenId.toString()}</strong>
          </div>

          {/* Step 1: Approval */}
          <div className={`step-row ${approved ? "step-done" : ""}`}>
            <span className="step-label">Step 1:</span>
            {approved ? (
              <span className="step-status">
                ✓ Approved (Trinity can move your NFTs)
              </span>
            ) : (
              <button
                className="action-btn"
                onClick={handleApprove}
                disabled={isApproveDisabled}
              >
                {isApprovalPending
                  ? "Confirm in wallet..."
                  : isApprovalConfirming
                    ? "Approving on-chain..."
                    : "→ Approve"}
              </button>
            )}
          </div>

          {/* Step 2: Deposit */}
          <div className="step-row">
            <span className="step-label">Step 2:</span>
            <button
              className="action-btn primary"
              onClick={handleDeposit}
              disabled={isDepositDisabled}
            >
              {isDepositPending
                ? "Confirm in wallet..."
                : isDepositConfirming
                  ? "Depositing to Trinity..."
                  : `→ Deposit #${selectedTokenId.toString()}`}
            </button>
          </div>
        </div>
      )}

      {/* ─── Success message ─────────────────────────────────────────── */}
      {isDepositSuccess && (
        <div className="deposit-success">
          ✓ NFT deposited successfully. Set your price within 48h in the
          Listings section.
        </div>
      )}

      {/* ─── Warning notice ──────────────────────────────────────────── */}
      <div className="deposit-notice">
        After deposit: you have <strong>48 hours</strong> to set your listing
        price or withdraw. Max hold: <strong>7 days</strong>. After that, anyone
        can force-buy at floor (3.30 USDC).
      </div>
    </section>
  );
}
