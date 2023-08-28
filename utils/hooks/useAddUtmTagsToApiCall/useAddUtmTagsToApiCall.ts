import { useEffect } from 'react'
import { useQuery } from '../useQuery'
import { QueryKeys, UTMTags } from 'utils/types/models'
import { useLocalStorage } from '../useLocalStorage'
import { LocalStorageKey } from 'utils/enum'
import {
  UTMProps,
  setUtmTagsAsUserProperties,
} from 'helpers/amplitude/trackingUserProperties'

export type UtmTagsMap = { [key in UTMTags]: string | null }
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

    setUtmTagsAsUserProperties(localUtmTagsMap)
    setUtmTagsMap(localUtmTagsMap)
  }, [])
}
