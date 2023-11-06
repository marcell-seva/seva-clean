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
  client && isPreApprovalFlowPage(window.location.pathname) ? '570px' : '100%'
export const maxPageWidthNumber = 570
export const screenHeight = client ? document.documentElement.clientHeight : 570
export const screenWidth = client ? document.documentElement.clientWidth : '570'
