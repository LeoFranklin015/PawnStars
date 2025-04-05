import { createWalletClient, custom, http, createPublicClient } from "viem";
import { hashkeyTestnet } from "viem/chains";

// Safely create public client
export const publicClient = createPublicClient({
  chain: hashkeyTestnet,
  transport: http(),
});

// Safely create wallet client only in browser environment
export const walletClient =
  typeof window !== "undefined" && window.ethereum
    ? createWalletClient({
        chain: hashkeyTestnet,
        transport: custom(window.ethereum),
      })
    : null;
