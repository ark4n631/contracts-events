import { BigInt } from "@graphprotocol/graph-ts"
import {
  Contract,
  CollateralDeposited,
  CollateralWithdrawn,
  LoanCreated,
  SignerAdded,
  SignerRemoved
} from "../generated/Contract/Contract"
import { Borrower, Loan, CollateralD, CollateralW } from "../generated/schema"

export function handleCollateralDeposited(event: CollateralDeposited): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = CollateralD.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (entity == null) {
    entity = new CollateralD(event.transaction.from.toHex())
  }

  // BigInt and BigDecimal math are supported
  entity.amount = event.params.depositAmount

  // Entity fields can be set based on event parameters
  let loan = new Loan(event.params.loanID.toHex())
  let borrower = new Borrower(event.params.borrower.toHex())
  entity.loan = loan.id
  entity.borrower = borrower.id

  // Entities can be written to the store with `.save()`
  entity.save()

}

export function handleCollateralWithdrawn(event: CollateralWithdrawn): void {}

export function handleLoanCreated(event: LoanCreated): void {

  let loanID = event.params.loanID.toHex()
  let loan = Loan.load(loanID)
  if (loan == null) {
    loan = new Loan(loanID)
    loan.save()
  }
  let address = event.params.borrower
  let borrower = Borrower.load(address.toHex())
  if (borrower == null){
    borrower = new Borrower(address.toHex())
    borrower.address = address
    borrower.save()
  }

  loan.amountBorrow = event.transaction.value
  loan.collateralRatio = event.params.collateralRatio
  loan.interestRate = event.params.interestRate
  loan.maxLoanAmount = event.params.maxLoanAmount
  loan.numberDays = event.params.numberDays
  loan.startDate = event.block.timestamp
  loan.borrower = borrower.id

  loan.save()
}

export function handleSignerAdded(event: SignerAdded): void {}

export function handleSignerRemoved(event: SignerRemoved): void {}
