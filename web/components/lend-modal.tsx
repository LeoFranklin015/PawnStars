"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, CheckCircle, Info } from "lucide-react";
import Image from "next/image";
import { publicClient, walletClient } from "@/lib/client";
import {
  LENDING_PROTOCOL_CONTRACT_ADDRESS,
  LendingProtocolABI,
} from "@/lib/const";
import { useAccount } from "wagmi";

interface RWA {
  id: string;
  productName: string;
  imageHash: string;
  yearsOfUsage: string;
  status: string;
  documentHash: string;
  tokenURI: string;
  loans: {
    id: string;
    status: string;
    amount: string;
  }[];
}

interface LendModalProps {
  rwa: RWA;
  onClose: () => void;
}

export default function LendModal({ rwa, onClose }: LendModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { address } = useAccount();

  console.log(rwa);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const rwaId = parseInt(rwa.id) - 1;
    console.log(rwaId);
    const tx = await walletClient?.writeContract({
      address: LENDING_PROTOCOL_CONTRACT_ADDRESS,
      abi: LendingProtocolABI,
      functionName: "requestLoan",
      args: [BigInt(rwaId)],
      account: address as `0x${string}`,
    });
    console.log(tx);
    await publicClient.waitForTransactionReceipt({ hash: tx! });
    console.log("Transaction complete");
    setIsComplete(true);
    setIsSubmitting(false);
  };

  const getImageUrl = (rwa: RWA) => {
    if (rwa.imageHash && rwa.imageHash !== "") {
      return `/placeholder.svg?height=200&width=300`;
    }
    return "/placeholder.svg?height=200&width=300";
  };

  // Get the latest loan amount or use a default value
  const latestLoan = rwa.loans && rwa.loans[0];
  const value = latestLoan ? parseInt(latestLoan.amount) / 1e18 : 0;
  const maxLoanAmount = Math.floor(value * 0.6);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b-4 border-black">
          <h2 className="text-xl font-bold">Lend Your Asset</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          {isComplete ? (
            <div className="flex flex-col items-center text-center py-8">
              <div className="h-16 w-16 bg-green-100 rounded-full border-4 border-green-500 flex items-center justify-center mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                Loan Request Submitted!
              </h3>
              <p className="text-gray-600 mb-4">
                {`Your loan request has been submitted successfully. You'll be
                notified once it's processed.`}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-6">
                <div className="flex items-center mb-4">
                  <Image
                    src={getImageUrl(rwa)}
                    alt={rwa.productName}
                    width={400}
                    height={300}
                    className="w-20 h-20 object-cover rounded-md border-2 border-black mr-4"
                  />
                  <div>
                    <h3 className="font-bold text-lg">{rwa.productName}</h3>
                    <p className="text-gray-600">
                      Value: {value.toLocaleString()} ETH
                    </p>
                  </div>
                </div>

                <div className="bg-blue-100 p-4 rounded-md border-2 border-blue-300 mb-4">
                  <div className="flex">
                    <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                    <p className="text-blue-700 text-sm">
                      {`You can request up to 60% of your asset's value as a loan.
                      The maximum amount available is ${maxLoanAmount.toLocaleString()} ETH.`}
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-100 p-4 rounded-md border-2 border-yellow-300">
                  <p className="text-yellow-800 text-sm">
                    By submitting, your RWA will be locked in the smart contract
                    as collateral until the loan is repaid.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                      />
                      Processing...
                    </>
                  ) : (
                    "Request Loan"
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
