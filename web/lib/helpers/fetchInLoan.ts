import { request, gql } from "graphql-request";
import { GRAPH_URL, ISSUER_ABI, ISSUER_CONTRACT_ADDRESS } from "../const";
import { publicClient } from "../client";

export const fetchInLoan = async () => {
  const query = gql`
    query GetInLoanRWAs {
      rwas(where: { status: IN_LOAN }) {
        createdAt
        documentHash
        id
        imageHash
        lastUpdated
        status
        productName
        tokenURI
        yearsOfUsage
        loans(orderBy: createdAt, orderDirection: desc, first: 1) {
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

  try {
    const data: any = await request(GRAPH_URL, query);
    console.log("Fetched IN_LOAN RWAs:", data);
    return data.rwas || [];
  } catch (error) {
    console.error("Error fetching IN_LOAN RWAs:", error);
    return [];
  }
};
