export const KYC_VERIFIER_CONTRACT_ADDRESS =
  "0x02DD486b283a644D1C72f83Ef5B4e4fF97f6D6BE";

export const UNIVERSAL_KYC_CONTRACT_ADDRESS =
  "0xb35867517ce0d65db253b8b9878cade96903607f";

export const ISSUER_CONTRACT_ADDRESS =
  "0x5e00488D2E7b887d2583F2657ce6816875C4De30";

export const RWA_CONTRACT_ADDRESS =
  "0x036551552e14AC7fbb0754FF1dDC5Ae64E0F1834";

export const ISSUER_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_rwaContractAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_universalKYCAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
    ],
    name: "RWAApproved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "requester",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "yearsOfUsage",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "productName",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "productModel",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "documentHash",
        type: "string",
      },
    ],
    name: "RWARequestCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
    ],
    name: "approveRWA",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "requestCounter",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_productName",
        type: "string",
      },
      {
        internalType: "string",
        name: "_productModel",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_yearsOfUsage",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_documentHash",
        type: "string",
      },
    ],
    name: "requestRWA",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "rwaContract",
    outputs: [
      {
        internalType: "contract RWA",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "rwaContractAddress",
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
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "rwaRequests",
    outputs: [
      {
        internalType: "address",
        name: "requester",
        type: "address",
      },
      {
        internalType: "string",
        name: "productName",
        type: "string",
      },
      {
        internalType: "string",
        name: "productModel",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "yearsOfUsage",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isApproved",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "isIssued",
        type: "bool",
      },
      {
        internalType: "string",
        name: "documentHash",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "universalKYC",
    outputs: [
      {
        internalType: "contract UniversalKYC",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
