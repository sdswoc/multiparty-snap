const { ethers, network } = require("hardhat")
const { networks } = require("../hardhat.config")


async function main() {

  // This function deloy the contract

  const Multisignature = await ethers.getContractFactory("Multisignature")
  console.log("Deploying contract...")
  const contract = await Multisignature.deploy("myCompany", 51, [({name: "Eminem", stakes: 21, coFounderAddress: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"})])
  await contract.deployed()
  console.log(`Deployed contract to: ${contract.address}`)
  // The contract is deployed to haradhat localhost

}

// Calling the main function

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
