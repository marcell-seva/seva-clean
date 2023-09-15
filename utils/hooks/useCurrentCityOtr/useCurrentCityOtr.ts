import { client } from 'utils/helpers/const'
import { LocalStorageKey } from 'utils/enum'
import { getLocalStorage, saveLocalStorage } from 'utils/handler/localStorage'
import { CityOtrOption, Location } from 'utils/types'

export const defaultCity = {
  cityName: 'Jakarta Pusat',
  cityCode: 'jakarta',
  province: 'DKI Jakarta',
  id: '118',
}

export const getCity = () => {
  const cityTemp = client ? localStorage.getItem(LocalStorageKey.CityOtr) : ''

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
  const cityTemp = client ? localStorage.getItem(LocalStorageKey.CityOtr) : ''
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

export const saveCity = (city: Location | CityOtrOption) => {
  saveLocalStorage(LocalStorageKey.CityOtr, JSON.stringify(city))
}

export const isCurrentCityJakartaPusatOrSurabaya = () => {
  return (
    getCity().cityName.toLowerCase() === 'jakarta pusat' ||
    getCity().cityName.toLowerCase() === 'surabaya'
  )
}
