import { SessionStorageKey } from 'utils/enum'

export const saveSessionStorage = (key: SessionStorageKey, data: string) => {
  if (window) sessionStorage.setItem(key, data)
}

export const getSessionStorage = <T>(key: SessionStorageKey): T | null => {
  if (typeof window !== 'undefined') {
    const dataInSessionstorage = window.sessionStorage.getItem(key)
    try {
      return dataInSessionstorage ? JSON.parse(dataInSessionstorage) : null
    } catch {
      return dataInSessionstorage as unknown as T
    }
  } else return null
}

export const removeSessionStorage = (key: SessionStorageKey) => {
  if (window) sessionStorage.removeItem(key)
}
