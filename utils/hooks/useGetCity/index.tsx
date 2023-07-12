import { getLocalStorage, saveLocalStorage } from 'utils/handler/localStorage'
import { LocalStorageKey } from 'utils/types/models'
import { CityOtrOption } from 'utils/types/props'

export const defaultCity = {
  cityName: 'Jakarta Pusat',
  cityCode: 'jakarta',
  province: 'DKI Jakarta',
  id: '118',
}

export const getCity = () => {
  if (typeof window !== 'undefined') {
    const cityTemp = localStorage.getItem(LocalStorageKey.CityOtr)
    if (
      cityTemp &&
      (!cityTemp.includes('cityName') || !cityTemp.includes('id'))
    ) {
      saveCity(defaultCity)
      return defaultCity
    } else {
      return (
        getLocalStorage<CityOtrOption>(LocalStorageKey.CityOtr) ?? defaultCity
      )
    }
  }
  return getLocalStorage<CityOtrOption>(LocalStorageKey.CityOtr) ?? defaultCity
}

export const getCityWithoutDefault = () => {
  if (typeof window !== 'undefined') {
    const cityTemp = localStorage.getItem(LocalStorageKey.CityOtr)
    if (
      cityTemp &&
      (!cityTemp.includes('cityName') || !cityTemp.includes('id'))
    ) {
      saveCity(defaultCity)
      return defaultCity
    } else {
      return getLocalStorage<CityOtrOption>(LocalStorageKey.CityOtr)
    }
  } else {
    return getLocalStorage<CityOtrOption>(LocalStorageKey.CityOtr)
  }
}

export const saveCity = (city: CityOtrOption) => {
  saveLocalStorage(LocalStorageKey.CityOtr, JSON.stringify(city))
}
