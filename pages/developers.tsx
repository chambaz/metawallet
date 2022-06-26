import { NextPage } from 'next'
import { Layout } from '../components/layout'
import { Heading } from '../components/heading'

const Api: NextPage = () => {
  return (
    <Layout>
      <>
        <div className="max-w-5xl px-4 py-16 mx-auto text-center">
          <Heading>Developers</Heading>
        </div>
        <div className="px-4 mx-auto mb-40 space-y-8 max-w-7xl md:space-y-16">
          <h2>Hello world</h2>
        </div>
      </>
    </Layout>
  )
}

export default Api
