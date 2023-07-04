import { Token } from 'utils/types'
import { getLocalStorage } from '../localStorage'
import { LocalStorageKey } from 'utils/types/models'

export const getToken = (): Token | null => {
  return getLocalStorage<Token>(LocalStorageKey.Token)
}
