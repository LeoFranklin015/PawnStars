import { ethers } from "ethers";

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

    // TODO: Add any additional processing logic here
    // For example:
    // - Store in database
    // - Trigger notifications
    // - Update UI state
    // - Call other services
  } catch (error) {
    console.error("Error handling LoanRequested event:", error);
    throw error;
  }
};
