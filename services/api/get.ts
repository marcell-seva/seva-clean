import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { clientInteractionNavigateToErrorPage } from 'utils/handler/navigateErrorPage'

const get = (
  path: string,
  config?: AxiosRequestConfig,
  ignoreErrorHandlerNavigation?: boolean,
) => {
  const promise: Promise<any> = new Promise((resolve, reject) => {
    axios.get(`${path}`, config).then(
      (result: AxiosResponse) => {
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

export default get
