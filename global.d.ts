declare module '@georgedrpg/pannellum-react-next'

declare module 'dompurify'

declare module 'lodash.debounce'

interface Window {
  gtag: (type: string, tagType: string, options?: Options) => void
  dataLayer: Array
  checkForDrag: any
}
