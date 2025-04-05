import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { RWAApproved } from "../generated/schema"
import { RWAApproved as RWAApprovedEvent } from "../generated/Issuer/Issuer"
import { handleRWAApproved } from "../src/issuer"
import { createRWAApprovedEvent } from "./issuer-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let requestId = BigInt.fromI32(234)
    let requester = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let productName = "Example string value"
    let productModel = "Example string value"
    let documentHash = "Example string value"
    let newRWAApprovedEvent = createRWAApprovedEvent(
      requestId,
      requester,
      productName,
      productModel,
      documentHash
    )
    handleRWAApproved(newRWAApprovedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("RWAApproved created and stored", () => {
    assert.entityCount("RWAApproved", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "RWAApproved",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "requestId",
      "234"
    )
    assert.fieldEquals(
      "RWAApproved",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "requester",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "RWAApproved",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "productName",
      "Example string value"
    )
    assert.fieldEquals(
      "RWAApproved",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "productModel",
      "Example string value"
    )
    assert.fieldEquals(
      "RWAApproved",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "documentHash",
      "Example string value"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
