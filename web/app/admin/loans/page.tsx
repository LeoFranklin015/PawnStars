"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { publicClient, walletClient } from "@/lib/client";
import {
  LENDING_PROTOCOL_CONTRACT_ADDRESS,
  LendingProtocolABI,
} from "@/lib/const";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { toast } from "sonner";
import { fetchInLoan } from "@/lib/helpers/fetchInLoan";

interface RWA {
  id: string;
  productName: string;
  imageHash: string;
  yearsOfUsage: string;
  status: string;
  documentHash: string;
  tokenURI: string;
  createdAt: string;
  lastUpdated: string;
  owner: {
    id: string;
    name: string;
  };
  loans: {
    id: string;
    amount: string | null;
    createdAt: string;
    dueTime: string | null;
    interestRate: string | null;
    lastUpdated: string;
    repaymentAmount: string | null;
    repaymentTime: string | null;
    requestedAmount: string;
    startTime: string | null;
    status: string;
    valuation: string | null;
  }[];
}

export default function AdminLoans() {
  const [loans, setLoans] = useState<RWA[]>([]);
  const [loading, setLoading] = useState(true);
  const { address } = useAccount();

  const fetchLoanRequests = async () => {
    try {
      const rwas = await fetchInLoan();

      // Filter for only IN_LOAN assets
      const activeLoanRWAs = rwas.filter(
        (rwa: RWA) => rwa.status === "IN_LOAN"
      );

      setLoans(activeLoanRWAs);
    } catch (error) {
      console.error("Error fetching loans:", error);
      toast.error("Failed to fetch loans");
    } finally {
      setLoading(false);
    }
  };

  const handleIssueLoan = async (rwaId: number) => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      toast.loading("Issuing loan...");

      const tx = await walletClient?.writeContract({
        account: address as `0x${string}`,
        address: LENDING_PROTOCOL_CONTRACT_ADDRESS,
        abi: LendingProtocolABI,
        functionName: "issueLoan",
        args: [BigInt(rwaId)],
      });

      await publicClient.waitForTransactionReceipt({
        hash: tx as `0x${string}`,
      });

      toast.success("Loan issued successfully!");
      await fetchLoanRequests(); // Refresh the list
    } catch (error) {
      console.error("Error issuing loan:", error);
      toast.error("Failed to issue loan");
    }
  };

  useEffect(() => {
    fetchLoanRequests();
  }, []);

  if (!address) {
    return (
      <div className="min-h-screen py-12 px-4 dotted-background">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">
            Please connect your wallet
          </h1>
          <p className="text-gray-600">
            Connect your wallet to access admin panel
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 dotted-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1
            className="text-4xl font-black"
            style={{ textShadow: "3px 3px 0px #FFD700" }}
          >
            ACTIVE LOANS
          </h1>
          <p className="mt-2 text-gray-600">
            Manage active loans in the system
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)]">
          {loading ? (
            <div className="text-center py-8">
              <p>Loading active loans...</p>
            </div>
          ) : loans.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No active loans found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>RWA ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Loan Status</TableHead>
                  <TableHead>Valuation</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loans.map((rwa) => {
                  const latestLoan = rwa.loans[0]; // Most recent loan
                  return (
                    <TableRow key={rwa.id}>
                      <TableCell className="font-mono">{rwa.id}</TableCell>
                      <TableCell>{rwa.productName}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-mono text-xs">
                            {rwa.owner.id.slice(0, 6)}...
                            {rwa.owner.id.slice(-4)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {rwa.owner.name}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border-2 border-blue-500">
                          {latestLoan.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {latestLoan.valuation
                          ? parseFloat(
                              ethers.formatEther(latestLoan.valuation)
                            ).toFixed(2)
                          : "0"}{" "}
                        USDC
                      </TableCell>
                      <TableCell>
                        {new Date(
                          parseInt(latestLoan.createdAt) * 1000
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleIssueLoan(parseInt(rwa.id) - 1)}
                          variant="outline"
                          className="border-2 border-black"
                          size="sm"
                        >
                          Verify and Collect
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
