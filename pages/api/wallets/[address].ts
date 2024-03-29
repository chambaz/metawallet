import type { NextApiRequest, NextApiResponse } from 'next'
import { BigNumber } from '@ethersproject/bignumber'
import { createAlchemyWeb3 } from '@alch/alchemy-web3'
import { ethers } from 'ethers'
import { transformNfts } from '../../../lib/helpers'
import MetaWallet from '../../../public/artifacts/MetaWallet.json'
import { AssetTransfersCategory } from '@alch/alchemy-web3'

type WalletData = {
  address: string
  username: string
  bio: string
  avatar: string
  links: {
    key: string
    value: string
  }[]
}

type Token = {
  tokenMeta: {
    decimals: number
    logo: string
    name: string
    symbol: string
  }
  token: {
    contractAddress: string
    tokenBalance: string
    error?: string
  }
}

type Nft = {
  contractAddress: string
  tokenId: string
  title: string
  tokenUri: string
  img: string
}

type Transaction = {
  blockNum: string
  hash: string
  from: string
  to: string
  value: number
  asset: string
}

type Data = {
  address: string
  claimed: boolean
  walletData: WalletData
  balance: BigNumber
  tokens: Token[]
  nfts: Nft[]
  transactions: Transaction[]
  nftPageKey?: string
}

const Address = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const mainnetProvider = new ethers.providers.JsonRpcProvider(
    process.env.ALCHEMY_API_URL_MAINNET
  )
  const optimismProvider = new ethers.providers.JsonRpcProvider(
    process.env.ALCHEMY_API_URL_GOERLI
    // 'http://localhost:8545'
  )

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, optimismProvider)
  // @ts-ignore
  const signer = wallet.provider.getSigner(wallet.address)

  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_META_WALLET_CONTRACT_ADDRESS,
    MetaWallet.abi,
    signer
  )

  const web3 = createAlchemyWeb3(process.env.ALCHEMY_API_URL_MAINNET)

  let address: string = req.query.address as string

  // resolve ENS addresses
  if (address.indexOf('.') > -1) {
    address = await mainnetProvider.resolveName(address)
  }

  // check if wallet is claimed
  const claimed = await contract.isClaimedWallet(address)

  // fetch wallet data if wallet claimed
  let walletData: WalletData
  if (claimed) {
    walletData = await contract.getWallet(address)
  }

  // get Ether balance
  const balance = await mainnetProvider.getBalance(address)

  // get balance of top tokens
  const tokenBalances = await web3.alchemy.getTokenBalances(
    address,
    // @ts-ignore
    'DEFAULT_TOKENS'
  )

  // filter out zero balance tokens
  const filteredTokenBalances = tokenBalances.tokenBalances.filter(
    (token) => token.tokenBalance !== '0'
  )

  // get token meta data
  const tokens = await Promise.all(
    filteredTokenBalances.map(async (token) => {
      const tokenMeta = await web3.alchemy.getTokenMetadata(
        token.contractAddress
      )
      return {
        tokenMeta,
        token,
      }
    })
  )

  // transaction sent from this address
  const transactionsFrom = await web3.alchemy.getAssetTransfers({
    fromBlock: '0x0',
    fromAddress: address,
    category: [AssetTransfersCategory.ERC20],
  })

  // transactions sent to this address
  const transactionsTo = await web3.alchemy.getAssetTransfers({
    fromBlock: '0x0',
    toAddress: address,
    category: [AssetTransfersCategory.ERC20],
  })

  // combine transactions array
  let transactionsCombined = transactionsFrom.transfers.concat(
    transactionsTo.transfers
  )

  // order all transactions by block num
  let transactions = transactionsCombined.map((item) => {
    return {
      blockNum: item.blockNum,
      hash: item.hash,
      from: item.from,
      to: item.to,
      value: item.value,
      asset: item.asset,
    }
  })
  transactions
    .sort((a, b) => parseInt(a.blockNum) - parseInt(b.blockNum))
    .reverse()
  transactions = transactions.slice(0, 30)

  // get owned NFTs
  const nftsQuery = await web3.alchemy.getNfts({
    owner: address,
    // @ts-ignore
    'filters[]': ['SPAM'],
  })

  // proxy ipfs images
  let nfts = await transformNfts(nftsQuery.ownedNfts)

  nfts = nfts.filter((nft) => nft)

  const data = {
    address,
    claimed,
    walletData,
    balance,
    tokens,
    nfts,
    transactions,
    nftPageKey: nftsQuery.pageKey,
  }

  res.json(data)
}

export default Address
