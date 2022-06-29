import { NextPage } from 'next'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'
import { AiOutlinePlusCircle } from 'react-icons/ai'
import { useRecoilState } from 'recoil'
import { currentAccountState, notificationState } from '../recoil/atoms'
import { Layout } from '../components/layout'
import { Loader } from '../components/loader'
import { Button } from '../components/button'
import MetaWallet from '../public/artifacts/MetaWallet.json'

const Profile: NextPage = () => {
  const router = useRouter()
  const [currentAccount] = useRecoilState(currentAccountState)
  const [noteState, setNoteState] = useRecoilState(notificationState)
  const [linksNum, setLinksNum] = useState(1)
  const [submitLabel, setSubmitLabel] = useState('Save')
  const [wallet, setWallet] = useState({ walletData: [] })

  const availableLinkTypes = [
    'twitter',
    'instagram',
    'linkedin',
    'github',
    'medium',
    'tiktok',
    'shanpchat',
    'website',
  ]

  const addLinkRow = () => {
    setLinksNum(linksNum + 1)
  }

  const fetchWallet = async () => {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + `api/wallets/${currentAccount}`
    )
    const responseJson = await response.json()
    setWallet(responseJson)

    if (responseJson.walletData[5].filter((item) => item[0]).length) {
      setLinksNum(0)
    }
  }

  const updateProfile = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_META_WALLET_CONTRACT_ADDRESS,
      MetaWallet.abi,
      signer
    )

    // build links array from formData
    const links = []
    const linkkeys = formData.getAll('linkKey')
    const linkValues = formData.getAll('linkValue')
    const fileUploadData = new FormData()
    let websiteNum = 0

    linkkeys.map((item, index) => {
      if (item === 'website') {
        item = `website${++websiteNum}`
      }
      links.push({
        key: item,
        value: linkValues[index],
      })
    })

    const walletData = {
      username: formData.get('username'),
      bio: formData.get('bio'),
      avatar: '',
      links,
    }

    // add avatar to separate formData object and upload to IPFS
    if (formData.get('avatar')) {
      fileUploadData.append('avatar', formData.get('avatar'))

      const uploadAvatarReq = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/upload/${currentAccount}`,
        {
          method: 'POST',
          body: fileUploadData,
        }
      )
      const uploadAvatar = await uploadAvatarReq.json()

      walletData.avatar = uploadAvatar.url
    }

    // update wallet data
    try {
      const tx = await contract.setWallet(...Object.values(walletData))
      setNoteState({
        show: true,
        type: 'success',
        heading: `Wallet updated`,
        message: (
          <a
            className="border-b border-black hover:border-0"
            href={`https://etherscan.io/tx/${tx.hash}`}
            target="_blank"
            rel="noreferrer">
            View on Etherscan
          </a>
        ),
      })
      router.push(`/wallets/${currentAccount}`)
    } catch (err) {
      setNoteState({
        show: true,
        type: 'error',
        heading: `Error ${err.code}`,
        message: err.message,
      })
      setSubmitLabel('Save')
    }
  }

  useEffect(() => {
    if (currentAccount) {
      fetchWallet()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount])

  return (
    <Layout>
      <div
        className="min-h-full mt-40 text-center bg-slate-50"
        style={{ height: 'calc(100% - 285px)' }}>
        <form
          onSubmit={updateProfile}
          className="relative inline-block w-full px-12 pt-12 pb-12 my-8 overflow-hidden text-left text-gray-700 align-bottom transition-all transform -translate-y-40 bg-white rounded-lg shadow-xl max-w-7xl">
          {wallet.walletData.length <= 0 && (
            <Loader label="Fetching profile" className="my-24" />
          )}

          {wallet.walletData.length > 0 && (
            <>
              <div className="space-y-8 divide-y divide-gray-200">
                <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                  <div>
                    <div>
                      <h3 className="text-3xl font-bold">Profile</h3>
                      <p className="max-w-2xl mt-4">
                        This information will be displayed publicly so be
                        careful what you share.
                      </p>
                    </div>

                    <div className="mt-8 space-y-6 sm:space-y-5">
                      <div className="sm:grid sm:grid-cols-6 sm:gap-4 sm:items-start sm:pt-5">
                        <label
                          htmlFor="username"
                          className="block font-medium sm:mt-px sm:pt-2">
                          Username
                        </label>
                        <div className="mt-1 sm:mt-0 sm:col-span-5">
                          <input
                            type="text"
                            name="username"
                            id="username"
                            defaultValue={wallet.walletData[2]}
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="sm:grid sm:grid-cols-6 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                        <label
                          htmlFor="bio"
                          className="block font-medium sm:mt-px sm:pt-2">
                          Bio
                        </label>
                        <div className="mt-1 sm:mt-0 sm:col-span-5">
                          <textarea
                            id="bio"
                            name="bio"
                            rows={6}
                            className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            defaultValue={wallet.walletData[3]}
                          />
                          <p className="mt-2 text-sm">
                            Write a few sentences about yourself.
                          </p>
                        </div>
                      </div>

                      <div className="sm:grid sm:grid-cols-6 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 sm:pt-5">
                        <label
                          htmlFor="avatar"
                          className="block text-sm font-medium text-gray-700">
                          Avatar
                        </label>
                        <div className="mt-1 sm:mt-0 sm:col-span-5">
                          <div className="flex items-center">
                            <span className="w-12 h-12 overflow-hidden bg-gray-100 rounded-full">
                              <svg
                                className="w-full h-full text-gray-300"
                                fill="currentColor"
                                viewBox="0 0 24 24">
                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>
                            </span>
                            <input
                              type="file"
                              name="avatar"
                              className="px-3 py-2 ml-5 text-sm font-medium leading-4 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="sm:grid sm:grid-cols-6 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                        <label
                          htmlFor="link"
                          className="block font-medium sm:mt-px sm:pt-2">
                          Links
                        </label>
                        <div className="mt-1 sm:mt-0 sm:col-span-5">
                          {wallet.walletData[5] &&
                            wallet.walletData[5].map((item, index) => {
                              if (!item[0]) {
                                return
                              }

                              return (
                                <div key={index} className="flex w-full mb-4">
                                  <select
                                    id="link"
                                    name="linkKey"
                                    className="block py-2 pl-3 pr-12 text-base text-gray-600 border-gray-300 rounded-md rounded-r-none focus:ring-0 focus:border-gray-300 focus:outline-none bg-gray-50 sm:text-sm">
                                    {availableLinkTypes.map(
                                      (availableLink, index) => {
                                        return (
                                          <option
                                            key={index}
                                            value={availableLink}
                                            selected={
                                              availableLink === item[0]
                                            }>
                                            {availableLink
                                              .charAt(0)
                                              .toUpperCase() +
                                              availableLink.slice(1)}
                                          </option>
                                        )
                                      }
                                    )}
                                  </select>
                                  <input
                                    type="text"
                                    name="linkValue"
                                    className="flex-1 block w-full min-w-0 border-l-0 border-gray-300 rounded-none rounded-r-md sm:text-sm focus:ring-0 focus:border-gray-300 focus:outline-none"
                                    defaultValue={item[1]}
                                  />
                                  {index ===
                                    wallet.walletData[5].filter(
                                      (item) => item[0].length
                                    ).length -
                                      1 &&
                                    !linksNum && (
                                      <button
                                        onClick={() => addLinkRow()}
                                        className="flex items-center py-2 pl-4 pr-3 ml-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        Add{' '}
                                        <AiOutlinePlusCircle className="ml-2" />
                                      </button>
                                    )}
                                </div>
                              )
                            })}

                          {[...new Array(linksNum).keys()].map((item) => {
                            return (
                              <div key={item} className="flex w-full mb-4">
                                <select
                                  id="link"
                                  name="linkKey"
                                  className="block py-2 pl-3 pr-12 text-base text-gray-600 border-gray-300 rounded-md rounded-r-none focus:ring-0 focus:border-gray-300 focus:outline-none bg-gray-50 sm:text-sm">
                                  {availableLinkTypes.map((item, index) => {
                                    return (
                                      <option key={index} value={item}>
                                        {item.charAt(0).toUpperCase() +
                                          item.slice(1)}
                                      </option>
                                    )
                                  })}
                                </select>
                                <input
                                  type="text"
                                  name="linkValue"
                                  className="flex-1 block w-full min-w-0 border-l-0 border-gray-300 rounded-none rounded-r-md sm:text-sm focus:ring-0 focus:border-gray-300 focus:outline-none"
                                />

                                {item === linksNum - 1 && (
                                  <button
                                    onClick={() => addLinkRow()}
                                    className="flex items-center py-2 pl-4 pr-3 ml-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Add <AiOutlinePlusCircle className="ml-2" />
                                  </button>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-5">
                <div className="flex justify-end gap-2">
                  <Button
                    theme="secondary"
                    onClick={() => router.push(`/wallets/${currentAccount}`)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    onClick={(e) => {
                      console.log(e)
                      setSubmitLabel('Saving...')
                    }}>
                    {submitLabel}
                  </Button>
                </div>
              </div>
            </>
          )}
        </form>
      </div>
    </Layout>
  )
}

export default Profile
