import { client } from 'const/const'

const userAgent = client ? window.navigator.userAgent : undefined

const browser = userAgent && {
  ios: !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
  iPhone: userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('Mac') > -1,
  iPad: userAgent.indexOf('iPad') > -1,
}

export const isIphone = browser
  ? browser.iPhone || browser.iPad || browser.ios
  : false
