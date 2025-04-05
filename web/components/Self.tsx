"use client";

import { countries, getUniversalLink } from "@selfxyz/core";
import SelfQRcodeWrapper, { SelfAppBuilder } from "@selfxyz/qrcode";
import { v4 } from "uuid";

export default function Home() {
  const userId = v4();
  const address = "0x4b4b30e2E7c6463b03CdFFD6c42329D357205334";

  const selfApp = new SelfAppBuilder({
    appName: "Self Workshop",
    scope: "self-workshop",
    endpoint: `https://3129-111-235-226-130.ngrok-free.app/api/verify`,
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
    <div className="h-screen w-full bg-white flex flex-col items-center justify-center gap-4">
      <SelfQRcodeWrapper
        selfApp={selfApp}
        // type='deeplink'
        onSuccess={() => {
          console.log("Verification successful");
        }}
      />
      <button
        onClick={() => {
          window.alert(getUniversalLink(selfApp));
        }}
        className="mt-4 bg-black text-white p-2 px-3 rounded-md"
      >
        Open Self app
      </button>
    </div>
  );
}
