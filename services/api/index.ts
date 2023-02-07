import get from './get'
import post from './post'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { collections } from './collections'

// axios.interceptors.request.use(
//   (config): AxiosRequestConfig => {
//     const token = getLocalStorage('token')?.idToken
//     config.headers = config.headers ?? {}
//     config.headers.Authorization = token
//     return config
//   },
//   (error) => Promise.reject(error),
// )

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
const getMenu = () => get(collections.utils.menu)
const getCities = () => get(collections.utils.cities)
const getTestimony = () => get(collections.utils.testimonials)
const getRecommendation = (params: string) =>
  get(collections.product.recommendation + params)
const getUsage = () => get(collections.utils.usage)
const getMainArticle = (params: string) =>
  get(collections.article.mainArticle + params)
const getSubArticle = (params: string) =>
  get(collections.article.subArticle + params)

const getVariantCar = (params: string) =>
  get(collections.product.variant + params)
const getTypeCar = (params: string) => get(collections.product.type + params)
const getBanner = () => get(collections.utils.banner)
const getCarofTheMonth = () => get(collections.product.carofTheMonth)
const getAnnouncementBox = () => get(collections.utils.announcementBox)

// post request
const postUnverfiedLeads = (body: any) =>
  post(collections.leads.unverified, body)

export const api = {
  getMenu,
  getCities,
  getTestimony,
  getRecommendation,
  getUsage,
  getMainArticle,
  getSubArticle,
  getVariantCar,
  getTypeCar,
  getBanner,
  getCarofTheMonth,
  getAnnouncementBox,
  postUnverfiedLeads,
}
