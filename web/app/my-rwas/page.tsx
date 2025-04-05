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

export default function MyRWAs() {
  const { address } = useAccount();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRWA, setSelectedRWA] = useState<RWA | null>(null);
  const [showLendModal, setShowLendModal] = useState(false);
  const [rwas, setRWAs] = useState<RWA[]>([]);
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

  const filteredRWAs = rwas.filter((rwa) =>
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
    return "available";
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
                        src={getImageUrl(rwa)}
                        alt={rwa.productName}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            status === "available"
                              ? "bg-green-100 text-green-800 border-2 border-green-500"
                              : "bg-blue-100 text-blue-800 border-2 border-blue-500"
                          }`}
                        >
                          {status === "available" ? "Available" : "In Lending"}
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

                    {status === "available" ? (
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          handleLendClick(rwa);
                        }}
                        className="w-full border-2 border-black"
                      >
                        Lend Asset
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
