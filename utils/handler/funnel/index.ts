import { AxiosRequestConfig } from 'axios'
import {
  getRecommendation,
  getUsedCars,
  postNewFunnelLoanSpecialRate,
} from 'services/api'
import { PaymentType } from 'utils/enum'
import { getCity } from 'utils/hooks/useCurrentCityOtr/useCurrentCityOtr'
import { FunnelQuery } from 'utils/types/context'
import { SpecialRateRequest } from 'utils/types/utils'

export const getNewFunnelRecommendations = (
  funnelQuery: FunnelQuery,
  surveyForm = false,
  useKeySearch = true,
) => {
  const params = new URLSearchParams()
  const {
    search,
    downPaymentAmount,
    downPaymentPercentage,
    monthlyInstallment,
    downPaymentType,
    brand,
    bodyType,
    sortBy,
    carModel,
    monthlyIncome,
    tenure,
    age,
    priceRangeGroup,
  } = funnelQuery

  const isDpSelected = downPaymentAmount || downPaymentPercentage
  const isMonthlySelected = monthlyInstallment
  if (isDpSelected) {
    params.append('recommendationType', PaymentType.DownPayment)
    params.append('dpType', downPaymentType as string)
    downPaymentAmount &&
      params.append('maxDpAmount', downPaymentAmount as string)
    downPaymentPercentage &&
      params.append('maxDpPercentage', downPaymentPercentage as string)
  }
  if (isMonthlySelected) {
    params.append('recommendationType', PaymentType.MonthlyInstallment)
    params.append('maxMonthlyInstallment', monthlyInstallment as string)
  }
  // if (funnelQuery.paymentType === 'carModel' && useKeySearch === true) {
  //   params.append('search', carModel as string)
  // }
  brand && brand.length > 0 && params.append('brand', brand.join('/'))
  bodyType &&
    bodyType.length > 0 &&
    params.append('bodyType', bodyType.join('/'))

  search && params.append('search', search as string)

  sortBy && params.append('sortBy', sortBy as string)

  monthlyIncome && params.append('monthlyIncome', monthlyIncome as string)
  age && params.append('age', age as string)
  tenure && params.append('tenure', String(tenure))
  priceRangeGroup && params.append('priceRangeGroup', priceRangeGroup as string)

  getCity().cityCode && params.append('city', getCity().cityCode as string)
  getCity().id && params.append('cityId', getCity().id as string)

  return getRecommendation('', { params })
}

export const getUsedCarFunnelRecommendations = async (
  funnelQuery: FunnelQuery,
  surveyForm = false,
  useKeySearch = true,
) => {
  const params = new URLSearchParams()
  const {
    search,
    brand,
    sortBy,
    mileageStart,
    mileageEnd,
    yearStart,
    yearEnd,
    transmission,
    cityId,
    priceStart,
    priceEnd,
    plate,
    page,
    perPage,
    modelName,
  } = funnelQuery

  brand &&
    brand.length > 0 &&
    brand.map((item) => params.append('brand', item.toLowerCase()))

  if (modelName && modelName.length > 0) {
    const combinedModelNames = modelName.join(',')
    params.append('modelName', combinedModelNames)
  }

  search && params.append('search', search as string)

  sortBy && params.append('sortBy', sortBy as string)

  cityId &&
    cityId.length > 0 &&
    cityId.map((item) => params.append('cityId', item))
  transmission &&
    transmission.length > 0 &&
    transmission.map((item) =>
      params.append('transmission', item.toLowerCase()),
    )
  plate &&
    plate.length > 0 &&
    plate.map((item) => params.append('plate', item.toLowerCase()))
  priceStart && params.append('priceStart', priceStart?.toString() as string)
  priceEnd && params.append('priceEnd', priceEnd?.toString() as string)
  mileageStart &&
    params.append('mileageStart', mileageStart?.toString() as string)
  mileageEnd && params.append('mileageEnd', mileageEnd?.toString() as string)
  yearStart && params.append('yearStart', yearStart?.toString() as string)
  yearEnd && params.append('yearEnd', yearEnd?.toString() as string)
  page && params.append('page', page?.toString() as string)
  perPage && params.append('perPage', perPage?.toString() as string)
  // getCity().cityCode && params.append('city', getCity().cityCode as string)
  // getCity().id && params.append('cityId', getCity().id as string)

  console.log('flag query', params)
  return await getUsedCars('', { params })
}

export const getNewFunnelLoanSpecialRate = (
  {
    otr,
    dp,
    dpAmount,
    monthlyIncome,
    age,
    city,
    discount,
    rateType,
    angsuranType,
    isFreeInsurance,
  }: SpecialRateRequest,
  config?: AxiosRequestConfig,
) => {
  const params = new URLSearchParams()
  getCity().cityCode && params.append('city', getCity().cityCode as string)
  return postNewFunnelLoanSpecialRate(
    {
      otr,
      dp,
      dpAmount,
      monthlyIncome,
      age,
      city,
      discount,
      rateType,
      angsuranType,
      isFreeInsurance,
    },
    {
      params,
      ...config,
    },
  )
}
