import {
  comma,
  hundred,
  jt,
  million,
  point,
  Rp,
  ten,
  thousand,
} from 'utils/helpers/const'
import { LanguageCode } from 'utils/enum'
import {
  addSeparator,
  COMMA,
  DOT,
  filterNonDigitCharacters,
} from '../stringUtils'

export enum RoundingStrategy {
  Round,
  Ceil,
  Floor,
}

export const formatPriceNumber = (price: number) => {
  return Math.round(price / million)
}

export const formatPriceNumberThousand = (price: number) => {
  return Math.round(price / thousand)
}

export const formatPriceNumberThousandDivisor = (
  price: number,
  languageId: LanguageCode,
) => {
  if (languageId === LanguageCode.id) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  } else {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
}

export const formatPriceConcise = (price: number) => {
  const concise = Math.abs(Number(price))
  return concise >= 1.0e9
    ? concise / 1.0e9 + ' M'
    : concise >= 1.0e6
    ? concise / 1.0e6 + ' jt'
    : price
}

export const formatPriceConciseFixed = (price: number) => {
  const concise = Math.abs(Number(price))
  return concise >= 1.0e9
    ? (concise / 1.0e9).toFixed(1) + ' M'
    : concise >= 1.0e6
    ? (concise / 1.0e6).toFixed(1) + ' jt'
    : price
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

//  DecimalPoint: if LanguageCode is "id" use COMMA, if LanguageCode is "en"
//  use  DOT
const replaceDecimalPointByLocalization = (
  num: number,
  languageId: LanguageCode,
) => (languageId === LanguageCode.id ? num.toString().replace(DOT, COMMA) : num)

export const formatBillionPoint = (num: number | string) => {
  const strNum = String(num).split(',')
  if (strNum[0].length > 3)
    return String(num).slice(0, 1) + '.' + String(num).slice(1, 7)
  return num
}

//  PriceSeparator: if LanguageCode is "id" use DOT, if LanguageCode is "en"
//  use  COMMA
export const replacePriceSeparatorByLocalization = (
  num: number | string,
  languageId: LanguageCode,
) => {
  const separator = languageId === LanguageCode.en ? COMMA : DOT
  return addSeparator(num?.toString(), separator)
}

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
// PriceSeparator from link header variant list
const replaceDecimalPointByLocalizationHeaderVariantList = (
  num: number,
  languageId: LanguageCode,
) =>
  languageId === LanguageCode.id
    ? num.toString().replace(COMMA, DOT)
    : num.toString().replace(DOT, COMMA)

export const formatNumberByLocalizationHeaderVariantList = (
  value: number,
  languageId: LanguageCode,
  divisor = thousand,
  digits = hundred,
  roundStrategy = RoundingStrategy.Round,
) => {
  const num = formatNumberByDivisor(value, divisor, digits, roundStrategy)
  return replaceDecimalPointByLocalizationHeaderVariantList(num, languageId)
}

export const transformToJtWithTwoDecimal = (
  value: number,
  languageId: LanguageCode,
) => {
  const num = formatNumberByDivisor(
    value,
    million,
    hundred,
    RoundingStrategy.Round,
  )
  const valueInJt = replaceDecimalPointByLocalization(num, languageId)
  return `${Rp} ${valueInJt} ${jt}`
}

export const transformToJtWithTargetDecimal = (
  value: number,
  languageId: LanguageCode,
  digits = ten,
  showRP = true,
) => {
  const num = formatNumberByDivisor(
    value,
    million,
    digits,
    RoundingStrategy.Round,
  )
  const valueInJt = replaceDecimalPointByLocalization(num, languageId)
  return showRP ? `${Rp} ${valueInJt} ${jt}` : `${valueInJt} ${jt}`
}

export const transformToJtWithTargetTwoDecimal = (
  value: number,
  languageId: LanguageCode,
  digits = thousand,
  showRP = true,
) => {
  const num = formatNumberByDivisor(
    value,
    million,
    digits,
    RoundingStrategy.Round,
  )
  const valueInJt = replaceDecimalPointByLocalization(num, languageId)
  return showRP ? `${Rp} ${valueInJt}${jt}` : `${valueInJt}${jt}`
}

export const generateNumberRange = (
  start: number,
  stop: number,
  step: number,
) =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (_, i) => Math.round((start + i * step) * 100) / 100,
  )

export const transformToJtByTargetDigits = (
  value: number,
  languageId: LanguageCode,
  digits: number,
) => {
  const num = formatNumberByDivisor(
    value,
    million,
    Math.pow(ten, digits),
    RoundingStrategy.Round,
  )
  const format = num.toString()
  const pointIndex = format.indexOf(point)
  const digitsWidthDecimalPoint = Math.max(pointIndex, digits + 1)
  const result =
    format.length - 1 >= digitsWidthDecimalPoint
      ? format.substr(0, digitsWidthDecimalPoint)
      : format
  const handlePoint = result.endsWith(point)
    ? result.substr(0, result.length - 1)
    : result
  const valueInJt =
    languageId === LanguageCode.id
      ? handlePoint.replace(point, comma)
      : handlePoint
  return `${Rp} ${valueInJt} ${jt}`
}

export const formatSortPrice = (price: number, languageId = LanguageCode.en) =>
  price ? formatNumberByLocalization(price, languageId, million, ten) : 0

export const Currency = (value: string | number) => {
  let currentValue = value
  if (typeof currentValue === 'number') currentValue = String(currentValue)
  return replacePriceSeparatorByLocalization(
    filterNonDigitCharacters(currentValue),
    LanguageCode.id,
  )
}

export const isValidPhoneNumber = (value: string) => {
  return /^\d{6,24}$/.test(value.replace(/[+]/gi, ''))
}
