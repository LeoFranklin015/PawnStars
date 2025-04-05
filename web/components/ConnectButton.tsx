import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useState } from "react";
import ProfileModal from "./ProfileModal";
import Image from "next/image";

export const CustomConnectButton = () => {
  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    onClick={openConnectModal}
                    type="button"
                    className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)]"
                  >
                    Connect Wallet
                  </Button>
                );
              }
              if (chain.unsupported) {
                return (
                  <Button
                    onClick={openChainModal}
                    type="button"
                    variant="destructive"
                    className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)]"
                  >
                    Wrong network
                  </Button>
                );
              }
              return (
                <div
                  style={{ display: "flex", gap: 12 }}
                  className="items-center"
                >
                  <Button
                    onClick={openChainModal}
                    type="button"
                    variant="outline"
                    className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] flex items-center"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: "hidden",
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <Image
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            width={12}
                            height={12}
                            className="w-full h-full"
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </Button>
                  <div className="relative">
                    <Button
                      onClick={() => setShowProfileModal(true)}
                      type="button"
                      variant="outline"
                      className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] p-2"
                      size="icon"
                    >
                      <div className="relative">
                        <User className="h-5 w-5" />
                        <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
                      </div>
                    </Button>
                  </div>
                </div>
              );
            })()}
            {showProfileModal && connected && (
              <ProfileModal
                onClose={() => setShowProfileModal(false)}
                account={{
                  displayName: account.displayName,
                  displayBalance: account.displayBalance,
                  address: account.address,
                }}
                onDisconnect={openAccountModal}
              />
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
