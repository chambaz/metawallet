import { useRouter } from 'next/router'
import { ethers } from 'ethers'

// resolves query or returns null
export const useQuery = () => {
  const router = useRouter()
  const hasQueryParams =
    /\[.+\]/.test(router.route) || /\?./.test(router.asPath)
  const ready = !hasQueryParams || Object.keys(router.query).length > 0
  if (!ready) return null
  return router.query
}

export const checkNetwork = async () => {
  const { ethereum } = window

  if (!ethereum) {
    return false
  }

  const accounts = await ethereum.request({ method: 'eth_accounts' })
  const provider = new ethers.providers.Web3Provider(ethereum)
  const { chainId } = await provider.getNetwork()

  // return chainId === 69
  return chainId === 31337
}
