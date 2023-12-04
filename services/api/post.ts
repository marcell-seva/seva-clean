import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { clientInteractionNavigateToErrorPage } from 'utils/handler/navigateErrorPage'
import { collections } from './collections'
import { LocalStorageKey } from 'utils/enum'
import { getLocalStorage } from 'utils/handler/localStorage'
import { UTMTagsData } from 'utils/types/utils'

const post = (path: string, data: any, config?: AxiosRequestConfig) => {
  const utmTags = getLocalStorage<UTMTagsData>(LocalStorageKey.UtmTags)
  const promise: Promise<any> = new Promise((resolve, reject) => {
    axios
      .post(`${path}`, data, {
        ...config,
        headers: { ...config?.headers, ...utmTags },
      })
      .then(
        (result) => {
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

export default post
