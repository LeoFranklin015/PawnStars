import { request, gql } from "graphql-request";
import { GRAPH_URL } from "../const";

export const fetchMarket = async () => {
  const query = gql`
    query MyQuery {
      rwas {
        createdAt
        id
        lastUpdated
        status
        tokenURI
        owner {
          id
          name
        }
      }
    }
  `;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await request(GRAPH_URL, query);
  console.log(data);
  return data.rwas[0];
};
