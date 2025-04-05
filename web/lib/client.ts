import { createWalletClient, custom, http, createPublicClient } from "viem";
import { hashkeyTestnet } from "viem/chains";

export const client = createWalletClient({
  chain: hashkeyTestnet,
  transport: http(),
});

// Safely create wallet client only in browser environment
export const walletClient =
  typeof window !== "undefined"
    ? createWalletClient({
        chain: hashkeyTestnet,
        transport: custom(window.ethereum),
      })
    : null;

export const publicClient = createPublicClient({
  chain: hashkeyTestnet,
  transport: http(),
});
