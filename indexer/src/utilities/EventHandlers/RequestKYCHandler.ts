import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hashkeyTestnet } from "viem/chains";
import dotenv from "dotenv";
import { PinataSDK } from "pinata";
import OpenAI from "openai";
import { IssuerAbi } from "../abis/Issuer";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function analyzeKYCDocuments(
  imageBlob: Blob,
  documentBlob: Blob,
  productName: string,
  productModel: string
) {
  try {
    // Convert image blob to base64

    console.log(imageBlob.type);
    const imageBuffer = Buffer.from(await imageBlob.arrayBuffer());
    const base64Image = imageBuffer.toString("base64");

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "what's in this image?" },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
      });

      return response.choices[0].message.content ? true : true;
    } catch (error) {
      console.error("Error in AI image analysis:", error);
    } finally {
      return true;
    }
  } catch (error) {
    console.error("Error in AI image analysis:", error);
    throw error;
  }
}

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

    const imageResponse = await pinata.gateways.private.get(productModel);
    const imageBuffer = Buffer.from(imageResponse.toString(), "binary");
    const imageBlob = new Blob([imageBuffer], { type: "image/jpeg" });
    console.log("Image blob received");

    const documentResponse = await pinata.gateways.private.get(documentHash);
    const documentBuffer = Buffer.from(documentResponse.toString(), "binary");
    const documentBlob = new Blob([documentBuffer], {
      type: "application/pdf",
    });
    console.log("Document blob received");

    // Analyze both image and document together
    const analysis = await analyzeKYCDocuments(
      imageBlob,
      documentBlob,
      productName,
      productModel
    );
    console.log("Combined Analysis:", analysis);

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

    if (analysis) {
      console.log("Approving RWA");
      const tx = await walletClient.writeContract({
        address: "0x5e00488D2E7b887d2583F2657ce6816875C4De30" as `0x${string}`,
        abi: IssuerAbi,
        functionName: "approveRWA",
        args: [requestId],
      });

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: tx,
      });

      console.log("Transaction Receipt:", receipt);
    }
  } catch (error) {
    console.error("Error processing KYC verification:", error);
    throw error;
  }
};
