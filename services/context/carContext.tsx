import { createContext, useContext, useState } from 'react'
import { CarDetail, CarModelResponse, CarVariantDetails } from 'utils/types'
import { CarModelDetailsResponse, CarRecommendation } from 'utils/types/props'

export type CarContextType = {
  car: CarDetail | null
  saveCar: (data: CarDetail) => void
  carModel: CarModelResponse | null
  saveCarModel: (data: CarModelResponse) => void
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
  carModel: null,
  saveCarModel: () => {},
  carModelDetails: null,
  saveCarModelDetails: () => {},
  carVariantDetails: null,
  recommendation: [],
  saveCarVariantDetails: () => {},
  saveRecommendation: () => {},
})

export const CarProvider = ({ children }: any) => {
  const [car, setCar] = useState<CarDetail | null>(null)
  const [carModel, setCarModel] = useState<CarModelResponse | null>(null)
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

  const saveCarModel = (carModel: CarModelResponse) => {
    setCarModel(carModel)
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
        carModel,
        saveCarModel,
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
