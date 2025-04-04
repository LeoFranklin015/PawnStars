import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const universalKYCAddress = "0x02DD486b283a644D1C72f83Ef5B4e4fF97f6D6BE";

  const RWA = await ethers.getContractFactory("RWA");
  const rwa = await RWA.deploy();
  console.log("Deploying RWA...");
  await rwa.waitForDeployment();

  const rwaDeployedAddress = await rwa.getAddress();
  console.log("RWA deployed to:", rwaDeployedAddress);

  const Issuer = await ethers.getContractFactory("Issuer");
  const issuer = await Issuer.deploy(rwaDeployedAddress, universalKYCAddress);
  console.log("Deploying Issuer...");
  await issuer.waitForDeployment();

  const deployedAddress = await issuer.getAddress();
  console.log("Issuer deployed to:", deployedAddress);

  await rwa.setIssuer(deployedAddress);
  console.log("Issuer set to:", deployedAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
