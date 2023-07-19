require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: "0.8.19",
  etherscan: {
    apiKey: process.env.ETHERSCAN_API,
  },
  networks: {
    mumbai: {
      url: process.env.INFURA_URL,
      accounts: [process.env.PVT_KEY],
    },
  },
};
