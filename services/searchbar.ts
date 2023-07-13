import { API } from '../utils/api'
import endpoints from 'helpers/endpoints'
import { getCity } from 'utils/hooks/useCurrentCityOtr/useCurrentCityOtr'

export const getCarsSearchBar = (keyword: string) => {
  const params = new URLSearchParams()

  getCity().cityCode && params.append('city', getCity().cityCode as string)
  getCity().id && params.append('cityId', getCity().id as string)
  params.append('query', keyword as string)

  return API.get(endpoints.carsSearchBar, { params })
}
