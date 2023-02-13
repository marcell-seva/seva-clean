import { createContext, useEffect, useState } from 'react'

interface Car {
  id: number
  brand: string
  model: any
  order: number
  status: boolean
}

export type CarContextType = {
  car: Car
  saveCar: (data: Car) => void
}

export const CarContext = createContext<CarContextType | null>(null)

export const CarProvider = ({ children }: any) => {
  const [car, setCar] = useState<Car>({
    id: 0,
    brand: '',
    model: {},
    order: 0,
    status: false,
  })

  const saveCar = (car: Car) => {
    setCar(car)
  }

  return (
    <CarContext.Provider value={{ car, saveCar }}>
      {children}
    </CarContext.Provider>
  )
}
