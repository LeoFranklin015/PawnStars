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
import { ISSUER_ABI, ISSUER_CONTRACT_ADDRESS } from "@/lib/const";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { toast } from "sonner";

interface LoanRequest {
  id: string;
  borrower: string;
  rwaId: string;
  valuation: string;
  status: string;
  productName: string;
}

export default function AdminLoans() {
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { address } = useAccount();

  const fetchLoanRequests = async () => {
    try {
      // TODO: Replace with actual GraphQL query
      // This is a placeholder - you'll need to implement the actual query
      const query = `
        query GetLoanRequests {
          loanRequests(where: { isActive: true, isAccepted: true, isFilled: false }) {
            id
            borrower
            rwaId
            valuation
            status
            rwa {
              productName
            }
          }
        }
      `;

      // Placeholder data for now
      const mockData = {
        loanRequests: [
          {
            id: "1",
            borrower: "0x1234...5678",
            rwaId: "1",
            valuation: ethers.parseEther("1.5").toString(),
            status: "ACCEPTED",
            rwa: {
              productName: "Vintage Watch",
            },
          },
          // Add more mock data as needed
        ],
      };

      setLoanRequests(
        mockData.loanRequests.map((request) => ({
          ...request,
          productName: request.rwa.productName,
        }))
      );
    } catch (error) {
      console.error("Error fetching loan requests:", error);
      toast.error("Failed to fetch loan requests");
    } finally {
      setLoading(false);
    }
  };

  const handleIssueLoan = async (requestId: string) => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      toast.loading("Issuing loan...");

      const tx = await walletClient?.writeContract({
        account: address as `0x${string}`,
        address: ISSUER_CONTRACT_ADDRESS,
        abi: ISSUER_ABI,
        functionName: "issueLoan",
        args: [BigInt(requestId)],
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
            LOAN REQUESTS
          </h1>
          <p className="mt-2 text-gray-600">
            Manage and issue loans for accepted requests
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)]">
          {loading ? (
            <div className="text-center py-8">
              <p>Loading loan requests...</p>
            </div>
          ) : loanRequests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No pending loan requests found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Borrower</TableHead>
                  <TableHead>RWA ID</TableHead>
                  <TableHead>Valuation</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loanRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-mono">{request.id}</TableCell>
                    <TableCell>{request.productName}</TableCell>
                    <TableCell className="font-mono">
                      {request.borrower.slice(0, 6)}...
                      {request.borrower.slice(-4)}
                    </TableCell>
                    <TableCell>{request.rwaId}</TableCell>
                    <TableCell>
                      {ethers.formatEther(request.valuation)} ETH
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border-2 border-yellow-500">
                        {request.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleIssueLoan(request.id)}
                        className="border-2 border-black"
                        size="sm"
                      >
                        Issue Loan
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
