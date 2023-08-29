import { LanguageCode, LocalStorageKey } from 'utils/enum'
import { useLocalStorage } from '../useLocalStorage'

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
