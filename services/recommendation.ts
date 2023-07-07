import { AxiosRequestConfig, AxiosResponse } from 'axios'
import endpoints from 'helpers/endpoints'
import { API } from 'utils/api'
import { getCity } from 'utils/hooks/useCurrentCityOtr/useCurrentCityOtr'
import {
  CarRecommendation,
  CarModelDetailsResponse,
  CarModelBasicDetailsResponse,
} from 'utils/types'

export const getCarModelDetailsById = (
  id: string,
  config?: AxiosRequestConfig,
) => {
  const params = new URLSearchParams()
  getCity().cityCode && params.append('city', getCity().cityCode as string)
  getCity().id && params.append('cityId', getCity().id as string)
  return API.get(endpoints.modelDetails.replace(':id', id), {
    params,
    ...config,
  })
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
  setCarModelDetails: React.Dispatch<
    React.SetStateAction<CarModelDetailsResponse | undefined>
  >,
) => {
  carModelDetails &&
    setCarModelDetails(
      mergeModelDetailsWithLoanRecommendations(
        recommendations,
        carModelDetails,
      ),
    )
}

export const handleCarModelDetailsUpdate =
  (
    recommendations: CarRecommendation[],
    setCarModelDetails: React.Dispatch<
      React.SetStateAction<CarModelDetailsResponse | undefined>
    >,
  ) =>
  (response: AxiosResponse<CarModelBasicDetailsResponse>) => {
    updateCarModelDetailsWithLoanInfo(
      recommendations,
      response.data,
      setCarModelDetails,
    )
  }
