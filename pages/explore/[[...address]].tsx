import { useState, useEffect } from 'react'
import { NextPage } from 'next'
import { GetServerSidePropsContext } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import { CgProfile } from 'react-icons/cg'
import { darkModeState } from '../../recoil/atoms'
import { Layout } from '../../components/layout'
import { Heading } from '../../components/heading'
import { Search } from '../../components/search'
import { Truncate } from '../../components/truncate'
import { Loader } from '../../components/loader'

type ContractMetadataProps = {
  name: string
  symbol: string
}

type ExploreProps = {
  address: string
  contractMetadata: ContractMetadataProps
  owners: string[]
}

const Explore: NextPage<ExploreProps> = ({
  address,
  contractMetadata,
  owners,
}) => {
  const router = useRouter()
  const [darkMode, setDarkMode] = useRecoilState(darkModeState)
  const [loading, setLoading] = useState(false)

  const exploreAddress = (e) => {
    const val = e.target.value

    if (val === '#') {
      return
    }

    setLoading(true)

    router.push(`/explore/${e.target.value}`)
  }

  useEffect(() => setLoading(false), [address])

  return (
    <Layout>
      <>
        <div className="max-w-5xl px-4 py-16 mx-auto text-center">
          <div className="mb-16 text-center">
            <Heading>Explore Wallets</Heading>
            <p className="my-4 text-lg dark:text-white">
              Explore the holders of an NFT collection.
              <br className="hidden md:block" /> Search a contract address or
              pick from the top collections.
            </p>
            <div>
              <select
                id="location"
                name="location"
                className="block w-1/2 py-2 pl-3 pr-10 mx-auto mt-8 text-base border-gray-400 rounded-md dark:border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                defaultValue="#"
                onChange={exploreAddress}>
                <option value="#">Top Collections</option>
                <option value="0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D">
                  Bored Ape Yacht Club
                </option>
                <option value="0x60e4d786628fea6478f785a6d7e704777c86a7c6">
                  Mutant Ape Yacht Club
                </option>
                <option value="0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258">
                  Otherdeed for Otherside
                </option>
                <option value="0x08d7c0242953446436f34b4c78fe9da38c73668d">
                  PROOF Collective
                </option>
                <option value="0x23581767a106ae21c074b2276d25e5c3e136a68b">
                  Moonbirds
                </option>
                <option value="0xed5af388653567af2f388e6224dc7c4b3241c544">
                  Azuki
                </option>
                <option value="0x8a90cab2b38dba80c64b7734e58ee1db38b8992e">
                  Doodles
                </option>
              </select>
              <Search
                label="Contract address"
                exploreLink={false}
                action="explore"
                className="mt-4"
              />
            </div>
          </div>
          {loading && (
            <Loader
              color={darkMode ? 'white' : 'blue'}
              label="Fetching wallets"
              className="text-gray-700 dark:text-gray-50"
            />
          )}

          {!loading && contractMetadata?.name && (
            <div className="text-center dark:text-white">
              <h2 className="text-2xl font-extrabold ">
                {contractMetadata.name} Owners
              </h2>
              <h3 className="text-lg">({contractMetadata.symbol})</h3>
            </div>
          )}
        </div>
        <div className="max-w-6xl gap-8 px-4 pb-12 mx-auto mb-40">
          {!loading && (
            <ul
              role="list"
              className="grid grid-cols-2 gap-4 md:gap-10 md:grid-cols-3 lg:grid-cols-4">
              {owners && (
                <>
                  {owners.slice(0, 80).map((wallet, key) => {
                    return (
                      <li
                        key={key}
                        className="flex flex-col col-span-1 text-center transition bg-white border border-gray-200 divide-y divide-gray-200 rounded-lg shadow hover:shadow-2xl">
                        <Link href={`/wallets/${wallet}`}>
                          <a className="flex flex-col flex-1 p-8 cursor">
                            <CgProfile className="flex-shrink-0 w-32 h-32 p-4 mx-auto text-white bg-gray-200 rounded-full" />
                            <h3 className="flex items-center justify-center mt-6 text-sm font-medium text-gray-900">
                              <Truncate address={wallet} digits={6} />
                            </h3>
                          </a>
                        </Link>
                      </li>
                    )
                  })}
                </>
              )}
            </ul>
          )}
        </div>
      </>
    </Layout>
  )
}

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  let data = {}

  if (query.address) {
    const res = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + `/api/contracts/${query.address[0]}`
    )
    data = await res.json()
  }

  return {
    props: {
      ...data,
    },
  }
}

export default Explore
