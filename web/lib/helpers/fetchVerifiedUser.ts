import { request, gql } from "graphql-request";
import { GRAPH_URL } from "../const";

export const fetchVerifiedUser = async (
  address: string
  /* eslint-disable @typescript-eslint/no-explicit-any */
): Promise<any | null> => {
  const query = gql`
    query MyQuery {
      user(id: "${address}") {
        isVerified
        name
        id  
      }
    }
  `;

  const variables = {
    address,
  };

  try {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const data: any = await request(GRAPH_URL, query, variables);
    console.log("Fetched RWA:", data);
    if (data.user.isVerified) {
      return data.user;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching RWA:", error);
    return null;
  }
};
