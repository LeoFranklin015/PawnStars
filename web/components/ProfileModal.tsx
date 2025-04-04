"use client";
import { Button } from "@/components/ui/button";
import { X, LogOut, User, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Self from "./Self";
import { fetchVerifiedUser } from "@/lib/helpers/fetchVerifiedUser";

interface ProfileModalProps {
  onClose: () => void;
  account: {
    displayName: string;
    displayBalance?: string;
    address: string;
  };
  onDisconnect?: () => void;
}

interface VerifiedUser {
  id: string;
  name: string;
  isVerified: boolean;
}

/* eslint-disable @typescript-eslint/no-unused-vars */
export default function ProfileModal({
  onClose,
  account,
  onDisconnect,
}: ProfileModalProps) {
  const [verifiedUser, setVerifiedUser] = useState<VerifiedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkVerification = async () => {
      if (account.address) {
        setLoading(true);
        try {
          const userData = await fetchVerifiedUser(
            account.address.toLowerCase()
          );
          setVerifiedUser(userData);
        } catch (error) {
          console.error("Error fetching user verification:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    checkVerification();
  }, [account.address]);

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-lg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] w-full max-w-md mx-4"
      >
        <div className="flex justify-between items-center p-4 border-b-2 border-black">
          <h2 className="text-xl font-bold">Profile</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              {verifiedUser && (
                <div className="absolute -top-1 -right-1 h-6 w-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <svg
                    className="h-3 w-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div>
              <h3 className="font-bold">
                {verifiedUser ? verifiedUser.name : account.displayName}
              </h3>
              <p className="text-sm text-gray-600 font-mono">
                {account.address.slice(0, 6)}...{account.address.slice(-4)}
              </p>
              {account.displayBalance && (
                <p className="text-sm text-gray-600">
                  {account.displayBalance}
                </p>
              )}
              {verifiedUser && (
                <p className="text-xs text-green-600 mt-1">Verified User</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {loading ? (
              <div className="w-full py-2 text-center text-sm text-gray-500">
                Checking verification status...
              </div>
            ) : !verifiedUser ? (
              <Self />
            ) : null}

            <Button
              variant="outline"
              className="w-full justify-start border-2 border-black text-left"
              onClick={() => {}}
            >
              <Settings className="mr-2 h-4 w-4" />
              Account Settings
            </Button>
            <Button
              variant="destructive"
              className="w-full justify-start border-2 border-black text-left"
              onClick={onDisconnect}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Disconnect
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
