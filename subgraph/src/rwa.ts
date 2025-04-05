import { RWATokenIssued as RWATokenIssuedEvent } from "../generated/RWA/RWA";
import { User, RWA } from "../generated/schema";
import { BigInt, Bytes } from "@graphprotocol/graph-ts";

export function handleRWATokenIssued(event: RWATokenIssuedEvent): void {
  // Load or create User
  let userId = event.params.owner;
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

  let rwaId = event.params.tokenId.toString();

  // Create RWA entity
  let rwa = new RWA(rwaId);
  rwa.owner = userId;
  rwa.tokenURI = event.params.tokenURI;
  rwa.status = "ISSUED";
  rwa.productName = ""; // Will be updated from Issuer event
  rwa.imageHash = ""; // Will be updated from Issuer event
  rwa.yearsOfUsage = BigInt.fromI32(0); // Will be updated from Issuer event
  rwa.documentHash = ""; // Will be updated from Issuer event
  rwa.createdAt = event.block.timestamp;
  rwa.lastUpdated = event.block.timestamp;
  rwa.save();
}
