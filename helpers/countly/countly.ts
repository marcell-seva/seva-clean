import Countly from 'countly-sdk-web'
import { client } from 'utils/helpers/const'
import { CountlyEventNames } from './eventNames'
import { getToken } from 'utils/handler/auth'
import { LocalStorageKey } from 'utils/enum'
import { getLocalStorage } from 'utils/handler/localStorage'
import { UtmTagsMap } from 'utils/hooks/useAddUtmTagsToApiCall/useAddUtmTagsToApiCall'

export const initCountly = () => {
  //Exposing Countly to the DOM as a global variable
  window.Countly = Countly
  Countly.init({
    app_key: 'YOUR_APP_KEY',
    url: 'YOUR_SERVER_URL',
    // session_update: 10,
    use_session_cookie: true,
    debug: true, // set true to show logged event
    // require_consent: true,
    namespace: 'seva-next',
    // inactivity_time: 1,
    offline_mode: false,
    // device_id: 'cly-device-demo-id', //Set only if you want dont want to use countly generated device_id
  })
}

const userIdValueForCountly = () => {
  if (client) {
    const tokenLocalStorage = getToken()
    if (!!tokenLocalStorage) {
      return tokenLocalStorage?.phoneNumber
    } else if (!!window?.Countly?.get_device_id()) {
      return window.Countly.get_device_id()
    } else {
      return ''
    }
  }
}

const sourceEntryValueForCountly = () => {
  // TODO @toni : use utm values as identifier (need confirmation)
  return ''
}

const initialUtmValueForCountly = () => {
  const UtmTags = getLocalStorage<UtmTagsMap>(LocalStorageKey.UtmTags)

  return {
    INITIAL_UTM_CAMPAIGN: UtmTags?.utm_campaign
      ? UtmTags?.utm_campaign
      : 'Null',
    INITIAL_UTM_CONTENT: UtmTags?.utm_content ? UtmTags?.utm_content : 'Null',
    INITIAL_UTM_ID: UtmTags?.utm_id ? UtmTags?.utm_id : 'Null',
    INITIAL_UTM_MEDIUM: UtmTags?.utm_medium ? UtmTags?.utm_medium : 'Null',
    INITIAL_UTM_SOURCE: UtmTags?.utm_source ? UtmTags?.utm_source : 'Null',
    INITIAL_UTM_TERM: UtmTags?.utm_term ? UtmTags?.utm_term : 'Null',
  }
}

const platformValueForCountly = () => {
  if (client) {
    if (window.innerWidth <= 1024) {
      return 'Web_Mobile'
    } else {
      return 'Web_Desktop'
    }
  }
}

export const trackEventCountly = (
  eventName: CountlyEventNames,
  data?: Record<string, unknown>,
) => {
  if (client) {
    const defaultSegmentationData = {
      USER_ID: userIdValueForCountly(),
      SOURCE_ENTRY: sourceEntryValueForCountly(),
      ...initialUtmValueForCountly(),
      PLATFORM: platformValueForCountly(),
      PAGE_ORIGINATION_URL: client ? window.location.href : '',
    }

    Countly.q.push([
      'add_event',
      {
        key: eventName,
        count: 1,
        segmentation: { ...defaultSegmentationData, ...data },
      },
    ])
    window.Countly = Countly
  } else {
    trackEventCountly(eventName, data)
  }
}
