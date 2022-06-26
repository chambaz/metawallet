import { NextPage } from 'next'
import { Layout } from '../components/layout'
import { Heading } from '../components/heading'
import { Search } from '../components/search'
import { Featured } from '../components/featured'

const Home: NextPage = () => {
  return (
    <Layout>
      <>
        <div className="max-w-5xl px-4 py-16 mx-auto text-center">
          <Heading>
            <>
              Wallet explorer and{' '}
              <span className="hidden md:inline">
                decentralized profile system{' '}
              </span>
              <span className="md:hidden">profiles </span>
              for Web3
            </>
          </Heading>
          <Search className="mt-16" />
        </div>
        <div className="px-4 mx-auto mb-20 space-y-8 max-w-7xl md:space-y-16">
          <Featured />
        </div>
      </>
    </Layout>
  )
}

export default Home
