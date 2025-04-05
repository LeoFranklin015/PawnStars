import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hashkeyTestnet } from "viem/chains";
import dotenv from "dotenv";
import { PinataSDK } from "pinata";

dotenv.config();

export const RequestKYC = async (
  requestId: number,
  requester: string,
  yearsOfUsage: number,
  productName: string,
  productModel: string,
  documentHash: string
): Promise<void> => {
  try {
    console.log("Request ID:", requestId);
    console.log("Requester:", requester);
    console.log("Years of Usage:", yearsOfUsage);
    console.log("Product Name:", productName);
    console.log("Product Model:", productModel);
    console.log("Document Hash:", documentHash);
    console.log("------------------------");

    const pinata = new PinataSDK({
      pinataJwt: process.env.PINATA_JWT!,
      pinataGateway: process.env.PINATA_GATEWAY!,
    });

    const image = await pinata.gateways.private.get(productModel);
    console.log("Image:", image);

    const document = await pinata.gateways.private.get(documentHash);
    console.log("Document:", document);

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
  } catch (error) {
    console.error("Error processing KYC verification:", error);
    throw error;
  }
};
