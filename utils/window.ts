import { client } from 'utils/helpers/const'

const userAgent = client ? window.navigator.userAgent : undefined
export const isMobileDevice = !!userAgent ? /Mobi/i.test(userAgent) : false

const browser = userAgent && {
  ios: !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
  iPhone: userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('Mac') > -1,
  iPad: userAgent.indexOf('iPad') > -1,
  firefox: navigator.userAgent.indexOf('Firefox') != -1,
}

export const isIphone = browser
  ? browser.iPhone || browser.iPad || browser.ios
  : false

export const isFirefox = browser && browser.firefox

export const screenSize = {
  mobileS: '320px',
}
