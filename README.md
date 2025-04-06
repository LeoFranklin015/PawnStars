# PawnStars Project Overview

## **KYC Verification (Privacy-Preserving)**
   - Users verify their identity using a **self-protocol**, ensuring privacy without revealing personal information.
   - The KYC proof is validated on-chain using the **Celo blockchain**, ensuring efficiency and security.
   - After verification, the proof is bridged from Celo to the **HashKey chain**, allowing cross-platform use.

## **Universal KYC Compliance Contract**
   - On the HashKey chain, a **Universal KYC compliance contract** is deployed, which can be imported into any smart contract on the chain.
   - The contract ensures that only **KYC-verified users** can access specific platform functions like lending and borrowing.

## **RWA Lending Platform**
   - Once KYC verification is complete, users can participate in the **RWA lending platform** by submitting necessary documentation proving ownership of the RWA they want to use as collateral.
   - The documentation is cross-verified against the KYC records, ensuring that the pledged asset matches the verified identity.

## **Minting of RWA Tokens**
   - After document verification, the platform **mints an RWA token**, representing the value of the Real World Asset pledged as collateral.

## **Loan Issuance and Market Pricing**
   - The user can now use the minted RWA token to request a loan.
   - The loan request is processed by the protocol and sent to an AI agent for **market analysis** to determine the loan price based on real-time market conditions, such as asset liquidity and market volatility.
   - The user is presented with a loan offer, including terms like interest rate, repayment schedule, and loan duration.

## **Loan Acceptance/Decline**
   - The user can either accept or decline the loan offer based on the terms.
   - If accepted, the loan is issued to the user, and the RWA collateral is locked in the platform’s smart contract for the loan term.

---

## **Project Features:**

- **Privacy-Preserving KYC**: The self-protocol for KYC ensures that user identities are verified while maintaining privacy.
  
- **On-Chain Verification**: KYC verification is handled on the **Celo blockchain**, and compliance is ensured through **HashKey chain** contracts.

- **Dynamic Loan Pricing via AI**: Loan pricing is determined by an AI agent, ensuring adaptive loan terms based on real-time market conditions.

- **RWA as Collateral**: Real World Assets, such as property or commodities, can be used as collateral for loans.

- **Secure Lending Protocol**: The platform ensures that only verified users can access financial features, providing a secure lending environment.

- **Decentralized Finance (DeFi)**: PawnStars operates in a decentralized manner, offering users full control over their financial transactions without intermediaries.

---

## **How It Works in Brief:**
**KYC Verification** → **Bridging KYC Proof to HashKey** → **Minting of RWA Tokens** → **Loan Request** → **AI Market Pricing** → **Loan Offer Acceptance** → **Loan Issuance**

---

PawnStars revolutionizes lending in the DeFi space by integrating AI-driven market analysis and decentralized KYC compliance, enabling users to leverage their real-world assets as collateral for loans in a secure, privacy-respecting environment.




### Celo
- https://github.com/LeoFranklin015/PawnStars/blob/2c353e7174b387630db26883b5c6b686c0c6fd7b/web/app/api/verify/route.ts#L226
- https://github.com/LeoFranklin015/PawnStars/blob/master/contracts/contracts/KYCVerifier.sol


### Self
- https://github.com/LeoFranklin015/PawnStars/blob/master/contracts/contracts/KYCVerifier.sol
- https://github.com/LeoFranklin015/PawnStars/blob/master/web/components/Self.tsx
- https://github.com/LeoFranklin015/PawnStars/blob/master/contracts/scripts/deployVerifier.ts


### Hashkey

- https://github.com/LeoFranklin015/PawnStars/tree/master/contracts/contracts
- https://github.com/LeoFranklin015/PawnStars/blob/master/web/lib/const.ts

