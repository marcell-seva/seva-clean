import { createContext, useEffect, useState } from 'react'
import { CarDetail } from 'utils/types'
import { CarModelDetailsResponse, CarVariantDetails } from 'utils/types/props'

export type CarContextType = {
  car: CarDetail | null
  saveCar: (data: CarDetail) => void
  carModelDetails: CarModelDetailsResponse | null
  saveCarModelDetails: (data: CarModelDetailsResponse) => void
  carVariantDetails: CarVariantDetails | null
  saveCarVariantDetails: (data: CarVariantDetails) => void
}

export const CarContext = createContext<CarContextType | null>(null)

export const CarProvider = ({ children }: any) => {
  const [car, setCar] = useState<CarDetail | null>(null)
  const [carModelDetails, setCarModelDetails] =
    useState<CarModelDetailsResponse | null>(null)
  const [carVariantDetails, setCarVariantDetails] =
    useState<CarVariantDetails | null>(null)

  const saveCar = (car: CarDetail) => {
    setCar(car)
  }

  const saveCarModelDetails = (carModelDetailsData: CarModelDetailsResponse) =>
    setCarModelDetails(carModelDetailsData)

  const saveCarVariantDetails = (carVariantDetailsData: CarVariantDetails) =>
    setCarVariantDetails(carVariantDetailsData)

  return (
    <CarContext.Provider
      value={{
        car,
        saveCar,
        carModelDetails,
        saveCarModelDetails,
        carVariantDetails,
        saveCarVariantDetails,
      }}
    >
      {children}
    </CarContext.Provider>
  )
}
