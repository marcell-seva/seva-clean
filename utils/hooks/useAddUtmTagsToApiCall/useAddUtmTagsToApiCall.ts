import { useEffect } from 'react'
import { useQuery } from '../useQuery'
import { QueryKeys, UTMTags } from 'utils/types/models'
import { useLocalStorage } from '../useLocalStorage'
import { LocalStorageKey } from 'utils/enum'
import {
  UTMProps,
  setUtmTagsAsUserProperties,
} from 'helpers/amplitude/trackingUserProperties'
import { getLocalStorage, saveLocalStorage } from 'utils/handler/localStorage'
import { isEmptyObject } from 'utils/objectUtils'

export type UtmTagsMap = { [key in UTMTags]: string | null }

const isUtmExpired = () => {
  let isExpired

  const lastTimeUpdateUtm = getLocalStorage<string>(
    LocalStorageKey.LastTimeUpdateUtm,
  )

  if (!!lastTimeUpdateUtm) {
    const currentDateTime = new Date().getTime()
    const expiredDate = parseInt(lastTimeUpdateUtm) + 11 * 24 * 60 * 60 * 1000 // 11 days
    isExpired = currentDateTime > expiredDate
  } else {
    isExpired = false
  }

  return isExpired
}

export const useAddUtmTagsToApiCall = () => {
  const defaultUtmTagsMap = {
    [UTMTags.UtmId]: null,
    [UTMTags.UtmTerm]: null,
    [UTMTags.UtmCampaign]: null,
    [UTMTags.UtmSource]: null,
    [UTMTags.UtmContent]: null,
    [UTMTags.UtmMedium]: null,
    [UTMTags.Adset]: null,
  }
  const [utmTagsMap, setUtmTagsMap] = useLocalStorage<UtmTagsMap | null>(
    LocalStorageKey.UtmTags,
    defaultUtmTagsMap,
  )
  const {
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_id,
    utm_term,
    adset,
  }: UTMProps = useQuery([
    QueryKeys.UtmSource,
    QueryKeys.UtmMedium,
    QueryKeys.UtmCampaign,
    QueryKeys.UtmId,
    QueryKeys.UtmContent,
    QueryKeys.UtmTerm,
    QueryKeys.AdSet,
  ])
  useEffect(() => {
    const localUtmTagsMap = {
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_id,
      utm_term,
      adset,
    }

    const isEmptyUtmTagsFromQuery = isEmptyObject(localUtmTagsMap)
    const isEmptyUtmTagsInLocalStorage = isEmptyObject(utmTagsMap)

    if (
      isEmptyUtmTagsInLocalStorage ||
      (!isEmptyUtmTagsInLocalStorage && !isEmptyUtmTagsFromQuery) ||
      isUtmExpired()
    ) {
      setUtmTagsAsUserProperties(localUtmTagsMap)
      setUtmTagsMap(localUtmTagsMap)
      saveLocalStorage(
        LocalStorageKey.LastTimeUpdateUtm,
        new Date().getTime().toString(),
      )
    }
  }, [])
}
