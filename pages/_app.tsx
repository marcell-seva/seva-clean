/* eslint-disable @next/next/inline-script-id */
import type { AppProps } from 'next/app'
import localFont from '@next/font/local'
import { useEffect } from 'react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { initAmplitude } from 'services/amplitude/'
import TagManager from 'react-gtm-module'
import { GlobalContextProvider } from 'services/context'
import { applyPolyfills, defineCustomElements } from 'seva-ui-kit/loader'
import Script from 'next/script'
import 'styles/global.scss'
import 'react-spring-bottom-sheet/dist/style.css'
import 'react-lazy-load-image-component/src/effects/blur.css'
import 'styles/bottomSheet.scss'
import 'styles/customAnimation.scss'
import 'styles/index.css'
import 'styles/modal-gallery.scss'
import 'styles/components/molecules/car-body-types-desktop.scss'
import 'styles/components/molecules/car-brand-recommendation.scss'
import 'styles/components/molecules/car-of-month.scss'
import 'styles/components/molecules/how-to-use.scss'
import 'styles/components/molecules/image-carousel.scss'
import 'styles/components/molecules/loan-calculator-widget.scss'
import 'styles/components/molecules/testimoni-tile.scss'
import 'styles/components/molecules/advisor-section.scss'
import 'styles/components/molecules/car-brand-item.scss'
import 'styles/components/molecules/testimonial.scss'
import 'styles/components/organisms/funnel-background.scss'
import 'styles/components/organisms/landingIA.scss'
import 'styles/CustomAnimationStyle.css'
import 'styles/pages/multi-kk.scss'
import 'styles/insuranceTooltip.scss'

import { FBPixelStandardEvent, FB_PIXEL_ID } from 'helpers/facebookPixel'
import { client } from 'utils/helpers/const'
import { IsSsrMobileContext } from 'services/context/isSsrMobileContext'
import { useAddUtmTagsToApiCall } from 'utils/hooks/useAddUtmTagsToApiCall/useAddUtmTagsToApiCall'
import Head from 'next/head'
import { CityFirst } from 'components/molecules/cityFirst'

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

