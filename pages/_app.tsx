/* eslint-disable @next/next/inline-script-id */
import type { AppProps } from 'next/app'
import localFont from '@next/font/local'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { initAmplitude } from 'services/amplitude/'
import TagManager from 'react-gtm-module'
import { GlobalContextProvider } from 'services/context'
import Script from 'next/script'
import 'react-spring-bottom-sheet/dist/style.css'
import 'react-lazy-load-image-component/src/effects/blur.css'
import 'styles/index.css'
import 'styles/global.scss'

import { FBPixelStandardEvent, FB_PIXEL_ID } from 'helpers/facebookPixel'
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
})
const kanyonMedium = localFont({
  src: '../public/revamp/fonts/Kanyon/Kanyon-Medium.otf',
  style: 'normal',
  display: 'swap',
})
const kanyonBold = localFont({
  src: '../public/revamp/fonts/Kanyon/Kanyon-Bold.otf',
  style: 'normal',
  display: 'swap',
})
const OpenSans = localFont({
  src: '../public/revamp/fonts/OpenSans/OpenSans-Regular.woff2',
  style: 'normal',
  display: 'swap',
})
const OpenSansSemiBold = localFont({
  src: '../public/revamp/fonts/OpenSans/OpenSans-SemiBold.woff2',
  style: 'normal',
  display: 'swap',
})
const OpenSansBold = localFont({
  src: '../public/revamp/fonts/OpenSans/OpenSans-Bold.woff2',
  style: 'normal',
  display: 'swap',
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
      client && window.fbq('track', FBPixelStandardEvent.PageView)
    }
  }, [])

  useAddUtmTagsToApiCall()

  return (
    <>
      <Head>
        <script>{`/*!@shinsenter/defer.js@3.6.0*/
!(function(o,u,s){function f(t,n,e){k?S(t,n):((e=e===s?f.lazy:e)?N:C).push(t,Math.max(e?350:0,n))}function i(t){j.head.appendChild(t)}function a(t,n){t.forEach(function(t){n(t)})}function r(n,t,e,c){a(t.split(" "),function(t){(c||o)[n+"EventListener"](t,e||p)})}function l(t,n,e,c){return(c=n?j.getElementById(n):s)||(c=j.createElement(t),n&&(c.id=n)),e&&r(g,b,e,c),c}function d(t,n){a(q.call(t.attributes),function(t){n(t.name,t.value)})}function h(t,n){return q.call((n||j).querySelectorAll(t))}function m(c,t){a(h("source,img",c),m),d(c,function(t,n,e){(e=/^data-(.+)/.exec(t))&&c[x](e[1],n)}),t&&(c.className+=" "+t),c[b]&&c[b]()}function t(t,n,e){f(function(n){a(n=h(t||"script[type=deferjs]"),function(t,e){t.src&&(e=l(v),d(t,function(t,n){t!=A&&e[x]("src"==t?"href":t,n)}),e.rel="preload",e.as=y,i(e))}),(function c(t,e){(t=n[E]())&&(e=l(y),d(t,function(t,n){t!=A&&e[x](t,n)}),e.text=t.text,t.parentNode.replaceChild(e,t),e.src&&!e.getAttribute("async")?r(g,b+" error",c,e):c())})()},n,e)}function p(t,n){for(n=k?(r(e,c),N):(r(e,w),k=f,N[0]&&r(g,c),C);n[0];)S(n[E](),n[E]())}var v="link",y="script",b="load",n="pageshow",g="add",e="remove",c="touchstart mousemove mousedown keydown wheel",w="on"+n in o?n:b,x="setAttribute",E="shift",A="type",I=o.IntersectionObserver,j=o.document||o,k=/p/.test(j.readyState),C=[],N=[],S=o.setTimeout,q=C.slice;f.all=t,f.dom=function(t,n,o,i,r){f(function(e){function c(t){i&&!1===i(t)||m(t,o)}e=I?new I(function(t){a(t,function(t,n){t.isIntersecting&&(e.unobserve(n=t.target),c(n))})},r):s,a(h(t||"[data-src]"),function(t){t[u]||(t[u]=f,e?e.observe(t):c(t))})},n,!1)},f.css=function(n,e,t,c,o){f(function(t){(t=l(v,e,c)).rel="stylesheet",t.href=n,i(t)},t,o)},f.js=function(n,e,t,c,o){f(function(t){(t=l(y,e,c)).src=n,i(t)},t,o)},f.reveal=m,o[u]=f,k||r(g,w),t()})(this,"Defer");`}</script>
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
