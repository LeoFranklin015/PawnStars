import {
  RWAApproved as RWAApprovedEvent,
  RWARequestCreated as RWARequestCreatedEvent,
} from "../generated/Issuer/Issuer";
import { User, RWA, RWARequest } from "../generated/schema";
import { BigInt, Bytes } from "@graphprotocol/graph-ts";

export function handleRWARequestCreated(event: RWARequestCreatedEvent): void {
  // Load or create User
  let userId = event.params.requester;
  let user = User.load(userId);
  if (!user) {
    user = new User(userId);
    user.isVerified = false;
    user.createdAt = event.block.timestamp;
    user.lastUpdated = event.block.timestamp;
    user.save();
  }

  let requestId = event.params.requestId.toString();

  // Create RWA entity in REQUESTED state
  let rwa = new RWA(requestId);
  rwa.owner = userId;
  rwa.tokenURI = event.params.documentHash; // Initially use documentHash as tokenURI
  rwa.status = "REQUESTED";
  rwa.createdAt = event.block.timestamp;
  rwa.lastUpdated = event.block.timestamp;
  rwa.save();

  // Create RWA Request
  let request = new RWARequest(requestId);
  request.requester = userId;
  request.rwa = requestId;
  request.productName = event.params.productName;
  request.productModel = event.params.productModel;
  request.yearsOfUsage = event.params.yearsOfUsage;
  request.documentHash = event.params.documentHash;
  request.status = "PENDING";
  request.createdAt = event.block.timestamp;
  request.lastUpdated = event.block.timestamp;
  request.save();
}

export function handleRWAApproved(event: RWAApprovedEvent): void {
  let requestId = event.params.requestId.toString();

  // Update RWA Request status
  let request = RWARequest.load(requestId);
  if (!request) return;

  request.status = "APPROVED";
  request.lastUpdated = event.block.timestamp;
  request.save();

  // Update RWA status
  let rwa = RWA.load(requestId);
  if (!rwa) return;

  rwa.status = "APPROVED";
  rwa.lastUpdated = event.block.timestamp;
  rwa.save();
}
