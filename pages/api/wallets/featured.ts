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
        address: '0xed2ab4948bA6A909a7751DEc4F34f303eB8c7236',
        username: 'franklinisbored',
        avatar:
          'https://pbs.twimg.com/profile_images/1528248325203443714/RA8UZdtB_400x400.png',
      },
      {
        address: '0x54BE3a794282C030b15E43aE2bB182E14c409C5e',
        username: 'pranksy.eth',
        avatar:
          'https://pbs.twimg.com/profile_images/1541659762630066179/uQaUkTec_400x400.jpg',
      },
      {
        address: '0x51787a2C56d710c68140bdAdeFD3A98BfF96FeB4',
        username: 'seedphrase.eth',
        avatar:
          'https://pbs.twimg.com/profile_images/1491477987962806274/TG9JhxIB_400x400.png',
      },
      {
        address: '0xB7d6ed1d7038BaB3634eE005FA37b925B11E9b13',
        username: 'punk6529',
        avatar:
          'https://lh3.googleusercontent.com/VzkUYm0c4o6qc9qJzJNRXt15DeI1t46V69FDedakHqRjhFT47sIbnlaOcygJXflDEdsyXsYDVU-no1djwSMqXvxYxPZTv6ZY6rV4=s0',
      },
      {
        address: '0x716eb921F3B346d2C5749B5380dC740d359055D7',
        username: '888',
        avatar:
          'https://pbs.twimg.com/profile_images/1528177750338437121/t59NlZqD_400x400.jpg',
      },
      {
        address: '0x240ad467a71210629D71D4dE22ebde27951c83Fc',
        username: 'collin.eth',
        avatar:
          'https://pbs.twimg.com/profile_images/1540692022826131456/8Mvz8awu_400x400.jpg',
      },
      {
        address: '0x0984974Ac1F1DA97d2242652042692856C76BF4F',
        username: 'Matty',
        avatar:
          'https://pbs.twimg.com/profile_images/1472740175130230784/L7Xcs7wJ_400x400.jpg',
      },
      {
        address: '0xC46Db2d89327D4C41Eb81c43ED5e3dfF111f9A8f',
        username: 'DeeZe',
        avatar:
          'https://pbs.twimg.com/profile_images/1537451764181516296/4ND5N3BZ_400x400.jpg',
      },
    ],
  })
}

export default Featured
