import endpoints from 'helpers/endpoints'
import { API } from 'utils/api'
import { LocalStorageKey } from 'utils/enum'
import { getLocalStorage } from 'utils/localstorageUtils'
import { CreateUnverifiedLeadRequestNew, UTMTagsData } from 'utils/types/utils'

export const createUnverifiedLeadNew = (
  requestBody: CreateUnverifiedLeadRequestNew,
) => {
  const UTMTags = getLocalStorage<UTMTagsData>(LocalStorageKey.UtmTags)
  return API.post(endpoints.unverifiedLeadNew, {
    ...requestBody,
    utmSource: UTMTags?.utm_source,
    utmMedium: UTMTags?.utm_medium,
    utmCampaign: UTMTags?.utm_campaign,
    utmId: UTMTags?.utm_id,
    utmContent: null, // temporary
    utmTerm: UTMTags?.utm_term,
    adSet: UTMTags?.adset,
  })
}
