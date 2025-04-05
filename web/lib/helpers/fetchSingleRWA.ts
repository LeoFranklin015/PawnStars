import { request, gql } from "graphql-request";
import { GRAPH_URL } from "../const";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const fetchSingleRWA = async (id: string): Promise<any | null> => {
  const query = gql`
    query GetRWA($id: String!) {
      rwas(where: { id: $id }) {
        createdAt
        documentHash
        id
        imageHash
        lastUpdated
        status
        productName
        tokenURI
        yearsOfUsage
        loans {
          amount
          createdAt
          dueTime
          id
          interestRate
          lastUpdated
          repaymentAmount
          repaymentTime
          requestedAmount
          startTime
          status
          valuation
        }
        owner {
          id
          name
        }
      }
    }
  `;

  const variables = {
    id,
  };

  try {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const data: any = await request(GRAPH_URL, query, variables);
    console.log("Fetched RWA:", data);
    return data.rwas[0] || null;
  } catch (error) {
    console.error("Error fetching RWA:", error);
    return null;
  }
};
