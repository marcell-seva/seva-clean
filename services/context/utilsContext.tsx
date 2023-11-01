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
import {
  AnnouncementBoxDataType,
  ArticleData,
  CarRecommendation,
  NavbarItemResponse,
  SalesAgent,
} from 'utils/types/utils'

export type UtilsContextType = {
  dataAnnouncementBox: AnnouncementBoxDataType | undefined
  saveDataAnnouncementBox: (data: AnnouncementBoxDataType | undefined) => void
  cities: CityOtrOption[]
  saveCities: (data: CityOtrOption[]) => void
  agent: SalesAgent[]
  saveAgent: (data: SalesAgent[]) => void
  articles: ArticleData[]
  saveArticles: (data: ArticleData[]) => void
  mobileWebTopMenus: MobileWebTopMenuType[] | []
  mobileWebFooterMenus: MobileWebFooterMenuType[] | []
  saveMobileWebTopMenus: (data: MobileWebTopMenuType[] | []) => void
  saveMobileWebFooterMenus: (data: MobileWebFooterMenuType[] | []) => void
  lastOtpSentTime: number
  setLastOtpSentTime: (value: number) => void
  currentLanguage: LanguageCode
  setCurrentLanguage: (value: LanguageCode) => void
  isSsrMobile: boolean
  dekstopWebTopMenu: NavbarItemResponse[]
  saveDesktopWebTopMenu: (data: NavbarItemResponse[] | []) => void
  dataLeads: CarRecommendation | undefined
  saveDataLeads: (data: CarRecommendation) => void
  dataVariantLeads: string | undefined
  saveDataVariantLeads: (data: string) => void
}

export const UtilsContext = createContext<UtilsContextType | []>([])

export const UtilsContextProvider = ({ children }: any) => {
  const [cities, setCities] = useState<CityOtrOption[] | []>([])
  const [agent, setAgent] = useState<SalesAgent[] | []>([])
  const [articles, setArticles] = useState<ArticleData[] | []>([])
  const [dataLeads, setDataLeads] = useState<CarRecommendation | undefined>()
  const [dataVariantLeads, setDataVariantLeads] = useState<string | undefined>()
  const [dataAnnouncementBox, setIsShowAnnouncementBox] = useState<
    AnnouncementBoxDataType | undefined
  >()
  const [mobileWebTopMenus, setMobileWebTopMenus] = useState<
    MobileWebTopMenuType[] | []
  >([])

  const [dekstopWebTopMenu, setDesktopWebTopMenu] = useState<
    NavbarItemResponse[] | []
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

  const saveCities = (citiesData: CityOtrOption[] | []) => setCities(citiesData)

  const saveDataLeads = (leadsData: CarRecommendation | undefined) =>
    setDataLeads(leadsData)

  const saveDataVariantLeads = (leadsVariantData: string | undefined) =>
    setDataVariantLeads(leadsVariantData)

  const saveAgent = (agentData: SalesAgent[] | []) => setAgent(agentData)

  const saveArticles = (articlesData: ArticleData[] | []) =>
    setArticles(articlesData)

  const saveDataAnnouncementBox = (
    dataAnnouncementBox: AnnouncementBoxDataType | undefined,
  ) => setIsShowAnnouncementBox(dataAnnouncementBox)

  const saveMobileWebTopMenus = (
    mobileWebTopMenusData: MobileWebTopMenuType[],
  ) => {
    setMobileWebTopMenus(mobileWebTopMenusData)
  }

  const saveMobileWebFooterMenus = (
    mobileWebFooterMenusData: MobileWebFooterMenuType[] | [],
  ) => {
    setMobileWebFooterMenus(mobileWebFooterMenusData)
  }

  const saveDesktopWebTopMenu = (
    desktopWebTopMenu: NavbarItemResponse[] | [],
  ) => {
    setDesktopWebTopMenu(desktopWebTopMenu)
  }

  return (
    <UtilsContext.Provider
      value={{
        dataAnnouncementBox,
        saveDataAnnouncementBox,
        cities,
        saveCities,
        agent,
        saveAgent,
        articles,
        saveArticles,
        mobileWebTopMenus,
        saveMobileWebTopMenus,
        mobileWebFooterMenus,
        saveMobileWebFooterMenus,
        lastOtpSentTime,
        setLastOtpSentTime,
        currentLanguage,
        setCurrentLanguage,
        isSsrMobile: false,
        dekstopWebTopMenu,
        saveDesktopWebTopMenu,
        dataLeads,
        saveDataLeads,
        dataVariantLeads,
        saveDataVariantLeads,
      }}
    >
      {children}
    </UtilsContext.Provider>
  )
}

export const useUtils = () => useContext(UtilsContext) as UtilsContextType
