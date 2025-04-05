import { Contract, JsonRpcProvider, WebSocketProvider } from "ethers";
import { LENDING_ABI } from "../utilities/abis/Lending";
import { handleLoanRequested } from "../utilities/EventHandlers/LoanRequestedHandler";
// Contract ABI
const contractABI = LENDING_ABI;
interface ChainConfig {
  providerUrl: string;
  contractAddress: string;
  chainId: number;
}

export class Validator {
  private contract!: Contract;
  private provider!: JsonRpcProvider | WebSocketProvider;
  private chainId: number;
  private config: ChainConfig;
  private _isListening: boolean;
  private reconnectAttempts: number;
  private readonly maxReconnectAttempts = 5;
  private readonly reconnectDelay = 5000; // 5 seconds

  constructor(config: ChainConfig) {
    this.config = config;
    this.chainId = config.chainId;
    this._isListening = false;
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
      this.contract.removeAllListeners("LoanRequested");

      // Set up the RWARequestCreated event listener
      this.contract.on(
        "LoanRequested",
        async (borrower, rwaId, amount, requestId, valuation) => {
          try {
            await handleLoanRequested(
              borrower,
              rwaId,
              amount,
              requestId,
              valuation
            );
          } catch (error) {
            console.error(
              `[Chain ${this.chainId}] Error processing KYC event:`,
              error
            );
          }
        }
      );

      // Set up provider error handling
      this.provider.on("error", this.handleProviderError.bind(this));

      // Reset reconnect attempts on successful connection
      this.reconnectAttempts = 0;
      this._isListening = true;

      console.log(
        `[Chain ${this.chainId}] Successfully set up event listeners`
      );
    } catch (error) {
      console.error(
        `[Chain ${this.chainId}] Error setting up event listeners:`,
        error
      );
      await this.handleProviderError(
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  private async handleProviderError(error: Error) {
    console.error(`[Chain ${this.chainId}] Provider error:`, error);
    this._isListening = false;

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
    if (this._isListening) {
      console.log(`[Chain ${this.chainId}] Already listening for events`);
      return;
    }

    try {
      await this.setupEventListener();
      console.log(
        `[Chain ${this.chainId}] Started listening for RWARequestCreated events`
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
    if (!this._isListening) {
      return;
    }

    try {
      this.contract.removeAllListeners("RWARequestCreated");
      this.contract.removeAllListeners("LoanRequested");
      this.provider.removeAllListeners();
      this._isListening = false;
      console.log(`[Chain ${this.chainId}] Stopped listening for events`);
    } catch (error) {
      console.error(`[Chain ${this.chainId}] Error stopping listener:`, error);
      throw error;
    }
  }

  public isListening(): boolean {
    return this._isListening;
  }
}
