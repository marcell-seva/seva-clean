import axios, { AxiosError, AxiosRequestConfig } from 'axios'

const put = (path: string, data: any, config?: AxiosRequestConfig) => {
  const promise: Promise<void> = new Promise((resolve, reject) => {
    axios.put(`${path}`, data, config).then(
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