initAmplitude()
applyPolyfills().then(() => {
  defineCustomElements()
})

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
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
          <CityFirst />
          <Component {...pageProps} />
        </GlobalContextProvider>
        <Script>{`/*!@shinsenter/defer.js@3.6.0*/
!(function(o,u,s){function f(t,n,e){k?S(t,n):((e=e===s?f.lazy:e)?N:C).push(t,Math.max(e?350:0,n))}function i(t){j.head.appendChild(t)}function a(t,n){t.forEach(function(t){n(t)})}function r(n,t,e,c){a(t.split(" "),function(t){(c||o)[n+"EventListener"](t,e||p)})}function l(t,n,e,c){return(c=n?j.getElementById(n):s)||(c=j.createElement(t),n&&(c.id=n)),e&&r(g,b,e,c),c}function d(t,n){a(q.call(t.attributes),function(t){n(t.name,t.value)})}function h(t,n){return q.call((n||j).querySelectorAll(t))}function m(c,t){a(h("source,img",c),m),d(c,function(t,n,e){(e=/^data-(.+)/.exec(t))&&c[x](e[1],n)}),t&&(c.className+=" "+t),c[b]&&c[b]()}function t(t,n,e){f(function(n){a(n=h(t||"script[type=deferjs]"),function(t,e){t.src&&(e=l(v),d(t,function(t,n){t!=A&&e[x]("src"==t?"href":t,n)}),e.rel="preload",e.as=y,i(e))}),(function c(t,e){(t=n[E]())&&(e=l(y),d(t,function(t,n){t!=A&&e[x](t,n)}),e.text=t.text,t.parentNode.replaceChild(e,t),e.src&&!e.getAttribute("async")?r(g,b+" error",c,e):c())})()},n,e)}function p(t,n){for(n=k?(r(e,c),N):(r(e,w),k=f,N[0]&&r(g,c),C);n[0];)S(n[E](),n[E]())}var v="link",y="script",b="load",n="pageshow",g="add",e="remove",c="touchstart mousemove mousedown keydown wheel",w="on"+n in o?n:b,x="setAttribute",E="shift",A="type",I=o.IntersectionObserver,j=o.document||o,k=/p/.test(j.readyState),C=[],N=[],S=o.setTimeout,q=C.slice;f.all=t,f.dom=function(t,n,o,i,r){f(function(e){function c(t){i&&!1===i(t)||m(t,o)}e=I?new I(function(t){a(t,function(t,n){t.isIntersecting&&(e.unobserve(n=t.target),c(n))})},r):s,a(h(t||"[data-src]"),function(t){t[u]||(t[u]=f,e?e.observe(t):c(t))})},n,!1)},f.css=function(n,e,t,c,o){f(function(t){(t=l(v,e,c)).rel="stylesheet",t.href=n,i(t)},t,o)},f.js=function(n,e,t,c,o){f(function(t){(t=l(y,e,c)).src=n,i(t)},t,o)},f.reveal=m,o[u]=f,k||r(g,w),t()})(this,"Defer");`}</Script>
        <Script
          async
          type="text/javascript"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
                            !function(e,n,i,t,a,r,o,d){var s=e[a]=e[a]||[];if(s.invoked=0,s.initialised>0||s.invoked>0)return console.error("MoEngage Web SDK initialised multiple times. Please integrate the Web SDK only once!"),!1;e.moengage_object=a;var l={},g=function n(i){return function(){for(var n=arguments.length,t=Array(n),a=0;a<n;a++)t[a]=arguments[a];(e.moengage_q=e.moengage_q||[]).push({f:i,a:t})}},u=["track_event","add_user_attribute","add_first_name","add_last_name","add_email","add_mobile","add_user_name","add_gender","add_birthday","destroy_session","add_unique_user_id","moe_events","call_web_push","track","location_type_attribute"],m={onsite:["getData","registerCallback"]};for(var c in u)l[u[c]]=g(u[c]);for(var v in m)for(var f in m[v])null==l[v]&&(l[v]={}),l[v][m[v][f]]=g(v+"."+m[v][f]);r=n.createElement(i),o=n.getElementsByTagName("head")[0],r.async=1,r.src=t,o.appendChild(r),e.moe=e.moe||function(){return(s.invoked=s.invoked+1,s.invoked>1)?(console.error("MoEngage Web SDK initialised multiple times. Please integrate the Web SDK only once!"),!1):(d=arguments.length<=0?void 0:arguments[0],l)},r.addEventListener("load",function(){if(d)return e[a]=e.moe(d),e[a].initialised=e[a].initialised+1||1,!0}),r.addEventListener("error",function(){return console.error("Moengage Web SDK loading failed."),!1})}(window,document,"script","https://cdn.moengage.com/webpush/moe_webSdk.min.latest.js","Moengage");
                            Moengage = moe({
                            app_id:"KW8JVVD7VJKF2EQHOHX2YYOA",
                            debug_logs: 0
                            });`,
          }}
        ></Script>
        <Script
          type="text/javascript"
          strategy="afterInteractive"
          async
          dangerouslySetInnerHTML={{
            __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('set', 'debug', false, ${FB_PIXEL_ID});
            fbq('set', 'autoConfig', true, ${FB_PIXEL_ID});
            fbq('init', ${FB_PIXEL_ID});
            
          `,
          }}
        />
        <Script
          type="text/javascript"
          strategy="afterInteractive"
          async
          dangerouslySetInnerHTML={{
            __html: `
            //some default pre init
            var Countly = Countly || {};
            Countly.q = Countly.q || [];

            //provide countly initialization parameters
            Countly.app_key = 'b3339752ab6da081b5fabf5e46be80ef26b666ca';
            Countly.url = 'https://push.meshtics.com';

            Countly.q.push(['track_sessions']);
            Countly.q.push(['track_pageview']);
            Countly.q.push(['track_clicks']);
            Countly.q.push(['track_links']);

            //load countly script asynchronously
            (function() {
              var cly = document.createElement('script'); cly.type = 'text/javascript';
              cly.async = true;
              //enter url of script here
              cly.src = 'https://cdnjs.cloudflare.com/ajax/libs/countly-sdk-web/20.4.0/countly.min.js';
              cly.onload = function(){Countly.init()};
              var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(cly, s);
            })();
            `,
          }}
        />
        <Script>
          {`Defer.all('script[type="text/javascript"]', 5000); Defer.lazy = true`}
        </Script>
      </IsSsrMobileContext.Provider>
    </>
  )
}
