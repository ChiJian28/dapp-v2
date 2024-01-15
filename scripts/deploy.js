// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const Persons = await hre.ethers.getContractFactory("Persons");   //fetching bytecode and ABI
  const person = await Persons.deploy();  //creating an instance of our smart contract 

  await person.waitForDeployment();  // deploying our smart contract

  console.log(`Deployed contract address: ${await person.getAddress()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});




// 'npx hardhat compile' to get artifacts and cache
// if you do some changes: 'npx hardhat clean' -> 'npx hardhat compile'
// 'npx hardhat run scripts/deploy.js' is default deploy to hardhat network (which is just for development mode only)
// 'npx hardhat run --network sepolia scripts/deploy.js' 要配合hardhat.config.js 的setting