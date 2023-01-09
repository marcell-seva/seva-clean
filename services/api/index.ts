import get from './get'
import post from './post'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { collections } from './collections'
import { getLocalStorage } from '../../utils/localStorage'

axios.interceptors.request.use(
  (config): AxiosRequestConfig => {
    const token = getLocalStorage('token')?.idToken
    config.headers = config.headers ?? {}
    config.headers.Authorization = token
    return config
  },
  (error) => Promise.reject(error),
)

// axios.interceptors.response.use(
//   (res) => {
//     return res
//   },
//   async (err) => {
//     const originalConfig = err.config

//     if (err.response?.status === 401) {
//       originalConfig._retry = true
//       originalConfig.headers.Authorization = 'marcell'
//       console.log('new', originalConfig)

//       return axios(originalConfig)
//     }

//     return Promise.reject(err)
//   },
// )

// get request
const getProduct = () => get(collections.auth.userProfile)

// post request
const postUserData = (data: any) => post(collections.auth.userProfile, data)

export const api = {
  getProduct,
  postUserData,
}
