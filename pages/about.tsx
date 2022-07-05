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
        <div className="max-w-5xl px-4 mx-auto mb-40 space-y-8 text-lg leading-loose text-white">
          <p>
            Irure quis eu voluptate sit eu quis nisi. Et duis minim laborum ea.
            Nulla consequat ea voluptate laborum eiusmod. Est duis eu tempor et
            ex cillum quis. Fugiat do dolore ipsum et. Qui ex sint amet esse
            commodo dolor labore enim eiusmod. Veniam esse proident voluptate ex
            consequat sint reprehenderit mollit tempor reprehenderit. Aliquip
            aliqua ut dolor duis proident. Aliqua dolore ut aute consequat id.
            Consequat nisi enim voluptate non quis proident culpa eiusmod veniam
            nostrud est veniam esse ut. Aute eu cillum ea veniam sunt duis enim.
          </p>
          <p>
            Incididunt dolor ex ex nulla laboris nisi. Deserunt esse sint aute
            Lorem consectetur incididunt. Ea officia dolor eiusmod proident ut
            dolore. Sint dolore occaecat nisi est fugiat in id laborum tempor
            irure id adipisicing Lorem. In incididunt ipsum cillum consectetur
            ullamco deserunt.
          </p>
        </div>
      </>
    </Layout>
  )
}

export default About
