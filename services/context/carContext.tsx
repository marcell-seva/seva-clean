import { createContext, useEffect, useState } from 'react'
import { CarDetail } from '../../utils/types'

export type CarContextType = {
  car: CarDetail | null
  saveCar: (data: CarDetail) => void
}

export const CarContext = createContext<CarContextType | null>(null)

export const CarProvider = ({ children }: any) => {
  const [car, setCar] = useState<CarDetail | null>(null)

  const saveCar = (car: CarDetail) => {
    setCar(car)
  }

  return (
    <CarContext.Provider value={{ car, saveCar }}>
      {children}
    </CarContext.Provider>
  )
}
