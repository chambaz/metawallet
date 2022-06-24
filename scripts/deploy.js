const hre = require('hardhat')

async function main() {
  const MetaWallet = await hre.ethers.getContractFactory('MetaWallet')
  const metaWallet = await MetaWallet.deploy()

  await metaWallet.deployed()

  console.log('NFTWallet deployed', metaWallet.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
