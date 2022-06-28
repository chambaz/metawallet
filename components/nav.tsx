import { useEffect } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import { ethers } from 'ethers'
import { Switch } from '@headlessui/react'
import { CgProfile } from 'react-icons/cg'
import { MdDarkMode } from 'react-icons/md'
import {
  loggedInState,
  currentAccountState,
  claimedState,
  darkModeState,
  networkErrorState,
} from '../recoil/atoms'
import { Button } from './button'
import { Truncate } from './truncate'
import MetaWallet from '../public/artifacts/MetaWallet.json'

export const Nav = () => {
  const router = useRouter()
  const [darkMode, setDarkMode] = useRecoilState(darkModeState)
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInState)
  const [isClaimed, setIsClaimed] = useRecoilState(claimedState)
  const [isNetworkError, setIsNetworkError] = useRecoilState(networkErrorState)
  const [currentAccount, setCurrentAccount] =
    useRecoilState(currentAccountState)

  const navItems = [
    {
      text: 'Explore Wallets',
      link: '/explore',
    },
    {
      text: 'About MetaWallet',
      link: '/about',
    },
    {
      text: 'For Developers',
      link: '/developers',
    },
  ]

  const login = async () => {
    // connect wallet if not already connected
    const { ethereum } = window
    let accounts

    if (!ethereum) {
      alert('Please install Metamask!')
      return
    }

    const networkCheck = await checkNetwork()

    setIsNetworkError(!networkCheck)

    if (!networkCheck) {
      return
    }

    try {
      accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      const account = accounts[0]
      console.log('Found an account: ', account)
      setCurrentAccount(account)
    } catch (err) {
      console.log(err)
    }

    // update router to wallet page
    router.push(`/wallets/${accounts[0]}`)

    // update logged in state
    setIsLoggedIn(true)
  }

  const checkNetwork = async () => {
    const { ethereum } = window

    if (!ethereum) {
      console.log('Make sure you have Metamask installed!')
      return
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' })
    const provider = new ethers.providers.Web3Provider(ethereum)
    const { chainId } = await provider.getNetwork()

    console.log(chainId)

    // return chainId === 10
    return chainId === 31337
  }

  useEffect(() => {
    const checkWallet = async () => {
      // check if wallet connected
      const { ethereum } = window

      if (!ethereum) {
        console.log('Make sure you have Metamask installed!')
        return
      } else {
        console.log("Wallet exists! We're ready to go!")
      }

      const networkCheck = await checkNetwork()

      setIsNetworkError(!networkCheck)

      if (!networkCheck) {
        return
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' })

      if (accounts.length > 0) {
        const account = accounts[0]
        console.log('Found an account: ', account)

        setCurrentAccount(account)
        setIsLoggedIn(true)

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
          setIsClaimed(true)
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

    checkWallet()
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
          {isClaimed && (
            <Button
              size="sm"
              variant="pill"
              className="mr-8"
              onClick={() => router.push('/profile')}>
              Edit Profile
            </Button>
          )}

          {isLoggedIn && (
            <Link href={`/wallets/${currentAccount}`} passHref>
              <button
                type="button"
                className="relative inline-flex items-center text-sm font-bold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <div className="p-4 bg-gray-800 rounded-l-md bg-opacity-90">
                  <CgProfile className="text-2xl" />
                </div>
                <div className="px-6">
                  <Truncate address={currentAccount} />
                </div>
              </button>
            </Link>
          )}

          {!isLoggedIn && (
            <Button size="lg" onClick={login}>
              Log in
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
