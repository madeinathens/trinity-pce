// Trinity PCE — wagmi + RainbowKit Configuration
// x⁰ = 1 | The Tangible Zero

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base } from "wagmi/chains";
import { http } from "wagmi";
import { APP_NAME, APP_DESCRIPTION, APP_URL } from "./constants";

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as string;

if (!projectId) {
  throw new Error(
    "VITE_WALLETCONNECT_PROJECT_ID is not defined. Check your .env file.",
  );
}

export const wagmiConfig = getDefaultConfig({
  appName: APP_NAME,
  appDescription: APP_DESCRIPTION,
  appUrl: APP_URL,
  projectId,
  chains: [base],
  transports: {
    [base.id]: http("https://mainnet.base.org"),
  },
  ssr: false, // We're deploying to IPFS/ENS (static), no server-side rendering
});
