"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import VerificationModal from "@/components/verification-modal";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUserStore } from "@/lib/stores/user-store";

export default function Home() {
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const { user, isLoggedIn } = useUserStore();

  return (
    <div className="min-h-screen w-full flex flex-col dotted-background">
      <Navbar onVerify={() => setShowVerificationModal(false)} />

      <main className="flex-grow flex items-center justify-center p-8">
        <div className="w-full max-w-5xl">
          <div className="text-center mb-12">
            <motion.h1
              className="text-6xl font-black mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ textShadow: "4px 4px 0px #FFD700" }}
            >
              RWA LENDING
            </motion.h1>
            <motion.p
              className="text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Convert your real-world assets into on-chain tokens
            </motion.p>
          </div>

          <motion.div
            className="border-4 border-black bg-green-300 p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0)] rounded-lg text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex justify-center mb-8">
              <img
                src="/placeholder.svg?height=200&width=400"
                alt="RWA to Token Conversion"
                className="h-40 object-contain"
              />
            </div>

            <h2 className="text-2xl font-bold mb-4">
              Turn your assets into opportunities
            </h2>

            <p className="mb-8 max-w-2xl mx-auto">
              Create RWA tokens from your real-world assets and use them as
              collateral to get loans. Repay the loan to get your ownership
              back.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="font-bold text-lg">
                <Link href="/create-rwa">Create RWA Token</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="font-bold text-lg"
              >
                <Link href="/my-rwas">View My Assets</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {[
              {
                title: "Create",
                description: "Tokenize your real-world assets",
              },
              {
                title: "Lend",
                description: "Use your RWA tokens as collateral",
              },
              {
                title: "Repay",
                description: "Return the loan to reclaim ownership",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="border-4 border-black p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0)] rounded-lg bg-blue-200"
              >
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </main>

      {showVerificationModal && (
        <VerificationModal onClose={() => setShowVerificationModal(false)} />
      )}
    </div>
  );
}
