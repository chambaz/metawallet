import { NextPage } from 'next'
import Head from 'next/head'
import { Layout } from '../components/layout'
import { Heading } from '../components/heading'

const About: NextPage = () => {
  return (
    <Layout>
      <>
        <Head>
          <title>
            About MetaWallet explorer and decentralized profile system for Web3
          </title>
        </Head>
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
        </div>
        <div className="max-w-4xl px-4 mx-auto mb-40 text-lg leading-loose text-center text-white">
          <p>
            MetaWallet is a wallet explorer and decentralised profile system for
            Web3. Search for Ethereum wallet addresses, explore the tokens they
            own, and view recent transaction history. Claim your wallet, verify
            your ownership, customize your profile, and share with the world.
          </p>
          <h2 className="mt-16 mb-4 text-2xl font-bold">Roadmap</h2>
          <ul>
            <li>Add support for Polygon</li>
            <li>The Graph API</li>
            <li>"MetaWallet Pass" NFT collection</li>
            <li>Advanced wallet search</li>
            <li>Add support for Solana</li>
            <li>Merge Ethereum / Solana profiles</li>
          </ul>
        </div>
      </>
    </Layout>
  )
}

export default About
