import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hashkeyTestnet } from "viem/chains";
import dotenv from "dotenv";
import { UniversalKYCAbi } from "../abis/UniversalKYC";

dotenv.config();

export const KYCVerified = async (
  user: string,
  firstName: string,
  lastName: string,
  chainId: number
): Promise<void> => {
  try {
    console.log("New KYC Verification on chain", chainId);
    console.log("User Address:", user);
    console.log("First Name:", firstName);
    console.log("Last Name:", lastName);
    console.log("------------------------");

    // Bridge the KYC data to the Hashkey Network

    const walletClient = createWalletClient({
      account: privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`),
      transport: http(),
      chain: hashkeyTestnet,
    });

    const publicClient = createPublicClient({
      chain: hashkeyTestnet,
      transport: http(),
    });

    const tx = await walletClient.writeContract({
      address: "0xB35867517ce0D65Db253B8b9878cAdE96903607F",
      abi: UniversalKYCAbi,
      functionName: "verifyUser",
      args: [
        user,
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        firstName + " " + lastName,
      ],
    });

    console.log("Transaction hash:", tx + "Waiting for confirmation...");

    const receipt = await publicClient.waitForTransactionReceipt({
      hash: tx,
    });

    console.log("Transaction confirmed:", receipt.transactionHash);

    console.log("KYC verification processed successfully for user:", user);
  } catch (error) {
    console.error("Error processing KYC verification:", error);
    throw error;
  }
};
