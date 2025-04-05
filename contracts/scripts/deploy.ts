import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const UniversalKYC = await ethers.getContractFactory("UniversalKYC");
  const universalKYC = await UniversalKYC.deploy();
  console.log("Deploying UniversalKYC...");
  await universalKYC.waitForDeployment();

  const universalKYCDeployedAddress = await universalKYC.getAddress();
  console.log("UniversalKYC deployed to:", universalKYCDeployedAddress);

  await universalKYC.verifyUser(
    "0x4b4b30e2E7c6463b03CdFFD6c42329D357205334",
    "0x0000000000000000000000000000000000000000000000000000000000000000",
    "LeoFranklin"
  );

  const RWA = await ethers.getContractFactory("RWA");
  const rwa = await RWA.deploy();
  console.log("Deploying RWA...");
  await rwa.waitForDeployment();

  const rwaDeployedAddress = await rwa.getAddress();
  console.log("RWA deployed to:", rwaDeployedAddress);

  const Issuer = await ethers.getContractFactory("Issuer");
  const issuer = await Issuer.deploy(
    rwaDeployedAddress,
    universalKYCDeployedAddress
  );
  console.log("Deploying Issuer...");
  await issuer.waitForDeployment();

  const deployedAddress = await issuer.getAddress();
  console.log("Issuer deployed to:", deployedAddress);

  await rwa.setIssuer(deployedAddress);
  console.log("Issuer set to:", deployedAddress);

  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const mockUSDC = await MockUSDC.deploy("USD Coin", "USDC");
  console.log("Deploying MockUSDC...");
  await mockUSDC.waitForDeployment();

  const mockUSDCDeployedAddress = await mockUSDC.getAddress();
  console.log("MockUSDC deployed to:", mockUSDCDeployedAddress);

  const LendingProtocol = await ethers.getContractFactory("LendingProtocol");
  const lendingProtocol = await LendingProtocol.deploy(
    rwaDeployedAddress,
    mockUSDCDeployedAddress
  );
  console.log("Deploying LendingProtocol...");
  await lendingProtocol.waitForDeployment();

  const lendingProtocolDeployedAddress = await lendingProtocol.getAddress();
  console.log("LendingProtocol deployed to:", lendingProtocolDeployedAddress);

  console.log("--------------------------------------------");

  console.log("UniversalKYC deployed to:", universalKYCDeployedAddress);
  console.log("RWA deployed to:", rwaDeployedAddress);
  console.log("Issuer deployed to:", deployedAddress);
  console.log("MockUSDC deployed to:", mockUSDCDeployedAddress);
  console.log("LendingProtocol deployed to:", lendingProtocolDeployedAddress);

  console.log("--------------------------------------------");

  // Requesting RWA
  await issuer.requestRWA("Iphone 14", "14", 2, "hkhkhvka");
  console.log("RWA requested");
  // Approving RWA
  await issuer.approveRWA(0);
  console.log("RWA approved");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
