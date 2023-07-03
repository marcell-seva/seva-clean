import { Dispatch, SetStateAction } from 'react'
import {
  CarModelBasicDetailsResponse,
  CarModelDetailsResponse,
  CarRecommendation,
} from './types'
import { AxiosResponse } from 'axios'
import { CarRecommendationResponse } from './types/context'

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
