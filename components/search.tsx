import { useState, useEffect, Fragment } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import clsx from 'clsx'
import { Listbox, Transition } from '@headlessui/react'
import { HiOutlineCheck, HiOutlineSelector } from 'react-icons/hi'
import { Button } from './button'

type Props = {
  action?: string
  exploreLink?: boolean
  className?: string
}

export const Search = ({
  action = 'wallets',
  exploreLink = true,
  className = '',
}: Props) => {
  const router = useRouter()
  const [address, setAddress] = useState('')

  const placeholders = {
    Ethereum: '0x0000000000000000000000000000',
    Solana: '000000000000000000000000000000',
  }

  const labels = {
    Ethereum: 'Wallet / ENS address',
    Solana: 'Wallet address',
  }

  const chains = [
    { id: 0, name: 'Ethereum', img: '/icons/ethereum.svg' },
    { id: 1, name: 'Solana', img: '/icons/solana.svg' },
  ]

  const [chainSelected, setChainSelected] = useState(chains[0])
  const [placeholder, setPlaceholder] = useState(placeholders.Ethereum)
  const [label, setLabel] = useState(labels.Ethereum)

  const submit = (e) => {
    e.preventDefault()
    router.push(`/${action}/${address}`)
  }

  useEffect(() => {
    setPlaceholder(placeholders[chainSelected.name])
    setLabel(labels[chainSelected.name])
  }, [chainSelected])

  return (
    <div className={clsx('w-full', className)}>
      <label
        htmlFor="email"
        className="block text-sm font-medium text-left dark:text-gray-50">
        {label}
      </label>
      <div className="mt-1">
        <form onSubmit={submit} className="flex gap-2">
          <div className="relative w-full">
            <input
              type="text"
              name="address"
              className="block w-full p-3 text-2xl text-gray-800 border-gray-400 rounded-md shadow-sm dark:border-gray-300 focus:ring-cyan-500 focus:border-cyan-500"
              placeholder={placeholder}
              onChange={(e) => setAddress(e.target.value)}
            />
            <div className="absolute top-0 flex items-center right-[1px] min-w-[140px]">
              <Listbox value={chainSelected} onChange={setChainSelected}>
                {({ open }) => (
                  <div className="relative w-full mt-1">
                    <Listbox.Button className="relative flex justify-end w-full py-3 pl-3 pr-10 text-left bg-white rounded-md shadow-sm cursor-default focus:outline-none sm:text-sm">
                      <span className="relative flex items-center truncate">
                        <img src={chainSelected.img} className="mr-1" />
                        {chainSelected.name}
                      </span>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <HiOutlineSelector
                          className="w-5 h-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>

                    <Transition
                      show={open}
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0">
                      <Listbox.Options className="absolute z-10 w-full py-1 mt-2 overflow-auto text-base text-left bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {chains.map((chain) => (
                          <Listbox.Option
                            key={chain.id}
                            className={({ active }) =>
                              clsx(
                                active
                                  ? 'text-white bg-indigo-600'
                                  : 'text-gray-900',
                                'cursor-default select-none relative py-2 pl-3 pr-9'
                              )
                            }
                            value={chain}>
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={clsx(
                                    selected ? 'font-semibold' : 'font-normal',
                                    'flex items-center truncate'
                                  )}>
                                  <img src={chain.img} className="mr-1" />
                                  {chain.name}
                                </span>

                                {selected ? (
                                  <span
                                    className={clsx(
                                      active ? 'text-white' : 'text-indigo-600',
                                      'absolute inset-y-0 right-0 flex items-center pr-4'
                                    )}>
                                    <HiOutlineCheck
                                      className="w-5 h-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                )}
              </Listbox>
            </div>
          </div>
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
