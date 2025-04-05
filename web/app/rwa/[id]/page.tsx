"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LendModal from "@/components/lend-modal";
import Image from "next/image";
import { fetchSingleRWA } from "@/lib/helpers/fetchSingleRWA";

export default function RWADetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [rwa, setRWA] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLendModal, setShowLendModal] = useState(false);
  const [isAcceptingOffer, setIsAcceptingOffer] = useState(false);
  const [isOfferAccepted, setIsOfferAccepted] = useState(false);

  useEffect(() => {
    const loadRWA = async () => {
      try {
        const data = await fetchSingleRWA(params.id);
        setRWA(data);
      } catch (error) {
        console.error("Error loading RWA:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRWA();
  }, [params.id]);

  const handleAcceptOffer = () => {
    setIsAcceptingOffer(true);

    // Simulate API call
    setTimeout(() => {
      setIsAcceptingOffer(false);
      setIsOfferAccepted(true);
    }, 1500);
  };

  const getImageUrl = (rwa: any) => {
    if (rwa.imageHash && rwa.imageHash !== "") {
      return `/placeholder.svg?height=400&width=600`;
    }
    return "/placeholder.svg?height=400&width=600";
  };

  const getRWAStatus = (rwa: any) => {
    // First check the RWA status from the API
    if (rwa.status) {
      return rwa.status;
    }

    // Fallback to checking loan status
    if (rwa.loans && rwa.loans.length > 0) {
      const latestLoan = rwa.loans[0];
      if (latestLoan.status === "ACTIVE") {
        return "IN_LOAN";
      }
    }

    return "UNKNOWN";
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 dotted-background">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!rwa) {
    return (
      <div className="min-h-screen py-12 px-4 dotted-background">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">RWA not found</h1>
          <Button asChild variant="outline">
            <Link href="/my-rwas">Back to My RWAs</Link>
          </Button>
        </div>
      </div>
    );
  }

  const status = getRWAStatus(rwa);
  const latestLoan = rwa.loans && rwa.loans[0];
  const value = latestLoan ? parseInt(latestLoan.amount) / 1e18 : 0;

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
                  src={getImageUrl(rwa)}
                  alt={rwa.productName}
                  width={600}
                  height={400}
                  className="w-full h-auto rounded-lg border-2 border-black mb-6"
                />
                <div className="absolute top-4 right-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      status === "APPROVED"
                        ? "bg-green-100 text-green-800 border-2 border-green-500"
                        : status === "REQUESTED"
                        ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-500"
                        : status === "REQUESTED_LOAN"
                        ? "bg-blue-100 text-blue-800 border-2 border-blue-500"
                        : status === "REQUESTED_LOAN_VALIDATED"
                        ? "bg-purple-100 text-purple-800 border-2 border-purple-500"
                        : status === "IN_LOAN"
                        ? "bg-blue-100 text-blue-800 border-2 border-blue-500"
                        : "bg-gray-100 text-gray-800 border-2 border-gray-500"
                    }`}
                  >
                    {status === "APPROVED"
                      ? "Approved"
                      : status === "REQUESTED"
                      ? "Requested"
                      : status === "REQUESTED_LOAN"
                      ? "Loan Requested"
                      : status === "REQUESTED_LOAN_VALIDATED"
                      ? "Loan Offer Available"
                      : status === "IN_LOAN"
                      ? "In Loan"
                      : "Unknown"}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">{rwa.productName}</h1>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-100 p-3 rounded-lg border-2 border-gray-200">
                    <span className="text-sm text-gray-500">
                      Estimated Value
                    </span>
                    <div className="font-bold">
                      {value.toLocaleString()} ETH
                    </div>
                  </div>

                  <div className="bg-gray-100 p-3 rounded-lg border-2 border-gray-200">
                    <span className="text-sm text-gray-500">
                      Years of Usage
                    </span>
                    <div className="font-bold">{rwa.yearsOfUsage} years</div>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-2">Description</h2>
                  <p className="text-gray-700">
                    Token URI: {rwa.tokenURI}
                    <br />
                    Document Hash: {rwa.documentHash}
                  </p>
                </div>

                <div className="flex gap-4">
                  {status === "APPROVED" ? (
                    <Button
                      onClick={() => setShowLendModal(true)}
                      className="flex-1 border-2 border-black"
                    >
                      Request Loan
                    </Button>
                  ) : status === "REQUESTED" ? (
                    <Button
                      variant="outline"
                      className="flex-1 border-2 border-black"
                      disabled
                    >
                      Waiting for Approval
                    </Button>
                  ) : status === "REQUESTED_LOAN" ? (
                    <Button
                      variant="outline"
                      className="flex-1 border-2 border-black"
                      disabled
                    >
                      Loan Request Pending
                    </Button>
                  ) : status === "REQUESTED_LOAN_VALIDATED" ? (
                    <Button
                      className="flex-1 border-2 border-black bg-purple-500 hover:bg-purple-600 text-white"
                      onClick={() =>
                        document
                          .getElementById("loan-offer")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                    >
                      Review Loan Offer
                    </Button>
                  ) : status === "IN_LOAN" ? (
                    <Button
                      variant="outline"
                      className="flex-1 border-2 border-black"
                      disabled
                    >
                      Asset in Loan
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="flex-1 border-2 border-black"
                      disabled
                    >
                      Status Unknown
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

                {status === "APPROVED" ? (
                  <div className="flex items-center justify-center py-8 text-center">
                    <div>
                      <p className="text-gray-600 mb-4">
                        Your asset has been approved. You can now request a
                        loan.
                      </p>
                      <Button onClick={() => setShowLendModal(true)} size="sm">
                        Request Loan
                      </Button>
                    </div>
                  </div>
                ) : status === "REQUESTED" ? (
                  <div className="flex items-center justify-center py-8 text-center">
                    <div>
                      <p className="text-gray-600 mb-4">
                        Your asset is currently under review.
                      </p>
                      <div className="text-yellow-600 font-medium">
                        Waiting for approval
                      </div>
                    </div>
                  </div>
                ) : status === "REQUESTED_LOAN" ? (
                  <div className="flex items-center justify-center py-8 text-center">
                    <div>
                      <p className="text-gray-600 mb-4">
                        Your loan request is being processed.
                      </p>
                      <div className="text-blue-600 font-medium">
                        Waiting for validation
                      </div>
                    </div>
                  </div>
                ) : status === "REQUESTED_LOAN_VALIDATED" &&
                  latestLoan?.valuation ? (
                  <div id="loan-offer" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Requested Amount:</span>
                      <span className="font-bold">
                        {(
                          parseInt(latestLoan.requestedAmount) / 1e18
                        ).toLocaleString()}{" "}
                        ETH
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Interest Rate:</span>
                      <span className="font-bold">
                        {latestLoan.interestRate
                          ? (parseInt(latestLoan.interestRate) / 100).toFixed(2)
                          : "0"}
                        % APR
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status:</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border-2 border-purple-300">
                        OFFER AVAILABLE
                      </span>
                    </div>

                    <div className="mt-6 p-4 bg-purple-100 rounded-md border-2 border-purple-300">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-bold text-purple-800">
                            Loan Offer Available
                          </h3>
                          <p className="text-sm text-purple-700 mb-3">
                            A lender has made an offer for your loan request.
                          </p>
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-purple-800">
                              Offered Amount:
                            </span>
                            <span className="font-bold text-purple-800">
                              {(
                                parseInt(latestLoan.valuation) / 1e18
                              ).toLocaleString()}{" "}
                              ETH
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
                  </div>
                ) : status === "IN_LOAN" && latestLoan ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Loan Amount:</span>
                      <span className="font-bold">
                        {(
                          parseInt(latestLoan.amount || "0") / 1e18
                        ).toLocaleString()}{" "}
                        ETH
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Interest Rate:</span>
                      <span className="font-bold">
                        {latestLoan.interestRate
                          ? (parseInt(latestLoan.interestRate) / 100).toFixed(2)
                          : "0"}
                        % APR
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status:</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border-2 border-blue-300">
                        ACTIVE
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-8 text-center">
                    <div>
                      <p className="text-gray-600 mb-4">
                        No active loan information available.
                      </p>
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
                            {latestLoan && latestLoan.valuation
                              ? (
                                  parseInt(latestLoan.valuation) / 1e18
                                ).toLocaleString()
                              : "0"}{" "}
                            ETH
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-bold mb-4">Asset Timeline</h2>

                <div className="relative pl-8">
                  <div className="absolute top-0 left-3 h-full w-px bg-gray-200"></div>

                  <div className="relative mb-6">
                    <div className="absolute left-[-24px] top-0 h-6 w-6 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">RWA Created</p>
                      <p className="text-sm text-gray-500">
                        {new Date(
                          parseInt(rwa.createdAt) * 1000
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="relative mb-6">
                    <div
                      className={`absolute left-[-24px] top-0 h-6 w-6 rounded-full ${
                        status === "REQUESTED" ||
                        status === "APPROVED" ||
                        status === "REQUESTED_LOAN" ||
                        status === "REQUESTED_LOAN_VALIDATED" ||
                        status === "IN_LOAN"
                          ? "bg-green-100 border-2 border-green-500 flex items-center justify-center"
                          : "bg-gray-100 border-2 border-gray-300 flex items-center justify-center"
                      }`}
                    >
                      {status === "REQUESTED" ||
                      status === "APPROVED" ||
                      status === "REQUESTED_LOAN" ||
                      status === "REQUESTED_LOAN_VALIDATED" ||
                      status === "IN_LOAN" ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                      )}
                    </div>
                    <div>
                      <p
                        className={`font-medium ${
                          !(
                            status === "REQUESTED" ||
                            status === "APPROVED" ||
                            status === "REQUESTED_LOAN" ||
                            status === "REQUESTED_LOAN_VALIDATED" ||
                            status === "IN_LOAN"
                          ) && "text-gray-400"
                        }`}
                      >
                        RWA Approval
                      </p>
                      <p className="text-sm text-gray-500">
                        {status === "APPROVED" ||
                        status === "REQUESTED_LOAN" ||
                        status === "REQUESTED_LOAN_VALIDATED" ||
                        status === "IN_LOAN"
                          ? "Asset approved for lending"
                          : "Waiting for approval"}
                      </p>
                    </div>
                  </div>

                  <div className="relative mb-6">
                    <div
                      className={`absolute left-[-24px] top-0 h-6 w-6 rounded-full ${
                        status === "REQUESTED_LOAN" ||
                        status === "REQUESTED_LOAN_VALIDATED" ||
                        status === "IN_LOAN"
                          ? "bg-green-100 border-2 border-green-500 flex items-center justify-center"
                          : "bg-gray-100 border-2 border-gray-300 flex items-center justify-center"
                      }`}
                    >
                      {status === "REQUESTED_LOAN" ||
                      status === "REQUESTED_LOAN_VALIDATED" ||
                      status === "IN_LOAN" ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                      )}
                    </div>
                    <div>
                      <p
                        className={`font-medium ${
                          !(
                            status === "REQUESTED_LOAN" ||
                            status === "REQUESTED_LOAN_VALIDATED" ||
                            status === "IN_LOAN"
                          ) && "text-gray-400"
                        }`}
                      >
                        Loan Requested
                      </p>
                      <p className="text-sm text-gray-500">
                        {latestLoan &&
                        (status === "REQUESTED_LOAN" ||
                          status === "REQUESTED_LOAN_VALIDATED" ||
                          status === "IN_LOAN")
                          ? new Date(
                              parseInt(latestLoan.createdAt) * 1000
                            ).toLocaleDateString()
                          : "Not requested yet"}
                      </p>
                    </div>
                  </div>

                  <div className="relative mb-6">
                    <div
                      className={`absolute left-[-24px] top-0 h-6 w-6 rounded-full ${
                        status === "REQUESTED_LOAN_VALIDATED" ||
                        status === "IN_LOAN"
                          ? "bg-green-100 border-2 border-green-500 flex items-center justify-center"
                          : "bg-gray-100 border-2 border-gray-300 flex items-center justify-center"
                      }`}
                    >
                      {status === "REQUESTED_LOAN_VALIDATED" ||
                      status === "IN_LOAN" ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                      )}
                    </div>
                    <div>
                      <p
                        className={`font-medium ${
                          !(
                            status === "REQUESTED_LOAN_VALIDATED" ||
                            status === "IN_LOAN"
                          ) && "text-gray-400"
                        }`}
                      >
                        Loan Offer Available
                      </p>
                      <p className="text-sm text-gray-500">
                        {latestLoan &&
                        (status === "REQUESTED_LOAN_VALIDATED" ||
                          status === "IN_LOAN")
                          ? "Lender made an offer"
                          : "Waiting for offer"}
                      </p>
                    </div>
                  </div>

                  <div className="relative mb-6">
                    <div
                      className={`absolute left-[-24px] top-0 h-6 w-6 rounded-full ${
                        status === "IN_LOAN"
                          ? "bg-green-100 border-2 border-green-500 flex items-center justify-center"
                          : "bg-gray-100 border-2 border-gray-300 flex items-center justify-center"
                      }`}
                    >
                      {status === "IN_LOAN" ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                      )}
                    </div>
                    <div>
                      <p
                        className={`font-medium ${
                          !(status === "IN_LOAN") && "text-gray-400"
                        }`}
                      >
                        Loan Active
                      </p>
                      <p className="text-sm text-gray-500">
                        {latestLoan &&
                        status === "IN_LOAN" &&
                        latestLoan.startTime
                          ? new Date(
                              parseInt(latestLoan.startTime) * 1000
                            ).toLocaleDateString()
                          : "Not active yet"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showLendModal && (
        <LendModal rwa={rwa} onClose={() => setShowLendModal(false)} />
      )}
    </div>
  );
}
