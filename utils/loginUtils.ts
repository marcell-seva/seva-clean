import { LocalStorageKey } from './models/models'

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
