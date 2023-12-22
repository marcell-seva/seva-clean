import { SessionStorageKey } from 'utils/enum'
import { client } from 'utils/helpers/const'

export const saveSessionStorage = (key: SessionStorageKey, data: string) => {
  if (client) sessionStorage.setItem(key, data)
}

export const getSessionStorage = <T>(key: SessionStorageKey): T | null => {
  if (client) {
    const dataInSessionstorage = window.sessionStorage.getItem(key)
    try {
      return dataInSessionstorage ? JSON.parse(dataInSessionstorage) : null
    } catch {
      return dataInSessionstorage as unknown as T
    }
  } else return null
}

export const removeSessionStorage = (key: SessionStorageKey) => {
  if (client) sessionStorage.removeItem(key)
}
