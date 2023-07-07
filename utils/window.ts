import { client } from 'const/const'
import { UAParser } from 'ua-parser-js'

const parser = new UAParser()

const userAgent = client ? window.navigator.userAgent : undefined
export const isMobileDevice = !!userAgent ? /Mobi/i.test(userAgent) : false

const browser = userAgent && {
  ios: !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
  iPhone: userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('Mac') > -1,
  iPad: userAgent.indexOf('iPad') > -1,
}

export const isIphone = browser
  ? browser.iPhone || browser.iPad || browser.ios
  : false

export const usedBrowser = parser.getBrowser()
