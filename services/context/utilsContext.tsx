import { createContext, useState } from 'react'
import { useSessionStorage } from 'utils/hooks/useSessionStorage/useSessionStorage'
import { LocalStorageKey } from 'utils/types/models'
import { MobileWebTopMenuType } from 'utils/types/props'

export type UtilsContextType = {
  mobileWebTopMenus: MobileWebTopMenuType[] | []
  saveMobileWebTopMenus: (data: MobileWebTopMenuType[]) => void
  lastOtpSentTime: number
  setLastOtpSentTime: (value: number) => void
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
      }}
    >
      {children}
    </UtilsContext.Provider>
  )
}
