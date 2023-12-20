import styles from '/styles/pages/index.module.scss'
import React, { useContext, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import CSAButton from 'components/atoms/floatButton/CSAButton'
import { setTrackEventMoEngageWithoutValue } from 'services/moengage'
import { EventName } from 'services/moengage/type'
import { LeadsActionParam, PageOriginationName } from 'utils/types/tracker'
import { AlephArticleCategoryType, Article, CityOtrOption } from 'utils/types'
import { COMData, COMDataTracking } from 'utils/types/models'
import { getLocalStorage } from 'utils/handler/localStorage'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import getCurrentEnvironment from 'utils/handler/getCurrentEnvironment'
import { alephArticleCategoryList } from 'utils/config/articles.config'
import { countDaysDifference } from 'utils/handler/date'
import {
  CtaWidget,
  FooterMobile,
  HowToUse,
  NavigationTabV1,
  NavigationTabV2,
  PromoSection,
} from 'components/molecules'
import {
  LeadsFormTertiary,
  ArticleWidget,
  SearchWidget,
  WebAnnouncementBox,
  MainHeroLP,
  SubProduct,
  TestimonyWidget,
  LpCarRecommendations,
  CarOfTheMonth,
  SearchWidgetSection,
} from 'components/organisms'
import { getCity } from 'utils/hooks/useGetCity'
import { HomePageDataLocalContext } from 'pages'
import { getToken } from 'utils/handler/auth'
import { useRouter } from 'next/router'
import { multiCreditQualificationPageUrl } from 'utils/helpers/routes'
import { savePageBeforeLogin } from 'utils/loginUtils'
import Seo from 'components/atoms/seo'
import { defaultSeoImage } from 'utils/helpers/const'
import { LocalStorageKey, SessionStorageKey } from 'utils/enum'
import {
  trackEventCountly,
  valueForUserTypeProperty,
  valueForInitialPageProperty,
} from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import {
  getSessionStorage,
  removeSessionStorage,
  saveSessionStorage,
} from 'utils/handler/sessionStorage'
import { RouteName } from 'utils/navigate'
import { getCustomerInfoSeva } from 'utils/handler/customer'
import { useAnnouncementBoxContext } from 'services/context/announcementBoxContext'
import { useUtils } from 'services/context/utilsContext'
import { useCar } from 'services/context/carContext'
import { useAfterInteractive } from 'utils/hooks/useAfterInteractive'
import dynamic from 'next/dynamic'
import { getCarofTheMonth, getCities, getRecommendation } from 'services/api'

const CitySelectorModal = dynamic(
  () => import('components/molecules').then((mod) => mod.CitySelectorModal),
  { ssr: false },
)

const LeadsFormPrimary = dynamic(
  () => import('components/organisms').then((mod) => mod.LeadsFormPrimary),
  { ssr: false },
)

const LoginModalMultiKK = dynamic(
  () =>
    import('components/organisms/loginModalMultiKK').then(
      (mod) => mod.LoginModalMultiKK,
    ),
  { ssr: false },
)

const HomepageMobile = ({ dataReccomendation, ssr }: any) => {
  const { dataCities, dataCarofTheMonth } = useContext(HomePageDataLocalContext)
  const { saveRecommendation } = useCar()
  const [openCitySelectorModal, setOpenCitySelectorModal] = useState(false)
  const [cityListApi, setCityListApi] =
    useState<Array<CityOtrOption>>(dataCities)
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const [selectedTab, setSelectedTab] = useState('')
  const [isLoginModalOpened, setIsLoginModalOpened] = useState(false)
  const [carOfTheMonthData, setCarOfTheMonthData] =
    useState<COMData[]>(dataCarofTheMonth)
  const { articles } = useUtils()
  const [articlesTabList, setArticlesTabList] = useState<Article[]>(articles)
  const [isModalOpenend, setIsModalOpened] = useState<boolean>(false)
  const [selectedCarOfTheMonth, setSelectedCarOfTheMonth] =
    useState<COMDataTracking>()
  const enableAnnouncementBoxAleph =
    getCurrentEnvironment.featureToggles.enableAnnouncementBoxAleph

  useEffect(() => {
    setArticlesTabList(articles)
  }, [articles])

  const router = useRouter()

  const {
    ref: landingPageLeadsFormSectionRef,
    inView: isLeadsFormSectionVisible,
  } = useInView({
    threshold: 0.5,
  })
  const [isSentCountlyPageView, setIsSentCountlyPageView] = useState(false)
  const [sourceButton, setSourceButton] = useState('Null')
  const { dataAnnouncementBox } = useUtils()
  const { saveShowAnnouncementBox } = useAnnouncementBoxContext()

  const checkCitiesData = () => {
    getCities().then((res: any) => {
      setCityListApi(res)
    })
  }

  const getCarOfTheMonth = async () => {
    try {
      const carofmonth: any = await getCarofTheMonth(
        '?city=' + getCity().cityCode,
      )

      setCarOfTheMonthData(carofmonth.data)
    } catch (e: any) {
      throw new Error(e)
    }
  }

  const loadCarRecommendation = async () => {
    try {
      const params = `?city=${getCity().cityCode}&cityId=${getCity().id}`
      const recommendation: any = await getRecommendation(params)
      saveRecommendation(recommendation.carRecommendations)
    } catch {
      saveRecommendation(dataReccomendation)
    }
  }

  const onClickCategory = async (value: string) => {
    const url = alephArticleCategoryList.find(
      (cat: AlephArticleCategoryType) => cat.value === value,
    )?.url
    if (url) {
      const response = await fetch(url)
      const responseData = await response.json()
      setArticlesTabList(responseData)
    }
  }
  const isIn30DaysInterval = () => {
    const lastTimeSelectCity = getLocalStorage<string>(
      LocalStorageKey.LastTimeSelectCity,
    )
    if (!lastTimeSelectCity) {
      return false
    } else if (
      countDaysDifference(lastTimeSelectCity, new Date().toISOString()) <= 30
    ) {
      return true
    } else {
      return false
    }
  }

  const cityHandler = async () => {
    if (!cityOtr && !isIn30DaysInterval()) {
      setOpenCitySelectorModal(true)
    }
  }

  const cleanEffect = (timeout: NodeJS.Timeout) => {
    clearTimeout(timeout)
  }

  const closeLeadsForm = () => {
    setIsModalOpened(false)
  }

  const scrollToLeadsForm = () => {
    const destinationElm = document.getElementById(
      'landing-page-leads-form-section',
    )
    if (destinationElm) {
      destinationElm.scrollIntoView({
        inline: 'center',
        block: 'center',
      })

      trackEventCountly(CountlyEventNames.WEB_LEADS_FORM_BUTTON_CLICK, {
        PAGE_ORIGINATION: 'Homepage - Floating Icon',
      })
    }
  }

  const trackCountlyPageView = async () => {
    const pageReferrer = getSessionStorage(
      SessionStorageKey.PageReferrerHomepage,
    )
    const previousSourceButton = getSessionStorage(
      SessionStorageKey.PreviousSourceButtonHomepage,
    )
    const referralCodeFromUrl: string | null = getLocalStorage(
      LocalStorageKey.referralTemanSeva,
    )

    let temanSevaStatus = 'No'
    if (referralCodeFromUrl) {
      temanSevaStatus = 'Yes'
    } else if (!!getToken()) {
      const response = await getCustomerInfoSeva()
      if (response[0].temanSevaTrxCode) {
        temanSevaStatus = 'Yes'
      }
    }

    if (!!window?.Countly?.q) {
      trackEventCountly(CountlyEventNames.WEB_HOMEPAGE_VIEW, {
        PAGE_REFERRER: pageReferrer ?? 'Null',
        PREVIOUS_SOURCE_BUTTON: previousSourceButton ?? 'Null',
        USER_TYPE: valueForUserTypeProperty(),
        INITIAL_PAGE: pageReferrer ? 'No' : valueForInitialPageProperty(),
        TEMAN_SEVA_STATUS: temanSevaStatus,
      })

      setIsSentCountlyPageView(true)
      removeSessionStorage(SessionStorageKey.PageReferrerHomepage)
      removeSessionStorage(SessionStorageKey.PreviousSourceButtonHomepage)
    }
  }

  const getAnnouncementBox = () => {
    if (dataAnnouncementBox) {
      const isShowAnnouncement = getSessionStorage(
        getToken()
          ? SessionStorageKey.ShowWebAnnouncementLogin
          : SessionStorageKey.ShowWebAnnouncementNonLogin,
      )
      if (typeof isShowAnnouncement !== 'undefined') {
        saveShowAnnouncementBox(Boolean(isShowAnnouncement))
      } else {
        saveShowAnnouncementBox(true)
      }
    } else {
      saveShowAnnouncementBox(false)
    }
  }

  useEffect(() => {
    if (getCity().cityCode !== 'jakarta' || ssr === 'failed') {
      loadCarRecommendation()
      getCarOfTheMonth()
      checkCitiesData()
    } else {
      saveRecommendation(dataReccomendation)
    }
  }, [])

  useAfterInteractive(() => {
    getAnnouncementBox()
  }, [dataAnnouncementBox])

  useAfterInteractive(() => {
    cityHandler()
    setTrackEventMoEngageWithoutValue(EventName.view_homepage)
    setTimeout(() => {
      const timeoutCountlyTracker = setTimeout(() => {
        if (!isSentCountlyPageView) {
          trackCountlyPageView()
        }
      }, 1000)
    })
  }, [])

  const trackLeadsLPForm = (): LeadsActionParam => {
    return {
      Page_Origination: PageOriginationName.LPFloatingIcon,
      ...(cityOtr && { City: cityOtr.cityName }),
    }
  }
  const trackLeadsCotm = (): LeadsActionParam => {
    return {
      Page_Origination: PageOriginationName.COTMLeadsForm,
      ...(cityOtr && { City: cityOtr.cityName }),
      Car_Brand: selectedCarOfTheMonth?.Car_Brand,
      Car_Model: selectedCarOfTheMonth?.Car_Model,
    }
  }

  const onClickMainHeroLP = () => {
    saveSessionStorage(SessionStorageKey.PageReferrerMultiKK, 'Homepage')
    trackEventCountly(
      CountlyEventNames.WEB_HOMEPAGE_CHECK_CREDIT_QUALIFICATION_CLICK,
      {
        SOURCE_SECTION: 'Upper section',
        LOGIN_STATUS: !!getToken() ? 'Yes' : 'No',
      },
    )
    if (!!getToken()) {
      window.location.href = multiCreditQualificationPageUrl
    } else {
      savePageBeforeLogin(multiCreditQualificationPageUrl)
      setIsLoginModalOpened(true)
    }
  }

  const onSelectLowerTab = (value: string) => {
    setSelectedTab(value)
  }

  return (
    <>
      <Seo
        title="SEVA - Beli Mobil Baru Dengan Cicilan Kredit Terbaik"
        description={`Beli mobil baru Toyota, Daihatsu, Isuzu, BMW, Peugeot ${new Date().getFullYear()} secara kredit dengan Instant Approval di SEVA. Proses Aman & Mudah Terintegrasi dengan ACC & TAF. SEVA member of ASTRA`}
        image={defaultSeoImage}
      />

      <main className={styles.main}>
        {enableAnnouncementBoxAleph && (
          <WebAnnouncementBox
            onCloseAnnouncementBox={() => null}
            pageOrigination="Homepage"
          />
        )}

        <div className={styles.container}>
          <MainHeroLP
            onCityIconClick={() => {
              setOpenCitySelectorModal(true)
              setSourceButton('Location Icon (Navbar)')
            }}
            onCtaClick={onClickMainHeroLP}
            passCountlyTrackerPageView={trackCountlyPageView}
          />
          <SearchWidgetSection
            isShowAnnouncementBox={false}
            onChangeTab={(value: string) => {
              onSelectLowerTab(value)
            }}
          />
          <div className={styles.line} />
          <PromoSection onPage={'Homepage'} />
          <LpCarRecommendations
            dataReccomendation={dataReccomendation}
            onClickOpenCityModal={() => setOpenCitySelectorModal(true)}
          />
          <HowToUse />
          <CarOfTheMonth
            carOfTheMonthData={carOfTheMonthData}
            onSendOffer={() => {
              setIsModalOpened(true)
              trackEventCountly(CountlyEventNames.WEB_LEADS_FORM_BUTTON_CLICK, {
                PAGE_ORIGINATION: 'Homepage - Car of The Month',
              })
            }}
            cityOtr={cityOtr}
            setSelectedCarOfTheMonth={setSelectedCarOfTheMonth}
          />
          <div
            ref={landingPageLeadsFormSectionRef}
            id="landing-page-leads-form-section"
          >
            <LeadsFormTertiary />
          </div>
          <SubProduct />
          <TestimonyWidget />
          <ArticleWidget
            articles={articles}
            onClickCategory={(value: string) => onClickCategory(value)}
            articlesTabList={articlesTabList}
          />
          <CtaWidget />
          <FooterMobile />
        </div>
        <CitySelectorModal
          isOpen={openCitySelectorModal}
          onClickCloseButton={() => setOpenCitySelectorModal(false)}
          cityListFromApi={cityListApi}
          pageOrigination={RouteName.Homepage}
          sourceButton={sourceButton}
        />
        {isModalOpenend && (
          <LeadsFormPrimary
            onCancel={closeLeadsForm}
            onPage={'LP'}
            trackerProperties={trackLeadsCotm()}
          />
        )}
        {!isLeadsFormSectionVisible && (
          <CSAButton
            onClick={scrollToLeadsForm}
            additionalstyle={'csa-button-homepage'}
          />
        )}

        {isLoginModalOpened && (
          <LoginModalMultiKK onCancel={() => setIsLoginModalOpened(false)} />
        )}
      </main>
    </>
  )
}

export default HomepageMobile
