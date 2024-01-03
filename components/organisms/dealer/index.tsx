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
import {
  CitySelectorModal,
  DealerCarousel,
  DealerLocationWidget,
  FooterMobile,
  Info,
} from 'components/molecules'
import styles from 'styles/pages/dealer.module.scss'
import { CSAButton, CardShadow, Gap } from 'components/atoms'
import { useCar } from 'services/context/carContext'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { Article, CityOtrOption } from 'utils/types'
import { LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { getLocalStorage } from 'utils/handler/localStorage'
import { countDaysDifference } from 'utils/handler/date'
import { useInView } from 'react-intersection-observer'
import { alephArticleCategoryList } from 'config/articles.config'
import { getAnnouncementBox as gab, getRecommendation } from 'services/api'
import { getSessionStorage } from 'utils/handler/sessionStorage'
import { getToken } from 'utils/handler/auth'
import { useAnnouncementBoxContext } from 'services/context/announcementBoxContext'
import { delayedExec } from 'utils/handler/delayed'
import clsx from 'clsx'
import { Faq } from 'components/molecules/section/faq'
import { useRouter } from 'next/router'
import { capitalizeFirstLetter, capitalizeWords } from 'utils/stringUtils'
import { getSeoFooterTextDescription } from 'utils/config/carVariantList.config'
import { getCity } from 'utils/hooks/useGetCity'

const Dealer = ({ dataRecommendation, ssr, page }: any) => {
  const router = useRouter()
  const getUrlBrand = router.query.brand?.toString() ?? ''
  const getUrlLocation =
    router.query.location?.toString().replace('-', ' ') ?? 'Indonesia'
  const { saveRecommendation } = useCar()
  const {
    mobileWebTopMenus,
    cities,
    dealerArticles,
    dataAnnouncementBox,
    dealerBrand,
  } = useUtils()
  const [showDealerBrand] = useState(page === 'main' ? true : false)
  const [startScroll, setStartScroll] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [openCitySelectorModal, setOpenCitySelectorModal] = useState(false)
  const [articlesTabList, setArticlesTabList] =
    useState<Article[]>(dealerArticles)
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const { showAnnouncementBox, saveShowAnnouncementBox } =
    useAnnouncementBoxContext()
  const {
    ref: landingPageLeadsFormSectionRef,
    inView: isLeadsFormSectionVisible,
  } = useInView({
    threshold: 0.5,
  })

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

  const getAnnouncementBox = () => {
    if (dataAnnouncementBox) {
      const isShowAnnouncement = getSessionStorage(
        getToken()
          ? SessionStorageKey.ShowWebAnnouncementLogin
          : SessionStorageKey.ShowWebAnnouncementNonLogin,
      )
      if (typeof isShowAnnouncement !== 'undefined') {
        saveShowAnnouncementBox(isShowAnnouncement as boolean)
      } else {
        saveShowAnnouncementBox(true)
      }
    } else {
      saveShowAnnouncementBox(false)
    }
  }

  useEffect(() => {
    cityHandler()
    getAnnouncementBox()
  }, [])

  useEffect(() => {
    setArticlesTabList(dealerArticles)
  }, [dealerArticles])

  const loadCarRecommendation = async () => {
    try {
      const params = `?city=${getCity().cityCode}&cityId=${getCity().id}`
      const recommendation: any = await getRecommendation(params)
      saveRecommendation(recommendation.carRecommendations)
    } catch {
      saveRecommendation(dataRecommendation)
    }
  }
  useEffect(() => {
    if (ssr !== 'success') {
      loadCarRecommendation()
    } else {
      saveRecommendation(dataRecommendation)
    }
  }, [])

  const scrollToLeadsForm = () => {
    const destinationElm = document.getElementById(
      'landing-page-leads-form-section',
    )
    if (destinationElm) {
      destinationElm.scrollIntoView({
        inline: 'start',
        block: 'start',
        behavior: 'smooth',
      })
    }
  }

  const getInfoText = (): string => {
    return `Toyota Raize adalah mobil dengan 5 Kursi SUV yang tersedia dalam kisaran harga Rp 233 - 306 juta di Indonesia. Mobil ini tersedia dalam 12 pilihan warna, 10 tipe mobil, dan 2 opsi transmisi: Manual dan Otomatis di Indonesia. Mobil ini memiliki dimensi sebagai berikut: 3995 mm L x 1695 mm W x 1620 mm H. Cicilan kredit mobil Toyota Raize dimulai dari Rp 6.16 juta selama 60 bulan.`
  }

  const listFaqMain = [
    {
      question: 'Ada berapa banyak dealer di Indonesia?',
      answer:
        'Cicilan / kredit bulanan terendah untuk Toyota Raize dimulai dari Rp314,9 juta untuk 60 bulan dengan DP Rp31,5 juta.',
    },
    {
      question: 'Apakah dealer menawarkan layanan pinjaman?',
      answer:
        'Cicilan / kredit bulanan terendah untuk Toyota Raize dimulai dari Rp314,9 juta untuk 60 bulan dengan DP Rp31,5 juta.',
    },
    {
      question: 'Apakah dealer memiliki service center?',
      answer:
        'Cicilan / kredit bulanan terendah untuk Toyota Raize dimulai dari Rp314,9 juta untuk 60 bulan dengan DP Rp31,5 juta.',
    },
  ]

  const listFaqBrand = [
    {
      question: 'Ada berapa banyak dealer Toyota di Indonesia?',
      answer:
        'Cicilan / kredit bulanan terendah untuk Toyota Raize dimulai dari Rp314,9 juta untuk 60 bulan dengan DP Rp31,5 juta.',
    },
    {
      question: 'Apakah dealer Toyota menawarkan layanan pinjaman?',
      answer:
        'Cicilan / kredit bulanan terendah untuk Toyota Raize dimulai dari Rp314,9 juta untuk 60 bulan dengan DP Rp31,5 juta.',
    },
    {
      question: 'Apakah dealer Toyota memiliki service center?',
      answer:
        'Cicilan / kredit bulanan terendah untuk Toyota Raize dimulai dari Rp314,9 juta untuk 60 bulan dengan DP Rp31,5 juta.',
    },
  ]

  const renderCarouselWidget = () => {
    switch (page) {
      case 'main':
        return <DealerBrands />
      case 'brand':
        return (
          <DealerCarousel
            items={dealerBrand}
            brand={
              getUrlBrand !== 'bmw'
                ? capitalizeFirstLetter(getUrlBrand)
                : getUrlBrand.toUpperCase()
            }
          />
        )
      case 'location':
        return <DealerLocationWidget />

      default:
        return <DealerBrands />
    }
  }

  return (
    <div
      className={clsx({
        [styles.container]: true,
        [styles.showAAnnouncementBox]: showAnnouncementBox,
      })}
    >
      <HeaderMobile
        startScroll={startScroll}
        isActive={showSidebar}
        setIsActive={setShowSidebar}
        emitClickCityIcon={() => setOpenCitySelectorModal(true)}
        setShowAnnouncementBox={saveShowAnnouncementBox}
        isShowAnnouncementBox={showAnnouncementBox}
      />
      <BannerDealerLP onPage={page} />
      {renderCarouselWidget()}
      <LpCarRecommendations
        dataReccomendation={dataRecommendation}
        onClickOpenCityModal={() => setOpenCitySelectorModal(true)}
      />
      <div className={styles.infoWrapper}>
        <Faq
          isWithIcon
          headingText={
            page === 'main'
              ? `Apa yang Orang Tanyakan tentang Dealer Mobil di Indonesia`
              : `Apa yang Orang Tanyakan tentang Dealer ${
                  getUrlBrand !== 'bmw'
                    ? capitalizeFirstLetter(getUrlBrand)
                    : getUrlBrand.toUpperCase()
                } di ${capitalizeWords(getUrlLocation)}`
          }
          descText={page === 'main' ? listFaqMain : listFaqBrand}
        />
      </div>
      {/* <div className={styles.searchContainer}>
        <CardShadow
          className={clsx({
            [styles.cardContainer]: true,
          })}
        >
          <DealerSearchWidget />
        </CardShadow>
      </div> */}

      <div
        ref={landingPageLeadsFormSectionRef}
        id="landing-page-leads-form-section"
      >
        <LeadsFormTertiary />
      </div>
      <DealerArticleWidget />
      <div className={styles.infoWrapper}>
        <Info isWithIcon headingText="Tentang Mobil" descText={getInfoText()} />
        <Gap height={24} />
        <Info
          headingText={`Membeli Mobil ${
            getUrlBrand !== 'bmw'
              ? capitalizeFirstLetter(getUrlBrand)
              : getUrlBrand.toUpperCase()
          }? Seperti Ini Cara Perawatannya!`}
          descText={getSeoFooterTextDescription(getUrlBrand)}
          isUsingSetInnerHtmlDescText={true}
        />
      </div>
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
