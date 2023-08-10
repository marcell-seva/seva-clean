import { createContext, useContext, useState } from 'react'
import { LanguageCode } from 'utils/enum'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { useSessionStorage } from 'utils/hooks/useSessionStorage/useSessionStorage'
import { LocalStorageKey } from 'utils/types/models'
import { MobileWebTopMenuType } from 'utils/types/props'
import { NavbarItemResponse } from 'utils/types/utils'

export type UtilsContextType = {
  mobileWebTopMenus: MobileWebTopMenuType[] | []
  saveMobileWebTopMenus: (data: MobileWebTopMenuType[]) => void
  lastOtpSentTime: number
  setLastOtpSentTime: (value: number) => void
  currentLanguage: LanguageCode
  setCurrentLanguage: (value: LanguageCode) => void
  isSsrMobile: boolean
  dataMenu: NavbarItemResponse[]
}

export const UtilsContext = createContext<UtilsContextType | []>([])

export const UtilsContextProvider = ({ children }: any) => {
  const [mobileWebTopMenus, setMobileWebTopMenus] = useState<
    MobileWebTopMenuType[] | []
  >([])

  const [lastOtpSentTime, setLastOtpSentTime] = useSessionStorage<number>(
    LocalStorageKey.LastOtpSent,
    0,
  )

  const [currentLanguage, setCurrentLanguage] = useLocalStorage<LanguageCode>(
    LocalStorageKey.Language,
    LanguageCode.id,
  )

  const saveMobileWebTopMenus = (
    mobileWebTopMenusData: MobileWebTopMenuType[],
  ) => setMobileWebTopMenus(mobileWebTopMenusData)

  return (
    <UtilsContext.Provider
      value={{
        mobileWebTopMenus,
        saveMobileWebTopMenus,
        lastOtpSentTime,
        setLastOtpSentTime,
        currentLanguage,
        setCurrentLanguage,
        isSsrMobile: false,
        dataMenu: [],
      }}
    >
      {children}
    </UtilsContext.Provider>
  )
}

export const useUtils = () => useContext(UtilsContext) as UtilsContextType
