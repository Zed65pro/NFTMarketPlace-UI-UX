const hre = require("hardhat");

async function main() {
  const _NAME = "CCS token";
  const _TOKEN = "CCST";

  const NFTMarketplace = await hre.ethers.deployContract("NFTMarketplace", [
    _NAME,
    _TOKEN,
  ]);

  await NFTMarketplace.waitForDeployment();

  console.log(`Smart contract deployed to ${NFTMarketplace.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
