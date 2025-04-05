import {
  RWAApproved as RWAApprovedEvent,
  RWARequestCreated as RWARequestCreatedEvent
} from "../generated/Issuer/Issuer"
import { RWAApproved, RWARequestCreated } from "../generated/schema"

export function handleRWAApproved(event: RWAApprovedEvent): void {
  let entity = new RWAApproved(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.requestId = event.params.requestId
  entity.requester = event.params.requester
  entity.productName = event.params.productName
  entity.productModel = event.params.productModel
  entity.documentHash = event.params.documentHash

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRWARequestCreated(event: RWARequestCreatedEvent): void {
  let entity = new RWARequestCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.requestId = event.params.requestId
  entity.requester = event.params.requester
  entity.yearsOfUsage = event.params.yearsOfUsage
  entity.productName = event.params.productName
  entity.productModel = event.params.productModel
  entity.documentHash = event.params.documentHash

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
