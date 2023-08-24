import { setAmplitudeUserProperties } from 'services/amplitude'
import { QueryKeys } from 'utils/types/models'

export type UTMProps = {
  [QueryKeys.UtmSource]: string
  [QueryKeys.UtmMedium]: string
  [QueryKeys.UtmCampaign]: string
  [QueryKeys.UtmId]: string
  [QueryKeys.UtmContent]: string
  [QueryKeys.AdSet]: string
  [QueryKeys.UtmTerm]: string
}

export const setUtmTagsAsUserProperties = (utmTags: UTMProps) => {
  setAmplitudeUserProperties(utmTags)
}
