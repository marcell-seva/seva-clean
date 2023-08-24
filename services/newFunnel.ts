import {
  LoanCalculatorAsuransiKombinasiPayloadType,
  LoanCalculatorIncludePromoPayloadType,
  LoanCalculatorInsuranceParams,
} from './../utils/types/utils'
import { AxiosRequestConfig } from 'axios'
import { api } from 'services/api'
import {
  decryptValue,
  encryptedPrefix,
  encryptValue,
} from 'utils/encryptionUtils'
import { PaymentType } from 'utils/enum'
import { defaultContactFormValue } from 'utils/hooks/useContactFormData/useContactFormData'
import { getCity } from 'utils/hooks/useCurrentCityOtr/useCurrentCityOtr'
import { defaultFormValue } from 'utils/hooks/useSurveyFormData/useSurveyFormData'
import { LocalStorageKey } from 'utils/enum'
import { FunnelQuery } from 'utils/types/context'
import { SpecialRateRequest } from 'utils/types/utils'
import { QueryKeys } from 'utils/types/models'

export const getSurveyFormData = () => {
  let item = localStorage.getItem(LocalStorageKey.SurveyForm)
  if (item?.includes(encryptedPrefix)) {
    item = decryptValue(item)
  }

  // if decryption failed, overwrite existing data with default value
  if (item === '') {
    localStorage.setItem(
      LocalStorageKey.SurveyForm,
      encryptValue(JSON.stringify(defaultContactFormValue)),
    )
    return defaultFormValue
  }

  return item ? JSON.parse(item) : ''
}

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

  return api.getRecommendation('', { params })
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

  return api.getRecommendation('', { params })
}

export const getMinMaxPrice = () => {
  const params = new URLSearchParams()
  getCity().cityCode && params.append('city', getCity().cityCode as string)

  return api.getMinMaxPrice('', { params })
}

export const getNewFunnelRecommendationsByQueries = ({
  bodyType,
  brand,
}: {
  bodyType?: string[]
  brand?: string[]
}) => {
  const params = new URLSearchParams()
  bodyType && params.append(QueryKeys.CarBodyType, bodyType.join('/'))
  brand && params.append(QueryKeys.CarBrand, brand.join('/'))
  getCity().cityCode && params.append('city', getCity().cityCode as string)
  getCity().id && params.append('cityId', getCity().id as string)

  return api.getRecommendation('', { params })
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
  return api.postNewFunnelLoanSpecialRate(
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

export const getNewFunnelCityRecommendations = (
  data: {
    modelName: string
    city: string
  },
  config?: AxiosRequestConfig,
) => {
  return api.postNewFunnelCityRecommendations(data, config)
}

export const getNewFunnelRecommendationsByCity = (
  cityId: string,
  city: string,
) => {
  const params = new URLSearchParams()
  params.append('cityId', cityId as string)
  params.append('city', city as string)

  return api.getRecommendation('', { params })
}

export const getCarVideoReview = () => {
  return api.getCarVideoReview()
}

export const getSuggestionsCars = (
  config?: AxiosRequestConfig,
  keyword?: string,
  sortBy?: string,
) => {
  const params = new URLSearchParams()
  params.append('city', getCity().cityCode as string)
  params.append('cityId', getCity().id as string)
  sortBy && params.append('sortBy', sortBy as string)
  return api.getVariantCar(`?query=${keyword}`, { ...config, ...params })
}
export const getNewFunnelRecommendationsCarModel = ({ model }: any) => {
  return api.getRecommendation(`/new-funnel?search=${model}`)
}

export const getCarBodyTypes = () => {
  const params = new URLSearchParams()
  getCity().cityCode && params.append('city', getCity().cityCode as string)
  return api.getTypeCar('', { params })
}

export const getLoanCalculatorInsurance = (
  params: LoanCalculatorInsuranceParams,
) => {
  return api.getLoanCalculatorInsurance(params)
}

export const postLoanPermutationIncludePromo = (
  body: LoanCalculatorIncludePromoPayloadType,
) => {
  return api.postLoanPermutationIncludePromo(body)
}

export const postLoanPermutationAsuransiKombinasi = (
  body: LoanCalculatorAsuransiKombinasiPayloadType,
) => {
  return api.postLoanPermutationAsuransiKombinasi(body)
}
