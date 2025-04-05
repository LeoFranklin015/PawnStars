import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const RWA = "0x3284FE432159d85c282Db76EBC9E74cf626551ec";

  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const mockUSDC = await MockUSDC.deploy("USD Coin", "USDC");
  console.log("Deploying MockUSDC...");
  await mockUSDC.waitForDeployment();

  const mockUSDCDeployedAddress = await mockUSDC.getAddress();
  console.log("MockUSDC deployed to:", mockUSDCDeployedAddress);

  const LendingProtocol = await ethers.getContractFactory("LendingProtocol");
  const lendingProtocol = await LendingProtocol.deploy(
    RWA,
    mockUSDCDeployedAddress
  );
  console.log("Deploying LendingProtocol...");
  await lendingProtocol.waitForDeployment();

  const deployedAddress = await lendingProtocol.getAddress();
  console.log("LendingProtocol deployed to:", deployedAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
