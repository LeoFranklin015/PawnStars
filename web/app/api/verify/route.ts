import { getUserIdentifier } from "@selfxyz/core";
import { NextResponse } from "next/server";
import { ethers } from "ethers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { proof, publicSignals } = body;
    const ContractAddress = "0xB35867517ce0D65Db253B8b9878cAdE96903607F"; // SELF VERIFIER

    if (!proof || !publicSignals) {
      return NextResponse.json(
        { message: "Proof and publicSignals are required" },
        { status: 400 }
      );
    }

    // const configuredVerifier = new SelfBackendVerifier(
    //   "self-workshop",
    //   "https://1d89-111-235-226-130.ngrok-free.app/api/verify",
    //   "uuid",
    //   true
    // )
    //   .setMinimumAge(20)
    //   .excludeCountries(countries.FRANCE);

    // const result = await configuredVerifier.verify(proof, publicSignals);
    // console.log("result", result);
    // console.log("Verification result:", result);
    // console.log("credentialSubject", result.credentialSubject);

    const address = await getUserIdentifier(publicSignals, "hex");
    console.log("Extracted address from verification result:", address);

    const abi = [
      {
        inputs: [
          {
            internalType: "address",
            name: "_identityVerificationHub",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_scope",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_attestationId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "_token",
            type: "address",
          },
          {
            internalType: "bool",
            name: "_olderThanEnabled",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "_olderThan",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "_forbiddenCountriesEnabled",
            type: "bool",
          },
          {
            internalType: "uint256[4]",
            name: "_forbiddenCountriesListPacked",
            type: "uint256[4]",
          },
          {
            internalType: "bool[3]",
            name: "_ofacEnabled",
            type: "bool[3]",
          },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        inputs: [],
        name: "InvalidAttestationId",
        type: "error",
      },
      {
        inputs: [],
        name: "InvalidScope",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
        name: "OwnableInvalidOwner",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "OwnableUnauthorizedAccount",
        type: "error",
      },
      {
        inputs: [],
        name: "RegisteredNullifier",
        type: "error",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "user",
            type: "address",
          },
        ],
        name: "KYCVerified",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "previousOwner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "OwnershipTransferred",
        type: "event",
      },
      {
        inputs: [],
        name: "owner",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            components: [
              {
                internalType: "uint256[2]",
                name: "a",
                type: "uint256[2]",
              },
              {
                internalType: "uint256[2][2]",
                name: "b",
                type: "uint256[2][2]",
              },
              {
                internalType: "uint256[2]",
                name: "c",
                type: "uint256[2]",
              },
              {
                internalType: "uint256[21]",
                name: "pubSignals",
                type: "uint256[21]",
              },
            ],
            internalType:
              "struct IVcAndDiscloseCircuitVerifier.VcAndDiscloseProof",
            name: "proof",
            type: "tuple",
          },
        ],
        name: "verifySelfProof",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ];
    const provider = new ethers.JsonRpcProvider(
      "https://alfajores-forno.celo-testnet.org"
    );
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);
    const contract = new ethers.Contract(ContractAddress, abi, signer);
    console.log("proof", proof);
    console.log("publicSignals", publicSignals);
    try {
      const tx = await contract.verifySelfProof({
        a: proof.a,
        b: [
          [proof.b[0][1], proof.b[0][0]],
          [proof.b[1][1], proof.b[1][0]],
        ],
        c: proof.c,
        pubSignals: publicSignals,
      });
      await tx.wait();
      console.log("Successfully called verifySelfProof function");

      return NextResponse.json(
        {
          status: "success",
          result: true,
          credentialSubject: {},
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error in contract call:", error);
      throw error; // Re-throw to be caught by outer catch block
    }
  } catch (error) {
    console.error("Error verifying proof:", error);
    return NextResponse.json(
      {
        message: "Error verifying proof",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
