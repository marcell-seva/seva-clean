/* eslint-disable @next/next/inline-script-id */
import type { AppProps } from 'next/app'
import localFont from '@next/font/local'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { initAmplitude } from 'services/amplitude/'
import TagManager from 'react-gtm-module'
import { GlobalContextProvider } from 'services/context'
import 'react-spring-bottom-sheet/dist/style.css'
import 'react-lazy-load-image-component/src/effects/blur.css'
import 'styles/index.css'
import 'styles/global.scss'

import { FBPixelStandardEvent } from 'helpers/facebookPixel'
import { client } from 'utils/helpers/const'
import { IsSsrMobileContext } from 'services/context/isSsrMobileContext'
import { useAddUtmTagsToApiCall } from 'utils/hooks/useAddUtmTagsToApiCall/useAddUtmTagsToApiCall'
import Head from 'next/head'
import { useAfterInteractive } from 'utils/hooks/useAfterInteractive'
import { ThirdScript } from 'components/atoms/thirdScript'

const kanyonLight = localFont({
  src: '../public/revamp/fonts/Kanyon/Kanyon-Light.otf',
  style: 'normal',
  display: 'swap',
})
const kanyon = localFont({
  src: '../public/revamp/fonts/Kanyon/Kanyon-Regular.otf',
  style: 'normal',
  display: 'swap',
  weight: '400',
})
const kanyonMedium = localFont({
  src: '../public/revamp/fonts/Kanyon/Kanyon-Medium.otf',
  style: 'normal',
  display: 'swap',
  weight: '600',
})
const kanyonBold = localFont({
  src: '../public/revamp/fonts/Kanyon/Kanyon-Bold.otf',
  style: 'normal',
  display: 'swap',
  weight: '700',
})
const OpenSans = localFont({
  src: '../public/revamp/fonts/OpenSans/OpenSans-Regular.woff2',
  style: 'normal',
  display: 'swap',
  weight: '400',
})
const OpenSansSemiBold = localFont({
  src: '../public/revamp/fonts/OpenSans/OpenSans-SemiBold.woff2',
  style: 'normal',
  display: 'swap',
  weight: '600',
})
const OpenSansBold = localFont({
  src: '../public/revamp/fonts/OpenSans/OpenSans-Bold.woff2',
  style: 'normal',
  display: 'swap',
  weight: '700',
})
const OpenSansExtraBold = localFont({
  src: '../public/revamp/fonts/OpenSans/OpenSans-ExtraBold.woff2',
  style: 'normal',
  display: 'swap',
})

export default function App({ Component, pageProps }: AppProps) {
  useAfterInteractive(() => {
    initAmplitude()
    if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'staging') {
      TagManager.initialize({ gtmId: 'GTM-K2P73CT' })
    } else {
      TagManager.initialize({ gtmId: 'GTM-TV9J5JM' })
    }
    if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'production') {
      if (client) {
        setTimeout(() => {
          window?.fbq('track', FBPixelStandardEvent.PageView)
        }, 1000)
      }
    }
  }, [])

  useAddUtmTagsToApiCall()

  return (
    <>
      <Head>
        <meta name="theme-color" content="#fff" />
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no"
        />
      </Head>
      <IsSsrMobileContext.Provider value={pageProps.isSsrMobile}>
        <GlobalContextProvider>
          <style jsx global>{`
            :root {
              --kanyon-light: ${kanyonLight.style.fontFamily};
              --kanyon: ${kanyon.style.fontFamily};
              --kanyon-medium: ${kanyonMedium.style.fontFamily};
              --kanyon-bold: ${kanyonBold.style.fontFamily};
              --open-sans: ${OpenSans.style.fontFamily};
              --open-sans-semi-bold: ${OpenSansSemiBold.style.fontFamily};
              --open-sans-bold: ${OpenSansBold.style.fontFamily};
              --open-sans-extra-bold: ${OpenSansExtraBold.style.fontFamily};
            }
          `}</style>
          <Component {...pageProps} />
        </GlobalContextProvider>
      </IsSsrMobileContext.Provider>
      <ThirdScript />
    </>
  )
}
