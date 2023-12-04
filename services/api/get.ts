import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { LocalStorageKey } from 'utils/enum'
import { getLocalStorage } from 'utils/handler/localStorage'
import { clientInteractionNavigateToErrorPage } from 'utils/handler/navigateErrorPage'
import { UTMTagsData } from 'utils/types/utils'

const get = (path: string, config?: AxiosRequestConfig) => {
  const promise: Promise<any> = new Promise((resolve, reject) => {
    const utmTags = getLocalStorage<UTMTagsData>(LocalStorageKey.UtmTags)
    axios
      .get(`${path}`, {
        ...config,
        headers: { ...config?.headers, ...utmTags },
      })
      .then(
        (result: AxiosResponse) => {
          resolve(result?.data)
        },
        (error: AxiosError) => {
          reject(error)
          clientInteractionNavigateToErrorPage(error?.response?.status)
        },
      )
  })
  return promise
}

export default get
