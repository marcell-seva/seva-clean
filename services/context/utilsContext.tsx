import { createContext, useContext, useState } from 'react'
import { LanguageCode } from 'utils/enum'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { useSessionStorage } from 'utils/hooks/useSessionStorage/useSessionStorage'
import { LocalStorageKey } from 'utils/enum'
import {
  MobileWebFooterMenuType,
  MobileWebTopMenuType,
} from 'utils/types/props'
import { CityOtrOption } from 'utils/types'
import { AnnouncementBoxDataType, NavbarItemResponse } from 'utils/types/utils'

export type UtilsContextType = {
  dataAnnouncementBox: AnnouncementBoxDataType | undefined
  saveDataAnnouncementBox: (data: AnnouncementBoxDataType) => void
  cities: CityOtrOption[]
  saveCities: (data: CityOtrOption[]) => void
  mobileWebTopMenus: MobileWebTopMenuType[] | []
  mobileWebFooterMenus: MobileWebFooterMenuType[] | []
  saveMobileWebTopMenus: (data: MobileWebTopMenuType[]) => void
  saveMobileWebFooterMenus: (data: MobileWebFooterMenuType[]) => void
  lastOtpSentTime: number
  setLastOtpSentTime: (value: number) => void
  currentLanguage: LanguageCode
  setCurrentLanguage: (value: LanguageCode) => void
  isSsrMobile: boolean
  dataMenu: NavbarItemResponse[]
}

export const UtilsContext = createContext<UtilsContextType | []>([])

export const UtilsContextProvider = ({ children }: any) => {
  const [cities, setCities] = useState<CityOtrOption[] | []>([])
  const [dataAnnouncementBox, setIsShowAnnouncementBox] = useState<
    AnnouncementBoxDataType | undefined
  >()
  const [mobileWebTopMenus, setMobileWebTopMenus] = useState<
    MobileWebTopMenuType[] | []
  >([])

  const [mobileWebFooterMenus, setMobileWebFooterMenus] = useState<
    MobileWebFooterMenuType[] | []
  >([])

  const [lastOtpSentTime, setLastOtpSentTime] = useSessionStorage<number>(
    LocalStorageKey.LastOtpSent,
    0,
  )

  const [currentLanguage, setCurrentLanguage] = useLocalStorage<LanguageCode>(
    LocalStorageKey.Language,
    LanguageCode.id,
  )

  const saveCities = (citiesData: CityOtrOption[]) => setCities(citiesData)
  const saveDataAnnouncementBox = (
    dataAnnouncementBox: AnnouncementBoxDataType,
  ) => setIsShowAnnouncementBox(dataAnnouncementBox)

  const saveMobileWebTopMenus = (
    mobileWebTopMenusData: MobileWebTopMenuType[],
  ) => {
    setMobileWebTopMenus(mobileWebTopMenusData)
  }

  const saveMobileWebFooterMenus = (
    mobileWebFooterMenusData: MobileWebFooterMenuType[],
  ) => {
    setMobileWebFooterMenus(mobileWebFooterMenusData)
  }

  return (
    <UtilsContext.Provider
      value={{
        dataAnnouncementBox,
        saveDataAnnouncementBox,
        cities,
        saveCities,
        mobileWebTopMenus,
        saveMobileWebTopMenus,
        mobileWebFooterMenus,
        saveMobileWebFooterMenus,
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
