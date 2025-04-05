"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, CheckCircle2 } from "lucide-react";
import { useUserStore } from "@/lib/stores/user-store";
import { CustomConnectButton } from "./ConnectButton";
import { useAccount } from "wagmi";

interface NavbarProps {
  onVerify: () => void;
}

export default function Navbar({ onVerify }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isLoggedIn, logout } = useUserStore();
  const { address } = useAccount();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "My RWAs", href: "/my-rwas" },
    { name: "Create RWA", href: "/create-rwa" },
  ];

  return (
    <header className="w-full bg-white border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-black">Pawn</span>
            <span className="text-2xl font-black text-primary ml-1">Stars</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-base font-bold hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Auth section */}
          <div className="hidden md:flex items-center">
            <CustomConnectButton />
          </div>

          {/* Mobile menu button */}
          {address && (
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t-2 border-black">
          <div className="px-2 pt-2 pb-4 space-y-1 bg-white">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            <CustomConnectButton />
          </div>
        </div>
      )}
    </header>
  );
}
