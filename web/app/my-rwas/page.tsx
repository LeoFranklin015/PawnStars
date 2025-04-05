"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import LendModal from "@/components/lend-modal";
import Image from "next/image";
import { fetchRWAs } from "@/lib/helpers/fetchRWA";
import { useAccount } from "wagmi";
import { PinataSDK } from "pinata";

interface RWA {
  id: string;
  productName: string;
  imageHash: string;
  yearsOfUsage: string;
  status: string;
  documentHash: string;
  tokenURI: string;
  imageURL: string;
  contractStatus: number;
  loans: {
    id: string;
    status: string;
    amount: string;
  }[];
}

export default function MyRWAs() {
  const { address } = useAccount();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRWA, setSelectedRWA] = useState<RWA | null>(null);
  const [showLendModal, setShowLendModal] = useState(false);
  const [rwas, setRWAs] = useState<RWA[]>([]);
  const [rwasWithImages, setRWAsWithImages] = useState<RWA[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRWAs = async () => {
      if (!address) return;
      try {
        const data = await fetchRWAs(address);
        setRWAs(data);
      } catch (error) {
        console.error("Error loading RWAs:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRWAs();
  }, [address]);

  useEffect(() => {
    const fetchImages = async () => {
      const updatedrwas = await Promise.all(
        rwas.map(async (rwa) => {
          try {
            const pinata = new PinataSDK({
              pinataJwt:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlOTJkMDk2Ni1lZjI3LTQ2NzEtYWM2ZS0zZTE1N2M4ODFkNjYiLCJlbWFpbCI6ImNvY2xlbzE1QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI5ZTY0YTQ5NjZmYWI2NWJjOWQwZSIsInNjb3BlZEtleVNlY3JldCI6IjEyMWViNjQ1ZjBjNzYxNmJhMWZlYzE2MDdhODdhY2EyM2NiZDg2MTE4YTMzMjQ1NTg4MmExMWVlZDc0ZDM4MGMiLCJleHAiOjE3NzUzNTgxNTF9.wSV-uVK6VVXBB0fADd53QKL5ZuWJa0Cdi6VfevN3vfY",
              pinataGateway: "orange-select-opossum-767.mypinata.cloud",
            });
            if (!rwa.imageHash) {
              return { ...rwa, imageURL: "/placeholder.svg" };
            }

            const { data: imageURL, contentType } =
              await pinata.gateways.private.get(rwa.imageHash);
            console.log(imageURL);
            const blobUrl = URL.createObjectURL(
              new Blob([imageURL as Blob], { type: contentType || "image/png" })
            );

            return { ...rwa, imageURL: blobUrl || "/placeholder.svg" };
          } catch (error) {
            console.error(`Failed to fetch image for rwa ${rwa.id}:`, error);
            return { ...rwa, imageURL: "/placeholder.svg" };
          }
        })
      );
      console.log(updatedrwas);
      setRWAsWithImages(updatedrwas);
    };

    if (rwas.length > 0) {
      fetchImages();
    }
  }, [rwas]);

  const filteredRWAs = rwasWithImages.filter((rwa) =>
    rwa.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLendClick = (rwa: RWA) => {
    setSelectedRWA(rwa);
    setShowLendModal(true);
  };

  const getImageUrl = (rwa: RWA) => {
    if (rwa.imageHash && rwa.imageHash !== "") {
      return `/placeholder.svg?height=200&width=300`;
    }
    return "/placeholder.svg?height=200&width=300";
  };

  const getRWAStatus = (rwa: RWA) => {
    if (rwa.loans && rwa.loans.length > 0) {
      const latestLoan = rwa.loans[0];
      if (latestLoan.status === "ACTIVE") {
        return "lending";
      }
    }

    switch (rwa.contractStatus) {
      case 0:
        return "requested";
      case 1:
        return "valued";
      case 2:
        return "accepted";
      case 3:
        return "issued";
      case 4:
        return "repaid";
      default:
        return "unknown";
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "lending":
        return {
          text: "In Lending",
          classes: "bg-blue-100 text-blue-800 border-2 border-blue-500",
        };
      case "requested":
        return {
          text: "Loan Requested",
          classes: "bg-yellow-100 text-yellow-800 border-2 border-yellow-500",
        };
      case "valued":
        return {
          text: "Valuation Done",
          classes: "bg-purple-100 text-purple-800 border-2 border-purple-500",
        };
      case "accepted":
        return {
          text: "Loan Accepted",
          classes: "bg-green-100 text-green-800 border-2 border-green-500",
        };
      case "issued":
        return {
          text: "Loan Issued",
          classes: "bg-blue-100 text-blue-800 border-2 border-blue-500",
        };
      case "repaid":
        return {
          text: "Loan Repaid",
          classes: "bg-gray-100 text-gray-800 border-2 border-gray-500",
        };
      default:
        return {
          text: "Unknown",
          classes: "bg-gray-100 text-gray-800 border-2 border-gray-500",
        };
    }
  };

  if (!address) {
    return (
      <div className="min-h-screen py-12 px-4 dotted-background">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">
            Please connect your wallet
          </h1>
          <p className="text-gray-600">Connect your wallet to view your RWAs</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 dotted-background">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 dotted-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1
              className="text-4xl font-black"
              style={{ textShadow: "3px 3px 0px #FFD700" }}
            >
              MY RWA ASSETS
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your tokenized real-world assets
            </p>
          </div>
          <Button
            asChild
            className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)]"
          >
            <Link href="/create-rwa">
              <Plus className="mr-2 h-4 w-4" />
              Create New RWA
            </Link>
          </Button>
        </div>

        <div className="bg-white p-4 rounded-lg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search assets..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredRWAs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)]">
            <p className="text-gray-500 mb-4">
              No assets found matching your search.
            </p>
            <Button asChild variant="outline">
              <Link href="/create-rwa">
                <Plus className="mr-2 h-4 w-4" />
                Create New RWA
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRWAs.map((rwa) => {
              const status = getRWAStatus(rwa);
              const latestLoan = rwa.loans && rwa.loans[0];
              const value = latestLoan ? latestLoan.amount : "0";

              return (
                <div
                  key={rwa.id}
                  className="bg-white rounded-lg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] overflow-hidden"
                >
                  <Link href={`/rwa/${rwa.id}`}>
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={rwa.imageURL}
                        alt={rwa.productName}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            getStatusDisplay(status).classes
                          }`}
                        >
                          {getStatusDisplay(status).text}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className="p-4">
                    <Link href={`/rwa/${rwa.id}`}>
                      <h3 className="text-xl font-bold mb-2 hover:text-primary transition-colors">
                        {rwa.productName}
                      </h3>
                    </Link>

                    <div className="flex justify-between mb-4">
                      <div className="text-sm font-bold">
                        ${(parseInt(value) / 1e18).toLocaleString()} ETH
                      </div>
                      <div className="text-sm">
                        {rwa.yearsOfUsage}{" "}
                        {rwa.yearsOfUsage === "1" ? "year" : "years"} old
                      </div>
                    </div>

                    {status === "valued" ? (
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          handleLendClick(rwa);
                        }}
                        className="w-full border-2 border-black"
                      >
                        Accept Loan
                      </Button>
                    ) : (
                      <Button
                        asChild
                        variant="outline"
                        className="w-full border-2 border-black"
                      >
                        <Link href={`/rwa/${rwa.id}`}>View Details</Link>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showLendModal && selectedRWA && (
        <LendModal rwa={selectedRWA} onClose={() => setShowLendModal(false)} />
      )}
    </div>
  );
}
