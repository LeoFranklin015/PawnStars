import { USERVERIFIED as UserVerifiedEvent } from "../generated/UniversalKYC/UniversalKYC";
import {
  User,
  UserVerifiedEvent as UserVerifiedEventEntity,
} from "../generated/schema";
import { BigInt, Bytes } from "@graphprotocol/graph-ts";

export function handleUserVerified(event: UserVerifiedEvent): void {
  // Create or load User entity
  let userId = event.params.user;
  let user = User.load(userId);
  if (!user) {
    user = new User(userId);
    user.isVerified = false;
    user.createdAt = event.block.timestamp;
  }

  // Update user verification status
  user.isVerified = true;
  user.verificationTime = event.block.timestamp;
  user.name = event.params.name;
  user.proof = event.params.proof;
  user.lastUpdated = event.block.timestamp;
  user.save();

  // Create verification event entity
  let eventId = Bytes.fromHexString(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  );
  let verificationEvent = new UserVerifiedEventEntity(eventId);
  verificationEvent.user = userId;
  verificationEvent.proof = event.params.proof;
  verificationEvent.name = event.params.name;
  verificationEvent.blockNumber = event.block.number;
  verificationEvent.blockTimestamp = event.block.timestamp;
  verificationEvent.transactionHash = event.transaction.hash;
  verificationEvent.save();
}
