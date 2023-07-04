import {
  CarModelBasicDetailsResponse,
  CarModelDetailsResponse,
} from 'utils/types/utils'
import { CarRecommendation } from './../utils/types/utils'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Dispatch, SetStateAction } from 'react'
import { getCity } from 'utils/hooks/useCurrentCityOtr/useCurrentCityOtr'
import endpoints from '../helpers/endpoints'
import { API } from '../utils/api'
import { CarRecommendationResponse } from 'utils/types/context'

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

export const getCarVariantDetailsById = (
  id: string,
  config?: AxiosRequestConfig,
) => {
  const params = new URLSearchParams()
  getCity().cityCode && params.append('city', getCity().cityCode as string)
  getCity().id && params.append('cityId', getCity().id as string)
  return API.get(endpoints.variantDetails.replace(':id', id), {
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

export const handleRecommendationsAndCarModelDetailsUpdate =
  (
    setRecommendations: Dispatch<SetStateAction<CarRecommendation[]>>,
    setCarModelDetails: Dispatch<
      SetStateAction<CarModelDetailsResponse | undefined>
    >,
  ) =>
  ([recommendationsResponse, carModelDetailsResponse]: [
    AxiosResponse<CarRecommendationResponse>,
    AxiosResponse<CarModelDetailsResponse>,
  ]) => {
    const recommendations =
      recommendationsResponse.data.carRecommendations || []
    const carModelDetails = carModelDetailsResponse.data

    setRecommendations(recommendations)
    updateCarModelDetailsWithLoanInfo(
      recommendations,
      carModelDetails,
      setCarModelDetails,
    )
  }
