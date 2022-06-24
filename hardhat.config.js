require('@nomiclabs/hardhat-waffle')
require('dotenv').config()
const verifyWallets = require('./verify.json')

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account)
  }
})

task('setPrice', 'Set claim / update price')
  .addOptionalParam('claim', 'New claim price (ETH)')
  .addOptionalParam('update', 'New wallet price (ETH)')
  .setAction(async (taskArgs, hre) => {
    const contract = await hre.ethers.getContractAt(
      'MetaWallet',
      process.env.NEXT_PUBLIC_META_WALLET_CONTRACT_ADDRESS
    )

    if (taskArgs.claim) {
      console.log('Setting claim price', taskArgs.claim)
      const txn = await contract.setClaimPrice(
        hre.ethers.utils.parseEther(taskArgs.claim)
      )
    }

    if (taskArgs.update) {
      console.log('Setting update price', taskArgs.update)
      const txn = await contract.setClaimPrice(
        hre.ethers.utils.parseEther(taskArgs.update)
      )
    }
  })

task('getAllWallets', 'Get all claimed wallets').setAction(
  async (taskArgs, hre) => {
    const contract = await hre.ethers.getContractAt(
      'MetaWallet',
      process.env.NEXT_PUBLIC_META_WALLET_CONTRACT_ADDRESS
    )

    const txn = await contract.getAllWallets()
    console.log(txn)
  }
)

task('getWallet', 'Get claimed wallet')
  .addParam('address', "The wallet's address")
  .setAction(async (taskArgs, hre) => {
    const contract = await hre.ethers.getContractAt(
      'MetaWallet',
      process.env.NEXT_PUBLIC_META_WALLET_CONTRACT_ADDRESS
    )

    console.log('Getting wallet', taskArgs.address)

    const txn = await contract.getWallet(taskArgs.address)
    console.log(txn)
  })

task('claim', 'Claim a wallet')
  .addParam('address', "The wallet's address")
  .setAction(async (taskArgs, hre) => {
    const contract = await hre.ethers.getContractAt(
      'MetaWallet',
      process.env.NEXT_PUBLIC_META_WALLET_CONTRACT_ADDRESS
    )

    console.log('Claiming wallet', taskArgs.address)

    const txn = await contract.adminClaimWallet(taskArgs.address)
    await txn.wait()
  })

task('claimWallets', 'Claim all wallets on file').setAction(
  async (taskArgs, hre) => {
    const contract = await hre.ethers.getContractAt(
      'MetaWallet',
      process.env.NEXT_PUBLIC_META_WALLET_CONTRACT_ADDRESS
    )

    const verify = await Promise.all(
      verifyWallets.wallets.map(async (wallet) => {
        console.log('Claiming wallet', wallet.address)
        const claimTxn = await contract.adminClaimWallet(wallet.address)
        await claimTxn.wait()

        console.log('Setting wallet', wallet.address)

        const setTxn = await contract.adminSetWallet(
          wallet.address,
          wallet.username,
          wallet.bio,
          wallet.avatar,
          wallet.links
        )
        await setTxn.wait()
      })
    )

    console.log('Complete')
  }
)

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.8.4',
  networks: {
    mainnet: {
      url: process.env.ALCHEMY_API_KEY_MAINNET,
      accounts: [process.env.PRIVATE_KEY],
    },
    optimism: {
      url: process.env.ALCHEMY_API_KEY_OPTIMISM,
      accounts: [process.env.PRIVATE_KEY],
    },
    kovan: {
      url: process.env.ALCHEMY_API_KEY_KOVAN,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      polygon: process.env.ETHERSCAN_API,
    },
  },
}
