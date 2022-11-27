import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  wallets: {
    address: string
    username: string
    avatar: string
  }[]
}

const Featured = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  res.json({
    wallets: [
      {
        address: '0xb35ea231b18dc4339f9bb82f95915d65e5b30be5',
        username: 'chambaz',
        avatar:
          'https://spacecubes.mypinata.cloud/ipfs/QmbbUULuTqDtrsUqrJ6wHfA1kPbm4VxWSJxS27CkEQGEmY?preview=1',
      },
      {
        address: '0x54BE3a794282C030b15E43aE2bB182E14c409C5e',
        username: 'pranksy.eth',
        avatar:
          'https://spacecubes.mypinata.cloud/ipfs/QmPn4jpWK1iBbqg1LCHgdVvt3YJz9Nb6NSFdqS5sxMkSsD?preview=1',
      },
      {
        address: '0x51787a2C56d710c68140bdAdeFD3A98BfF96FeB4',
        username: 'seedphrase.eth',
        avatar:
          'https://spacecubes.mypinata.cloud/ipfs/QmUZyWwCxnsjkS6stfbRrHfTHCPq85MprUy4VJNtgE7J3y?preview=1',
      },
      {
        address: '0xB7d6ed1d7038BaB3634eE005FA37b925B11E9b13',
        username: 'punk6529',
        avatar:
          'https://spacecubes.mypinata.cloud/ipfs/Qmc6xHMsRUhmXPVrzABiDGDKvyTFxfbmW2mTk9GfmveFEU',
      },
    ],
  })
}

export default Featured
