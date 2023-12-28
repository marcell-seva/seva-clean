import React, { useEffect, useState } from 'react'
import { useUtils } from 'services/context/utilsContext'
import {
  ArticleWidget,
  BannerDealerLP,
  DealerArticleWidget,
  DealerBrands,
  DealerSearchWidget,
  HeaderMobile,
  LeadsFormTertiary,
  LpCarRecommendations,
} from 'components/organisms'
import { CitySelectorModal, FooterMobile } from 'components/molecules'
import styles from 'styles/pages/dealer.module.scss'
import { CSAButton, CardShadow } from 'components/atoms'
import { useCar } from 'services/context/carContext'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { AlephArticleCategoryType, Article, CityOtrOption } from 'utils/types'
import { LocalStorageKey } from 'utils/enum'
import { getLocalStorage } from 'utils/handler/localStorage'
import { countDaysDifference } from 'utils/handler/date'
import { useInView } from 'react-intersection-observer'
import { alephArticleCategoryList } from 'config/articles.config'

const Dealer = ({ dataRecommendation }: any) => {
  const { saveRecommendation } = useCar()
  const { mobileWebTopMenus, cities, articles } = useUtils()
  const [showSidebar, setShowSidebar] = useState(false)
  const [openCitySelectorModal, setOpenCitySelectorModal] = useState(false)
  const [articlesTabList, setArticlesTabList] = useState<Article[]>(articles)
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const {
    ref: landingPageLeadsFormSectionRef,
    inView: isLeadsFormSectionVisible,
  } = useInView({
    threshold: 0.5,
  })

  const getTabList = async () => {
    const url = alephArticleCategoryList[2].url
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

  useEffect(() => {
    getTabList()
    cityHandler()
  }, [])

  useEffect(() => {
    setArticlesTabList(articles)
  }, [articles])

  // const loadCarRecommendation = async () => {
  //   try {
  //     const params = `?city=${getCity().cityCode}&cityId=${getCity().id}`
  //     const recommendation: any = await getRecommendation(params)
  //     saveRecommendation(recommendation.carRecommendations)
  //   } catch {
  //     saveRecommendation(dataRecomendation)
  //   }
  // }
  // useEffect(() => {
  //   if (ssr !== 'success') {
  //     loadCarRecommendation()
  //   } else {
  //     saveRecommendation(dataRecomendation)
  //   }
  // }, [])

  const scrollToLeadsForm = () => {
    const destinationElm = document.getElementById(
      'landing-page-leads-form-section',
    )
    if (destinationElm) {
      destinationElm.scrollIntoView({
        inline: 'center',
        block: 'center',
        behavior: 'smooth',
      })
    }
  }

  return (
    <div className={styles.container}>
      <HeaderMobile
        isActive={showSidebar}
        setIsActive={setShowSidebar}
        emitClickCityIcon={() => setOpenCitySelectorModal(true)}
      />
      <BannerDealerLP />
      <DealerBrands />
      {/* <div className={styles.searchContainer}>
        <CardShadow
          className={clsx({
            [styles.cardContainer]: true,
          })}
        >
          <DealerSearchWidget />
        </CardShadow>
      </div> */}
      {/* <LpCarRecommendations
        dataReccomendation={dataRecommendation}
        onClickOpenCityModal={() => setOpenCitySelectorModal(true)}
      /> */}

      <div
        ref={landingPageLeadsFormSectionRef}
        id="landing-page-leads-form-section"
      >
        <LeadsFormTertiary />
      </div>
      <DealerArticleWidget articlesTabList={articlesTabList} />
      <FooterMobile />
      <CitySelectorModal
        isOpen={openCitySelectorModal}
        onClickCloseButton={() => {
          setOpenCitySelectorModal(false)
        }}
        cityListFromApi={cities}
      />
      {!isLeadsFormSectionVisible && (
        <CSAButton
          onClick={scrollToLeadsForm}
          additionalstyle={'csa-button-homepage'}
        />
      )}
    </div>
  )
}

export default Dealer
