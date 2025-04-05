import {
  LoanRequested as LoanRequestedEvent,
  ValuationProvided as ValuationProvidedEvent,
  LoanAccepted as LoanAcceptedEvent,
  LoanIssued as LoanIssuedEvent,
  LoanRepaid as LoanRepaidEvent,
} from "../generated/LendingProtocol/LendingProtocol";
import { User, RWA, Loan } from "../generated/schema";
import { BigInt, Bytes } from "@graphprotocol/graph-ts";

export function handleLoanRequested(event: LoanRequestedEvent): void {
  // Load or create User
  let userId = event.params.borrower;
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

  let loanId = event.params.requestId.toString();
  let rwaId = event.params.rwaId.toString();

  // Create new Loan entity
  let loan = new Loan(loanId);
  loan.borrower = userId;
  loan.rwa = rwaId;
  loan.requestedAmount = event.params.amount;
  loan.status = "REQUESTED";
  loan.createdAt = event.block.timestamp;
  loan.lastUpdated = event.block.timestamp;
  loan.save();
}

export function handleValuationProvided(event: ValuationProvidedEvent): void {
  let loanId = event.params.requestId.toString();
  let loan = Loan.load(loanId);
  if (!loan) return;

  loan.valuation = event.params.valuation;
  loan.status = "VALUED";
  loan.lastUpdated = event.block.timestamp;
  loan.save();
}

export function handleLoanAccepted(event: LoanAcceptedEvent): void {
  let loanId = event.params.requestId.toString();
  let loan = Loan.load(loanId);
  if (!loan) return;

  loan.status = "ACCEPTED";
  loan.lastUpdated = event.block.timestamp;
  loan.save();

  // Update RWA status
  let rwa = RWA.load(loan.rwa);
  if (rwa) {
    rwa.status = "IN_LOAN";
    rwa.lastUpdated = event.block.timestamp;
    rwa.save();
  }
}

export function handleLoanIssued(event: LoanIssuedEvent): void {
  let loanId = event.params.loanId.toString();
  let loan = Loan.load(loanId);
  if (!loan) return;

  loan.amount = event.params.amount;
  loan.interestRate = event.params.interestRate;
  loan.startTime = event.block.timestamp;
  loan.dueTime = event.params.dueTime;
  loan.status = "ACTIVE";
  loan.lastUpdated = event.block.timestamp;
  loan.save();
}

export function handleLoanRepaid(event: LoanRepaidEvent): void {
  let loanId = event.params.loanId.toString();
  let loan = Loan.load(loanId);
  if (!loan) return;

  loan.status = "REPAID";
  loan.repaymentAmount = event.params.amount.plus(event.params.interest);
  loan.repaymentTime = event.block.timestamp;
  loan.lastUpdated = event.block.timestamp;
  loan.save();

  // Update RWA status
  let rwa = RWA.load(loan.rwa);
  if (rwa) {
    rwa.status = "AVAILABLE";
    rwa.lastUpdated = event.block.timestamp;
    rwa.save();
  }
}
