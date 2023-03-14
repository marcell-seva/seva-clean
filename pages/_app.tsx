/* eslint-disable @next/next/inline-script-id */
import '/styles/saas/main.scss'

import type { AppProps } from 'next/app'
import localFont from '@next/font/local'
import { useContext, useEffect } from 'react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { initAmplitude } from 'services/amplitude/'
import TagManager from 'react-gtm-module'
import { AuthProvider, LocationProvider, CarProvider } from 'services/context'
import { ConfigProvider } from 'services/context/configContext'
import { applyPolyfills, defineCustomElements } from 'seva-ui-kit/loader'

const kanyon = localFont({
  src: '../public/Kanyon-Regular.otf',
  style: 'normal',
  display: 'swap',
})
const kanyonBold = localFont({
  src: '../public/Kanyon-Bold.otf',
  style: 'normal',
  display: 'swap',
})
const OpenSans = localFont({
  src: '../public/OpenSans-Regular.woff2',
  style: 'normal',
  display: 'swap',
})
const OpenSansSemiBold = localFont({
  src: '../public/OpenSans-SemiBold.woff2',
  style: 'normal',
  display: 'swap',
})

initAmplitude()
applyPolyfills().then(() => {
  defineCustomElements()
})

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    TagManager.initialize({ gtmId: 'GTM-TV9J5JM' })
  }, [])
  return (
    <ConfigProvider>
      <AuthProvider>
        <LocationProvider>
          <CarProvider>
            <style jsx global>{`
              :root {
                --kanyon: ${kanyon.style.fontFamily};
                --kanyon-bold: ${kanyonBold.style.fontFamily};
                --open-sans: ${OpenSans.style.fontFamily};
                --open-sans-semi-bold: ${OpenSansSemiBold.style.fontFamily};
              }
            `}</style>
            <Component {...pageProps} />
          </CarProvider>
        </LocationProvider>
      </AuthProvider>
    </ConfigProvider>
  )
}
