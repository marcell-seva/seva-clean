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
import 'styles/bottomSheet.scss'
import 'styles/customAnimation.scss'
import 'react-spring-bottom-sheet/dist/style.css'
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
import 'styles/CustomAnimationStyle.css'

import { IsSsrMobileContext } from 'context/isSsrMobileContext'
import { FBPixelStandardEvent, FB_PIXEL_ID } from 'helpers/facebookPixel'
import { client } from 'utils/helpers/const'
import Head from 'next/head'

const kanyon = localFont({
  src: '../public/Kanyon-Regular.otf',
  style: 'normal',
  display: 'swap',
})
const kanyonMedium = localFont({
  src: '../public/Kanyon-Medium.otf',
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
    if (process.env.REACT_APP_ENVIRONMENT === 'production') {
      client && window.fbq('track', FBPixelStandardEvent.PageView)
    }
  }, [])
  return (
    <>
      <script
        type="text/javascript"
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
      <IsSsrMobileContext.Provider value={pageProps.isSsrMobile}>
        <GlobalContextProvider>
          <Script
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
          <style jsx global>{`
            :root {
              --kanyon: ${kanyon.style.fontFamily};
              --kanyon-medium: ${kanyonMedium.style.fontFamily};
              --kanyon-bold: ${kanyonBold.style.fontFamily};
              --open-sans: ${OpenSans.style.fontFamily};
              --open-sans-semi-bold: ${OpenSansSemiBold.style.fontFamily};
            }
          `}</style>
          <Component {...pageProps} />
        </GlobalContextProvider>
      </IsSsrMobileContext.Provider>
    </>
  )
}
