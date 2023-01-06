import { ReactElement } from 'react'
import type { AppProps } from 'next/app'
import '../styles/globals.scss'
type AppLayoutProps = AppProps & {
  Component: any
  pageProps: any
}
function MyApp({ Component, pageProps }: AppLayoutProps) {
  const Layout =
    Component.layout || ((children: ReactElement) => <>{children}</>)
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
export default MyApp
