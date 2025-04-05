import { request, gql } from "graphql-request";
import { GRAPH_URL } from "../const";

export interface RWA {
  id: string;
  productName: string;
  imageHash: string;
  yearsOfUsage: string;
  status: string;
  documentHash: string;
  tokenURI: string;
  createdAt: string;
  lastUpdated: string;
  owner: {
    id: string;
    isVerified: boolean;
    name: string;
    proof: string;
    createdAt: string;
    lastUpdated: string;
  };
  loans: {
    id: string;
    amount: string;
    requestedAmount: string;
    valuation: string;
    interestRate: string;
    startTime: string;
    dueTime: string;
    repaymentAmount: string;
    repaymentTime: string;
    status: string;
    createdAt: string;
    lastUpdated: string;
  }[];
}

export const fetchSingleRWA = async (id: string): Promise<RWA | null> => {
  const query = gql`
    query GetRWA($id: String!) {
      rwas(where: { id: $id }) {
        id
        productName
        imageHash
        yearsOfUsage
        status
        documentHash
        tokenURI
        createdAt
        lastUpdated
        owner {
          id
          isVerified
          name
          proof
          createdAt
          lastUpdated
        }
        loans(orderBy: createdAt, orderDirection: desc) {
          id
          amount
          requestedAmount
          valuation
          interestRate
          startTime
          dueTime
          repaymentAmount
          repaymentTime
          status
          createdAt
          lastUpdated
        }
      }
    }
  `;

  const variables = {
    id,
  };

  try {
    const data: any = await request(GRAPH_URL, query, variables);
    console.log("Fetched RWA:", data);
    return data.rwas[0] || null;
  } catch (error) {
    console.error("Error fetching RWA:", error);
    return null;
  }
};
