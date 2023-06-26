import { SessionStorageKey } from './enum'

export const saveSessionStorage = (key: SessionStorageKey, data: string) => {
  sessionStorage.setItem(key, data)
}

export const getSessionStorage = <T>(key: SessionStorageKey): T | null => {
  const dataInSessionstorage = sessionStorage.getItem(key)
  try {
    return dataInSessionstorage ? JSON.parse(dataInSessionstorage) : null
  } catch {
    return dataInSessionstorage as unknown as T
  }
}
