import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { clientInteractionNavigateToErrorPage } from 'utils/handler/navigateErrorPage'
import { collections } from './collections'

const post = (path: string, data: any, config?: AxiosRequestConfig) => {
  const promise: Promise<any> = new Promise((resolve, reject) => {
    axios.post(`${path}`, data, config).then(
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
