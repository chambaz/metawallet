import { Nav } from './nav'
import { Footer } from './footer'

type Props = {
  children: JSX.Element
}

export const Layout = ({ children }: Props) => {
  return (
    <div className="h-full min-h-screen text-gray-800 bg-slate-100 dark:bg-gray-800">
      <Nav />
      {children}
      <Footer />
    </div>
  )
}
