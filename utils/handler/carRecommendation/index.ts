import { api } from 'services/api'
import {
  CarModelBasicDetailsResponse,
  CarModelDetailsResponse,
  CarRecommendation,
} from 'utils/types/utils'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { getCity } from 'utils/hooks/useCurrentCityOtr/useCurrentCityOtr'

export const getCarModelDetailsById = (
  id: string,
  config?: AxiosRequestConfig,
) => {
  const params = new URLSearchParams()
  getCity().cityCode && params.append('city', getCity().cityCode as string)
  getCity().id && params.append('cityId', getCity().id as string)
  return api.getCarModelDetails(id, '', { params })
}

export const getCarVariantDetailsById = (
  id: string,
  config?: AxiosRequestConfig,
) => {
  const params = new URLSearchParams()
  getCity().cityCode && params.append('city', getCity().cityCode as string)
  getCity().id && params.append('cityId', getCity().id as string)
  return api.getCarVariantDetails(id, '', { params })
}

export const mergeModelDetailsWithLoanRecommendations = (
  recommendations: CarRecommendation[],
  modelDetails: CarModelBasicDetailsResponse,
): CarModelDetailsResponse => {
  const carModelVariantLoans =
    recommendations.find((r) => r.id === modelDetails.id)?.variants || []
  return {
    ...modelDetails,
    variants: carModelVariantLoans.map((v) => ({
      ...v,
      ...modelDetails.variants.filter((c) => c.id === v.id)[0],
    })),
  }
}

const updateCarModelDetailsWithLoanInfo = (
  recommendations: CarRecommendation[],
  carModelDetails: CarModelBasicDetailsResponse,
  setCarModelDetails: (data: CarModelDetailsResponse) => void,
) => {
  carModelDetails &&
    setCarModelDetails(
      mergeModelDetailsWithLoanRecommendations(
        recommendations,
        carModelDetails,
      ),
    )
}

export const handleRecommendationsAndCarModelDetailsUpdate =
  (
    setRecommendations: (data: CarRecommendation[] | []) => void,
    setCarModelDetails: (data: CarModelDetailsResponse) => void,
  ) =>
  ([recommendationsResponse, carModelDetailsResponse]: any) => {
    const recommendations = recommendationsResponse?.carRecommendations || []
    const carModelDetails = carModelDetailsResponse

    setRecommendations(recommendations)
    updateCarModelDetailsWithLoanInfo(
      recommendations,
      carModelDetails,
      setCarModelDetails,
    )
  }

export const handleCarModelDetailsUpdate =
  (
    recommendations: CarRecommendation[],
    setCarModelDetails: (data: CarModelDetailsResponse) => void,
  ) =>
  (response: AxiosResponse<CarModelBasicDetailsResponse>) => {
    updateCarModelDetailsWithLoanInfo(
      recommendations,
      response.data,
      setCarModelDetails,
    )
  }

export const getIncomeList = () => {
  return api.getIncomeList()
}
