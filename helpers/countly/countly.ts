import Countly from 'countly-sdk-web'
import { client } from 'utils/helpers/const'
import { CountlyEventNames } from './eventNames'

export const initCountly = () => {
  //Exposing Countly to the DOM as a global variable
  window.Countly = Countly
  Countly.init({
    app_key: 'YOUR_APP_KEY',
    url: 'YOUR_SERVER_URL',
    // session_update: 10,
    use_session_cookie: true,
    debug: false, // set true to show logged event
    // require_consent: true,
    namespace: 'seva-next',
    // inactivity_time: 1,
    offline_mode: false,
    // device_id: "cly-device-demo-id" //Set only if you want dont want to use countly generated device_id
  })
}

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
