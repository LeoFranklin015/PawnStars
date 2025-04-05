import { request, gql } from "graphql-request";
import { GRAPH_URL } from "../const";

export const fetchRWAs = async (address: string) => {
  const query = gql`
    query GetUserRWAs($address: String!) {
      rwas(where: { owner_: { id: $address } }) {
        id
        productName
        imageHash
        yearsOfUsage
        status
        documentHash
        tokenURI
        createdAt
        lastUpdated
        loans(orderBy: createdAt, orderDirection: desc, first: 1) {
          id
          status
          amount
        }
      }
    }
  `;

  const variables = {
    address: address.toLowerCase(),
  };

  try {
    const data: any = await request(GRAPH_URL, query, variables);
    console.log("Fetched RWAs:", data);
    return data.rwas;
  } catch (error) {
    console.error("Error fetching RWAs:", error);
    return [];
  }
};
