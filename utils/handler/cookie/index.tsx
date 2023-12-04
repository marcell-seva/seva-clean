import { CookieKey } from 'utils/enum'
import { client } from 'utils/helpers/const'

export const getCookie = (key: CookieKey) => {
  if (client) {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${key}=`)
    if (parts.length === 2) return parts?.pop()?.split(';').shift()
  } else {
    return null
  }
}

export const saveCookie = (key: CookieKey, value: string) => {
  if (client) {
    document.cookie = `${key}=${value}`
  } else {
    return null
  }
}

export const deleteCookie = (key: CookieKey) => {
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}
