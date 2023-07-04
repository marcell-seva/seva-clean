import { LocalStorageKey } from 'utils/models/models'

export const savePageBeforeLogin = (page: string) => {
  localStorage.setItem(LocalStorageKey.PageBeforeLogin, page)
}
