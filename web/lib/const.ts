export const GRAPH_URL =
  "https://api.studio.thegraph.com/query/73364/pawnstars/version/latest";

export const KYC_VERIFIER_CONTRACT_ADDRESS =
  "0x02DD486b283a644D1C72f83Ef5B4e4fF97f6D6BE";

export const UNIVERSAL_KYC_CONTRACT_ADDRESS =
  "0x5A47902ceb0AEbF11D18df3b88209E735Deb708C";

export const ISSUER_CONTRACT_ADDRESS =
  "0x4Bac3740e3980731f041983B61C075a2D316e78A";

export const RWA_CONTRACT_ADDRESS =
  "0xB1b866325B97367cBA86C2428400C1311907d7bb";

export const MOCK_USDC_CONTRACT_ADDRESS =
  "0xce0f39abbF9e8d42F9c64fF5EC7bfbb919bedE8E";

export const LENDING_PROTOCOL_CONTRACT_ADDRESS =
  "0x8A5fA1b0A754Ca969a748bF507b41c76aB43DC97";

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
