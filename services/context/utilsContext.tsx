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
  BrandList,
  CarModelDetailsResponse,
  CarRecommendation,
  DealerBrand,
  DealerBrandLocation,
  NavbarItemResponse,
  SalesAgent,
  SearchUsedCar,
} from 'utils/types/utils'

export type UtilsContextType = {
  dataAnnouncementBox: AnnouncementBoxDataType | undefined
  saveDataAnnouncementBox: (data: AnnouncementBoxDataType | undefined) => void
  cities: CityOtrOption[]
  saveCities: (data: CityOtrOption[]) => void
  city: CityOtrOption | undefined
  saveCity: (data: CityOtrOption) => void
  agent: SalesAgent[]
  saveAgent: (data: SalesAgent[]) => void
  brand: BrandList[]
  saveBrand: (data: BrandList[]) => void
  articles: ArticleData[]
  saveArticles: (data: ArticleData[]) => void
  dealerArticles: ArticleData[]
  saveDealerArticles: (data: ArticleData[]) => void
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
  dataSearchUsedCar: SearchUsedCar[] | []
  saveDataSearchUsedCar: (data: SearchUsedCar[] | []) => void
  combination: CarModelDetailsResponse | null
  saveDataCombination: (data: CarModelDetailsResponse | null) => void
  dealerBrand: DealerBrand[]
  saveDealerBrand: (data: DealerBrand[]) => void
  dealerBrandLocation: DealerBrandLocation[]
  saveDealerBrandLocation: (data: DealerBrandLocation[]) => void
}

export const UtilsContext = createContext<UtilsContextType | []>([])

export const UtilsContextProvider = ({ children }: any) => {
  const [cities, setCities] = useState<CityOtrOption[] | []>([])
  const [dataSearchUsedCar, setDataSearchUsedCar] = useState<
    SearchUsedCar[] | []
  >([])
  const [city, setCity] = useState<CityOtrOption | undefined>()
  const [articles, setArticles] = useState<ArticleData[] | []>([])
  const [dealerArticles, setDealerArticles] = useState<ArticleData[] | []>([])
  const [agent, setAgent] = useState<SalesAgent[] | []>([])
  const [brand, setBrand] = useState<BrandList[] | []>([])
  const [dealerBrand, setDealerBrand] = useState<DealerBrand[] | []>([])
  const [dealerBrandLocation, setDealerBrandLocation] = useState<
    DealerBrandLocation[] | []
  >([])
  const [combination, setCombination] =
    useState<CarModelDetailsResponse | null>(null)
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
  const saveDataSearchUsedCar = (searchData: SearchUsedCar[] | []) =>
    setDataSearchUsedCar(searchData)

  const saveCity = (cityData: CityOtrOption | undefined) => setCity(cityData)

  const saveDataLeads = (leadsData: CarRecommendation | undefined) =>
    setDataLeads(leadsData)

  const saveDataVariantLeads = (leadsVariantData: string | undefined) =>
    setDataVariantLeads(leadsVariantData)

  const saveAgent = (agentData: SalesAgent[] | []) => setAgent(agentData)

  const saveBrand = (brandData: BrandList[] | []) => setBrand(brandData)

  const saveDealerBrand = (dealerBrandData: DealerBrand[] | []) =>
    setDealerBrand(dealerBrandData)

  const saveDealerBrandLocation = (
    dealerBrandLocationData: DealerBrandLocation[] | [],
  ) => setDealerBrandLocation(dealerBrandLocationData)

  const saveDataCombination = (
    combinationData: CarModelDetailsResponse | null,
  ) => setCombination(combinationData)

  const saveArticles = (articlesData: ArticleData[] | []) =>
    setArticles(articlesData)

  const saveDealerArticles = (dealerArticlesData: ArticleData[] | []) =>
    setDealerArticles(dealerArticlesData)

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
        city,
        saveCity,
        agent,
        saveAgent,
        brand,
        saveBrand,
        articles,
        saveArticles,
        dealerArticles,
        saveDealerArticles,
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
        dataSearchUsedCar,
        saveDataSearchUsedCar,
        combination,
        saveDataCombination,
        dealerBrand,
        saveDealerBrand,
        dealerBrandLocation,
        saveDealerBrandLocation,
      }}
    >
      {children}
    </UtilsContext.Provider>
  )
}

export const useUtils = () => useContext(UtilsContext) as UtilsContextType
