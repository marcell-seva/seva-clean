import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { getLocalStorage } from 'utils/handler/localStorage'
import { LocalStorageKey } from 'utils/types/models'
import { UTMTagsData } from 'utils/types/props'

const UTMTags = getLocalStorage<UTMTagsData>(LocalStorageKey.UtmTags)
const post = (path: string, data: any, config?: AxiosRequestConfig) => {
  const utm = {
    utmSource: UTMTags?.utm_source,
    utmMedium: UTMTags?.utm_medium,
    utmCampaign: UTMTags?.utm_campaign,
    utmId: UTMTags?.utm_id,
    utmContent: null, // temporary
    utmTerm: UTMTags?.utm_term,
    adSet: UTMTags?.adset,
  }
  data = { ...data, utm }
  const promise: Promise<void> = new Promise((resolve, reject) => {
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
