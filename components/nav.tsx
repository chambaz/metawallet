import { useState, useEffect } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import { ethers } from 'ethers'
import { Switch } from '@headlessui/react'
import { CgProfile } from 'react-icons/cg'
import { MdDarkMode } from 'react-icons/md'
import { loggedInState, currentAccountState } from '../recoil/atoms'
import { Truncate } from './truncate'
import MetaWallet from '../public/artifacts/MetaWallet.json'

export const Nav = () => {
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInState)
  const [currentAccount, setCurrentAccount] =
    useRecoilState(currentAccountState)

  const navItems = [
    {
      text: 'Explore Wallets',
      link: '/explore',
    },
    {
      text: 'About MetaWallet',
      link: '/#features',
    },
  ]

  const claimWallet = async () => {
    // connect wallet if not already connected
    const { ethereum } = window
    let accounts

    if (!ethereum) {
      alert('Please install Metamask!')
    }

    try {
      accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      const account = accounts[0]
      console.log('Found an account: ', account)
      setCurrentAccount(account)
    } catch (err) {
      console.log(err)
    }

    // init contract
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_META_WALLET_CONTRACT_ADDRESS,
      MetaWallet.abi,
      signer
    )

    // check if already claimed
    const isClaimed = await contract.isClaimedWallet(accounts[0])

    if (!isClaimed) {
      // make call to claim wallet
      const claim = await contract.claimWallet({
        value: ethers.utils.parseEther('1'),
      })
    }

    // update router to wallet page
    router.push(`/wallets/${accounts[0]}`)

    // update logged in state
    setIsLoggedIn(true)
  }

  useEffect(() => {
    const checkClaimed = async () => {
      // check if wallet connected
      const { ethereum } = window

      if (!ethereum) {
        console.log('Make sure you have Metamask installed!')
        return
      } else {
        console.log("Wallet exists! We're ready to go!")
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' })

      if (accounts.length > 0) {
        const account = accounts[0]
        console.log('Found an account: ', account)

        // init contract
        // TODO: Requires being on correct netework to view
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_META_WALLET_CONTRACT_ADDRESS,
          MetaWallet.abi,
          signer
        )

        // check if wallet already claimed
        const isClaimed = await contract.isClaimedWallet(account)

        if (isClaimed) {
          setCurrentAccount(account)
          setIsLoggedIn(true)
        } else {
          if (router.pathname === '/profile') {
            router.push(`/wallets/${account}`)
          }
        }
      } else {
        console.log('No account found')

        if (router.pathname === '/profile') {
          router.push(`/`)
        }
      }
    }

    checkClaimed()
    setDarkMode(document.documentElement.classList.contains('dark'))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="flex items-center justify-center p-8 dark:text-white 2xl:justify-start">
        <Link href="/" passHref>
          <a
            className="flex items-center cursor-pointer"
            style={{ transform: 'translateY(-2px)' }}>
            <div className="flex flex-col items-center justify-center mr-4 scale-105">
              <span
                className="pb-2 font-serif text-5xl leading-none text-transparent rotate-180 bg-clip-text bg-gradient-to-b to-cyan-300 from-cyan-700 dark:to-cyan-500 dark:from-cyan-900"
                style={{ lineHeight: 0.5 }}>
                W
              </span>
              <span
                className="pb-2 font-serif text-5xl leading-none text-transparent bg-clip-text bg-gradient-to-b to-violet-600 from-cyan-700 dark:to-violet-800 dark:from-cyan-900"
                style={{ lineHeight: 0.5 }}>
                W
              </span>
            </div>
            <p className="font-serif text-3xl dark:text-white">MetaWallet</p>
          </a>
        </Link>
        <div className="items-center hidden ml-auto 2xl:flex">
          <ul className="flex items-center mr-12">
            {navItems.map((item, index) => {
              return (
                <li className="mx-8 font-bold" key={index}>
                  <Link href={item.link}>
                    <a
                      className={clsx(
                        'dark:text-white transition hover:text-teal-500 dark:hover:text-teal-200',
                        !item.link.includes('/#') &&
                          router.asPath.includes(item.link) &&
                          'text-teal-600 dark:text-teal-300'
                      )}>
                      {item.text}
                    </a>
                  </Link>
                </li>
              )
            })}
            <li className="flex items-center ml-4">
              <Switch
                checked={darkMode}
                onChange={() => {
                  if (darkMode) {
                    setDarkMode(false)
                    document.documentElement.classList.remove('dark')
                    localStorage.theme = 'light'
                  } else {
                    setDarkMode(true)
                    document.documentElement.classList.add('dark')
                    localStorage.theme = 'dark'
                  }
                }}
                className={clsx(
                  darkMode ? 'bg-indigo-600' : 'bg-gray-200',
                  'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                )}>
                <span className="sr-only">Dark Mode</span>
                <span
                  aria-hidden="true"
                  className={clsx(
                    darkMode ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                  )}
                />
              </Switch>
              <MdDarkMode className="ml-4" />
            </li>
          </ul>
          {isLoggedIn && (
            <>
              <Link href="/profile" passHref>
                <button className="flex px-8 py-2 mr-8 transition border border-gray-800 rounded-full dark:border-white hover:bg-white hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Edit Profile
                </button>
              </Link>
              <Link href={`/wallets/${currentAccount}`} passHref>
                <button
                  type="button"
                  className="relative inline-flex items-center text-sm font-bold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-5">
                  <div className="p-4 bg-gray-800 rounded-l-md bg-opacity-90">
                    <CgProfile className="text-2xl" />
                  </div>
                  <div className="px-6">
                    <Truncate address={currentAccount} />
                  </div>
                </button>
              </Link>
            </>
          )}
          {!isLoggedIn && (
            <button
              type="button"
              onClick={() => claimWallet()}
              className="relative inline-flex items-center px-6 py-4 ml-auto text-sm font-bold text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Claim your wallet
            </button>
          )}
        </div>
      </div>
    </>
  )
}
