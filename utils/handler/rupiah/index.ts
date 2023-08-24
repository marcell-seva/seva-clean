import { LanguageCode } from 'utils/enum'
import { hundred, thousand } from 'utils/helpers/const'
import { COMMA, DOT } from 'utils/stringUtils'
import { RoundingStrategy } from 'utils/types/models'
import { addSeparator } from '../stringManipulation'

export const rupiah = (num: number, isLargerThan?: boolean): string => {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e6, symbol: ' Jt' },
  ]
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value
    })

  const parsed = item
    ? (num / item.value).toFixed(2).replace(rx, '$1') + item.symbol
    : '0'

  if (isLargerThan) return `Rp > ${parsed.replace('.', ',')}`
  else return `Rp ${parsed.replace('.', ',')}`
}

export const formatBillionPoint = (num: number | string) => {
  const strNum = String(num).split(',')
  if (strNum[0].length > 3)
    return String(num).slice(0, 1) + '.' + String(num).slice(1, 7)
  return num
}

export const formatNumberByDivisor = (
  length: number,
  divisor = thousand,
  digits = hundred,
  roundStrategy = RoundingStrategy.Round,
) => {
  if (roundStrategy === RoundingStrategy.Round) {
    return Math.round((length / divisor) * digits) / digits
  }
  if (roundStrategy === RoundingStrategy.Ceil) {
    return Math.ceil((length / divisor) * digits) / digits
  }
  return Math.floor((length / divisor) * digits) / digits
}

const replaceDecimalPointByLocalization = (
  num: number,
  languageId: LanguageCode,
) => (languageId === LanguageCode.id ? num.toString().replace(DOT, COMMA) : num)

export const formatNumberByLocalization = (
  value: number,
  languageId: LanguageCode,
  divisor = thousand,
  digits = hundred,
  roundStrategy = RoundingStrategy.Round,
) => {
  const num = formatNumberByDivisor(value, divisor, digits, roundStrategy)
  return replaceDecimalPointByLocalization(num, languageId)
}

export const replacePriceSeparatorByLocalization = (
  num: number | string,
  languageId: LanguageCode,
) => {
  const separator = languageId === LanguageCode.en ? COMMA : DOT
  return addSeparator(num?.toString(), separator)
}
