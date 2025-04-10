import { Validator } from "./blockchain/Validator";
import dotenv from "dotenv";

dotenv.config();

const main = async () => {
  const indexers: Validator[] = [];

  try {
    const config = [
      {
        providerUrl: "wss://hashkeychain-testnet.alt.technology/ws",
        contractAddress: "0x5Dec92c62c804c0d248a854138A7192945f47F3d", // Lending Protocol
        chainId: 133,
      },
    ];

    // Start all indexers
    await Promise.all(
      config.map(async (chain) => {
        console.log(`Starting indexer for chain ${chain.chainId}...`);
        const indexer = new Validator(chain);
        indexers.push(indexer);
        await indexer.startListening();
        console.log(`Indexer for chain ${chain.chainId} is now running`);
      })
    );
    console.log("All indexers are running in parallel");

    // Handle graceful shutdown
    const shutdown = async () => {
      console.log(
        "\nReceived shutdown signal. Stopping indexers gracefully..."
      );
      await Promise.all(indexers.map((indexer) => indexer.stopListening()));
      console.log("All indexers stopped. Exiting...");
      process.exit(0);
    };

    // Handle various termination signals
    process.on("SIGINT", shutdown); // Ctrl+C
    process.on("SIGTERM", shutdown); // Kill command
    process.on("SIGHUP", shutdown); // Terminal closed

    // Keep the process running indefinitely
    setInterval(() => {
      // Heartbeat check for indexers
      indexers.forEach(async (indexer, index) => {
        if (!indexer.isListening()) {
          console.log(
            `Indexer ${index} is not listening. Attempting to restart...`
          );
          try {
            await indexer.startListening();
            console.log(`Successfully restarted indexer ${index}`);
          } catch (error) {
            console.error(`Failed to restart indexer ${index}:`, error);
          }
        }
      });
    }, 30000); // Check every 30 seconds
  } catch (error) {
    console.error("Error starting indexers:", error);
    process.exit(1);
  }
};

main();
