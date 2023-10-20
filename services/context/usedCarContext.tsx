import { createContext, useContext, useState } from 'react'
import { CarDetail, CarModelResponse, CarVariantDetails } from 'utils/types'
import { BodyTypes } from 'utils/types/carModel'
import { UsedCarRecommendation } from 'utils/types/context'
import { COMData } from 'utils/types/models'
import { CarModelDetailsResponse, CarRecommendation } from 'utils/types/props'

export interface UsedCarContextType {
  car: CarDetail | null
  saveCar: (data: CarDetail) => void
  carOfTheMonth: COMData[] | []
  saveCarOfTheMonth: (data: COMData[]) => void
  typeCar: BodyTypes[] | null
  saveTypeCar: (data: BodyTypes[]) => void
  carModel: CarModelResponse | null
  saveCarModel: (data: CarModelResponse) => void
  carModelDetails: CarModelDetailsResponse | null
  saveCarModelDetails: (data: CarModelDetailsResponse) => void
  carVariantDetails: CarVariantDetails | null
  saveCarVariantDetails: (data: CarVariantDetails) => void
  recommendation: UsedCarRecommendation[] | []
  saveRecommendation: (data: UsedCarRecommendation[] | []) => void
  recommendationToyota: CarRecommendation[] | []
  saveRecommendationToyota: (data: CarRecommendation[] | []) => void
  totalItems: number | null
  saveTotalItems: (data: number) => void
}

export interface UsedCarContextProps
  extends Pick<
    UsedCarContextType,
    | 'car'
    | 'carOfTheMonth'
    | 'typeCar'
    | 'carModel'
    | 'carModelDetails'
    | 'carVariantDetails'
    | 'recommendation'
    | 'recommendationToyota'
    | 'totalItems'
  > {
  children: React.ReactNode
}

export const UsedCarContext = createContext<UsedCarContextType>({
  car: null,
  saveCar: () => {},
  carOfTheMonth: [],
  saveCarOfTheMonth: () => {},
  typeCar: null,
  saveTypeCar: () => {},
  carModel: null,
  saveCarModel: () => {},
  carModelDetails: null,
  saveCarModelDetails: () => {},
  carVariantDetails: null,
  saveCarVariantDetails: () => {},
  recommendation: [],
  saveRecommendation: () => {},
  recommendationToyota: [],
  saveRecommendationToyota: () => {},
  totalItems: null,
  saveTotalItems: () => {},
})

export const UsedCarProvider = ({
  children,
  car = null,
  carOfTheMonth = [],
  typeCar = null,
  carModel = null,
  carModelDetails = null,
  carVariantDetails = null,
  recommendation = [],
  recommendationToyota = [],
  totalItems = null,
}: UsedCarContextProps) => {
  const [currentCar, setCar] = useState<CarDetail | null>(car)
  const [currentCarofTheMonth, setCarofTheMonth] = useState<COMData[] | []>(
    carOfTheMonth,
  )
  const [currentTypeCar, setTypeCar] = useState<BodyTypes[] | null>(typeCar)
  const [currentCarModel, setCarModel] = useState<CarModelResponse | null>(
    carModel,
  )
  const [currentCarModelDetails, setCarModelDetails] =
    useState<CarModelDetailsResponse | null>(carModelDetails)
  const [currentCarVariantDetails, setCarVariantDetails] =
    useState<CarVariantDetails | null>(carVariantDetails)
  const [currentRecommendation, setRecommendation] = useState<
    UsedCarRecommendation[] | []
  >(recommendation)
  const [currentRecommendationToyota, setRecommendationToyota] = useState<
    CarRecommendation[] | []
  >(recommendationToyota)
  const [currentTotalItems, setTotalItems] = useState<number | null>(totalItems)

  const saveCar = (car: CarDetail) => {
    setCar(car)
  }

  const saveTypeCar = (typeCar: BodyTypes[]) => {
    setTypeCar(typeCar)
  }

  const saveCarOfTheMonth = (carOfTheMonth: COMData[]) => {
    setCarofTheMonth(carOfTheMonth)
  }

  const saveCarModel = (carModel: CarModelResponse) => {
    setCarModel(carModel)
  }

  const saveCarModelDetails = (carModelDetailsData: CarModelDetailsResponse) =>
    setCarModelDetails(carModelDetailsData)

  const saveCarVariantDetails = (carVariantDetailsData: CarVariantDetails) =>
    setCarVariantDetails(carVariantDetailsData)

  const saveRecommendation = (
    recommendationData: UsedCarRecommendation[] | [],
  ) => {
    setRecommendation(recommendationData)
  }

  const saveRecommendationToyota = (
    recommendationData: CarRecommendation[] | [],
  ) => {
    setRecommendationToyota(recommendationData)
  }

  const saveTotalItems = (totalItems: number | null) => {
    setTotalItems(totalItems)
  }

  return (
    <UsedCarContext.Provider
      value={{
        car: currentCar,
        saveCar,
        typeCar: currentTypeCar,
        saveTypeCar,
        carOfTheMonth: currentCarofTheMonth,
        saveCarOfTheMonth,
        carModel: currentCarModel,
        saveCarModel,
        carModelDetails: currentCarModelDetails,
        saveCarModelDetails,
        carVariantDetails: currentCarVariantDetails,
        saveCarVariantDetails,
        recommendation: currentRecommendation,
        saveRecommendation,
        recommendationToyota: currentRecommendationToyota,
        saveRecommendationToyota,
        totalItems: currentTotalItems,
        saveTotalItems,
      }}
    >
      {children}
    </UsedCarContext.Provider>
  )
}

export const usedCar = () => useContext(UsedCarContext)
