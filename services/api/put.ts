import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { LocalStorageKey } from 'utils/enum'
import { getLocalStorage } from 'utils/handler/localStorage'
import { UTMTagsData } from 'utils/types/utils'
import { clientInteractionNavigateToErrorPage } from 'utils/handler/navigateErrorPage'

const put = (
  path: string,
  data: any,
  config?: AxiosRequestConfig,
  ignoreErrorHandlerNavigation?: boolean,
) => {
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
          if (!ignoreErrorHandlerNavigation) {
            clientInteractionNavigateToErrorPage(error?.response?.status)
          }
        },
      )
  })
  return promise
}

export default put
