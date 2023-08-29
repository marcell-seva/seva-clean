import { client } from 'utils/helpers/const'
import { CountlyEventNames } from './eventNames'
import { getToken } from 'utils/handler/auth'
import { LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { getLocalStorage, saveLocalStorage } from 'utils/handler/localStorage'
import { UtmTagsMap } from 'utils/hooks/useAddUtmTagsToApiCall/useAddUtmTagsToApiCall'
import {
  getSessionStorage,
  saveSessionStorage,
} from 'utils/handler/sessionStorage'

const userIdValueForCountly = () => {
  if (client) {
    const tokenLocalStorage = getToken()
    if (!!tokenLocalStorage) {
      return tokenLocalStorage?.phoneNumber
    } else if (!!window?.Countly?.device_id) {
      return window.Countly.device_id
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
  if (client && !!window?.Countly?.q) {
    const defaultSegmentationData = {
      USER_ID: userIdValueForCountly(),
      SOURCE_ENTRY: sourceEntryValueForCountly(),
      ...initialUtmValueForCountly(),
      PLATFORM: platformValueForCountly(),
      PAGE_ORIGINATION_URL: client ? window.location.href : '',
    }

    window.Countly.q.push([
      'add_event',
      {
        key: eventName,
        count: 1,
        segmentation: { ...defaultSegmentationData, ...data },
      },
    ])

    saveLocalStorage(
      LocalStorageKey.LastHitTracker,
      new Date().getTime().toString(),
    )
  }
}

export const valueForUserTypeProperty = () => {
  const lastHitTracker = getLocalStorage<string>(LocalStorageKey.LastHitTracker)

  if (!!lastHitTracker) {
    const currentDateTime = new Date().getTime()
    const expiredDate = parseInt(lastHitTracker) + 30 * 24 * 60 * 60 * 1000 // 30 days
    const isExceedOneMonth = currentDateTime > expiredDate
    if (isExceedOneMonth) {
      return 'New'
    } else {
      return 'Returning'
    }
  } else {
    return 'New'
  }
}

export const valueForInitialPageProperty = () => {
  const hasOpenSevaBefore = getSessionStorage(
    SessionStorageKey.HasOpenSevaBefore,
  )

  if (!hasOpenSevaBefore) {
    saveSessionStorage(SessionStorageKey.HasOpenSevaBefore, 'true')
    return 'Yes'
  } else {
    return 'No'
  }
}

export const valueMenuTabCategory = () => {
  if (client) {
    const url = window.location.href.toLocaleLowerCase()
    if (url.includes('spesifikasi')) {
      return 'Spesifikasi'
    } else if (url.includes('harga')) {
      return 'Harga'
    } else if (url.includes('kredit')) {
      return 'Kredit'
    } else {
      return 'Ringkasan'
    }
  } else {
    return ''
  }
}
