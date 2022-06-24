import { AiOutlineSearch } from 'react-icons/ai'
import { MdVerified } from 'react-icons/md'
import { BiNetworkChart } from 'react-icons/bi'

const features = [
  {
    name: 'Explore Wallets',
    description:
      'Ad sint anim id ipsum amet nisi pariatur commodo. Qui occaecat irure consectetur in non.',
    icon: AiOutlineSearch,
  },
  {
    name: 'Claim Your Wallet',
    description:
      'Ad sint anim id ipsum amet nisi pariatur commodo. Qui occaecat irure consectetur in non.',
    icon: MdVerified,
  },
  {
    name: 'Profile API',
    description:
      'Ad sint anim id ipsum amet nisi pariatur commodo. Qui occaecat irure consectetur in non.',
    icon: BiNetworkChart,
  },
]

export const Features = () => {
  return (
    <div className="relative py-16" id="features">
      <div className="max-w-md px-4 mx-auto text-center sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-base font-semibold tracking-wider text-teal-400 uppercase dark:text-teal-200">
          Profiles for Web3
        </h2>
        <p className="mt-2 text-3xl font-extrabold tracking-tight dark:text-white sm:text-4xl">
          Explore, claim, customize
        </p>
        <p className="mx-auto mt-5 text-xl dark:text-gray-100 max-w-prose">
          Phasellus lorem quam molestie id quisque diam aenean nulla in.
          Accumsan in quis quis nunc, ullamcorper malesuada. Eleifend
          condimentum id viverra nulla.
        </p>
        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex pt-6">
                <div className="flow-root px-6 pb-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-50">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                        <feature.icon
                          className="w-6 h-6 text-white"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-bold tracking-tight text-gray-900">
                      {feature.name}
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
