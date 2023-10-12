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
import { CitySelectorModal, FooterMobile } from 'components/molecules'
import {
  ArticleWidget,
  WebAnnouncementBox,
  LeadsFormAdaOTOdiSEVA,
  AdaOTOdiSEVALeadsForm,
  HeaderMobile,
  LpCarRecommendations,
  TestimonyWidget,
} from 'components/organisms'
import { CarContext, CarContextType } from 'services/context'
import { getCity } from 'utils/hooks/useGetCity'
import { HomePageDataLocalContext } from 'pages'
import { getToken } from 'utils/handler/auth'
import { useRouter } from 'next/router'
import { LoginModalMultiKK } from '../loginModalMultiKK'
import Seo from 'components/atoms/seo'
import { defaultSeoImage } from 'utils/helpers/const'
import { LocalStorageKey, SessionStorageKey } from 'utils/enum'
import Banner from '/public/revamp/images/banner/adaOTOdiSEVABanner.png'
import Image from 'next/image'
import styles from 'styles/components/organisms/homepageAdaOTOdiSEVA.module.scss'
import { getSessionStorage } from 'utils/handler/sessionStorage'
import { useUtils } from 'services/context/utilsContext'
import { Button, IconCross } from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import logoOTO from '/public/revamp/images/logo/logo-oto.webp'
import logoSEVA from '/public/revamp/images/logo/seva-header.png'
import supergraphic from '/public/revamp/illustration/supergraphic-crop.webp'

const HomepageAdaSEVAdiOTO = ({ dataReccomendation }: any) => {
  useEffect(() => {
    sendAmplitudeData(AmplitudeEventName.WEB_LANDING_PAGE_VIEW, {})
  }, [])
  const { dataCities, dataCarofTheMonth, dataMainArticle } = useContext(
    HomePageDataLocalContext,
  )
  const { saveDataAnnouncementBox } = useUtils()
  const [isActive, setIsActive] = useState(false)
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
  const [articles, setArticles] = useState<Article[]>([])
  const [articlesTabList, setArticlesTabList] =
    useState<Article[]>(dataMainArticle)
  const [isModalOpenend, setIsModalOpened] = useState<boolean>(false)
  const enableAnnouncementBoxAleph =
    getCurrentEnvironment.featureToggles.enableAnnouncementBoxAleph

  const router = useRouter()

  const [showAnnouncementBox, setShowAnnouncementBox] = useState<
    boolean | null
  >(
    getSessionStorage(
      getToken()
        ? SessionStorageKey.ShowWebAnnouncementLogin
        : SessionStorageKey.ShowWebAnnouncementNonLogin,
    ) ?? true,
  )
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
  const getAnnouncementBox = () => {
    try {
      const res: any = api.getAnnouncementBox({
        headers: {
          'is-login': getToken() ? 'true' : 'false',
        },
      })
      saveDataAnnouncementBox(res.data)
      setShowAnnouncementBox(res.data !== undefined)
    } catch (error) {}
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
    if (cityOtr === null || !isIn30DaysInterval) {
      setOpenCitySelectorModal(true)
    }
  }

  const closeLeadsForm = () => {
    setIsModalOpened(false)
  }

  const showLeadsForm = () => {
    setIsModalOpened(true)
  }

  useEffect(() => {
    cityHandler()
    setTrackEventMoEngageWithoutValue(EventName.view_homepage)
    Promise.all([
      loadCarRecommendation(),
      checkCitiesData(),
      getArticles(),
    ]).then(() => {
      setLoadLP(false)
    })
  }, [])
  const trackLeadsLPForm = (): LeadsActionParam => {
    return {
      Page_Origination: PageOriginationName.LPFloatingIcon,
      ...(cityOtr && { City: cityOtr.cityName }),
    }
  }

  const InformationSection: React.FC<any> = (): JSX.Element => {
    const label =
      'Kerjasama kami untuk lorem ipsum dolor sit amet sit amet dolor sit amet blabla lorem ipsum'
    return (
      <div className={styles.information}>
        <Image
          src={supergraphic}
          alt="seva x oto supergraphic "
          className={styles.supergraphicInformation}
        />
        <div className={styles.informationFront}>
          <div className={styles.bundleLogoInformation}>
            <Image
              src={logoSEVA}
              alt="seva main logo"
              className={styles.logoSeva}
            />
            <IconCross width={12} height={12} color="#05256E" />
            <Image src={logoOTO} alt="seva x oto" className={styles.logoOto} />
          </div>
          <h3 className={styles.informationText}>{label}</h3>
        </div>
      </div>
    )
  }

  useEffect(() => {
    getAnnouncementBox()
  }, [])

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
          <HeaderMobile
            isActive={isActive}
            setIsActive={setIsActive}
            style={{
              position: 'fixed',
            }}
            emitClickCityIcon={() => setOpenCitySelectorModal(true)}
            setShowAnnouncementBox={setShowAnnouncementBox}
            isShowAnnouncementBox={showAnnouncementBox}
            isOTO={true}
            isRegular={false}
          />
          <div className={styles.banner}>
            <Image
              src={Banner}
              alt="Ada OTO di SEVA"
              className={styles.bannerImage}
            />
            <div className={styles.buttonBanner}>
              <Button
                secondaryClassName={styles.button}
                version={ButtonVersion.PrimaryDarkBlue}
                size={ButtonSize.Big}
                onClick={showLeadsForm}
              >
                Saya Tertarik
              </Button>
            </div>
          </div>
          <div className={styles.line} />
          <LpCarRecommendations
            dataReccomendation={dataReccomendation}
            onClickOpenCityModal={() => setOpenCitySelectorModal(true)}
            isOTO={true}
          />

          <InformationSection />
          <div
            ref={landingPageLeadsFormSectionRef}
            id="landing-page-leads-form-section"
          >
            <LeadsFormAdaOTOdiSEVA />
          </div>
          <TestimonyWidget />
          <ArticleWidget
            articles={articles}
            onClickCategory={(value: string) => onClickCategory(value)}
            articlesTabList={articlesTabList}
          />
          <FooterMobile />
        </div>
        <CitySelectorModal
          isOpen={openCitySelectorModal}
          onClickCloseButton={() => setOpenCitySelectorModal(false)}
          cityListFromApi={cityListApi}
        />
        {isModalOpenend && <AdaOTOdiSEVALeadsForm onCancel={closeLeadsForm} />}

        <CSAButton onClick={showLeadsForm} />

        {isLoginModalOpened && (
          <LoginModalMultiKK onCancel={() => setIsLoginModalOpened(false)} />
        )}
      </main>
    </>
  )
}

export default HomepageAdaSEVAdiOTO
