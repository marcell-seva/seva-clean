import { Context, createContext, useContext, useEffect, useState } from 'react'
import { CarDetail } from 'utils/types'
import {
  CarModelDetailsResponse,
  CarRecommendation,
  CarVariantDetails,
} from 'utils/types/props'

export type CarContextType = {
  car: CarDetail | null
  saveCar: (data: CarDetail) => void
  carModelDetails: CarModelDetailsResponse | null
  saveCarModelDetails: (data: CarModelDetailsResponse) => void
  carVariantDetails: CarVariantDetails | null
  saveCarVariantDetails: (data: CarVariantDetails) => void
  recommendation: CarRecommendation[] | []
  saveRecommendation: (data: CarRecommendation[] | []) => void
}

export const CarContext = createContext<CarContextType>({
  car: null,
  saveCar: () => {},
  carModelDetails: null,
  saveCarModelDetails: () => {},
  carVariantDetails: null,
  recommendation: [],
  saveCarVariantDetails: () => {},
  saveRecommendation: () => {},
})

export const CarProvider = ({ children }: any) => {
  const [car, setCar] = useState<CarDetail | null>(null)
  const [carModelDetails, setCarModelDetails] =
    useState<CarModelDetailsResponse | null>(null)
  const [carVariantDetails, setCarVariantDetails] =
    useState<CarVariantDetails | null>(null)
  const [recommendation, setRecommendation] = useState<
    CarRecommendation[] | []
  >([])

  const saveCar = (car: CarDetail) => {
    setCar(car)
  }

  const saveCarModelDetails = (carModelDetailsData: CarModelDetailsResponse) =>
    setCarModelDetails(carModelDetailsData)

  const saveCarVariantDetails = (carVariantDetailsData: CarVariantDetails) =>
    setCarVariantDetails(carVariantDetailsData)

  const saveRecommendation = (recommendationData: CarRecommendation[] | []) => {
    setRecommendation(recommendationData)
  }

  return (
    <CarContext.Provider
      value={{
        car,
        saveCar,
        carModelDetails,
        saveCarModelDetails,
        carVariantDetails,
        saveCarVariantDetails,
        recommendation,
        saveRecommendation,
      }}
    >
      {children}
    </CarContext.Provider>
  )
}

export const useCar = () => useContext(CarContext)
