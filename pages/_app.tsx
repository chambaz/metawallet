import { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import '../styles/globals.css'

declare global {
  interface Window {
    ethereum: any
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  )
}

export default MyApp
