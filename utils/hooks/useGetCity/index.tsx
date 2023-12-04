import { LocalStorageKey } from 'utils/enum'
import { getLocalStorage, saveLocalStorage } from 'utils/handler/localStorage'
import { CityOtrOption } from 'utils/types'

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

export const isCurrentCitySameWithSSR = () => {
  if (getCity().cityName === 'Depok') {
    // need exception because "Depok" code is "jakarta" (case exception hyundai depok)
    return false
  } else {
    return getCity().cityCode === defaultCity.cityCode
  }
}
