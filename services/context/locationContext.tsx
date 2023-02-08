import { createContext, useState } from 'react'

interface Location {
  cityCode: string
  cityName: string
  id: number
  province: string
}

export type LocationContextType = {
  location: Location
  isInit: boolean
  saveLocation: (data: Location) => void
}

export const LocationContext = createContext<LocationContextType | null>(null)

export const LocationProvider = ({ children }: any) => {
  const [location, setLocation] = useState<Location>({
    cityCode: '',
    cityName: '',
    id: 0,
    province: '',
  })

  const saveLocation = (location: Location) => {
    setLocation(location)
  }

  const isInit = location.cityName === ''

  return (
    <LocationContext.Provider value={{ location, saveLocation, isInit }}>
      {children}
    </LocationContext.Provider>
  )
}
