import React, { useContext, useEffect, useState } from 'react'
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
import { countDaysDifference, monthId } from 'utils/handler/date'
import { useInView } from 'react-intersection-observer'
import { alephArticleCategoryList } from 'config/articles.config'
import {
  getAnnouncementBox as gab,
  getDealer,
  getRecommendation,
} from 'services/api'
import { getSessionStorage } from 'utils/handler/sessionStorage'
import { getToken } from 'utils/handler/auth'
import { useAnnouncementBoxContext } from 'services/context/announcementBoxContext'
import { delayedExec } from 'utils/handler/delayed'
import clsx from 'clsx'
import { Faq } from 'components/molecules/section/faq'
import { useRouter } from 'next/router'
import { capitalizeFirstLetter, capitalizeWords } from 'utils/stringUtils'
import {
  getSeoFooterDealerTextDescription,
  getSeoFooterTextDescription,
} from 'utils/config/carVariantList.config'
import { SearchWidgetContext, SearchWidgetContextType } from 'services/context'
import { getCity } from 'utils/hooks/useGetCity'
import { DealerBrand } from 'utils/types/utils'

const Dealer = ({ dataRecommendation, ssr, page, dealerCount }: any) => {
  const todayDate = new Date()
  const currentMonth = monthId(todayDate.getMonth())
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
  const { funnelWidget, saveFunnelWidget } = useContext(
    SearchWidgetContext,
  ) as SearchWidgetContextType
  const [dealerCityList, setDealerCityList] = useState([])
  const [startScroll, setStartScroll] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [openCitySelectorModal, setOpenCitySelectorModal] = useState(false)
  const [selectedCityId, setSelectedCityId] = useState<number>()
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
    if (getUrlLocation !== '' || 'Indonesia') {
      getDealer(
        `?brand=${
          getUrlBrand === 'bmw'
            ? getUrlBrand.toUpperCase()
            : capitalizeWords(getUrlBrand)
        }`,
      ).then((res: any) => {
        const temp = res.data.find(
          (item: DealerBrand) =>
            item.cityName.replace(/ /g, '-').toLocaleLowerCase() ===
            getUrlLocation.replace(/ /g, '-').toLocaleLowerCase(),
        )
        setSelectedCityId(temp?.cityId)
      })
    }
  }, [getUrlLocation])

  useEffect(() => {
    cityHandler()

    getAnnouncementBox()
    if (getUrlBrand !== '' && getUrlLocation) {
      saveFunnelWidget({
        ...funnelWidget,
        brand: getUrlBrand.split(' '),
        city: getUrlLocation,
      })
    }
  }, [])

  useEffect(() => {
    setArticlesTabList(dealerArticles)
  }, [dealerArticles])

  useEffect(() => {
    if (getUrlBrand !== '') {
      getDealer(
        `?brand=${
          getUrlBrand === 'bmw'
            ? getUrlBrand.toUpperCase()
            : capitalizeWords(getUrlBrand)
        }`,
      ).then((res: any) => {
        setDealerCityList(res.data)
      })
    }
  }, [getUrlBrand])

  const loadCarRecommendation = async () => {
    try {
      const params =
        page !== 'main'
          ? `?brand=${
              getUrlBrand !== 'bmw'
                ? capitalizeFirstLetter(getUrlBrand)
                : getUrlBrand.toUpperCase()
            }&city=${getCity().cityCode}&cityId=${getCity().id}`
          : `?city=${getCity().cityCode}&cityId=${getCity().id}`
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
    if (page === 'main') {
      saveFunnelWidget({ ...funnelWidget, dealerBrand: '', city: '' })
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

  const getInfoTitle = () => {
    if (page === 'main') {
      return 'Dealer & Showroom Mobil SEVA : Pilihan Terbaik untuk Pembelian Mobil Baru'
    } else if (page === 'brand') {
      return `Dealer ${
        getUrlBrand !== 'bmw'
          ? capitalizeFirstLetter(getUrlBrand)
          : getUrlBrand.toUpperCase()
      }: Pilihan Terbaik untuk Pembelian Mobil Baru ${
        getUrlBrand !== 'bmw'
          ? capitalizeFirstLetter(getUrlBrand)
          : getUrlBrand.toUpperCase()
      }`
    } else {
      return `Auto 2000 ${
        getUrlBrand !== 'bmw'
          ? capitalizeFirstLetter(getUrlBrand)
          : getUrlBrand.toUpperCase()
      } ${capitalizeWords(
        getUrlLocation,
      )}: Pilihan Terbaik untuk Pembelian Mobil Baru ${
        getUrlBrand !== 'bmw'
          ? capitalizeFirstLetter(getUrlBrand)
          : getUrlBrand.toUpperCase()
      }`
    }
  }

  const listFaqMain = [
    {
      question: `Ada berapa banyak dealer atau showroom mobil ${
        page === 'main'
          ? ''
          : getUrlBrand !== 'bmw'
          ? capitalizeFirstLetter(getUrlBrand)
          : getUrlBrand.toUpperCase()
      } yang ada di ${
        page === 'main'
          ? 'SEVA'
          : page === 'brand'
          ? 'SEVA'
          : capitalizeWords(getUrlLocation)
      }?`,
      answer: `Terdapat ${dealerCount?.dealerCount} dealer mobil ${
        page === 'main'
          ? ''
          : getUrlBrand !== 'bmw'
          ? capitalizeFirstLetter(getUrlBrand)
          : getUrlBrand.toUpperCase()
      } di SEVA dan tersebar di ${
        page === 'main'
          ? 'Indonesia'
          : page === 'brand'
          ? 'Indonesia'
          : capitalizeWords(getUrlLocation)
      }.`,
    },
    {
      question: `Apakah ada promo diskon di dealer atau showroom mobil ${
        page === 'main'
          ? ''
          : getUrlBrand !== 'bmw'
          ? capitalizeFirstLetter(getUrlBrand)
          : getUrlBrand.toUpperCase()
      } ${
        page === 'main'
          ? ''
          : page === 'brand'
          ? ''
          : ` di ${capitalizeWords(getUrlLocation)}`
      } yang dikelola oleh SEVA?`,
      answer: `Sebagian besar dealer atau showroom ${
        page === 'main'
          ? ''
          : getUrlBrand !== 'bmw'
          ? capitalizeFirstLetter(getUrlBrand)
          : getUrlBrand.toUpperCase()
      } ${
        page === 'main'
          ? ''
          : page === 'brand'
          ? ''
          : ` di ${capitalizeWords(getUrlLocation)}`
      } yang bekerjasama dengan SEVA memberikan promo diskon mobil ${
        page === 'main'
          ? ''
          : getUrlBrand !== 'bmw'
          ? capitalizeFirstLetter(getUrlBrand)
          : getUrlBrand.toUpperCase()
      }.`,
    },
    {
      question: `Apakah dealer atau showroom mobil ${
        page === 'main'
          ? ''
          : getUrlBrand !== 'bmw'
          ? capitalizeFirstLetter(getUrlBrand)
          : getUrlBrand.toUpperCase()
      } ${
        page === 'main'
          ? ''
          : page === 'brand'
          ? ''
          : ` di ${capitalizeWords(getUrlLocation)}`
      } memiliki service center?`,
      answer: `Beberapa dealer atau showroom mobil ${
        page === 'main'
          ? ''
          : getUrlBrand !== 'bmw'
          ? capitalizeFirstLetter(getUrlBrand)
          : getUrlBrand.toUpperCase()
      } ${
        page === 'main'
          ? ''
          : page === 'brand'
          ? ''
          : ` di ${capitalizeWords(getUrlLocation)}`
      } memiliki layanan service untuk kendaraan, tetapi sebagian besar diler memiliki pusat layanan terpisah.`,
    },
    {
      question: `Bagaimana cara memilih dealer mobil ${
        page === 'main'
          ? ''
          : getUrlBrand !== 'bmw'
          ? capitalizeFirstLetter(getUrlBrand)
          : getUrlBrand.toUpperCase()
      } yang terpercaya ${
        page === 'main'
          ? ''
          : page === 'brand'
          ? ''
          : ` di ${capitalizeWords(getUrlLocation)}`
      }?`,
      answer: `Anda dapat memilih dealer mobil ${
        page === 'main'
          ? ''
          : getUrlBrand !== 'bmw'
          ? capitalizeFirstLetter(getUrlBrand)
          : getUrlBrand.toUpperCase()
      } ${
        page === 'main'
          ? ''
          : page === 'brand'
          ? ''
          : ` di ${capitalizeWords(getUrlLocation)}`
      } yang terpercaya melalui SEVA, karena dealer atau showroom mobil kami sudah terverifikasi.`,
    },
    {
      question: `Adakah program asuransi yang ditawarkan oleh dealer mobil ${
        page === 'main'
          ? ''
          : getUrlBrand !== 'bmw'
          ? capitalizeFirstLetter(getUrlBrand)
          : getUrlBrand.toUpperCase()
      } ${
        page === 'main'
          ? ''
          : page === 'brand'
          ? ''
          : ` di ${capitalizeWords(getUrlLocation)}`
      } untuk pembelian baru?`,
      answer: `Ya ada, setiap pembelian mobil ${
        page === 'main'
          ? ''
          : getUrlBrand !== 'bmw'
          ? capitalizeFirstLetter(getUrlBrand)
          : getUrlBrand.toUpperCase()
      } ${
        page === 'main'
          ? ''
          : page === 'brand'
          ? ''
          : ` di ${capitalizeWords(getUrlLocation)}`
      } baru di dealer atau showroom mobil di SEVA, sudah termasuk dengan Asuransi mobil.`,
    },
    {
      question: `Apakah ada promo atau diskon khusus untuk pembelian mobil ${
        page === 'main'
          ? ''
          : getUrlBrand !== 'bmw'
          ? capitalizeFirstLetter(getUrlBrand)
          : getUrlBrand.toUpperCase()
      } di bulan ${currentMonth} ${todayDate.getFullYear()} ini ${
        page === 'main'
          ? ''
          : page === 'brand'
          ? ''
          : ` di dealer ${
              getUrlBrand !== 'bmw'
                ? capitalizeFirstLetter(getUrlBrand)
                : getUrlBrand.toUpperCase()
            } ${capitalizeWords(getUrlLocation)}`
      }?`,
      answer: `Di dealer atau showroom ${
        page === 'main'
          ? ''
          : getUrlBrand !== 'bmw'
          ? capitalizeFirstLetter(getUrlBrand)
          : getUrlBrand.toUpperCase()
      } ${
        page === 'main'
          ? ''
          : page === 'brand'
          ? ''
          : ` ${capitalizeWords(getUrlLocation)}`
      } kami, selalu memberikan promo atau diskon khusus untuk para konsumen setia SEVA.`,
    },
    {
      question: `Bagaimana proses pengajuan kredit atau cicilan untuk membeli mobil ${
        page === 'main'
          ? ''
          : getUrlBrand !== 'bmw'
          ? capitalizeFirstLetter(getUrlBrand)
          : getUrlBrand.toUpperCase()
      } di dealer atau showroom ${
        page === 'main'
          ? ''
          : page === 'brand'
          ? ''
          : ` di ${capitalizeWords(getUrlLocation)}`
      }?`,
      answer: `Untuk pengajuan kredit mobil ${
        page === 'main'
          ? ''
          : getUrlBrand !== 'bmw'
          ? capitalizeFirstLetter(getUrlBrand)
          : getUrlBrand.toUpperCase()
      } ${
        page === 'main'
          ? ''
          : page === 'brand'
          ? ''
          : ` di ${capitalizeWords(getUrlLocation)}`
      } dan estimasi cicilan, bisa anda akses di calculator kredit seva. Dan sales kami akan membantu anda dalam proses kredit mobil.`,
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
            items={dealerCityList}
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
      <div className={styles.searchContainer}>
        <CardShadow
          className={clsx({
            [styles.cardContainer]: true,
          })}
          defaultChecked
        >
          <DealerSearchWidget cityList={dealerCityList} onPage={page} />
        </CardShadow>
      </div>
      <Gap height={24} />
      {renderCarouselWidget()}
      <LpCarRecommendations
        dataReccomendation={dataRecommendation}
        page={page}
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
          descText={listFaqMain}
        />
      </div>

      <div
        ref={landingPageLeadsFormSectionRef}
        id="landing-page-leads-form-section"
      >
        <LeadsFormTertiary
          isDealer={true}
          onPage={page}
          cityId={selectedCityId}
        />
      </div>
      <DealerArticleWidget />
      <div className={styles.infoWrapper}>
        <Info
          isWithIcon
          headingText={getInfoTitle()}
          descText={getSeoFooterDealerTextDescription(
            page,
            getUrlBrand,
            dealerCount,
            getUrlLocation,
          )}
          isUsingSetInnerHtmlDescText={true}
        />
        <Gap height={24} />
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
