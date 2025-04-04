import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const UniversalKYC = await ethers.getContractFactory("UniversalKYC");
  const universalKYC = await UniversalKYC.deploy();
  console.log("Deploying UniversalKYC...");
  await universalKYC.waitForDeployment();

  const deployedAddress = await universalKYC.getAddress();
  console.log("UniversalKYC deployed to:", deployedAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
