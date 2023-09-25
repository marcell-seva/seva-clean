import styles from '/styles/pages/index.module.scss'
import React, { useContext, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import CSAButton from 'components/atoms/floatButton/CSAButton'
import { setTrackEventMoEngageWithoutValue } from 'services/moengage'
import { EventName } from 'services/moengage/type'
import { sendAmplitudeData } from 'services/amplitude'
import { AmplitudeEventName } from 'services/amplitude/types'
import { LeadsActionParam, PageOriginationName } from 'utils/types/tracker'
import { AlephArticleCategoryType, Article, CityOtrOption } from 'utils/types'
import { COMData, COMDataTracking } from 'utils/types/models'
import { getLocalStorage } from 'utils/handler/localStorage'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import getCurrentEnvironment from 'utils/handler/getCurrentEnvironment'
import { alephArticleCategoryList } from 'utils/config/articles.config'
import { api } from 'services/api'
import { countDaysDifference } from 'utils/handler/date'
import {
  CitySelectorModal,
  CtaWidget,
  FooterMobile,
  HowToUse,
  PromoSection,
} from 'components/molecules'
import {
  LeadsFormTertiary,
  LeadsFormPrimary,
  ArticleWidget,
  SearchWidget,
  WebAnnouncementBox,
  LpSkeleton,
  MainHeroLP,
  SubProduct,
  TestimonyWidget,
  LpCarRecommendations,
  CarOfTheMonth,
} from 'components/organisms'
import { CarContext, CarContextType } from 'services/context'
import { getCity } from 'utils/hooks/useGetCity'
import { HomePageDataLocalContext } from 'pages'
import { trackLPKualifikasiKreditTopCtaClick } from 'helpers/amplitude/seva20Tracking'
import { getToken } from 'utils/handler/auth'
import { useRouter } from 'next/router'
import { multiCreditQualificationPageUrl } from 'utils/helpers/routes'
import { savePageBeforeLogin } from 'utils/loginUtils'
import { LoginModalMultiKK } from '../loginModalMultiKK'
import Seo from 'components/atoms/seo'
import { defaultSeoImage } from 'utils/helpers/const'
import { LocalStorageKey } from 'utils/enum'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'

const HomepageMobile = ({ dataReccomendation }: any) => {
  useEffect(() => {
    sendAmplitudeData(AmplitudeEventName.WEB_LANDING_PAGE_VIEW, {})
  }, [])
  const { dataCities, dataCarofTheMonth, dataMainArticle } = useContext(
    HomePageDataLocalContext,
  )
  const { saveRecommendation } = useContext(CarContext) as CarContextType
  const [openCitySelectorModal, setOpenCitySelectorModal] = useState(false)
  const [cityListApi, setCityListApi] =
    useState<Array<CityOtrOption>>(dataCities)
  const [loadLP, setLoadLP] = useState(true)
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const [isLoginModalOpened, setIsLoginModalOpened] = useState(false)
  const [carOfTheMonthData, setCarOfTheMonthData] =
    useState<COMData[]>(dataCarofTheMonth)
  const [articles, setArticles] = useState<Article[]>([])
  const [articlesTabList, setArticlesTabList] =
    useState<Article[]>(dataMainArticle)
  const [isModalOpenend, setIsModalOpened] = useState<boolean>(false)
  const [selectedCarOfTheMonth, setSelectedCarOfTheMonth] =
    useState<COMDataTracking>()
  const enableAnnouncementBoxAleph =
    getCurrentEnvironment.featureToggles.enableAnnouncementBoxAleph

  const router = useRouter()

  const {
    ref: landingPageLeadsFormSectionRef,
    inView: isLeadsFormSectionVisible,
  } = useInView({
    threshold: 0.5,
  })

  const checkCitiesData = () => {
    api.getCities().then((res: any) => {
      setCityListApi(res)
    })
  }

  const getCarOfTheMonth = async () => {
    try {
      const carofmonth: any = await api.getCarofTheMonth(
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
      const recommendation: any = await api.getRecommendation(params)
      saveRecommendation(recommendation.carRecommendations)
    } catch {
      saveRecommendation([])
    }
  }

  const getArticles = async () => {
    const response = await fetch(
      'https://www.seva.id/wp-json/foodicious/latest-posts/65',
    )
    const responseData = await response.json()
    setArticles(responseData)
    setArticlesTabList(responseData)
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

  const cleanEffect = () => {
    setLoadLP(true)
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
      sendAmplitudeData(
        AmplitudeEventName.WEB_LEADS_FORM_OPEN,
        trackLeadsLPForm(),
      )
    }
  }

  useEffect(() => {
    cityHandler()
    setTrackEventMoEngageWithoutValue(EventName.view_homepage)
    Promise.all([
      loadCarRecommendation(),
      getCarOfTheMonth(),
      checkCitiesData(),
      getArticles(),
    ]).then(() => {
      setLoadLP(false)
    })

    return () => {
      cleanEffect()
    }
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
    trackLPKualifikasiKreditTopCtaClick()
    if (!!getToken()) {
      router.push(multiCreditQualificationPageUrl)
    } else {
      savePageBeforeLogin(multiCreditQualificationPageUrl)
      setIsLoginModalOpened(true)
    }
  }

  return (
    <>
      <Seo
        title="SEVA - Beli Mobil Terbaru Dengan Cicilan Kredit Terbaik"
        description="Beli mobil terbaru dari Toyota, Daihatsu, BMW dengan Instant Approval*. Proses Aman & Mudah✅ Terintegrasi dengan ACC & TAF✅ SEVA member of ASTRA"
        image={defaultSeoImage}
      />

      <main className={styles.main}>
        {enableAnnouncementBoxAleph && (
          <WebAnnouncementBox onCloseAnnouncementBox={() => null} />
        )}

        <div className={styles.container}>
          <MainHeroLP
            onCityIconClick={() => setOpenCitySelectorModal(true)}
            onCtaClick={onClickMainHeroLP}
          />
          <SearchWidget />
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
            additionalStyle={'csa-button-homepage'}
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
