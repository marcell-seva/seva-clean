import axios, { AxiosRequestConfig } from 'axios'
import endpoints from 'helpers/endpoints'
import { API } from 'utils/api'
import { PaymentType } from 'utils/enum'
import { getCity } from 'utils/hooks/useCurrentCityOtr/useCurrentCityOtr'
import { QueryKeys } from 'utils/models/models'
import { FunnelQuery } from 'utils/types/context'

export const getNewFunnelAllRecommendations = (
  config?: AxiosRequestConfig,
  customCity?: string,
) => {
  const params = new URLSearchParams()

  getCity().cityCode && params.append('city', getCity().cityCode as string)
  getCity().id && params.append('cityId', getCity().id as string)
  if (customCity) {
    params.set('city', customCity as string)
  }

  return API.get(endpoints.newFunnelRecommendation, {
    ...config,
    params,
  })
}

export const getNewFunnelRecommendations = (
  funnelQuery: FunnelQuery,
  surveyForm = false,
  useKeySearch = true,
) => {
  const params = new URLSearchParams()
  const {
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
  if (funnelQuery.paymentType === 'carModel' && useKeySearch === true) {
    params.append('search', carModel as string)
  }
  brand && brand.length > 0 && params.append('brand', brand.join('/'))
  bodyType &&
    bodyType.length > 0 &&
    params.append('bodyType', bodyType.join('/'))

  sortBy && params.append('sortBy', sortBy as string)

  monthlyIncome && params.append('monthlyIncome', monthlyIncome as string)
  age && params.append('age', age as string)
  tenure && params.append('tenure', String(tenure))
  priceRangeGroup && params.append('priceRangeGroup', priceRangeGroup as string)

  getCity().cityCode && params.append('city', getCity().cityCode as string)
  getCity().id && params.append('cityId', getCity().id as string)

  return API.get(endpoints.newFunnelRecommendation, { params })
}

export const getMinMaxPrice = (config?: AxiosRequestConfig) => {
  const params = new URLSearchParams()
  getCity().cityCode && params.append('city', getCity().cityCode as string)

  return API.get(endpoints.minMaxPrice, {
    ...config,
    params,
  })
}

export const getNewFunnelRecommendationsByQueries = (
  {
    bodyType,
    brand,
  }: {
    bodyType?: string[]
    brand?: string[]
  },
  config?: AxiosRequestConfig,
) => {
  const params = new URLSearchParams()
  bodyType && params.append(QueryKeys.CarBodyType, bodyType.join('/'))
  brand && params.append(QueryKeys.CarBrand, brand.join('/'))
  getCity().cityCode && params.append('city', getCity().cityCode as string)
  getCity().id && params.append('cityId', getCity().id as string)

  return API.get(endpoints.newFunnelRecommendation, {
    ...config,
    params,
  })
}
