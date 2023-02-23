import { createContext, useEffect, useState } from 'react'
import { Location } from '../../utils/types'

export type LocationContextType = {
  location: Location
  isInit: boolean
  saveLocation: (data: Location) => void
}

export const LocationContext = createContext<LocationContextType | null>(null)

const getDataLocation = () => {
  const res = localStorage.getItem('cityOtr')
  const loc = res !== null ? JSON.parse(res) : null
  return loc
}
export const LocationProvider = ({ children }: any) => {
  const [isInit, setIsInit] = useState<boolean>(true)
  const [location, setLocation] = useState<Location>({
    cityCode: '',
    cityName: '',
    id: 0,
    province: '',
  })

  useEffect(() => {
    const data = getDataLocation()
    if (data !== null) {
      setLocation(data)
      setIsInit(false)
    }
  }, [])

  const saveLocation = (location: Location) => {
    localStorage.setItem('cityOtr', JSON.stringify(location))
    setIsInit(false)
    setLocation(location)
  }

  return (
    <LocationContext.Provider value={{ location, saveLocation, isInit }}>
      {children}
    </LocationContext.Provider>
  )
}
