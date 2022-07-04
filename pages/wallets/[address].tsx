import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import clsx from 'clsx'
import { useRecoilState } from 'recoil'
import { useRouter } from 'next/router'
import Image from 'next/image'
import {
  currentAccountState,
  claimedState,
  loggedInState,
  notificationState,
} from '../../recoil/atoms'
import { MdVerified } from 'react-icons/md'
import { CgProfile } from 'react-icons/cg'
import {
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaGithub,
  FaMedium,
  FaSnapchat,
  FaTiktok,
  FaGlobeAmericas,
} from 'react-icons/fa'
import CurrencyFormat from 'react-currency-format'
import { useQuery } from '../../lib/helpers'
import { Layout } from '../../components/layout'
import { Button } from '../../components/button'
import { Truncate } from '../../components/truncate'
import { Loader } from '../../components/loader'
import MetaWallet from '../../public/artifacts/MetaWallet.json'

const Wallet = () => {
  const emptyWallet = {
    address: '',
    balance: 0,
    walletData: [],
    tokens: [],
    nfts: [],
    transactions: [],
    nftPageKey: '',
  }
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInState)
  const [isClaimed, setIsClaimed] = useRecoilState(claimedState)
  const [currentAccount, setCurrentAccount] =
    useRecoilState(currentAccountState)
  const [noteState, setNoteState] = useRecoilState(notificationState)
  const [wallet, setWallet] = useState(emptyWallet)
  const [currentTab, setCurrentTab] = useState('#nfts')
  const [balance, setBalance] = useState(0)
  const [ethPrice, setEthPrice] = useState(0)
  const [claimed, setClaimed] = useState(false)
  const [loadingNfts, setLoadingNfts] = useState(false)
  const query = useQuery()

  const tabs = [
    { name: 'NFTs', href: '#nfts', current: true },
    { name: 'Tokens', href: '#tokens', current: false },
    { name: 'Transactions', href: '#transactions', current: false },
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
      setNoteState({
        show: true,
        type: 'error',
        heading: `Error ${err.code}`,
        message: err.message,
      })
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
      try {
        const claim = await contract.claimWallet({
          value: ethers.utils.parseEther('0'),
        })

        setNoteState({
          show: true,
          type: 'success',
          heading: `Wallet claimed`,
          message: (
            <a
              className="border-b border-black hover:border-0"
              href={`https://kovan-optimistic.etherscan.io/tx/${claim.hash}`}
              target="_blank"
              rel="noreferrer">
              View on Etherscan
            </a>
          ),
        })
      } catch (err) {
        console.log(err)
        setNoteState({
          show: true,
          type: 'error',
          heading: `Error ${err.code}`,
          message: err.message,
        })
        return
      }
    }

    // update claimed state
    setIsClaimed(true)
    setWallet(emptyWallet)
    fetchWallet()
  }

  const fetchWallet = async () => {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + `/api/wallets/${query.address}`
    )
    const responseJson = await response.json()
    setWallet(responseJson)
    setClaimed(responseJson.claimed)
  }

  const fetchEthPrice = async () => {
    const res = await fetch('https://data.messari.io/api/v1/assets/eth/metrics')
    const json = await res.json()

    if (json.data.market_data.price_usd) {
      setEthPrice(json.data.market_data.price_usd)
    }
  }

  const loadMoreNfts = async () => {
    setLoadingNfts(true)

    const fetchMoreNftsReq = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/nfts/${wallet.address}/${wallet.nftPageKey}`
    )

    const fetchMoreNfts = await fetchMoreNftsReq.json()

    setWallet({
      ...wallet,
      nfts: wallet.nfts.concat(fetchMoreNfts.nfts),
      nftPageKey: fetchMoreNfts.pageKey,
    })

    setLoadingNfts(false)
  }

  useEffect(() => {
    if (wallet.address) {
      setBalance(
        Math.round(Number(ethers.utils.formatEther(wallet.balance)) * 100) / 100
      )
    }
  }, [wallet, ethPrice])

  useEffect(() => {
    if (!query) {
      return
    }

    setWallet(emptyWallet)

    fetchWallet()
    fetchEthPrice()

    if (
      window.location.hash === '#nfts' ||
      window.location.hash === '#tokens'
    ) {
      setCurrentTab(window.location.hash)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  return (
    <Layout>
      <div
        className="min-h-full mt-40 text-center bg-slate-50"
        style={{ minHeight: 'calc(100vh - 285px)' }}>
        <div className="relative inline-block w-full px-8 pt-8 pb-12 my-8 overflow-hidden text-left text-gray-700 align-bottom transition-all transform -translate-y-40 bg-white rounded-lg shadow-xl max-w-7xl">
          {!wallet.address && (
            <Loader label="Loading wallet" className="my-24" />
          )}
          {wallet.address == currentAccount && !isClaimed && (
            <button
              onClick={claimWallet}
              className="flex items-center mx-auto mt-2 text-lg font-bold text-indigo-500 border-b border-indigo-400">
              Claim your wallet and customize your profile
            </button>
          )}
          {wallet.address && (
            <div className="py-16">
              <div className="w-full max-w-4xl mx-auto">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="flex items-center justify-center w-32 h-32 border rounded-full shadow-inner border-cyan-500">
                    {wallet.walletData && wallet.walletData[4] && (
                      <img
                        className="w-full h-full rounded-full"
                        src={wallet.walletData[4]}
                      />
                    )}
                    {!wallet.walletData ||
                    !wallet.walletData.length ||
                    !wallet.walletData[4] ? (
                      <CgProfile className="flex-shrink-0 w-32 h-32 p-4 mx-auto text-white bg-gray-200 rounded-full" />
                    ) : (
                      ''
                    )}
                  </div>
                  {claimed && (
                    <h1 className="flex items-center mt-6 mb-2 font-serif text-3xl">
                      {wallet.walletData[2] ? (
                        wallet.walletData[2]
                      ) : (
                        <Truncate address={wallet.address} />
                      )}
                      <MdVerified className="ml-2 text-lg text-blue-500" />
                    </h1>
                  )}
                  {!claimed && (
                    <h1 className="flex items-center mt-6 mb-2 font-serif text-3xl">
                      <Truncate address={wallet.address} />
                    </h1>
                  )}

                  {claimed && (
                    <>
                      {wallet.walletData[5] && (
                        <ul className="flex flex-wrap gap-4 mt-4 mb-8">
                          {wallet.walletData[5].map((link, key) => {
                            const customIcons = [
                              'opensea',
                              'magiceden',
                              'rarible',
                              'looksrare',
                              'superrare',
                            ]
                            if (!link[0]) {
                              return
                            }
                            return (
                              <li key={key} data-type={link[0]}>
                                <a
                                  href={link[1]}
                                  className="flex items-center justify-center w-full h-full">
                                  {link[0] === 'twitter' && <FaTwitter />}
                                  {link[0] === 'instagram' && <FaInstagram />}
                                  {link[0] === 'linkedin' && <FaLinkedin />}
                                  {link[0] === 'github' && <FaGithub />}
                                  {link[0] === 'medium' && <FaMedium />}
                                  {link[0] === 'tiktok' && <FaTiktok />}
                                  {link[0] === 'snapchat' && <FaSnapchat />}
                                  {link[0].includes('website') && (
                                    <FaGlobeAmericas />
                                  )}
                                  {customIcons.includes(link[0]) && (
                                    <img
                                      src={`/icons/${link[0]}.svg`}
                                      height={link[0] === 'looksrare' ? 20 : 16}
                                      width={link[0] === 'looksrare' ? 20 : 16}
                                      className="max-w-none"
                                    />
                                  )}
                                </a>
                              </li>
                            )
                          })}
                        </ul>
                      )}
                      {wallet.walletData[3] && (
                        <p className="leading-loose">{wallet.walletData[3]}</p>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="w-full max-w-6xl pb-20 mx-auto mt-6 text-lg text-center">
                <p>
                  <strong>Balance</strong>: {balance} ETH (
                  <CurrencyFormat
                    value={balance * ethPrice}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'$'}
                    decimalScale={2}
                    fixedDecimalScale={2}
                  />
                  )
                </p>
                <div className="mt-16 mb-4">
                  <div className="sm:hidden">
                    <label htmlFor="tabs" className="sr-only">
                      Select a tab
                    </label>
                    <select
                      id="tabs"
                      name="tabs"
                      className="block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      defaultValue={tabs.find((tab) => tab.current).name}
                      onChange={(e) => {
                        window.location.hash = e.currentTarget.value
                        setCurrentTab(e.currentTarget.value)
                      }}>
                      {tabs.map((tab) => (
                        <option
                          key={tab.name}
                          value={tab.href}
                          selected={tab.href === currentTab}>
                          {tab.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="hidden sm:block">
                    <div className="border-b border-gray-200">
                      <nav className="flex -mb-px" aria-label="Tabs">
                        {tabs.map((tab) => (
                          <a
                            key={tab.name}
                            href={tab.href}
                            onClick={() => setCurrentTab(tab.href)}
                            className={clsx(
                              currentTab === tab.href
                                ? 'border-gray-900 text-gray-900'
                                : 'border-gray-200 text-gray-400 hover:text-gray-500 hover:border-gray-300',
                              'w-1/2 py-4 px-1 text-center border-b-2 font-medium text-base'
                            )}
                            aria-current={tab.current ? 'page' : undefined}>
                            {tab.name}
                          </a>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: currentTab === '#nfts' ? 'block' : 'none',
                  }}>
                  <div className="grid grid-cols-2 gap-6 mt-8 md:grid-cols-3 lg:grid-cols-4">
                    {wallet?.nfts?.map((nft, index) => {
                      if (!nft || !nft.img) {
                        return false
                      }
                      return (
                        <div className="text-left">
                          <div
                            key={index}
                            className="relative h-[276px] bg-gray-100 text-xs flex items-center justify-center text-center">
                            <p>Loading...</p>
                            <img
                              className="absolute object-cover w-full h-full rounded-lg"
                              src={nft.img}
                              onError={(e) => {
                                e.currentTarget.src = '/img/placeholder.jpg'
                              }}
                            />
                          </div>
                          <div>
                            <h3 className="pt-2 text-sm font-bold">
                              {nft.title}
                            </h3>
                            <h4 className="text-sm text-gray-500">
                              {nft.collectionName}
                            </h4>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  {wallet.nftPageKey && (
                    <Button
                      onClick={() => loadMoreNfts()}
                      size="lg"
                      disabled={loadingNfts}
                      className="mx-auto mt-16">
                      {loadingNfts ? 'Loading...' : 'Load more'}
                    </Button>
                  )}
                </div>
                <div
                  style={{
                    display: currentTab === '#tokens' ? 'block' : 'none',
                  }}>
                  <ul className="text-left ">
                    {wallet?.tokens?.map((token, index) => {
                      return (
                        <li key={index} className="flex items-center py-4">
                          <img
                            src={token.tokenMeta.logo}
                            className="object-contain mr-2"
                            width="20px"
                          />
                          <span className="w-16 font-bold">
                            {token.tokenMeta.symbol}
                          </span>
                          <span>
                            {ethers.utils.formatUnits(
                              token.token.tokenBalance,
                              token.tokenMeta.decimals
                            )}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
                <div
                  style={{
                    display: currentTab === '#transactions' ? 'block' : 'none',
                  }}>
                  <div className="flex flex-col mt-8">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                          <table className="min-w-full text-sm text-left divide-y divide-gray-300 ">
                            <thead className="font-semibold text-gray-900 bg-gray-50">
                              <tr>
                                <th scope="col" className="px-3 py-3.5">
                                  Hash
                                </th>
                                <th scope="col" className="px-3 py-3.5">
                                  From
                                </th>
                                <th scope="col" className="px-3 py-3.5">
                                  To
                                </th>
                                <th scope="col" className="px-3 py-3.5">
                                  Asset
                                </th>
                                <th scope="col" className="px-3 py-3.5">
                                  Value
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-20 text-gray-5000 whitespace-nowrap">
                              {wallet?.transactions?.map((trans, index) => {
                                return (
                                  <tr key={index}>
                                    <td className="px-3 py-4">
                                      <Truncate address={trans.hash} />
                                    </td>
                                    <td className="px-3 py-4">
                                      <Truncate address={trans.from} />
                                    </td>
                                    <td className="px-3 py-4">
                                      <Truncate address={trans.to} />
                                    </td>
                                    <td className="px-3 py-4">{trans.asset}</td>
                                    <td className="px-3 py-4">{trans.value}</td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Wallet
