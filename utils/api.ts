import { LocalStorageKey } from './enum'
import { getLocalStorage } from './localstorageUtils'
import { Token } from './types/context'

export const getToken = (): Token | null => {
  return getLocalStorage<Token>(LocalStorageKey.Token)
}
