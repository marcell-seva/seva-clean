import { COMMA, DOT } from 'utils/stringUtils'
import { LanguageCode } from 'utils/types/models'
import { addSeparator, filterNonDigitCharacters } from '../stringManipulation'

type MonthlyInstallmentObject = {
  monthlyInstallment: number
}
export const getLowestInstallment = (variants: MonthlyInstallmentObject[]) => {
  const prices = variants.map((variant) => variant.monthlyInstallment)
  return Math.min(...prices)
}

export const replacePriceSeparatorByLocalization = (
  num: number | string,
  languageId: LanguageCode,
) => {
  const separator = languageId === LanguageCode.en ? COMMA : DOT
  return addSeparator(num?.toString(), separator)
}

export const Currency = (value: string | number) => {
  let currentValue = value
  if (typeof currentValue === 'number') currentValue = String(currentValue)
  return replacePriceSeparatorByLocalization(
    filterNonDigitCharacters(currentValue),
    LanguageCode.id,
  )
}

export const getConvertFilterIncome = (value: string) => {
  if (value.includes('-') || value.includes('<') || value.includes('>')) {
    if (value === '<2M') {
      return Currency('2000000')
    } else if (value === '2M-4M') {
      return Currency('3000000')
    } else if (value === '4M-6M') {
      return Currency('5000000')
    } else if (value === '6M-8M') {
      return Currency('7000000')
    } else if (value === '8M-10M') {
      return Currency('9000000')
    } else if (value === '10M-20M') {
      return Currency('15000000')
    } else if (value === '20M-50M') {
      return Currency('35000000')
    } else if (value === '50M-75M') {
      return Currency('62500000')
    } else if (value === '75M-100M') {
      return Currency('87500000')
    } else if (value === '100M-150M') {
      return Currency('125000000')
    } else if (value === '150M-200M') {
      return Currency('175000000')
    } else if (value === '>200M') {
      return Currency('200000000')
    } else {
      return value
    }
  }
  return Currency(value)
}
