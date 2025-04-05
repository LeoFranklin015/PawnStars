import { RWATokenIssued as RWATokenIssuedEvent } from "../generated/RWA/RWA";
import { User, RWA } from "../generated/schema";
import { BigInt, Bytes } from "@graphprotocol/graph-ts";

export function handleRWATokenIssued(event: RWATokenIssuedEvent): void {
  const rwaId = event.params.tokenId.toString();
}
