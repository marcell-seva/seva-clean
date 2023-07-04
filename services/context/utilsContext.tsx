import { createContext, useState } from 'react'
import { MobileWebTopMenuType } from 'utils/types/props'

export type UtilsContextType = {
  mobileWebTopMenus: MobileWebTopMenuType[] | []
  saveMobileWebTopMenus: (data: MobileWebTopMenuType[]) => void
}

export const UtilsContext = createContext<UtilsContextType | []>([])

export const UtilsContextProvider = ({ children }: any) => {
  const [mobileWebTopMenus, setMobileWebTopMenus] = useState<
    MobileWebTopMenuType[] | []
  >([])

  const saveMobileWebTopMenus = (
    mobileWebTopMenusData: MobileWebTopMenuType[],
  ) => setMobileWebTopMenus(mobileWebTopMenusData)

  return (
    <UtilsContext.Provider
      value={{
        mobileWebTopMenus,
        saveMobileWebTopMenus,
      }}
    >
      {children}
    </UtilsContext.Provider>
  )
}
