import { createContext, useContext, useState } from 'react'
import { CarDetail, CarModelResponse, CarVariantDetails } from 'utils/types'
import { CarModelDetailsResponse, CarRecommendation } from 'utils/types/props'

export interface CarContextType {
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

export interface CarContextProps
  extends Pick<
    CarContextType,
    | 'car'
    | 'carModel'
    | 'carModelDetails'
    | 'carVariantDetails'
    | 'recommendation'
  > {
  children: React.ReactNode
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

export const CarProvider = ({
  children,
  car = null,
  carModel = null,
  carModelDetails = null,
  carVariantDetails = null,
  recommendation = [],
}: CarContextProps) => {
  const [currentCar, setCar] = useState<CarDetail | null>(car)
  const [currentCarModel, setCarModel] = useState<CarModelResponse | null>(
    carModel,
  )
  const [currentCarModelDetails, setCarModelDetails] =
    useState<CarModelDetailsResponse | null>(carModelDetails)
  const [currentCarVariantDetails, setCarVariantDetails] =
    useState<CarVariantDetails | null>(carVariantDetails)
  const [currentRecommendation, setRecommendation] = useState<
    CarRecommendation[] | []
  >(recommendation)

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
        car: currentCar,
        saveCar,
        carModel: currentCarModel,
        saveCarModel,
        carModelDetails: currentCarModelDetails,
        saveCarModelDetails,
        carVariantDetails: currentCarVariantDetails,
        saveCarVariantDetails,
        recommendation: currentRecommendation,
        saveRecommendation,
      }}
    >
      {children}
    </CarContext.Provider>
  )
}

export const useCar = () => useContext(CarContext)
