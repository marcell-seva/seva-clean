import { LocalStorageKey } from 'utils/enum'
import { getLocalStorage, saveLocalStorage } from 'utils/localstorageUtils'
import { Location } from 'utils/types'

export const defaultCity = {
  cityName: 'Jakarta Pusat',
  cityCode: 'jakarta',
  province: 'DKI Jakarta',
  id: '118',
}

export const getCity = () => {
  const cityTemp = localStorage.getItem(LocalStorageKey.CityOtr)

  if (
    cityTemp &&
    (!cityTemp.includes('cityName') || !cityTemp.includes('id'))
  ) {
    saveCity(defaultCity)
    return defaultCity
  } else {
    return getLocalStorage<Location>(LocalStorageKey.CityOtr) ?? defaultCity
  }
}

export const getCityWithoutDefault = () => {
  const cityTemp = localStorage.getItem(LocalStorageKey.CityOtr)
  if (
    cityTemp &&
    (!cityTemp.includes('cityName') || !cityTemp.includes('id'))
  ) {
    saveCity(defaultCity)
    return defaultCity
  } else {
    return getLocalStorage<Location>(LocalStorageKey.CityOtr)
  }
}

export const saveCity = (city: Location) => {
  saveLocalStorage(LocalStorageKey.CityOtr, JSON.stringify(city))
}
