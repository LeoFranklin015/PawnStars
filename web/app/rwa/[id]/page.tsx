"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LendModal from "@/components/lend-modal";
import Image from "next/image";

// Mock data for a single RWA
const mockRWA = {
  id: "1",
  name: "Vintage Rolex Watch",
  image: "/placeholder.svg?height=400&width=600",
  value: 12000,
  status: "lending", // available, lending, approved
  yearsOfUsage: 5,
  createdAt: "2023-10-15",
  description:
    "Authentic Rolex Submariner in excellent condition. Includes original box and papers. Serial number verified. Minor scratches on the bracelet from normal wear.",
  loanDetails: {
    requestedAmount: 7000,
    interestRate: 5,
    startDate: null,
    dueDate: null,
    status: "pending", // pending, active, repaid
    lenderOffer: 6500,
    offerAccepted: false,
  },
};

/* eslint-disable @typescript-eslint/no-unused-vars */
export default function RWADetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [showLendModal, setShowLendModal] = useState(false);
  const [isAcceptingOffer, setIsAcceptingOffer] = useState(false);
  const [isOfferAccepted, setIsOfferAccepted] = useState(false);

  const handleAcceptOffer = () => {
    setIsAcceptingOffer(true);

    // Simulate API call
    setTimeout(() => {
      setIsAcceptingOffer(false);
      setIsOfferAccepted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen py-12 px-4 dotted-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Button
            variant="outline"
            asChild
            className="mb-4 border-2 border-black"
          >
            <Link href="/my-rwas">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to My RWAs
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] overflow-hidden">
              <div className="relative">
                <Image
                  src={mockRWA.image || "/placeholder.svg"}
                  alt={mockRWA.name}
                  width={600}
                  height={400}
                  className="w-full h-auto rounded-lg border-2 border-black mb-6"
                />
                <div className="absolute top-4 right-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      mockRWA.status === "available"
                        ? "bg-green-100 text-green-800 border-2 border-green-500"
                        : "bg-blue-100 text-blue-800 border-2 border-blue-500"
                    }`}
                  >
                    {mockRWA.status === "available"
                      ? "Available"
                      : "In Lending Process"}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">{mockRWA.name}</h1>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-100 p-3 rounded-lg border-2 border-gray-200">
                    <span className="text-sm text-gray-500">
                      Estimated Value
                    </span>
                    <div className="font-bold">
                      ${mockRWA.value.toLocaleString()}
                    </div>
                  </div>

                  <div className="bg-gray-100 p-3 rounded-lg border-2 border-gray-200">
                    <span className="text-sm text-gray-500">
                      Years of Usage
                    </span>
                    <div className="font-bold">
                      {mockRWA.yearsOfUsage} years
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-2">Description</h2>
                  <p className="text-gray-700">{mockRWA.description}</p>
                </div>

                <div className="flex gap-4">
                  {mockRWA.status === "available" ? (
                    <Button
                      onClick={() => setShowLendModal(true)}
                      className="flex-1 border-2 border-black"
                    >
                      Request Loan
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="flex-1 border-2 border-black"
                      disabled
                    >
                      Asset In Lending Process
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] overflow-hidden mb-6">
              <div className="p-6">
                <h2 className="text-lg font-bold mb-4">Loan Status</h2>

                {mockRWA.status === "available" ? (
                  <div className="flex items-center justify-center py-8 text-center">
                    <div>
                      <p className="text-gray-600 mb-4">
                        No active loan requests for this asset.
                      </p>
                      <Button onClick={() => setShowLendModal(true)} size="sm">
                        Request Loan
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Requested Amount:</span>
                      <span className="font-bold">
                        ${mockRWA.loanDetails.requestedAmount.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Interest Rate:</span>
                      <span className="font-bold">
                        {mockRWA.loanDetails.interestRate}% APR
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status:</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border-2 border-yellow-300">
                        Pending
                      </span>
                    </div>

                    {mockRWA.loanDetails.lenderOffer &&
                      !mockRWA.loanDetails.offerAccepted &&
                      !isOfferAccepted && (
                        <div className="mt-6 p-4 bg-yellow-100 rounded-md border-2 border-yellow-300">
                          <div className="flex items-start">
                            <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                              <h3 className="font-bold text-yellow-800">
                                Lender Offer
                              </h3>
                              <p className="text-sm text-yellow-700 mb-3">
                                A lender has made an offer for your loan
                                request.
                              </p>
                              <div className="flex justify-between items-center mb-4">
                                <span className="text-yellow-800">
                                  Offered Amount:
                                </span>
                                <span className="font-bold text-yellow-800">
                                  $
                                  {mockRWA.loanDetails.lenderOffer.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  onClick={handleAcceptOffer}
                                  size="sm"
                                  className="w-full"
                                  disabled={isAcceptingOffer}
                                >
                                  {isAcceptingOffer
                                    ? "Processing..."
                                    : "Accept Offer"}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                  disabled={isAcceptingOffer}
                                >
                                  Decline
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                    {isOfferAccepted && (
                      <div className="mt-6 p-4 bg-green-100 rounded-md border-2 border-green-300">
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <div>
                            <h3 className="font-bold text-green-800">
                              Offer Accepted
                            </h3>
                            <p className="text-sm text-green-700 mb-3">
                              {`You've accepted the lender's offer. The loan will
                              be processed shortly.`}
                            </p>
                            <div className="flex justify-between items-center">
                              <span className="text-green-800">Amount:</span>
                              <span className="font-bold text-green-800">
                                $
                                {mockRWA.loanDetails.lenderOffer.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-bold mb-4">Loan Timeline</h2>

                <div className="relative pl-8">
                  <div className="absolute top-0 left-3 h-full w-px bg-gray-200"></div>

                  <div className="relative mb-6">
                    <div className="absolute left-[-24px] top-0 h-6 w-6 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">RWA Created</p>
                      <p className="text-sm text-gray-500">
                        {new Date(mockRWA.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {mockRWA.status !== "available" && (
                    <div className="relative mb-6">
                      <div className="absolute left-[-24px] top-0 h-6 w-6 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium">Loan Requested</p>
                        <p className="text-sm text-gray-500">
                          {new Date(
                            new Date(mockRWA.createdAt).getTime() + 86400000
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {isOfferAccepted && (
                    <div className="relative mb-6">
                      <div className="absolute left-[-24px] top-0 h-6 w-6 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium">Offer Accepted</p>
                        <p className="text-sm text-gray-500">
                          {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showLendModal && (
        <LendModal rwa={mockRWA} onClose={() => setShowLendModal(false)} />
      )}
    </div>
  );
}
