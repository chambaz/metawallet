import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import pinataClient from '@pinata/sdk'

type Data = {
  error?: string
  url?: string
}

export const config = {
  api: {
    bodyParser: false,
  },
}

const pinata = pinataClient(
  process.env.PINATA_API_KEY,
  process.env.PINATA_API_SECRET
)

const Upload = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { address } = req.query
  const form = formidable({ multiples: true })

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.json({ error: err })
      return
    }

    const pin = await pinata.pinFromFS(files.avatar.filepath, {
      pinataMetadata: {
        name: `MetaWallet-${address}`,
      },
    })

    res.json({
      url: `https://metawallet.mypinata.cloud/ipfs/${pin.IpfsHash}`,
    })
  })
}

export default Upload
