/* eslint-disable @next/next/no-sync-scripts */
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <script
          src="https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.js"
          defer
        ></script>
        <script
          src="https://cdn.jsdelivr.net/npm/vanilla-lazyload@17.8.3/dist/lazyload.min.js"
          defer
        ></script>
        <NextScript />
      </body>
    </Html>
  )
}
