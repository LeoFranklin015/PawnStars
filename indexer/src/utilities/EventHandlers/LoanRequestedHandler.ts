import { Contract, ethers } from "ethers";
import { IssuerAbi } from "../abis/Issuer";
import { createWalletClient, http } from "viem";
import { hashkeyTestnet } from "viem/chains";
import { createPublicClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { LENDING_ABI } from "../abis/Lending";
import { request, gql } from "graphql-request";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

// Make sure to set these environment variables in your .env file
const GRAPH_URL =
  process.env.SUBGRAPH_URL ||
  "https://api.thegraph.com/subgraphs/name/pawnstars/rwa-protocol";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define types for the GraphQL response
interface RWAOwner {
  id: string;
  name: string;
}

interface RWALoan {
  id: string;
  amount: string | null;
  requestedAmount: string;
  interestRate: string | null;
  status: string;
  createdAt: string;
}

interface RWAData {
  id: string;
  productName: string;
  imageHash: string;
  yearsOfUsage: string;
  status: string;
  documentHash: string;
  tokenURI: string;
  createdAt: string;
  lastUpdated: string;
  owner: RWAOwner;
  loans: RWALoan[];
}

interface GraphQLResponse {
  rwa: RWAData;
}

// Function to query the GraphQL endpoint
async function fetchRWADetails(rwaId: bigint): Promise<RWAData | null> {
  const query = gql`
    query GetRWADetails($id: String!) {
      rwa(id: $id) {
        id
        productName
        imageHash
        yearsOfUsage
      }
    }
  `;

  try {
    const variables = {
      id: rwaId.toString(),
    };

    const data = await request<GraphQLResponse>(GRAPH_URL, query, variables);
    console.log("Fetched RWA data from subgraph:", data);
    return data.rwa;
  } catch (error) {
    console.error("Error fetching RWA data from subgraph:", error);
    return null;
  }
}

// Function to analyze RWA data with OpenAI
async function analyzeRWAWithOpenAI(rwaData: RWAData): Promise<bigint> {
  try {
    const rwaDetails = JSON.stringify(rwaData, null, 2);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant that analyzes RWA (Real World Asset) data to determine fair valuations for lending.Only Reply to in 10^18 . For example 500 usd -> you need to only return 500000000000000000000 ",
        },
        {
          role: "user",
          content: `Please analyze this RWA data and suggest a fair valuation in ETH for lending. Consider the product name, years of usage, and other relevant factors. Here's the data:\n\n${rwaDetails}. You should only 1e18 . For example 500 usd -> you need to only return 500000000000000000000 `,
        },
      ],
    });

    const aiSuggestion = response.choices[0].message.content;
    console.log("AI Valuation Analysis:", aiSuggestion);

    // Try to extract a numeric valuation from the AI response
    const valuationMatch = aiSuggestion?.match(/(\d+(\.\d+)?)\s*ETH/i);
    let suggestedValuation = 500; // Default fallback value in ETH

    if (valuationMatch && valuationMatch[1]) {
      suggestedValuation = parseFloat(valuationMatch[1]);
      console.log(`AI suggested valuation: ${suggestedValuation} ETH`);
    } else {
      console.log(
        `Could not extract precise valuation from AI. Using default: ${suggestedValuation} ETH`
      );
    }

    return ethers.parseEther(suggestedValuation.toString());
  } catch (error) {
    console.error("Error analyzing RWA with OpenAI:", error);
    // Return a default valuation if AI analysis fails
    return ethers.parseEther("500");
  }
}

export const handleLoanRequested = async (
  borrower: string,
  rwaId: bigint,
  amount: bigint,
  requestId: bigint,
  valuation: bigint
) => {
  try {
    console.log("New Loan Request Event:");
    console.log("------------------------");
    console.log(`Borrower: ${borrower}`);
    console.log(`RWA ID: ${rwaId.toString()}`);
    console.log(`Amount: ${ethers.formatEther(amount)} ETH`);
    console.log(`Request ID: ${requestId.toString()}`);
    console.log(`Valuation: ${ethers.formatEther(valuation)} ETH`);
    console.log("------------------------");

    // Fetch RWA data from subgraph
    const rwaData = await fetchRWADetails(rwaId);

    if (!rwaData) {
      console.warn(
        "Could not fetch RWA data from subgraph. Using default valuation."
      );
    }

    // Analyze RWA data with OpenAI to get suggested valuation
    let aiValuation;
    if (rwaData) {
      console.log("Analyzing RWA data with OpenAI...");
      aiValuation = await analyzeRWAWithOpenAI(rwaData);
      console.log(
        `AI determined valuation: ${ethers.formatEther(aiValuation)} ETH`
      );
    } else {
      aiValuation = ethers.parseEther("500"); // Default fallback
      console.log(
        `Using default valuation: ${ethers.formatEther(aiValuation)} ETH`
      );
    }

    const publicClient = createPublicClient({
      chain: hashkeyTestnet,
      transport: http(),
    });

    const walletClient = createWalletClient({
      account: privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`),
      transport: http(),
      chain: hashkeyTestnet,
    });

    console.log(
      `Providing valuation for RWA ID ${rwaId}, amount: ${ethers.formatEther(
        aiValuation
      )} ETH`
    );

    const tx = await walletClient.writeContract({
      address: "0x5Dec92c62c804c0d248a854138A7192945f47F3d",
      abi: LENDING_ABI,
      functionName: "provideValuation",
      args: [rwaId - BigInt(1), aiValuation],
    });

    const txReceipt = await publicClient.waitForTransactionReceipt({
      hash: tx,
    });

    console.log("Transaction Receipt:", txReceipt);
    console.log(
      `Successfully provided valuation of ${ethers.formatEther(
        aiValuation
      )} ETH for RWA ID ${rwaId}`
    );
  } catch (error) {
    console.error("Error handling LoanRequested event:", error);
    throw error;
  }
};
