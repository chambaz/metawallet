import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  address: string
  contractMetadata: {
    name: string
    symbol: string
  }
  owners: string[]
}

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { address } = req.query
  const contractUrl = `https://eth-mainnet.alchemyapi.io/nft/v2/${process.env.ALCHEMY_API_KEY}/getContractMetadata`
  const ownersUrl = `https://eth-mainnet.alchemyapi.io/nft/v2/${process.env.ALCHEMY_API_KEY}/getOwnersForCollection`

  const fetchContract = `${contractUrl}?contractAddress=${address}`
  const contractResult = await fetch(fetchContract)
  const contractJson = await contractResult.json()

  const fetchOwners = `${ownersUrl}?contractAddress=${address}`
  const ownersCResult = await fetch(fetchOwners)
  const ownersJson = await ownersCResult.json()

  const json = {
    ...contractJson,
    owners: ownersJson.ownerAddresses,
  }

  res.json(json)
}
