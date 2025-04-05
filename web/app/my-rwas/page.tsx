"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import LendModal from "@/components/lend-modal"

// Mock data for RWAs
const mockRWAs = [
  {
    id: "1",
    name: "Vintage Rolex Watch",
    image: "/placeholder.svg?height=200&width=300",
    value: 12000,
    status: "available",
    yearsOfUsage: 5,
  },
  {
    id: "2",
    name: 'MacBook Pro 16"',
    image: "/placeholder.svg?height=200&width=300",
    value: 2500,
    status: "lending",
    yearsOfUsage: 2,
  },
  {
    id: "3",
    name: "Diamond Necklace",
    image: "/placeholder.svg?height=200&width=300",
    value: 8000,
    status: "available",
    yearsOfUsage: 3,
  },
]

export default function MyRWAs() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRWA, setSelectedRWA] = useState<(typeof mockRWAs)[0] | null>(null)
  const [showLendModal, setShowLendModal] = useState(false)

  const filteredRWAs = mockRWAs.filter((rwa) => rwa.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleLendClick = (rwa: (typeof mockRWAs)[0]) => {
    setSelectedRWA(rwa)
    setShowLendModal(true)
  }

  return (
    <div className="min-h-screen py-12 px-4 dotted-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black" style={{ textShadow: "3px 3px 0px #FFD700" }}>
              MY RWA ASSETS
            </h1>
            <p className="mt-2 text-gray-600">Manage your tokenized real-world assets</p>
          </div>
          <Button asChild className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)]">
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
            <p className="text-gray-500 mb-4">No assets found matching your search.</p>
            <Button asChild variant="outline">
              <Link href="/create-rwa">
                <Plus className="mr-2 h-4 w-4" />
                Create New RWA
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRWAs.map((rwa) => (
              <div
                key={rwa.id}
                className="bg-white rounded-lg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] overflow-hidden"
              >
                <Link href={`/rwa/${rwa.id}`}>
                  <div className="relative h-48 overflow-hidden">
                    <img src={rwa.image || "/placeholder.svg"} alt={rwa.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          rwa.status === "available"
                            ? "bg-green-100 text-green-800 border-2 border-green-500"
                            : "bg-blue-100 text-blue-800 border-2 border-blue-500"
                        }`}
                      >
                        {rwa.status === "available" ? "Available" : "In Lending"}
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="p-4">
                  <Link href={`/rwa/${rwa.id}`}>
                    <h3 className="text-xl font-bold mb-2 hover:text-primary transition-colors">{rwa.name}</h3>
                  </Link>

                  <div className="flex justify-between mb-4">
                    <div className="text-sm font-bold">${rwa.value.toLocaleString()}</div>
                    <div className="text-sm">
                      {rwa.yearsOfUsage} {rwa.yearsOfUsage === 1 ? "year" : "years"} old
                    </div>
                  </div>

                  {rwa.status === "available" ? (
                    <Button
                      onClick={(e) => {
                        e.preventDefault()
                        handleLendClick(rwa)
                      }}
                      className="w-full border-2 border-black"
                    >
                      Lend Asset
                    </Button>
                  ) : (
                    <Button asChild variant="outline" className="w-full border-2 border-black">
                      <Link href={`/rwa/${rwa.id}`}>View Details</Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showLendModal && selectedRWA && <LendModal rwa={selectedRWA} onClose={() => setShowLendModal(false)} />}
    </div>
  )
}

