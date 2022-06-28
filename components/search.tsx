import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import clsx from 'clsx'
import { Button } from './button'

type Props = {
  label?: string
  placeholder?: string
  action?: string
  exploreLink?: boolean
  className?: string
}

export const Search = ({
  label = 'Wallet / ENS address',
  placeholder = '0x0000000000000000',
  action = 'wallets',
  exploreLink = true,
  className = '',
}: Props) => {
  const router = useRouter()
  const [address, setAddress] = useState('')

  const submit = (e) => {
    e.preventDefault()
    router.push(`/${action}/${address}`)
  }

  return (
    <div className={clsx('w-full', className)}>
      <label
        htmlFor="email"
        className="block text-sm font-medium text-left dark:text-gray-50">
        {label}
      </label>
      <div className="mt-1">
        <form onSubmit={submit} style={{ display: 'flex' }}>
          <input
            type="text"
            name="address"
            className="block w-full p-3 mr-2 text-2xl text-gray-800 border-gray-400 rounded-md shadow-sm dark:border-gray-300 focus:ring-cyan-500 focus:border-cyan-500"
            placeholder={placeholder}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Button type="submit">
            <div className="flex flex-col items-center justify-center">
              <span
                className="font-serif text-3xl leading-none rotate-180"
                style={{ lineHeight: 0.5 }}>
                W
              </span>
              <span
                className="font-serif text-3xl leading-none"
                style={{ lineHeight: 0.5 }}>
                W
              </span>
            </div>
          </Button>
        </form>
        <p className="inline-block my-4 text-sm transition border-b border-gray-800 dark:border-white dark:text-white hover:border-teal-500 hover:text-teal-500 dark:hover:border-teal-200 dark:hover:text-teal-200">
          {exploreLink && (
            <Link href="/explore">
              <a>Explore more wallets</a>
            </Link>
          )}
        </p>
      </div>
    </div>
  )
}
