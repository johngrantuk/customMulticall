// * Kovan: `$ npx buidler run --network kovan ./scripts/deploy-script-kovan.js`
async function main() {
  const [deployer] = await ethers.getSigners();

  console.log(await deployer.getAddress());
  console.log("Account balance:", (await deployer.getBalance()).toString());
  // We get the contract to deploy
  const PoolState = await ethers.getContractFactory("PoolState");
  console.log('Deploying...')
  const poolState = await PoolState.deploy();
  await poolState.deployed();
  console.log("poolState deployed to:", poolState.address);
  // 0x76d6043458e92149Aedfc69925B37080366F793E - Norm weights
  // 0x9907109e5Ca97aE76f684407318D1B8ea119c83B - Denorm
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
