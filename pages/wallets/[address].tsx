import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
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
import { Truncate } from '../../components/truncate'

const Wallet = () => {
  const emptyWallet = {
    address: '',
    balance: 0,
    walletData: [],
    tokens: [],
    nfts: [],
    transactions: [],
  }
  const [wallet, setWallet] = useState(emptyWallet)
  const [currentTab, setCurrentTab] = useState('#nfts')
  const [balance, setBalance] = useState(0)
  const [ethPrice, setEthPrice] = useState(0)
  const [claimed, setClaimed] = useState(false)
  const query = useQuery()

  const tabs = [
    { name: 'NFTs', href: '#nfts', current: true },
    { name: 'Tokens', href: '#tokens', current: false },
    { name: 'Transactions', href: '#transactions', current: false },
  ]

  const classNames = (...classes) => {
    return classes.filter(Boolean).join(' ')
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
            <div className="py-24 text-center">Loading wallet...</div>
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
                    <h1 className="flex items-center mt-6 font-serif text-3xl">
                      {wallet.walletData[2] ? (
                        wallet.walletData[2]
                      ) : (
                        <Truncate address={wallet.address} />
                      )}
                      <MdVerified className="ml-2 text-lg text-blue-500" />
                    </h1>
                  )}
                  {!claimed && (
                    <h1 className="flex items-center mt-6 font-serif text-3xl">
                      <Truncate address={wallet.address} />
                    </h1>
                  )}

                  {claimed && (
                    <>
                      {wallet.walletData[5] && (
                        <ul className="flex mt-4">
                          {wallet.walletData[5].map((link, key) => {
                            if (!link[0]) {
                              return
                            }
                            return (
                              <li className="mx-2" key={key}>
                                <a href={link[1]}>
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
                                </a>
                              </li>
                            )
                          })}
                        </ul>
                      )}
                      {wallet.walletData[3] && (
                        <p className="mt-12 mb-8 leading-loose">
                          {wallet.walletData[3]}
                        </p>
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
                      defaultValue={tabs.find((tab) => tab.current).name}>
                      {tabs.map((tab) => (
                        <option key={tab.name}>{tab.name}</option>
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
                            className={classNames(
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
                  <div className="grid grid-cols-2 gap-4 mt-8 md:grid-cols-3 lg:grid-cols-4">
                    {wallet?.nfts?.map((nft, index) => {
                      if (!nft || !nft.img) {
                        return false
                      }
                      return (
                        <div
                          key={index}
                          className="relative h-[276px] bg-gray-100 text-xs flex items-center justify-center text-center">
                          <p>Loading...</p>
                          <img
                            className="absolute object-cover w-full h-full"
                            src={nft.img}
                          />
                        </div>
                      )
                    })}
                  </div>
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
