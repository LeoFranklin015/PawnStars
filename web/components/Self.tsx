"use client";

import { countries, getUniversalLink } from "@selfxyz/core";
import SelfQRcodeWrapper, { SelfAppBuilder } from "@selfxyz/qrcode";
import { v4 } from "uuid";

export default function Self() {
  const userId = v4();
  const address = "0x4b4b30e2E7c6463b03CdFFD6c42329D357205334";

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
