import { RWATokenIssued as RWATokenIssuedEvent } from "../generated/RWA/RWA";
import {
  User,
  RWA,
  RWATokenIssuedEvent as RWATokenIssuedEventEntity,
} from "../generated/schema";
import { BigInt, Bytes } from "@graphprotocol/graph-ts";

export function handleRWATokenIssued(event: RWATokenIssuedEvent): void {
  // Load or create User
  let userId = event.params.owner;
  let user = User.load(userId);
  if (!user) {
    user = new User(userId);
    user.isVerified = false;
    user.createdAt = event.block.timestamp;
    user.lastUpdated = event.block.timestamp;
    user.save();
  }

  let rwaId = event.params.tokenId.toString();

  // Create RWA entity
  let rwa = new RWA(rwaId);
  rwa.owner = userId;
  rwa.tokenURI = event.params.tokenURI;
  rwa.status = "ISSUED";
  rwa.createdAt = event.block.timestamp;
  rwa.lastUpdated = event.block.timestamp;
  rwa.save();

  // Create token issuance event entity
  let eventId = Bytes.fromHexString(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  );
  let issuanceEvent = new RWATokenIssuedEventEntity(eventId);
  issuanceEvent.rwa = rwaId;
  issuanceEvent.owner = userId;
  issuanceEvent.tokenURI = event.params.tokenURI;
  issuanceEvent.blockNumber = event.block.number;
  issuanceEvent.blockTimestamp = event.block.timestamp;
  issuanceEvent.transactionHash = event.transaction.hash;
  issuanceEvent.save();
}
