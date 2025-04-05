import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import { RWAApproved, RWARequestCreated } from "../generated/Issuer/Issuer"

export function createRWAApprovedEvent(
  requestId: BigInt,
  requester: Address,
  productName: string,
  productModel: string,
  documentHash: string
): RWAApproved {
  let rwaApprovedEvent = changetype<RWAApproved>(newMockEvent())

  rwaApprovedEvent.parameters = new Array()

  rwaApprovedEvent.parameters.push(
    new ethereum.EventParam(
      "requestId",
      ethereum.Value.fromUnsignedBigInt(requestId)
    )
  )
  rwaApprovedEvent.parameters.push(
    new ethereum.EventParam("requester", ethereum.Value.fromAddress(requester))
  )
  rwaApprovedEvent.parameters.push(
    new ethereum.EventParam(
      "productName",
      ethereum.Value.fromString(productName)
    )
  )
  rwaApprovedEvent.parameters.push(
    new ethereum.EventParam(
      "productModel",
      ethereum.Value.fromString(productModel)
    )
  )
  rwaApprovedEvent.parameters.push(
    new ethereum.EventParam(
      "documentHash",
      ethereum.Value.fromString(documentHash)
    )
  )

  return rwaApprovedEvent
}

export function createRWARequestCreatedEvent(
  requestId: BigInt,
  requester: Address,
  yearsOfUsage: BigInt,
  productName: string,
  productModel: string,
  documentHash: string
): RWARequestCreated {
  let rwaRequestCreatedEvent = changetype<RWARequestCreated>(newMockEvent())

  rwaRequestCreatedEvent.parameters = new Array()

  rwaRequestCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "requestId",
      ethereum.Value.fromUnsignedBigInt(requestId)
    )
  )
  rwaRequestCreatedEvent.parameters.push(
    new ethereum.EventParam("requester", ethereum.Value.fromAddress(requester))
  )
  rwaRequestCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "yearsOfUsage",
      ethereum.Value.fromUnsignedBigInt(yearsOfUsage)
    )
  )
  rwaRequestCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "productName",
      ethereum.Value.fromString(productName)
    )
  )
  rwaRequestCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "productModel",
      ethereum.Value.fromString(productModel)
    )
  )
  rwaRequestCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "documentHash",
      ethereum.Value.fromString(documentHash)
    )
  )

  return rwaRequestCreatedEvent
}
