import { useRecoilState } from 'recoil'
import { networkErrorState } from '../recoil/atoms'
import { Nav } from './nav'
import { NetworkModal } from './networkModal'
import { Footer } from './footer'

type Props = {
  children: JSX.Element
}

export const Layout = ({ children }: Props) => {
  const [isNetworkError, setIsNetworkError] = useRecoilState(networkErrorState)

  return (
    <div className="h-full min-h-screen text-gray-800 bg-slate-100 dark:bg-gray-800">
      <NetworkModal show={isNetworkError} onClose={setIsNetworkError} />
      <Nav />
      {children}
      <Footer />
    </div>
  )
}
