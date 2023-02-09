import { createContext, useEffect, useState } from 'react'

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

const getDataLocation = () => {
  const res = localStorage.getItem('seva-loc')
  const loc = res !== null ? JSON.parse(res) : null
  return loc
}
export const LocationProvider = ({ children }: any) => {
  const [location, setLocation] = useState<Location>({
    cityCode: '',
    cityName: '',
    id: 0,
    province: '',
  })

  useEffect(() => {
    const data = getDataLocation()
    if (data !== null) setLocation(data)
  }, [])

  const saveLocation = (location: Location) => {
    localStorage.setItem('seva-loc', JSON.stringify(location))
    setLocation(location)
  }

  const isInit = location.cityName === ''

  return (
    <LocationContext.Provider value={{ location, saveLocation, isInit }}>
      {children}
    </LocationContext.Provider>
  )
}
