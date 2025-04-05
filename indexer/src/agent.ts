import { HashKeyRWAVerifier } from "./blockchain/HashKeyRWAVerifier";
import dotenv from "dotenv";

dotenv.config();

const main = async () => {
  try {
    const config = [
      {
        providerUrl: "wss://hashkeychain-testnet.alt.technology/ws",
        contractAddress: "0x5e00488D2E7b887d2583F2657ce6816875C4De30",
        chainId: 133,
      },
    ];

    await Promise.all(
      config.map(async (chain) => {
        console.log(`Starting indexer for chain ${chain.chainId}...`);
        const indexer = new HashKeyRWAVerifier(chain);
        await indexer.startListening();
        console.log(`Indexer for chain ${chain.chainId} is now running`);
      })
    );
    console.log("All indexers are running in parallel");

    // Keep the process running
    process.on("SIGINT", () => {
      console.log("Stopping indexers...");
      process.exit(0);
    });
  } catch (error) {
    console.error("Error starting indexers:", error);
    process.exit(1);
  }
};

main();
