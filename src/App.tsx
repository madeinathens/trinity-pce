import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import "./App.css";
import { ListingsFeed } from "./components/ListingsFeed";
import { AssetsDisplay } from "./components/AssetsDisplay";

function App() {
  const { isConnected, address } = useAccount();

  return (
    <div className="app">
      <header className="header">
        <div className="sigil">🜁 🜂 🜄 🜃 ℧ 🜀</div>
        <h1 className="title">TRINITY PCE</h1>
        <p className="tagline">x⁰ = 1 &nbsp;|&nbsp; The Tangible Zero</p>
      </header>

      <main className="main">
        <section className="connect-section">
          <ConnectButton />
        </section>

        <ListingsFeed />
        <AssetsDisplay />

        {isConnected && (
          <section className="status">
            <div className="status-line">
              <span className="label">EXECUTOR STATE:</span>
              <span className="value">CONNECTED</span>
            </div>
            <div className="status-line">
              <span className="label">ADDRESS:</span>
              <span className="value mono">{address}</span>
            </div>
            <div className="status-line">
              <span className="label">CHAIN:</span>
              <span className="value">BASE MAINNET</span>
            </div>
          </section>
        )}

        {!isConnected && (
          <section className="intro">
            <p>The world's 1st RWA Absolute Mitotic Ladder.</p>
            <p className="axiom">
              This system cannot be joined.
              <br />
              It can only be instantiated.
            </p>
          </section>
        )}
      </main>

      <footer className="footer">
        <p>madeinathens.eth © 2012–2026</p>
      </footer>
    </div>
  );
}

export default App;
