"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import VerificationModal from "@/components/verification-modal";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUserStore } from "@/lib/stores/user-store";
import { CheckCircle2, FileCheck, Coins, ArrowRight } from "lucide-react";

export default function Home() {
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const { user, isLoggedIn } = useUserStore();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onVerify={() => setShowVerificationModal(false)} />

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <h1
                className="text-6xl md:text-7xl font-black"
                style={{ textShadow: "4px 4px 0px #FFD700" }}
              >
                PAWNSTARS
              </h1>

              <h2 className="text-3xl font-bold">
                Turn Your Valuables Into RWA's
              </h2>

              <p className="text-lg text-gray-600">
                Hold the proof of asset and lend the asset to get some cash
                whenever needed !
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="font-bold text-base border-2 border-black"
                >
                  <Link href="/create-rwa">Get Started</Link>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="font-bold text-base border-2 border-black"
                >
                  <Link href="/my-rwas">View My Assets</Link>
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-10 w-10 rounded-full border-2 border-black bg-green-200 flex items-center justify-center"
                    >
                      <span className="text-xs font-bold">U{i}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-bold text-black">People</span> started
                  to bring thier Real World Assets onchain
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="border-2 border-black rounded-xl overflow-hidden bg-green-100 p-8">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="Luxury items collage"
                  className="w-full h-auto rounded-lg border-2 border-black mb-6"
                />
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-lg border-2 border-black">
                    <div className="text-sm font-bold mb-1">
                      Estimated Value
                    </div>
                    <div className="text-2xl font-black">$12,500</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-2 border-black">
                    <div className="text-sm font-bold mb-1">Available Cash</div>
                    <div className="text-2xl font-black text-primary">
                      $7,500
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How PawnStars Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our streamlined process gets you cash quickly and securely in just
              three simple steps
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Horizontal line */}
            <div className="absolute top-[60px] left-0 right-0 h-1 bg-black z-0"></div>

            {/* Timeline steps */}
            <div className="relative z-10">
              <div className="flex justify-between">
                {[
                  {
                    icon: <CheckCircle2 className="h-6 w-6" />,
                    title: "Verify KYC",
                    description:
                      "Complete identity verification and compliance",
                    color: "bg-blue-100",
                  },
                  {
                    icon: <FileCheck className="h-6 w-6" />,
                    title: "Create RWA",
                    description: "Tokenize your valuable assets securely",
                    color: "bg-pink-100",
                  },
                  {
                    icon: <Coins className="h-6 w-6" />,
                    title: "Get USD",
                    description: "Use your RWA as collateral for instant cash",
                    color: "bg-yellow-100",
                  },
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    className="flex flex-col items-center w-1/3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.2 }}
                  >
                    <div
                      className={`h-32 w-32 rounded-full ${step.color} border-2 border-black flex items-center justify-center mb-6 relative`}
                    >
                      <div className="h-20 w-20 rounded-full bg-white border-2 border-black flex items-center justify-center">
                        {step.icon}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-2 text-center">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 text-center max-w-[180px]">
                      {step.description}
                    </p>

                    {index < 2 && (
                      <div
                        className="absolute top-[60px] transform -translate-y-1/2"
                        style={{ left: `${33.3 * (index + 1)}%` }}
                      >
                        <ArrowRight className="h-6 w-6 text-black -translate-x-1/2" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Fast & Secure",
                description:
                  "Get cash in as little as 24 hours with our secure process that protects your assets.",
                color: "bg-blue-100",
              },
              {
                title: "No Credit Checks",
                description:
                  "Your assets determine your loan amount, not your credit score. Bad credit? No problem.",
                color: "bg-pink-100",
              },
              {
                title: "Keep Your Assets",
                description:
                  "Repay your loan within the agreed timeframe to reclaim full ownership of your valuables.",
                color: "bg-yellow-100",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.2 }}
                className={`${feature.color} p-8 rounded-lg border-2 border-black`}
              >
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to unlock the value of your assets?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have turned their
            valuables into cash without selling them.
          </p>
          <Button
            size="lg"
            variant="outline"
            className="bg-white text-primary hover:bg-white/90 border-white"
          >
            <Link href="/create-rwa">Get Started Now</Link>
          </Button>
        </div>
      </section>

      {showVerificationModal && (
        <VerificationModal onClose={() => setShowVerificationModal(false)} />
      )}
    </div>
  );
}
