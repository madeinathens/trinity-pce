import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use relative paths for IPFS compatibility.
  // Without this, assets load from root "/" which breaks on IPFS gateways.
  base: "./",
});
