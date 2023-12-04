import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { LocalStorageKey } from 'utils/enum'
import { getLocalStorage } from 'utils/handler/localStorage'
import { UTMTagsData } from 'utils/types/utils'

const put = (path: string, data: any, config?: AxiosRequestConfig) => {
  const utmTags = getLocalStorage<UTMTagsData>(LocalStorageKey.UtmTags)
  const promise: Promise<any> = new Promise((resolve, reject) => {
    axios
      .put(`${path}`, data, {
        ...config,
        headers: { ...config?.headers, ...utmTags },
      })
      .then(
        (result) => {
          resolve(result?.data)
        },
        (error: AxiosError) => {
          reject(error)
        },
      )
  })
  return promise
}

export default put
