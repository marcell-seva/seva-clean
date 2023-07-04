import get from './get'
import post from './post'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { collections } from './collections'

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

    if (statusCode === 4000)
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
const getRecommendation = (params?: string) =>
  get(collections.product.recommendation + params)
const getUsage = () => get(collections.utils.usage)
const getMainArticle = (params: string) =>
  get(collections.article.mainArticle + params)
const getSubArticle = (params: number) =>
  get(collections.article.subArticle + params)

const getVariantCar = (params: string) =>
  get(collections.product.variant + params)
const getTypeCar = (params: string) => get(collections.product.type + params)
const getBanner = () => get(collections.utils.banner)
const getCarofTheMonth = () => get(collections.product.carofTheMonth)
const getAnnouncementBox = () => get(collections.utils.announcementBox)
const getMobileFooterMenu = () => get(collections.utils.mobileFooterMenu)
const getUserInfo = () => get(collections.auth.user, getConfigToken())
const getMobileHeaderMenu = () => get(collections.utils.mobileHeaderMenu)
const getMinMaxPrice = (params: string) =>
  get(collections.product.pricing + params)

// post request
const createUnverifiedLeadsNew = (body: any) =>
  post(collections.leads.unverifiedLeadNew, body)
const postRefreshToken = (body: any) => post(collections.auth.refresh, body)
const postSendSMSGeneration = (recaptchaToken: string, phoneNumber: string) =>
  post(collections.auth.otp, { recaptchaToken, phoneNumber })
const postVerifyOTPGeneration = (otpCode: string, phoneNumber: string) =>
  post(collections.auth.otpVerification, { otpCode, phoneNumber })

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
  getMobileFooterMenu,
  getMobileHeaderMenu,
  getMinMaxPrice,

  createUnverifiedLeadsNew,
  postRefreshToken,
  postSendSMSGeneration,
  postVerifyOTPGeneration,
}
