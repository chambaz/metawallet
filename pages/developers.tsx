import { NextPage } from 'next'
import Head from 'next/head'
import { Layout } from '../components/layout'
import { Heading } from '../components/heading'

const Api: NextPage = () => {
  return (
    <Layout>
      <>
        <Head>
          <title>Decentralized Profile System &amp; Graph API</title>
        </Head>
        <div className="max-w-5xl px-4 py-16 mx-auto text-center">
          <Heading>Decentralized Profile System &amp; Graph API</Heading>
        </div>
        <div className="max-w-3xl px-4 mx-auto text-lg leading-loose text-center text-white mb-44">
          <h2 className="mt-4 mb-12 text-2xl italic">Coming soon...</h2>
          <p>
            Usig our subgraph, deveopers can pull profile information for a
            wallet address including username, bio, avatar, and social links.
            Gravatar for Web3.
          </p>
        </div>
      </>
    </Layout>
  )
}

export default Api
