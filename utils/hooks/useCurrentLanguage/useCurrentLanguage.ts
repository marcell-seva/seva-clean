import { useLocalStorage } from '../useLocalStorage/useLocalStorage'
import { LanguageCode, LocalStorageKey } from '../../models/models'

export const useCurrentLanguage = () => {
  const [language, setLanguage] = useLocalStorage(LocalStorageKey.Language, '')
  let currentLanguage
  if (!!language) {
    currentLanguage = language
  } else {
    currentLanguage = LanguageCode.id
  }
  return [currentLanguage, setLanguage]
}
