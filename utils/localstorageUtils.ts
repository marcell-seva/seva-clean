import { client } from 'utils/helpers/const'
import { LocalStorageKey } from './enum'

interface DataWithExpiry<T> {
  value: T
  expiry: number
}

export const setWithExpiry = <T>(
  key: LocalStorageKey,
  value: T,
  ttl: number,
) => {
  const item: DataWithExpiry<T> = {
    value: value,
    expiry: new Date().getTime() + ttl,
  }
  saveLocalStorage(key, JSON.stringify(item))
}

export const getWithExpiry = <T>(key: LocalStorageKey): T | null => {
  const item = getLocalStorage<DataWithExpiry<T>>(key)
  if (!item) {
    return null
  }
  const isExpired = new Date().getTime() > item.expiry

  if (isExpired) {
    localStorage.removeItem(key)
    return null
  }

  return item.value
}

export const getLocalStorage = <T>(key: LocalStorageKey): T | null => {
  const dataInLocalstorage = client ? localStorage.getItem(key) : null
  try {
    return dataInLocalstorage ? JSON.parse(dataInLocalstorage) : null
  } catch {
    return dataInLocalstorage as unknown as T
  }
}

export const saveLocalStorage = (key: LocalStorageKey, data: string) => {
  client && localStorage.setItem(key, data)
}
