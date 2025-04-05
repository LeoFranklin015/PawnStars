import { request, gql } from "graphql-request";
import { GRAPH_URL } from "../const";

export const fetchRWAs = async (address: string) => {
  const query = gql`
    query MyQuery {
      rwas(
        where: { owner_: { id: "${address}" } }
      ) {
        createdAt
        documentHash
        lastUpdated
        id
        imageHash
        productName
        status
        yearsOfUsage
        tokenURI
      }
    }
  `;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await request(GRAPH_URL, query);
  console.log(data);
  return data.rwas[0];
};
