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
  console.log('qwe utils recommendations', recommendations)
  console.log('qwe utils carModelDetails', modelDetails)
  const carModelVariantLoans =
    recommendations.find((r) => r.id === modelDetails.id)?.variants || []
  console.log('qwe utils carModelVariantLoans', carModelVariantLoans)
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
    CarRecommendationResponse,
    CarModelDetailsResponse,
  ]) => {
    const recommendations = recommendationsResponse.carRecommendations || []
    const carModelDetails = carModelDetailsResponse
    setRecommendations(recommendations)
    updateCarModelDetailsWithLoanInfo(
      recommendations,
      carModelDetails,
      setCarModelDetails,
    )
  }
