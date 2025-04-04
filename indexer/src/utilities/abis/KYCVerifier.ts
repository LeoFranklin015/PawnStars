export const KYCVerifierAbi = [
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
    name: "INSUFFICIENT_CHARCODE_LEN",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidAttestationId",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidFieldElement",
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
      {
        indexed: false,
        internalType: "string",
        name: "firstName",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "lastName",
        type: "string",
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
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "getFirstName",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "getLastName",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "isVerified",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
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
        internalType: "struct IVcAndDiscloseCircuitVerifier.VcAndDiscloseProof",
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
