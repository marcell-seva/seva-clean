import get from './get'
import post from './post'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { collections } from './collections'
import { useContext } from 'react'
import { AuthContext, AuthContextType } from '../context/authContext'

// axios.interceptors.request.use(
//   (config): AxiosRequestConfig => {
//     const token = getLocalStorage('token')?.idToken
//     config.headers = config.headers ?? {}
//     config.headers.Authorization = token
//     return config
//   },
//   (error) => Promise.reject(error),
// )

const getDataToken = () => {
  const dataToken = localStorage.getItem('token')
  const token = dataToken !== null ? JSON.parse(dataToken) : null
  return token
}

const setDataToken = (payload: any) => {
  localStorage.setItem('token', JSON.stringify(payload))
}

const requestNewToken = async (payload: any) => {
  try {
    const res = await api.postRefreshToken({ refreshToken: payload })
    return res
  } catch (error) {
    throw error
  }
}

axios.interceptors.response.use(
  (res) => {
    return res
  },
  async (err) => {
    const originalConfig = err.config
    const statusCode = err.response.status
    const dataToken = getDataToken()
    console.log('error', statusCode)

    if (statusCode === 400)
      window.location.href = 'https://www.seva.id/masuk-akun'
    else if (statusCode === 401) {
      const userToken: any = await requestNewToken(dataToken.refreshToken)
      setDataToken(userToken)
      originalConfig._retry = true
      originalConfig.headers.Authorization = userToken.idToken
      return axios(originalConfig)
    }
    return Promise.reject(err)
  },
)

const getConfigToken = () => {
  const dataToken = localStorage.getItem('token')
  const userToken = dataToken !== null ? JSON.parse(dataToken).idToken : null
  const config = {
    headers: { Authorization: userToken },
  }
  return config
}
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

const getUserInfo = () => get(collections.auth.user, getConfigToken())

// post request
const postUnverfiedLeads = (body: any) =>
  post(collections.leads.unverified, body)
const postRefreshToken = (body: any) => post(collections.auth.refresh, body)

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
  getUserInfo,
  postUnverfiedLeads,
  postRefreshToken,
}
