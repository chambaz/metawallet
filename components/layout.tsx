import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import { ethers } from 'ethers'
import {
  currentAccountState,
  loggedInState,
  claimedState,
  darkModeState,
  networkErrorState,
  notificationState,
} from '../recoil/atoms'
import { checkNetwork } from '../lib/helpers'
import { Nav } from './nav'
import { NetworkModal } from './networkModal'
import { Notification } from './notification'
import { Footer } from './footer'
import MetaWallet from '../public/artifacts/MetaWallet.json'

type Props = {
  children: JSX.Element
}

export const Layout = ({ children }: Props) => {
  const router = useRouter()
  const [currentAccount, setCurrentAccount] =
    useRecoilState(currentAccountState)
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInState)
  const [isClaimed, setIsClaimed] = useRecoilState(claimedState)
  const [isDarkMode, setDarkMode] = useRecoilState(darkModeState)
  const [isNetworkError, setIsNetworkError] = useRecoilState(networkErrorState)
  const [noteState, setNoteState] = useRecoilState(notificationState)

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

      const accounts = await ethereum.request({ method: 'eth_accounts' })

      if (accounts.length > 0) {
        const networkCheck = await checkNetwork()

        if (!networkCheck) {
          return
        }

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
    <div className="h-full min-h-screen text-gray-800 bg-slate-100 dark:bg-gray-800">
      <div className="w-full p-2 text-sm font-bold text-center text-white bg-teal-500">
        <p>📣 MetaWallet is in alpha and currently running on testnet 📣</p>
      </div>
      <NetworkModal show={isNetworkError} onClose={setIsNetworkError} />
      <Notification
        show={noteState.show}
        type={noteState.type}
        heading={noteState.heading}
        message={<>{noteState.message}</>}
        onClose={() =>
          setNoteState({
            show: false,
            type: '',
            heading: '',
            message: '',
          })
        }
      />
      <Nav />
      {children}
      <Footer />
    </div>
  )
}
