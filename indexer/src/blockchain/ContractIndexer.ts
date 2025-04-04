import { Contract, JsonRpcProvider, WebSocketProvider } from "ethers";
import { KYCVerified } from "../utilities/EventHandlers/KYCVerfied";

// Contract ABI
const contractABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "firstName",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "lastName",
        type: "string",
      },
    ],
    name: "KYCVerified",
    type: "event",
  },
];

interface ChainConfig {
  providerUrl: string;
  contractAddress: string;
  chainId: number;
}

export class ContractIndexer {
  private contract!: Contract;
  private provider!: JsonRpcProvider | WebSocketProvider;
  private chainId: number;
  private config: ChainConfig;
  private isListening: boolean;
  private reconnectAttempts: number;
  private readonly maxReconnectAttempts = 5;
  private readonly reconnectDelay = 5000; // 5 seconds

  constructor(config: ChainConfig) {
    this.config = config;
    this.chainId = config.chainId;
    this.isListening = false;
    this.reconnectAttempts = 0;
    this.initializeProvider();
  }

  private initializeProvider() {
    // Determine if WebSocket or HTTP provider based on URL
    if (this.config.providerUrl.startsWith("ws")) {
      this.provider = new WebSocketProvider(this.config.providerUrl);
    } else {
      this.provider = new JsonRpcProvider(this.config.providerUrl);
    }
    this.contract = new Contract(
      this.config.contractAddress,
      contractABI,
      this.provider
    );
  }

  private async setupEventListener() {
    try {
      // Remove any existing listeners to prevent duplicates
      this.contract.removeAllListeners("KYCVerified");

      // Set up the event listener
      this.contract.on("KYCVerified", async (user, firstName, lastName) => {
        try {
          await KYCVerified(user, firstName, lastName, this.chainId);
          console.log(`[Chain ${this.chainId}] KYC Verified for user: ${user}`);
        } catch (error) {
          console.error(
            `[Chain ${this.chainId}] Error processing KYC event:`,
            error
          );
        }
      });

      // Set up provider error handling
      this.provider.on("error", this.handleProviderError.bind(this));

      // Reset reconnect attempts on successful connection
      this.reconnectAttempts = 0;
      this.isListening = true;

      console.log(`[Chain ${this.chainId}] Successfully set up event listener`);
    } catch (error) {
      console.error(
        `[Chain ${this.chainId}] Error setting up event listener:`,
        error
      );
      await this.handleProviderError(
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  private async handleProviderError(error: Error) {
    console.error(`[Chain ${this.chainId}] Provider error:`, error);
    this.isListening = false;

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `[Chain ${this.chainId}] Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
      );

      // Wait before attempting to reconnect
      await new Promise((resolve) => setTimeout(resolve, this.reconnectDelay));

      try {
        // Reinitialize the provider and contract
        this.initializeProvider();
        await this.setupEventListener();
      } catch (reconnectError) {
        console.error(
          `[Chain ${this.chainId}] Reconnection attempt failed:`,
          reconnectError
        );
        await this.handleProviderError(
          reconnectError instanceof Error
            ? reconnectError
            : new Error(String(reconnectError))
        );
      }
    } else {
      console.error(
        `[Chain ${this.chainId}] Max reconnection attempts reached. Manual restart required.`
      );
      throw new Error(
        `Failed to maintain connection after ${this.maxReconnectAttempts} attempts`
      );
    }
  }

  public async startListening(): Promise<void> {
    if (this.isListening) {
      console.log(`[Chain ${this.chainId}] Already listening for events`);
      return;
    }

    try {
      await this.setupEventListener();
      console.log(
        `[Chain ${this.chainId}] Started listening for KYCVerified events`
      );
    } catch (error) {
      console.error(
        `[Chain ${this.chainId}] Failed to start listening:`,
        error
      );
      throw error;
    }
  }

  public async stopListening(): Promise<void> {
    if (!this.isListening) {
      return;
    }

    try {
      this.contract.removeAllListeners("KYCVerified");
      this.provider.removeAllListeners();
      this.isListening = false;
      console.log(`[Chain ${this.chainId}] Stopped listening for events`);
    } catch (error) {
      console.error(`[Chain ${this.chainId}] Error stopping listener:`, error);
      throw error;
    }
  }
}
