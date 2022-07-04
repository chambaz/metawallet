import { useRouter } from 'next/router'
import { ethers } from 'ethers'
import { createAlchemyWeb3 } from '@alch/alchemy-web3'

// resolves query or returns null
export const useQuery = () => {
  const router = useRouter()
  const hasQueryParams =
    /\[.+\]/.test(router.route) || /\?./.test(router.asPath)
  const ready = !hasQueryParams || Object.keys(router.query).length > 0
  if (!ready) return null
  return router.query
}

export const checkNetwork = async () => {
  const { ethereum } = window

  if (!ethereum) {
    return false
  }

  const accounts = await ethereum.request({ method: 'eth_accounts' })
  const provider = new ethers.providers.Web3Provider(ethereum)
  const { chainId } = await provider.getNetwork()

  return chainId === 69
  // return chainId === 31337
}

export const transformNfts = async (nftArray) => {
  const web3 = createAlchemyWeb3(process.env.ALCHEMY_API_URL_MAINNET)
  const contractUrl = `https://eth-mainnet.alchemyapi.io/nft/v2/${process.env.ALCHEMY_API_KEY_MAINNET}/getContractMetadata`

  const nfts = await Promise.all(
    nftArray.map(async (nft) => {
      const contractAddress = nft.contract.address
      const tokenId = nft.id.tokenId
      const response = await web3.alchemy.getNftMetadata({
        contractAddress,
        tokenId,
      })

      if (!response.media.length || !response.metadata.image) {
        return
      }

      let img

      if (response.media.gateway) {
        img = response.media.gateway
      } else {
        img = response.metadata.image
        if (img.substring(0, 7) === 'ipfs://') {
          const imgParts = img.split('ipfs://')

          if (imgParts[1].indexOf('ipfs/') > -1) {
            imgParts[1] = imgParts[1].substring(5, imgParts[1].length)
          }

          img = `https://metawallet.mypinata.cloud/ipfs/${imgParts[1]}`
        }
      }

      const fetchContract = `${contractUrl}?contractAddress=${contractAddress}`
      const contractResult = await fetch(fetchContract)
      const contractJson = await contractResult.json()

      return {
        contractAddress,
        collectionName: contractJson.contractMetadata.name,
        tokenId,
        title: response.title || `#${parseInt(Number(response.id.tokenId))}`,
        tokenUri: response.tokenUri.gateway,
        img,
      }
    })
  )

  return nfts
}
