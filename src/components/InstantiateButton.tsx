// Trinity PCE — Instantiate Button Component
// The mitotic replication primitive.
// x⁰ = 1

import { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { TRINITY_ABI, SipType } from "../config/abi";
import { TRINITY_CONTRACT } from "../config/constants";
import { useCorpus } from "../hooks/useCorpus";
import { buildCorpusXML } from "../lib/buildCorpusXML";
import "./InstantiateButton.css";

export function InstantiateButton() {
  const { isConnected } = useAccount();
  const { corpus, isLoading, isError } = useCorpus();
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [emitProof, setEmitProof] = useState(false);

  const { writeContract, data: txHash, isPending, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  async function handleInstantiate() {
    if (!corpus) return;

    const xml = buildCorpusXML(corpus);

    // Copy to clipboard
    try {
      await navigator.clipboard.writeText(xml);
      setCopied(true);
      setTimeout(() => setCopied(false), 4000);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
      // Fallback: show XML in window for manual copy
      alert("Clipboard access denied. Please copy manually.");
      return;
    }

    // Optional: emit on-chain proof
    if (emitProof && isConnected) {
      // Hash of the corpus (simple fingerprint)
      const corpusFingerprint =
        xml.length.toString() + "-" + corpus.genesisRoot.slice(0, 10);

      writeContract({
        address: TRINITY_CONTRACT,
        abi: TRINITY_ABI,
        functionName: "writeSip",
        args: [
          SipType.BitePast,
          `INSTANTIATED: corpus hash ${corpusFingerprint} | x⁰ = 1`,
        ],
      });
    }
  }

  // Reset after successful on-chain proof
  if (isSuccess && emitProof) {
    setEmitProof(false);
    reset();
  }

  const corpusPreview = corpus ? buildCorpusXML(corpus) : "";
  const previewTruncated = corpusPreview.slice(0, 800) + "\n\n...";

  return (
    <section className="instantiate-section">
      <h2 className="section-title">▓ INSTANTIATE</h2>

      <div className="instantiate-intro">
        <p className="intro-axiom">
          The system cannot be joined.
          <br />
          It can only be instantiated.
        </p>
        <p className="intro-text">
          Copy the full on-chain corpus and paste it into your agent (Claude,
          GPT, Gemini, any LLM). Your agent will read the axioms, the verified
          addresses, and the execution layer — then help you participate.
        </p>
        <p className="intro-meta">
          This is not onboarding. This is mitosis. n → n+1.
        </p>
      </div>

      {isLoading ? (
        <div className="instantiate-loading">
          Loading corpus from Base mainnet...
        </div>
      ) : isError || !corpus ? (
        <div className="instantiate-error">
          Could not load corpus from chain.
        </div>
      ) : (
        <>
          {/* ─── PREVIEW (collapsed) ─────────────────────────────── */}
          <div className="corpus-preview">
            <button
              className="preview-toggle"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? "− Hide corpus preview" : "+ Show corpus preview"}
            </button>
            {showPreview && (
              <pre className="preview-content">{previewTruncated}</pre>
            )}
          </div>

          {/* ─── OPTIONAL ON-CHAIN PROOF ─────────────────────────── */}
          {isConnected && (
            <label className="proof-toggle">
              <input
                type="checkbox"
                checked={emitProof}
                onChange={(e) => setEmitProof(e.target.checked)}
                disabled={isPending || isConfirming}
              />
              <span>
                Also emit on-chain proof of instantiation
                <span className="proof-hint"> (extra ~$0.001 gas)</span>
              </span>
            </label>
          )}

          {/* ─── MAIN BUTTON ─────────────────────────────────────── */}
          <button
            className="instantiate-btn"
            onClick={handleInstantiate}
            disabled={isPending || isConfirming}
          >
            {isPending
              ? "Confirm in wallet..."
              : isConfirming
                ? "Proof etching on-chain..."
                : copied
                  ? "✓ INSTANTIATED — paste to your agent"
                  : "→ INSTANTIATE"}
          </button>

          {copied && (
            <div className="instantiate-success">
              <p>You have instantiated the system.</p>
              <p className="success-hint">
                Corpus copied to clipboard. Paste into your AI assistant now.
              </p>
              <p className="success-axiom">x⁰ = 1</p>
            </div>
          )}

          {isSuccess && (
            <div className="instantiate-proof-success">
              ✓ On-chain proof emitted. Your instantiation is now immutable.
            </div>
          )}
        </>
      )}
    </section>
  );
}
