import { LocalStorageKey } from 'utils/enum'
import { waitingCreditQualificationUrl } from './helpers/routes'

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

export const restrictedAutoNavigationRoutes = [waitingCreditQualificationUrl]

export const isGoingToRestrictedRoutes = (route: string) => {
  return restrictedAutoNavigationRoutes.includes(route)
}
