import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button } from './button'
import { MdVerified } from 'react-icons/md'
import { CgProfile } from 'react-icons/cg'

const features = [
  {
    name: 'janecooper',
    address: '0xb35...0bE5',
    avatar: CgProfile,
  },
  {
    name: 'dingaling',
    address: '0xb35...0bE5',
    avatar: CgProfile,
  },
  {
    name: 'Nate Rivers',
    address: '0xb35...0bE5',
    avatar: CgProfile,
  },
  {
    name: '6529',
    address: '0xb35...0bE5',
    avatar: CgProfile,
  },
  {
    name: 'janecooper',
    address: '0xb35...0bE5',
    avatar: CgProfile,
  },
  {
    name: 'dingaling',
    address: '0xb35...0bE5',
    avatar: CgProfile,
  },
  {
    name: 'Nate Rivers',
    address: '0xb35...0bE5',
    avatar: CgProfile,
  },
  {
    name: '6529',
    address: '0xb35...0bE5',
    avatar: CgProfile,
  },
]

export const Featured = () => {
  const router = useRouter()
  return (
    <div className="relative py-16 text-center">
      <div className="mb-8">
        <h2 className="mb-4 text-3xl font-bold text-center dark:text-white">
          Featured MetaWallet profiles
        </h2>
      </div>
      <ul
        role="list"
        className="grid grid-cols-2 gap-6 md:gap-10 md:grid-cols-3 lg:grid-cols-4">
        {features.map((feature, index) => (
          <li
            key={index}
            className="flex flex-col col-span-1 text-center transition bg-white border border-gray-200 divide-y divide-gray-200 rounded-lg shadow hover:shadow-lg dark:hover:shadow-2xl">
            <Link href={`/wallets/${feature.address}`}>
              <a className="flex flex-col flex-1 p-8 cursor">
                <feature.avatar className="flex-shrink-0 w-32 h-32 p-4 mx-auto text-white bg-gray-200 rounded-full" />
                <h3 className="flex items-center justify-center mt-6 text-sm font-medium text-gray-900">
                  {feature.name}
                  <MdVerified className="ml-1 text-lg text-blue-500" />
                </h3>
                <h4 className="mt-2 text-xs text-gray-500">
                  {feature.address}
                </h4>
              </a>
            </Link>
          </li>
        ))}
      </ul>
      <Button
        size="md"
        className="mx-auto mt-12 mb-8 ml-auto"
        onClick={() => router.push('/explore')}>
        Explore more wallets
      </Button>
    </div>
  )
}
