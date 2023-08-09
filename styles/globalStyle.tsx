import { client } from 'utils/helpers/const'

const paFlowUrlPrefixList = [
  '/pre-approval',
  '/ekyc',
  '/camera',
  '/image-preview',
  '/image-quality-check',
  '/ocr-success',
  '/ocr-fail',
  '/bank-selection',
  '/link-brick-success',
  '/link-brick-fail',
  '/pre-approval-sms-sending',
  '/image-crop',
  '/pac',
]

const isPreApprovalFlowPage = (url: string): boolean =>
  paFlowUrlPrefixList.some((prefix) => url.startsWith(prefix))

export const maxPageWidth =
  client && isPreApprovalFlowPage(window.location.pathname) ? '700px' : '100%'
export const maxPageWidthNumber = 700
// export const screenHeight = document.documentElement.clientHeight
export const screenWidth = client
  ? document.documentElement.clientWidth
  : '700px'

// export const GlobalStyle = createGlobalStyle`
//   * {
//     box-sizing: border-box;
//     margin: 0;
//     padding: 0;
//     font-family: 'OpenSans';
//     -webkit-font-smoothing: antialiased;
//     -moz-osx-font-smoothing: grayscale;
//   }

//   html body {
//     background: ${colors.offWhite};
//     margin: 0 auto;
//     max-width: ${maxPageWidth};
//     overflow-x: hidden;
//   }
// `
