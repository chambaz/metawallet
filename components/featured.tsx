import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button } from './button'
import { Truncate } from './truncate'
import { MdVerified } from 'react-icons/md'

export const Featured = () => {
  const router = useRouter()
  const [wallets, setWallets] = useState([])

  const fetchWallets = async () => {
    const featuredReq = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/wallets/featured`
    )
    const featured = await featuredReq.json()
    setWallets(featured.wallets)
  }

  useEffect(() => {
    fetchWallets()
  }, [])
  return (
    <div id="featured" className="relative py-16 text-center">
      <div className="mb-8">
        <h2 className="mb-4 text-3xl font-bold text-center dark:text-white">
          Featured MetaWallet profiles
        </h2>
      </div>
      <ul
        role="list"
        className="grid grid-cols-2 gap-6 md:gap-10 md:grid-cols-3 lg:grid-cols-4">
        {wallets.map((wallet, index) => (
          <li
            key={index}
            className="flex flex-col col-span-1 text-center transition bg-white border border-gray-200 divide-y divide-gray-200 rounded-lg shadow hover:shadow-lg dark:hover:shadow-2xl">
            <Link href={`/wallets/${wallet.address}`}>
              <a className="flex flex-col flex-1 p-8 cursor">
                <img
                  className="flex-shrink-0 w-32 h-32 p-4 mx-auto rounded-full"
                  src={wallet.avatar}
                />
                <h3 className="flex items-center justify-center mt-6 text-sm font-medium text-gray-900">
                  {wallet.username}
                  <MdVerified className="ml-1 text-lg text-blue-500" />
                </h3>
                <h4 className="mt-2 text-xs text-gray-500">
                  <Truncate address={wallet.address} />
                </h4>
              </a>
            </Link>
          </li>
        ))}
      </ul>
      {/* <Button
        size="md"
        className="mx-auto mt-12 mb-8 ml-auto"
        onClick={() => router.push('/explore')}>
        Explore more wallets
      </Button> */}
    </div>
  )
}
