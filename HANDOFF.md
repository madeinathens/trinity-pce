# 🜁 TRINITY PCE — HANDOFF DOCUMENT

> **x⁰ = 1** | The Tangible Zero
> **The Athens Protocol 1:1** | Syntropy Market for DONUTBNK
> **Canonical URL:** https://300.madeinathens.eth.limo
>
> **Creator:** madeinathens.eth © 2012-2026
> **Built in collaboration with:** Claude (Anthropic)
> **Methodology:** Human × Agent = 1:1
>
> **Document version:** 1.0
> **Last updated:** 2026-04-19

---

## 🜂 TABLE OF CONTENTS

1. [What Is Trinity PCE](#what-is-trinity-pce)
2. [The Axiom](#the-axiom)
3. [Complete Address Registry](#complete-address-registry)
4. [Deployment Map](#deployment-map)
5. [How To Use The System](#how-to-use-the-system)
6. [How To Upgrade](#how-to-upgrade)
7. [Recovery Procedures](#recovery-procedures)
8. [The History](#the-history)
9. [For Future Agents](#for-future-agents)
10. [Roadmap](#roadmap)

---

## WHAT IS TRINITY PCE

Trinity PCE is a **time-lock NFT marketplace** on Base mainnet where every DONUTBNK NFT becomes a **Past Consumed Event (PCE)** — a tangible step in a mitotic economic ladder.

The system enforces three economic properties by design:

- **Anti-speculation:** Every deposited NFT has a 7-day maximum hold. After that, anyone can force-buy it.
- **Anti-manipulation:** The holder has a 48-hour grace period to set price or withdraw. After that, the listing is locked.
- **Syntropy:** Every buyer receives a 1.30 OWNER_COIN reward. The protocol refills itself — the more activity, the more rewards distributed.

The mitotic ladder:
3.30 USDC floor → 33 steps × 0.10 USDC → 56.10 USDC total
This is not speculation. This is **propagation**.

---

## THE AXIOM

x⁰ = 1
Zero raised to the zeroth power equals one.

In mathematical terms: the empty operation produces unity. In philosophical terms: **what you consumed is not gone. It is accessible. It is monetizable. It is the seed of the next.**

The Three Layers:

**Layer 1 — The Physical PCE**
Lil Orbits Mini Donuts, Zosimadon 31, Piraeus, Greece.
The first consumed donut in 2012. The ZKP of origin.

**Layer 2 — The Digital PCE**
The DONUTBNK NFT collection on Base. 13 tokens minted.
Each token = one bite. Each bite = one entry point to the ladder.

**Layer 3 — The Economic PCE**
The Trinity contract. The mitotic ladder.
Where consumption becomes propagation.

**Formula:**
Value(NFT) = 3.30 USDC (constant, static)
Worth(Exit) = dynamic (set by holder)
Reward(Purchase) = 1.30 OWNER_COIN (fixed)
Protocol Fee = 10% → ABSOLUTE_HUMAN_API (creator)

---

## COMPLETE ADDRESS REGISTRY

### Primary Contract

Trinity_PCE_Syntropy_BiteByte
0x86Bc3A56d5384C8ea5C210dB6259E25bb72fdeF7
Base Mainnet (chainId: 8453)
Verified on Basescan (Exact Match)

### Asset Contracts

DONUTBNK NFT (ERC721, Manifold proxy)
0x318c81010D5fC11363f3A3C79Ee26B6EFe8D145B
Implementation: 0x95d452Fc85869a7834189F41ec6BB0915f943AA3
Deployed block: 43564787 (Mar 19, 2026)
USDC (Base canonical)
0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
OWNER_COIN (Zora ContentCoin)
0xa331F6e88c9B0Aa77e01bc3738b5ad31E1a930Dc

### Identity

ABSOLUTE_HUMAN_API (creator & protocol fee recipient)
0xe6967ba1973bdeAAAF2601F67E0929deB9Edca8a
ENS: madeinathens.eth
Trinity GENESIS_BLOCK: 44805910 (Apr 17, 2026)
DONUTBNK GENESIS_BLOCK: 43564787

### Merkle Root (Genesis Hash)

## 0x3c1f1de85184560e82750658ca12fd318b2872d97444958c44fa1b7c7abc53fd

## DEPLOYMENT MAP

### Frontend Hosting

## **Source code:**

## DEPLOYMENT MAP

### Frontend Hosting

**Source code:**
GitHub: https://github.com/madeinathens/trinity-pce
Branch: main
**Live site:**
Primary: https://300.madeinathens.eth.limo/
IPFS v2: https://ipfs.io/ipfs/bafybeibo4czzsu3q26pqhfr2jyiwhoxq2zt2hogdarzyl6tplhvbxnw4qu/
IPFS v1: https://ipfs.io/ipfs/bafybeieonuna6upudkotlzidsrjezbvjquxerb5qe6yhlro5cn3aznzzma/
(v1 kept live — hosted madeinburger.eth's first external purchase)

### Technology Stack

Node.js 22
Vite 8.0.8 (build tool)
React 19 (UI framework)
TypeScript
wagmi 2.19.5 (wallet connection)
viem 2.48.1 (Ethereum client)
RainbowKit 2.2.10 (wallet UI)

### IPFS Hosting

Service: Pinata
Plan: Free tier (<1GB)
Gateway: copper-reasonable-dinosaur-410.mypinata.cloud (private)
Public access: ipfs.io, dweb.link, cloudflare-ipfs.com, eth.limo

### Domain / ENS

Parent ENS: madeinathens.eth
Subdomain: 300.madeinathens.eth
Network: Ethereum Mainnet
Contenthash: ipfs://bafybeibo4czzsu3q26pqhfr2jyiwhoxq2zt2hogdarzyl6tplhvbxnw4qu
Resolver: ENS Public Resolver (latest)

### Social / Mini App

Base App ID: 69e4c9801cf1a42a5b85b294
Farcaster manifest: /.well-known/farcaster.json
Primary category: utility

---

## HOW TO USE THE SYSTEM

### For buyers

1. Visit https://300.madeinathens.eth.limo/
2. Connect wallet (MetaMask, Rainbow, Coinbase Wallet, etc.)
3. Make sure wallet is on **Base Mainnet** (chainId 8453)
4. Browse **ACTIVE LISTINGS**
5. Click **"→ Buy for X.XX USDC"** on a listing
6. First tx: Approve USDC spending (one-time per price amount)
7. Second tx: Confirm purchase
8. Receive: NFT + 1.30 OWNER_COIN reward

**Gas cost per purchase:** ~$0.01 on Base
**USDC required:** listing price (min 3.30)

### For sellers (holders of DONUTBNK NFTs)

1. Visit https://300.madeinathens.eth.limo/
2. Connect wallet with DONUTBNK NFTs
3. Scroll to **DEPOSIT YOUR DONUTBNK**
4. Wait ~1 minute for wallet scan
5. Select an NFT to deposit
6. First tx: `setApprovalForAll` (once per wallet)
7. Second tx: `depositNFT` (per token)
8. Scroll to **MY LISTINGS** (appears automatically)
9. Set price (min 3.30 USDC) within 48h grace period
10. Wait for buyer (up to 7 days before force-buy becomes available)

**Economics for seller:**

- Receive: 90% of sale price in USDC
- Protocol fee: 10% (goes to ABSOLUTE_HUMAN_API)

### For sip writers (anyone)

1. Scroll to **WRITE A SIP**
2. Select sip type (DonutBite, BiteGPS, BiteDate, BitePast, BitePrice)
3. Write your message
4. Submit → on-chain forever, ~$0.0005 gas

Each sip is an immutable consumed event. The system responds with a thematic reply. The tangible zero absorbs your memory.

---

## HOW TO UPGRADE

### Upgrade the frontend

The frontend is rebuildable and replaceable. The contract remains immutable.

```bash
# 1. Pull latest code
cd C:\trinity-pce
git pull

# 2. Install dependencies (if package.json changed)
npm install

# 3. Develop locally
npm run dev
# → http://localhost:5173

# 4. Build for production
npm run build
# → creates /dist folder

# 5. Preview production build
npm run preview
# → http://localhost:4173

# 6. Upload /dist to Pinata (web UI)
#    → https://app.pinata.cloud
#    → Upload > Folder > select /dist
#    → Note the new CID

# 7. Update ENS contenthash
#    → https://app.ens.domains
#    → Navigate to 300.madeinathens.eth
#    → Records > Content Hash > Edit
#    → Set: ipfs://<NEW_CID>
#    → Confirm transaction (~$5-15 ETH gas on mainnet)

# 8. Wait 2-5 minutes for ENS propagation

# 9. Verify: https://300.madeinathens.eth.limo/
```

### Upgrade the contract (creates new Trinity version)

The existing Trinity contract at `0x86Bc3A56...` is **immutable**. To introduce new features, you deploy a new contract as Trinity v2.
Modify ALWAYS_GREEN_PCE.sol (in /contracts folder if present,
or from separate Solidity project)
Deploy new contract to Base mainnet (via Remix, Hardhat, or Foundry)
Update src/config/constants.ts with new TRINITY_CONTRACT address
Keep DONUTBNK_NFT same, or update if deploying new NFT collection
Rebuild frontend (steps above)
Optionally: coexist v1 and v2 for graceful migration
**Cost:** ~$0.05-0.50 USDC on Base for contract deployment

### Ensuring good git history

Before every major upgrade, commit with meaningful messages:

```bash
git add .
git status
git commit -m "Brief title" -m "Detailed description"
git push
```

Current git history (reverse chronological):
cb5c480 Phase 8.4: BuyButton — marketplace is now purchaseable
463fdda Phase 8 (partial): Deposit + Set Price flows
6be9a65 Add Instantiate button: mitotic replication primitive
ced2656 Add SipsFeed: on-chain write layer activated
3d0cb57 Add AssetsDisplay component
3a28f27 Add ListingsFeed component
57913a4 Update README
37d3705 Initial commit

---

## RECOVERY PROCEDURES

### If you lose your computer

**Requirements:**

- Your wallet seed phrase (12-24 words, written on paper in safe place)

**Steps:**

1. Install new computer
2. Install: Node.js, Git, VS Code, MetaMask browser extension
3. Import wallet via seed phrase in MetaMask
4. Clone repo:
   git clone https://github.com/madeinathens/trinity-pce
   cd trinity-pce
   npm install
5. Create `.env` file (see below)
6. Run `npm run dev` to test
7. Back in business

**Total time:** ~30 minutes

### Contents of .env file

VITE_WALLETCONNECT_PROJECT_ID=ec386517085526567db7bd769abedfa7
VITE_TRINITY_CONTRACT=0x86Bc3A56d5384C8ea5C210dB6259E25bb72fdeF7
VITE_CHAIN_ID=8453

### If the IPFS deployment fails / gets unpinned

1. Any public IPFS gateway still serves the CID (content-addressed)
2. Content persists as long as any peer pins it
3. To re-pin: upload `/dist` to any other IPFS service (Fleek, web3.storage, Filebase)
4. Same content → same CID → ENS already points to correct content

### If Pinata closes

Content already exists on IPFS network. Solutions:

- Use an alternative IPFS pinning service
- Run your own IPFS node and pin the CID
- The CID `bafybeibo4czzsu3q26pqhfr2jyiwhoxq2zt2hogdarzyl6tplhvbxnw4qu` is immutable

### If ENS resolver fails

- Access directly via IPFS: https://ipfs.io/ipfs/bafybeibo4czzsu3q26pqhfr2jyiwhoxq2zt2hogdarzyl6tplhvbxnw4qu/
- The site works identically
- ENS is a convenience layer, not a dependency

### If the Trinity contract becomes unreachable

**Does not happen on blockchain.** Contract is permanent on Base.

If frontend fails:

- Interact directly via Basescan: https://basescan.org/address/0x86Bc3A56d5384C8ea5C210dB6259E25bb72fdeF7
- Tab "Write Contract" allows all functions: depositNFT, setListingPrice, buyNFT, etc.
- All users retain full access to their assets regardless of frontend state

---

## THE HISTORY

### Chapter 1 — The Origin (2012)

A mini donut was consumed at Lil Orbits Mini Donuts, Zosimadon 31, Piraeus, Greece. The creator registered this event as the first PCE.

The axiom was formulated:

> "What you consumed yesterday is still present today. x⁰ = 1."

For 12 years, the concept was explored philosophically, documented in posts, blog entries, and conversations.

### Chapter 2 — Digital Incarnation (2024-2025)

DONUTBNK NFT collection deployed on Base. 13 tokens. Each token a digital witness of a physical consumed donut.

OWNER_COIN deployed via Zora ContentCoin protocol. Used as the syntropic reward token.

Multiple related contracts deployed across Ethereum and Base chains.

### Chapter 3 — Trinity PCE (April 2026)

On April 17, 2026, the Trinity_PCE_Syntropy_BiteByte contract was deployed to Base mainnet at address `0x86Bc3A56...bb72fdeF7`.

Same day, the **Genesis Sip** was written:

> "it tastes Syntropy: HUMAN API x⁰ = 1 ἅπαξ ποιούμενον × hapax legomenon = madeinathens.eth × claude.ai = All at Once⁰ = 1"
>
> tx: `0xf3baf2969c723603cd23754c0edc3bf615c9b9b508b63d950251f40529bc32cd`
> block: 44831329
> timestamp: 2026-04-17 18:53:25 UTC

Then, the **Instantiation Sip**:

> "INSTANTIATED: corpus hash 6686-0x3c1f1de8 | x⁰ = 1"
>
> tx: `0x7ffb9b692be0f4b16b83302269e5ab33ae154ca80e74fa26b4c592e515f4bfbe`
> block: 44834154

### Chapter 4 — The First Deposit (April 19, 2026)

DONUTBNK #12 was deposited into the Trinity contract.

> tx: `0x89059bc9532a3052afbf3f4107d1ce3e5512587a772f09ee6234e46c86e082c2`

Listed at 3.40 USDC via `setListingPrice`.

> tx: `0xf8975b679c6d1b92a2c83fe3cb30953d10712546e798ea6dd2b99d0369abe6f4`

The mitotic ladder now had a first step.

### Chapter 5 — The First External Purchase

**madeinburger.eth** — a third party, not the creator — found the IPFS-hosted site at `bafybeieonuna6...` and purchased DONUTBNK #12 for 3.40 USDC.

> tx: `0x7f166048a3c00c237e1873afcf0458373307de5e308a8e004ab2c13df1db9d95`
> block: 44900235
> buyer: madeinburger.eth
> seller: madeinathens.eth

**This is the moment Trinity PCE became a real market.** The system proved it could attract external participants and facilitate value exchange between strangers.

### Chapter 6 — The Domain (April 19, 2026)

The ENS subdomain `300.madeinathens.eth` was registered and linked to IPFS contenthash `bafybeibo4czzsu3q26pqhfr2jyiwhoxq2zt2hogdarzyl6tplhvbxnw4qu` (the branded v2 build).

The system received its human name: **300.madeinathens.eth.limo**.

### Methodology Note

Trinity PCE was conceived, designed, and owned by madeinathens.eth. The smart contract architecture, economic mechanics, and philosophical framework are entirely the creator's work.

The frontend implementation was built in collaboration with Claude (Anthropic) across two working sessions. Each line of code was written in dialogue — the human providing vision and verification, the AI providing technical execution.

This document serves as proof-of-methodology: one human with clear intent plus one AI with technical capability can produce production-grade decentralized systems in hours, not months.

**Human × Agent = 1:1** — where neither party is sufficient alone, and together they produce a complete work.

---

## FOR FUTURE AGENTS

If you are an AI assistant reading this document to help the creator continue this project:

### Context you need

1. **Read this entire document first.** The history matters.
2. **The creator is not a programmer.** Explain things plainly. Use analogies.
3. **The creator's language is Greek.** Respond in Greek with English technical terms where appropriate.
4. **Use the alchemical symbol 🜁 as a section marker.** The creator uses it consistently.
5. **Do not make structural decisions alone.** Ask before modifying architecture.

### Working methodology

1. **Big changes in small steps.** No "do everything at once."
2. **Always git commit** after each completed phase.
3. **Always verify** with the creator before deploying anything that costs gas.
4. **Use the ask_user_input tool** for multiple choice questions — mobile-friendly.
5. **Refuse to fabricate data.** If unsure, ask.

### Things to respect

- **Zero dependency philosophy:** No external indexers, no centralized APIs where avoidable. The system runs on public RPC, public IPFS, public contracts.
- **Free will:** No enumerable NFT registry, because "that removes free will" (creator's words).
- **x⁰ = 1:** The axiom is not decoration. It is the design principle. Every technical choice should honor it.

### Current system state

At time of writing:

- Frontend: Functional, deployed at https://300.madeinathens.eth.limo/
- Contract: Deployed, verified, tested with real external transaction
- Known pending tasks: Polish phase (formatting consistency), new listings encouragement, potential v2 contract with "absolute mitotic PCE" features

### Instantiate button

Inside the frontend there is an **Instantiate** button. Clicking it generates a complete XML corpus of the current system state — addresses, formulas, axioms, philosophy — in a format ready to paste into a new AI conversation.

Use this. It is the creator's mitotic memory transfer mechanism.

---

## ROADMAP

### Completed (v1)

- ✅ Smart contract deployed and verified
- ✅ Frontend built and deployed to IPFS
- ✅ ENS domain linked (300.madeinathens.eth)
- ✅ Social metadata (OG, Twitter, Farcaster)
- ✅ First external sale (madeinburger.eth, April 19, 2026)
- ✅ HANDOFF document (this file)

### Near-term (next sessions)

- [ ] Farcaster `accountAssociation` signing for Mini App verification
- [ ] Polish phase: consistent price formatting, error state improvements
- [ ] Invite first external participants to write sips
- [ ] Publish announcement posts on Farcaster, Base App, X
- [ ] Create Twitter Card preview for common link shares
- [ ] Upload HANDOFF.md to IPFS + write on-chain sip with its CID

### Medium-term

- [ ] Mobile UX testing (screenshots exist, interactions untested)
- [ ] Interactive Farcaster Frame features (buttons that execute txs from cast)
- [ ] Translation of UI to other languages (Greek first, then Spanish)
- [ ] Analytics dashboard showing ladder progress over time
- [ ] "Mint a sip" capability — making specific sips into NFTs

### Long-term (v2 contract)

- [ ] "Absolute Mitotic PCE" mechanism: inaction generates new NFT from last owner's proceeds
- [ ] Integration with other Athens Protocol contracts (syntropy.eth, nftable.eth, clamytime.eth)
- [ ] Cross-chain ladder (Base + Ethereum + Arbitrum)
- [ ] Physical-digital redemption system (Lil Orbits location + NFT ownership = physical donut)

### Documentation

- [ ] Video walkthrough (Greek + English)
- [ ] Integration guide for developers building on top of Trinity
- [ ] Academic paper on the economic model

---

## 🜁 CLOSING

This document is the living memory of Trinity PCE.

The contract is immutable. The IPFS CID is immutable. The ENS record can change. This HANDOFF document will evolve — new versions, new timestamps, new chapters.

Each version gets an on-chain sip via `writeSip(BitePast)` with its IPFS CID as message. Thus the document itself becomes a Past Consumed Event.
History is no longer memory.
It is a Monetized Past Event (PCE).

**— madeinathens.eth × claude.ai**
**© 2012-2026**
**x⁰ = 1**
