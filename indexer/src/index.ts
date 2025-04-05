import { ContractIndexer } from "./blockchain/ContractIndexer";
import dotenv from "dotenv";

dotenv.config();

const main = async () => {
  try {
    const config = [
      {
        providerUrl:
          process.env.RPC_URL ||
          "https://celo-alfajores.g.alchemy.com/v2/6unFRgRqxklQkmPxSBhd2WE9aMV5ffMY",
        contractAddress:
          process.env.CONTRACT_ADDRESS ||
          "0x036551552e14AC7fbb0754FF1dDC5Ae64E0F1834",
        chainId: 44787, // Celo Alfajores testnet
      },
    ];

    await Promise.all(
      config.map(async (chain) => {
        console.log(`Starting indexer for chain ${chain.chainId}...`);
        const indexer = new ContractIndexer(chain);
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
