import '../styles/globals.css'
import type { AppProps } from 'next/app'
import localFont from '@next/font/local'

const kanyon = localFont({
  src: '../public/Kanyon-Regular.otf',
  style: 'normal',
})
const kanyonBold = localFont({
  src: '../public/Kanyon-Bold.otf',
  style: 'normal',
})
const OpenSans = localFont({
  src: '../public/OpenSans-Regular.woff2',
  style: 'normal',
})
const OpenSansSemiBold = localFont({
  src: '../public/OpenSans-SemiBold.woff2',
  style: 'normal',
})
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        :root {
          --kanyon: ${kanyon.style.fontFamily};
          --kanyon-bold: ${kanyonBold.style.fontFamily};
          --open-sans: ${OpenSans.style.fontFamily};
          --open-sans-semi-bold: ${OpenSansSemiBold.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </>
  )
}
