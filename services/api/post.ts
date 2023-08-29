import axios, { AxiosError, AxiosRequestConfig } from 'axios'

const post = (path: string, data: any, config?: AxiosRequestConfig) => {
  const promise: Promise<any> = new Promise((resolve, reject) => {
    axios.post(`${path}`, data, config).then(
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

export default post
