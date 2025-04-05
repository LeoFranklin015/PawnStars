import { UserVerified as UserVerifiedEvent } from "../generated/UniversalKYC/UniversalKYC";
import { User } from "../generated/schema";
import { Bytes, log } from "@graphprotocol/graph-ts";

export function handleUserVerified(event: UserVerifiedEvent): void {
  // Create or load User entity
  log.info("User verified: {}", [event.params.user.toHexString()]);
  log.info("Name: {}", [event.params.name]);
  log.info("Proof: {}", [event.params.proof.toHexString()]);
  let userId = event.params.user;
  let user = User.load(userId);
  if (!user) {
    user = new User(userId);
    user.isVerified = false;
    user.name = "";
    user.proof = Bytes.fromHexString("0x");
    user.createdAt = event.block.timestamp;
    user.lastUpdated = event.block.timestamp;
  }

  // Update user verification status
  user.isVerified = true;
  user.name = event.params.name;
  user.proof = event.params.proof;
  user.lastUpdated = event.block.timestamp;
  user.save();
}
