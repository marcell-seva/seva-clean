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
import { GlobalContextProvider } from 'context/GlobalContextProvider'
import { ConfigProvider } from 'services/context/configContext'
import { applyPolyfills, defineCustomElements } from 'seva-ui-kit/loader'
import Script from 'next/script'
import 'styles/saas/global.scss'
import 'styles/saas/bottomSheet.scss'
import 'styles/saas/customAnimation.scss'
import 'react-spring-bottom-sheet/dist/style.css'
import 'styles/index.css'
import 'styles/saas/modal-gallery.scss'
import { IsSsrMobileContext } from 'context/isSsrMobileContext'

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
    <IsSsrMobileContext.Provider value={pageProps.isSsrMobile}>
      <GlobalContextProvider>
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
                <Script
                  type="text/javascript"
                  strategy="afterInteractive"
                  dangerouslySetInnerHTML={{
                    __html: `(function(i, s, o, g, r, a, m, n) {
        i.moengage_object = r
        t = {}
        q = function (f) {
          return function () {
            (i.moengage_q = i.moengage_q || []).push({ f: f, a: arguments })
          }
        }
        (f = [
          'track_event',
          'add_user_attribute',
          'add_first_name',
          'add_last_name',
          'add_email',
          'add_mobile',
          'add_user_name',
          'add_gender',
          'add_birthday',
          'destroy_session',
          'add_unique_user_id',
          'moe_events',
          'call_web_push',
          'track',
          'location_type_attribute',
        ]),
          (h = { onsite: ['getData', 'registerCallback'] })
        for (k in f) {
          t[f[k]] = q(f[k])
        }
        for (k in h)
          for (l in h[k]) {
            null == t[k] && (t[k] = {}), (t[k][h[k][l]] = q(k + '.' + h[k][l]))
          }
        a = s.createElement(o)
        m = s.getElementsByTagName(o)[0]
        a.async = 1
        a.src = g
        m.parentNode.insertBefore(a, m)
        i.moe =
          i.moe ||
          function () {
            n = arguments[0]
            return t
          }
        a.onload = function () {
          if (n) {
            i[r] = moe(n)
          }
        }
      })(
        window,
        document,
        'script',
        'https://cdn.moengage.com/webpush/moe_webSdk.min.latest.js',
        'Moengage',
      )
      if (
        window.location.href.includes('staging') ||
        window.location.href.includes('dev') ||
        window.location.href.includes('localhost')
      ) {
        Moengage = moe({
          app_id: 'KW8JVVD7VJKF2EQHOHX2YYOA',
          debug_logs: 1,
        })
      } else {
        Moengage = moe({
          app_id: 'KW8JVVD7VJKF2EQHOHX2YYOA',
          debug_logs: 0,
        })
        }`,
                  }}
                ></Script>
              </CarProvider>
            </LocationProvider>
          </AuthProvider>
        </ConfigProvider>
      </GlobalContextProvider>
    </IsSsrMobileContext.Provider>
  )
}
