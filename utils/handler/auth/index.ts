import { LocalStorageKey } from 'utils/enum'
import { Token } from 'utils/types'
import { getLocalStorage } from '../localStorage'

export const getToken = (isUsingTempToken?: boolean): Token | null => {
  return getLocalStorage<Token>(
    isUsingTempToken ? LocalStorageKey.TempToken : LocalStorageKey.Token,
  )
}

export const getPageBeforeLogin = () => {
  return localStorage.getItem(LocalStorageKey.PageBeforeLogin)
}

export const savePageBeforeLogin = (page: string) => {
  localStorage.setItem(LocalStorageKey.PageBeforeLogin, page)
}

export const getPageBeforeLoginExternal = () => {
  return localStorage.getItem(LocalStorageKey.PageBeforeLoginExternal)
}

export const savePageBeforeLoginExternal = (page: string) => {
  localStorage.setItem(LocalStorageKey.PageBeforeLoginExternal, page)
}
