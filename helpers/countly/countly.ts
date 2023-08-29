import { client } from 'utils/helpers/const'
import { CountlyEventNames } from './eventNames'

const defaultSegmentationData = {
  // USER_ID: 'test user id',
  PAGE_ORIGINATION_URL: client ? window.location.href : '',
  // other default property (SEVA-5379)
}

export const trackEventCountly = (
  eventName: CountlyEventNames,
  data?: Record<string, unknown>,
) => {
  window.Countly.q.push([
    'add_event',
    {
      key: eventName,
      count: 1,
      segmentation: { ...defaultSegmentationData, ...data },
    },
  ])
}
