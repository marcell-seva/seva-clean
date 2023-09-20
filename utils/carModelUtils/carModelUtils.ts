import { LanguageCode } from 'utils/enum'
import { formatNumberByLocalization } from 'utils/handler/rupiah'
import {
  formatBillionPoint,
  formatPriceNumber,
  formatPriceNumberThousandDivisor,
} from 'utils/numberUtils/numberUtils'
import { CarRecommendation, CarVariant } from 'utils/types/context'
import { hundred, million, ten } from '../../utils/helpers/const'

type DpObject = {
  dpAmount: number
}
type MonthlyInstallmentObject = {
  monthlyInstallment: number
}
export type CarModel = Pick<
  CarRecommendation,
  'lowestAssetPrice' | 'highestAssetPrice'
>
type CarModelWithBrandAndModel = Pick<CarRecommendation, 'brand' | 'model'>
type PriceValueObject = Pick<CarVariant, 'priceValue'>

export const formatPriceRange = (
  prices: number[],
  digits = ten,
  languageCode = LanguageCode.en,
) => {
  const minPrice = formatNumberByLocalization(
    Math.min(...prices),
    languageCode,
    million,
    digits,
  )

  const maxPrice = formatNumberByLocalization(
    Math.max(...prices),
    languageCode,
    million,
    digits,
  )

  return `${formatBillionPoint(minPrice)} - ${formatBillionPoint(maxPrice)}`
}

export const getDpRange = (
  variants: DpObject[],
  languageCode = LanguageCode.en,
) => {
  return formatPriceRange(
    variants.map((variant) => variant.dpAmount),
    ten,
    languageCode,
  )
}
export const getMonthlyInstallmentRange = (
  variants: MonthlyInstallmentObject[],
  languageCode = LanguageCode.en,
) => {
  return formatPriceRange(
    variants.map((variant) => variant.monthlyInstallment),
    hundred,
    languageCode,
  )
}

export const getModelPriceRange = (
  carModel: CarModel,
  languageId = LanguageCode.en,
) => {
  const lowestAssetPrice = formatPriceNumber(carModel.lowestAssetPrice)
  const highestAssetPrice = formatPriceNumber(carModel.highestAssetPrice)

  const lowerPrice =
    lowestAssetPrice >= 1000
      ? formatPriceNumberThousandDivisor(lowestAssetPrice, languageId)
      : lowestAssetPrice

  const higherPrice =
    highestAssetPrice >= 1000
      ? formatPriceNumberThousandDivisor(highestAssetPrice, languageId)
      : highestAssetPrice

  return `${lowerPrice}-${higherPrice}`
}
export const getVariantsPriceRange = (
  variants: PriceValueObject[],
  languageCode = LanguageCode.en,
) => {
  return formatPriceRange(
    variants.map((variant) => variant.priceValue),
    hundred,
    languageCode,
  )
}

export const getModelName = (carModel: CarModelWithBrandAndModel) => {
  return `${carModel.brand} ${carModel.model}`
}

export const getMinimumMonthlyInstallment = (
  variants: MonthlyInstallmentObject[],
  language: LanguageCode,
  divider: number,
  digits: number,
) => {
  const prices = variants?.map((variant) => variant.monthlyInstallment) || []
  return formatNumberByLocalization(
    Math.min(...prices),
    language,
    divider,
    digits,
  )
}

export const getMinimumDp = (
  variants: DpObject[],
  language: LanguageCode,
  divider: number,
  digits: number,
) => {
  const prices = variants.map((variant) => variant.dpAmount)
  return formatNumberByLocalization(
    Math.min(...prices),
    language,
    divider,
    digits,
  )
}

export const getLowestDp = (variants: DpObject[]) => {
  const prices = variants.map((variant) => variant.dpAmount)
  return Math.min(...prices)
}

export const getLowestInstallment = (variants: MonthlyInstallmentObject[]) => {
  const prices = variants.map((variant) => variant.monthlyInstallment)
  return Math.min(...prices)
}

export const getCarBrand = (brand: string | string[] | undefined) => {
  if (String(brand).toLowerCase() === 'toyota') {
    return 'Toyota'
  } else if (String(brand).toLowerCase() === 'daihatsu') {
    return 'Daihatsu'
  } else if (String(brand).toLowerCase() === 'bmw') {
    return 'BMW'
  }else if (String(brand).toLowerCase() === 'isuzu') {
    return 'Isuzu'
  }else if (String(brand).toLowerCase() === 'peugeot') {
    return 'Peugeot'
  } else {
    return ''
  }
}