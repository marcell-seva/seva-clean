import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { getConfig, attach } from 'retry-axios'
import endpoints, { shouldCheckAuth } from '../helpers/endpoints'

import createAuthRefreshInterceptor, {
  AxiosAuthRefreshRequestConfig,
} from 'axios-auth-refresh'
import environments from '../helpers/environments'
import { Token } from './types'
import { ErrorCode, HTTPResponseStatusCode, LocalStorageKey } from './enum'
import { removeInformationWhenLogout } from './logoutUtils'
import { UTMTagsData } from './types/utils'
import { getToken } from './handler/auth'
import { getLocalStorage, saveLocalStorage } from './handler/localStorage'

const TIMEOUT_IN_MILLISECONDS = 20 * 1000

class APIService {
  constructor() {
    this.init()
  }
  init() {
    axios.defaults.baseURL = environments.apiBaseUrl
    axios.defaults.timeout = TIMEOUT_IN_MILLISECONDS

    axios.defaults.raxConfig = {
      retry: 1,
      statusCodesToRetry: [[500, 599]],
      httpMethodsToRetry: ['GET', 'POST'],
      onRetryAttempt: (err: AxiosError) => {
        const cfg = getConfig(err)
        throw new Error(`Retry attempt #${cfg?.currentRetryAttempt}`)
      },
    }

    axios.interceptors.request.use(
      (request) => {
        const url = request.url
        const idToken = getToken()?.idToken
        if (url && shouldCheckAuth(url) && idToken) {
          request.headers.Authorization = idToken
        }
        return request
      },
      (error) => Promise.reject(error),
    )
    axios.interceptors.request.use(
      (request) => {
        const headers = request.headers
        const utmTags = getLocalStorage<UTMTagsData>(LocalStorageKey.UtmTags)
        request.headers = { ...headers, ...utmTags }
        return request
      },
      (error) => Promise.reject(error),
    )

    createAuthRefreshInterceptor(axios, this.refreshAuthLogic, {
      statusCodes: [HTTPResponseStatusCode.Unauthorized],
      pauseInstanceWhileRefreshing: true,
      interceptNetworkError: false,
      retryInstance: axios,
      onRetry: (config) => {
        return {
          ...config,
          headers: { ...config.headers, Authorization: getToken()?.idToken },
        }
      },
    })

    attach()
  }

  refreshAuthLogic = async () => {
    try {
      const refreshToken = getToken()?.refreshToken ?? ''
      const response = await this.post(
        endpoints.refreshToken,
        { refreshToken },
        {
          skipAuthRefresh: true,
        } as AxiosAuthRefreshRequestConfig,
      )
      saveLocalStorage(LocalStorageKey.Token, JSON.stringify(response.data))
      return Promise.resolve()
    } catch (error: any) {
      removeInformationWhenLogout()
      // showLogoutModal()
      return Promise.reject({
        ...error,
        response: {
          status: HTTPResponseStatusCode.Unauthorized,
          data: {
            code: ErrorCode.AUTHENTICATION_FAILED,
            message: 'Failed to refresh token',
          },
        },
      })
    }
  }

  get(url: string, config?: AxiosRequestConfig) {
    return axios.get(url, config)
  }

  post(
    url: string,
    data: Record<string, unknown>,
    config?: AxiosRequestConfig,
  ) {
    return axios.post(url, data, config)
  }
}

export const API = new APIService()
