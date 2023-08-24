import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

const get = (path: string, config?: AxiosRequestConfig) => {
  const promise: Promise<any> = new Promise((resolve, reject) => {
    axios.get(`${path}`, config).then(
      (result: AxiosResponse) => {
        resolve(result?.data)
      },
      (error: AxiosError) => {
        reject(error)
      },
    )
  })
  return promise
}

export default get
