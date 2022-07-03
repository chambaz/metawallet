import clsx from 'clsx'
import Link from 'next/link'
import { FaTwitter, FaDiscord, FaGithub } from 'react-icons/fa'

const navigation = {
  main: [
    { name: 'Explore wallets', href: '/' },
    { name: 'About MetaWallet', href: '/about' },
    { name: 'For Developers', href: '/developers' },
  ],
  social: [
    {
      name: 'Twitter',
      href: 'https://twitter.com/chambaz',
      icon: FaTwitter,
    },
    {
      name: 'GitHub',
      href: 'https://github.com/chambaz',
      icon: FaGithub,
    },
    {
      name: 'Discord',
      href: '#',
      icon: FaDiscord,
    },
  ],
}

export const Footer = () => {
  return (
    <footer className="shadow-inner bg-gray-50 dark:bg-gray-50">
      <div className="px-4 py-10 mx-auto overflow-hidden max-w-7xl sm:px-6 lg:px-8">
        <nav
          className="flex flex-wrap justify-center -mx-5 -my-2"
          aria-label="Footer">
          {navigation.main.map((item) => (
            <div key={item.name} className="px-5 py-2">
              <Link href={item.href}>
                <a className="text-base text-gray-500 hover:text-gray-900">
                  {item.name}
                </a>
              </Link>
            </div>
          ))}
        </nav>
        <div className="flex justify-center mt-8 space-x-6">
          {navigation.social.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={clsx(
                'text-gray-400 hover:text-gray-500',
                item.href === '#' && 'cursor-help'
              )}
              title={item.href === '#' ? 'Coming soon...' : ''}>
              <span className="sr-only">{item.name}</span>
              <item.icon className="w-6 h-6" aria-hidden="true" />
            </a>
          ))}
        </div>
        <p className="mt-8 text-base text-center text-gray-400">
          &copy; 2022 MetaWallet. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
