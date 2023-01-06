import '../styles/globals.scss'

import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import MainLayout from '../components/layouts/main'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  // set default layout
  const getLayout = Component.getLayout
  if (getLayout === undefined) {
    return (
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    )
  } else {
    return getLayout(<Component {...pageProps} />)
  }
}
