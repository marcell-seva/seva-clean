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
export const screenHeight = client ? document.documentElement.clientHeight : 700
export const screenWidth = client
  ? document.documentElement.clientWidth
  : '700px'
