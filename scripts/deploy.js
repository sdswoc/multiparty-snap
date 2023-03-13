const { ethers, network } = require("hardhat");
const { networks } = require("../hardhat.config");

async function main() {
  // This function deloys the contract

  const Multisignature = await ethers.getContractFactory("Multisignature");
  console.log("Deploying contract...");
  const contract = await Multisignature.deploy("myCompany", 51, [
    {
      name: "Saurabh",
      stakes: 21,
      coFounderAddress: "0x38d4948cf9cb91d1aaede05160a8990c662d8a6c",
    },
  ]);
  await contract.deployed();
  console.log(`Deployed contract to: ${contract.address}`);
  // The contract is deployed to polygon_mumbai testnet
}

// Calling the main function

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
