"use client";
import Navbar from "@/components/navbar";
import { useState } from "react";
import VerificationModal from "@/components/verification-modal";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onVerify={() => setShowVerificationModal(false)} />
      {children}
      {showVerificationModal && (
        <VerificationModal onClose={() => setShowVerificationModal(false)} />
      )}
    </div>
  );
};
