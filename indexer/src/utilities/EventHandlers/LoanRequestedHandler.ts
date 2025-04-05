import { Contract, ethers } from "ethers";
import { IssuerAbi } from "../abis/Issuer";
import { createWalletClient, http } from "viem";
import { hashkeyTestnet } from "viem/chains";
import { createPublicClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { LENDING_ABI } from "../abis/Lending";

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

    const publicClient = createPublicClient({
      chain: hashkeyTestnet,
      transport: http(),
    });

    const walletClient = createWalletClient({
      account: privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`),
      transport: http(),
      chain: hashkeyTestnet,
    });

    const tx = await walletClient.writeContract({
      address: "0x5Dec92c62c804c0d248a854138A7192945f47F3d",
      abi: LENDING_ABI,
      functionName: "provideValuation",
      args: [rwaId - BigInt(1), BigInt(500000000000000000000)],
    });

    const txReceipt = await publicClient.waitForTransactionReceipt({
      hash: tx,
    });

    console.log("txReceipt", txReceipt);
  } catch (error) {
    console.error("Error handling LoanRequested event:", error);
    throw error;
  }
};
