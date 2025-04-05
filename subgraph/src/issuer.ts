import {
  RWAApproved as RWAApprovedEvent,
  RWARequestCreated as RWARequestCreatedEvent,
} from "../generated/Issuer/Issuer";
import { User, RWA } from "../generated/schema";
import { BigInt, Bytes } from "@graphprotocol/graph-ts";

export function handleRWARequestCreated(event: RWARequestCreatedEvent): void {
  // Load or create User
  let userId = event.params.requester;
  let user = User.load(userId);
  if (!user) {
    user = new User(userId);
    user.isVerified = false;
    user.name = "";
    user.proof = Bytes.fromHexString("0x");
    user.createdAt = event.block.timestamp;
    user.lastUpdated = event.block.timestamp;
    user.save();
  }

  let requestId = event.params.requestId.toString();

  // Create RWA entity in REQUESTED state
  let rwa = new RWA(requestId);
  rwa.owner = userId;
  rwa.tokenURI = event.params.documentHash;
  rwa.status = "REQUESTED";
  rwa.productName = event.params.productName;
  rwa.productModel = event.params.imageHash;
  rwa.yearsOfUsage = event.params.yearsOfUsage;
  rwa.documentHash = event.params.documentHash;
  rwa.createdAt = event.block.timestamp;
  rwa.lastUpdated = event.block.timestamp;
  rwa.save();
}

export function handleRWAApproved(event: RWAApprovedEvent): void {
  let requestId = event.params.requestId.toString();

  // Update RWA status
  let rwa = RWA.load(requestId);
  if (!rwa) return;

  rwa.status = "APPROVED";
  rwa.productName = event.params.productName;
  rwa.productModel = event.params.productModel;
  rwa.documentHash = event.params.documentHash;
  rwa.lastUpdated = event.block.timestamp;
  rwa.save();
}
