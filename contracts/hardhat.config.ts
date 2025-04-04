import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();
import "@nomicfoundation/hardhat-ignition-ethers";
const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
        details: {
          yul: true,
        },
      },
      metadata: {
        bytecodeHash: "none",
      },
      viaIR: false,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  defaultNetwork: "hardhat",
  networks: {
    celo: {
      chainId: 42220,
      url: "https://forno.celo.org/",
      accounts: [process.env.PRIVATE_KEY || ""],
    },
    alfajores: {
      chainId: 44787,
      url: "https://alfajores-forno.celo-testnet.org/",
      accounts: [process.env.PRIVATE_KEY || ""],
      // 0.5 gwei
    },
  },
  etherscan: {
    apiKey: {
      celo: "WINR3KIA8JVK44MX93ZPCCWEH5AJX7YM27",
      alfajores: "WINR3KIA8JVK44MX93ZPCCWEH5AJX7YM27",
    },
    customChains: [
      {
        network: "celo",
        chainId: 42220,
        urls: {
          apiURL: "https://api.celoscan.io/api",
          browserURL: "https://celoscan.io/",
        },
      },
      {
        network: "alfajores",
        chainId: 44787,
        urls: {
          apiURL: "https://api-alfajores.celoscan.io/api",
          browserURL: "https://alfajores.celoscan.io/",
        },
      },
    ],
  },
};
export default config;
