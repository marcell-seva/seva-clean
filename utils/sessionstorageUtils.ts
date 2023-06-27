import { client } from 'const/const'
import { SessionStorageKey } from './enum'

export const saveSessionStorage = (key: SessionStorageKey, data: string) => {
  client && sessionStorage.setItem(key, data)
}

export const getSessionStorage = <T>(key: SessionStorageKey): T | null => {
  const dataInSessionstorage = client ? sessionStorage.getItem(key) : null
  try {
    return dataInSessionstorage ? JSON.parse(dataInSessionstorage) : null
  } catch {
    return dataInSessionstorage as unknown as T
  }
}
