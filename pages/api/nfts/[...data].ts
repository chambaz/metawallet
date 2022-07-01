import type { NextApiRequest, NextApiResponse } from 'next'
import { createAlchemyWeb3 } from '@alch/alchemy-web3'
import { transformNfts } from '../../../lib/helpers'

type Data = {}

const Address = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const [address, pageKey] = req.query.data

  const web3 = createAlchemyWeb3(process.env.ALCHEMY_API_KEY_MAINNET)

  const nftsQuery = await web3.alchemy.getNfts({
    owner: address,
    pageKey,
    // @ts-ignore
    'filters[]': ['SPAM'],
  })

  const nfts = await transformNfts(nftsQuery.ownedNfts)

  res.json({
    nfts,
    pageKey: nftsQuery.pageKey,
  })
}

export default Address
