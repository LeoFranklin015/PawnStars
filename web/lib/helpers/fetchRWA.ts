import { request, gql } from "graphql-request";
import { GRAPH_URL, ISSUER_ABI, ISSUER_CONTRACT_ADDRESS } from "../const";
import { publicClient } from "../client";

export const fetchRWAs = async (address: string) => {
  const query = gql`
    query GetUserRWAs($address: String!) {
      rwas(where: { owner_: { id: $address } }) {
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
    address: address.toLowerCase(),
  };

  try {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const data: any = await request(GRAPH_URL, query, variables);
    console.log("Fetched RWAs:", data);

    // Get contract status for each RWA
    const rwasWithStatus = await Promise.all(
      /* eslint-disable @typescript-eslint/no-explicit-any */
      data.rwas.map(async (rwa: any) => {
        const status = await publicClient.readContract({
          address: ISSUER_CONTRACT_ADDRESS,
          abi: ISSUER_ABI,
          functionName: "getRWAStatus",
          args: [BigInt(rwa.id)],
        });
        return {
          ...rwa,
          contractStatus: Number(status),
        };
      })
    );

    return rwasWithStatus;
  } catch (error) {
    console.error("Error fetching RWAs:", error);
    return [];
  }
};
