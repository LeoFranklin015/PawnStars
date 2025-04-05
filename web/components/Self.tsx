"use client";

import { countries, getUniversalLink } from "@selfxyz/core";
import SelfQRcodeWrapper, { SelfAppBuilder } from "@selfxyz/qrcode";
import { useAccount } from "wagmi";

export default function Self() {
  const { address } = useAccount();

  const selfApp = new SelfAppBuilder({
    appName: "Self Workshop",
    scope: "self-workshop",
    endpoint: `https://1d89-111-235-226-130.ngrok-free.app/api/verify`,
    logoBase64:
      "https://pluspng.com/img-png/images-owls-png-hd-owl-free-download-png-png-image-485.png",
    userIdType: "hex",
    userId: address,
    disclosures: {
      minimumAge: 20,
      ofac: false,
      excludedCountries: [countries.NORTH_KOREA],
      name: true,
    },

    devMode: true,
  }).build();
  console.log("Universal link:", getUniversalLink(selfApp));

  return (
    <div className="w-full bg-white flex flex-col items-center justify-center gap-4">
      <SelfQRcodeWrapper
        selfApp={selfApp}
        // type='deeplink'
        onSuccess={() => {
          console.log("Verification successful");
        }}
      />
    </div>
  );
}
