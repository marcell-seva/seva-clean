import React, { createContext, useContext } from 'react'
import { LanguageCode, LocalStorageKey } from 'utils/enum'
import { useLocalStorage } from 'utils/hooks/useLocalStorage/useLocalStorage'

interface ActionContextType {
  currentLanguage: LanguageCode
  setCurrentLanguage: (value: LanguageCode) => void
}
const defaultContextValue: ActionContextType = {
  currentLanguage: LanguageCode.id,
  setCurrentLanguage: (value: LanguageCode) => {
    console.log(value)
  },
}
const CurrentLanguageContext = createContext(defaultContextValue)

export const CurrentLanguageContextProvider = ({ children }: HTMLElement) => {
  const [currentLanguage, setCurrentLanguage] = useLocalStorage<LanguageCode>(
    LocalStorageKey.Language,
    LanguageCode.id,
  )

  return (
    <CurrentLanguageContext.Provider
      value={{ currentLanguage, setCurrentLanguage }}
    >
      <>{children}</>
    </CurrentLanguageContext.Provider>
  )
}

export const useCurrentLanguageFromContext = () =>
  useContext(CurrentLanguageContext)
