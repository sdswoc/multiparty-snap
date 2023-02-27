require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "polygon_mumbai",   
  networks: {
    polygon_mumbai: {      
    url: `${process.env.API_URL}`,
    accounts: [`0x${process.env.PRIVATE_KEY}`],
  },
}
};
