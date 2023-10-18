import React, { useContext, useEffect, useRef, useState } from 'react'
import { NavigationTabV2 } from 'components/molecules'
import styles from 'styles/components/organisms/carRecomendations.module.scss'
import stylec from 'styles/components/organisms/cardetailcard.module.scss'
import stylex from 'styles/components/organisms/testimonyWidget.module.scss'
import stylep from 'styles/components/organisms/lpCarRecommendations.module.scss'
import EmptyCarImage from '/public/revamp/illustration/empty-car.webp'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Swiper as SwiperType } from 'swiper'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import urls from 'utils/helpers/url'
import { Button } from 'components/atoms'
import { IconChevronRight } from 'components/atoms/icon'
import { colors } from 'utils/helpers/style/colors'
import { CarRecommendation } from 'utils/types/props'
import { sendAmplitudeData } from 'services/amplitude'
import { AmplitudeEventName } from 'services/amplitude/types'
import elementId from 'utils/helpers/trackerId'
import LPCRSkeleton from '../lpSkeleton/carRecommendation'
import brandList from 'utils/config'
import { LabelPromo } from 'components/molecules'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { CarContext, CarContextType } from 'services/context'
import { AlternativeCarCard } from '../alternativeCarCard'
import { PopupPromo } from '../popupPromo'
import { LocalStorageKey } from 'utils/enum'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import {
  PreviousButton,
  navigateToPLP,
  saveDataForCountlyTrackerPageViewLC,
  saveDataForCountlyTrackerPageViewPDP,
} from 'utils/navigate'
import { AdaOTOdiSEVALeadsForm } from '../leadsForm/adaOTOdiSEVA/popUp'
import { it } from 'node:test'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { useCar } from 'services/context/carContext'

type LPCarRecommendationsProps = {
  dataReccomendation: any
  onClickOpenCityModal: () => void
  isOTO?: boolean
}

const LpCarRecommendations = ({
  dataReccomendation,
  onClickOpenCityModal,
  isOTO = false,
}: LPCarRecommendationsProps) => {
  const router = useRouter()
  const swiperRef = useRef<SwiperType>()
  const { recommendation } = useCar()
  const [recommendationList, setRecommendationList] =
    useState<CarRecommendation[]>(dataReccomendation)
  const [city] = useLocalStorage(LocalStorageKey.CityOtr, null)
  const [openPromo, setOpenPromo] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState('')
  const [load, setLoad] = useState(false)
  const [isModalOpenend, setIsModalOpened] = useState<boolean>(false)

  const handleCalculateAbility = (item: CarRecommendation, index: number) => {
    trackEventCountly(CountlyEventNames.WEB_HOMEPAGE_LOAN_CALCULATOR_CLICK, {
      SOURCE_SECTION: 'Car Recommendation',
      CAR_BRAND: item.brand,
      CAR_MODEL: item.model,
      CAR_ORDER: index + 1,
    })
    saveDataForCountlyTrackerPageViewLC(PreviousButton.CarRecommendationCta)
    const selectedCity = city ? city.cityName : 'Jakarta Pusat'
    const path = urls.internalUrls.loanCalculatorWithCityBrandModelUrl
      .replace(
        ':cityName/:brand/:model',
        selectedCity.replace(/ +/g, '-') +
          '/' +
          item.brand.replace(/ +/g, '-') +
          '/' +
          item.model.replace(/ +/g, '-') +
          '/',
      )
      .toLocaleLowerCase()
    trackEventCountly(CountlyEventNames.WEB_CAR_RECOMMENDATION_CTA_CLICK, {
      PAGE_ORIGINATION: 'Homepage',
      CAR_BRAND: 'Null',
      CAR_MODEL: 'Null',
      CAR_BRAND_RECOMMENDATION: item.brand,
      CAR_MODEL_RECOMMENDATION: item.model,
      CTA_BUTTON: 'Hitung Kemampuan',
      PAGE_DIRECTION_URL: 'https://' + window.location.hostname + path,
      TENOR_OPTION: 'Null',
      TENOR_RESULT: 'Null',
    })
    router.push(path)
  }

  const handleClickDetailCar = (item: CarRecommendation) => {
    saveDataForCountlyTrackerPageViewPDP(PreviousButton.CarRecommendation)

    const path = urls.internalUrls.variantListUrl
      .replace(
        ':brand/:model/:tab?',
        item.brand.replace(/ +/g, '-') +
          '/' +
          item.model.replace(/ +/g, '-') +
          '/',
      )
      .toLocaleLowerCase()

    trackEventCountly(CountlyEventNames.WEB_CAR_RECOMMENDATION_CLICK, {
      PAGE_ORIGINATION: 'Homepage',
      PELUANG_KREDIT_BADGE: 'Null',
      CAR_BRAND: 'Null',
      CAR_MODEL: 'Null',
      CAR_BRAND_RECOMMENDATION: item.brand,
      CAR_MODEL_RECOMMENDATION: item.model,
      PAGE_DIRECTION_URL: window.location.hostname + path,
      TENOR_OPTION: 'Null',
      TENOR_RESULT: 'Null',
    })

    const newPath = window.location.pathname + path

    window.location.href = isOTO ? newPath : path
  }

  const handleClickLabel = () => {
    setOpenPromo(true)
  }
  const handleShowRecommendation = () => {
    if (!selectedBrand) {
      const mainRecommendation: any = recommendation?.sort(
        (a: any, b: any) => a.lowestAssetPrice - b.lowestAssetPrice,
      )

      setRecommendationList(mainRecommendation)
    } else {
      const filterCar: any = recommendation?.filter(
        (x: any) => x.brand === selectedBrand,
      )
      if (filterCar.length > 0) {
        setRecommendationList(
          filterCar.sort(
            (a: any, b: any) => a.lowestAssetPrice - b.lowestAssetPrice,
          ),
        )
      } else {
        setRecommendationList([])
      }
    }
    setLoad(false)
  }

  const closeLeadsForm = () => {
    setIsModalOpened(false)
  }

  const lihatSemuaMobil = () => {
    sendAmplitudeData(
      AmplitudeEventName.WEB_LP_BRANDRECOMMENDATION_CAR_SEE_ALL_CLICK,
      { Car_Brand: selectedBrand || 'Semua' },
    )
    trackEventCountly(CountlyEventNames.WEB_CAR_RECOMMENDATION_ALL_CLICK, {
      CAR_BRAND: selectedBrand || 'Semua',
    })
    if (!selectedBrand) {
      return isOTO
        ? router.push('/adaSEVAdiOTO/mobil-baru')
        : navigateToPLP(PreviousButton.undefined)
    }

    const path = router.asPath.split('/')[1]
    if (path === 'adaSEVAdiOTO') {
      return router.push(`/adaSEVAdiOTO/mobil-baru/${selectedBrand}`)
    }

    navigateToPLP(PreviousButton.undefined, {
      search: new URLSearchParams({ brand: selectedBrand }).toString(),
    })
  }

  const trackCountlyClickTab = (brand: string) => {
    trackEventCountly(CountlyEventNames.WEB_CAR_RECOMMENDATION_TAB_CLICK, {
      CAR_BRAND_TAB: brand.length !== 0 ? brand : 'Semua',
    })
  }

  useEffect(() => {
    handleShowRecommendation()

    return () => {
      setRecommendationList([])
    }
  }, [selectedBrand, recommendation])

  if (load) return <LPCRSkeleton />

  return (
    <>
      <div className={`${stylex.container}`}>
        <h2 className={stylex.title} style={{ marginBottom: 16 }}>
          Rekomendasi
        </h2>
        <NavigationTabV2
          itemList={brandList}
          onPage={isOTO ? 'OTO' : 'PDP'}
          onSelectTab={(value: any) => {
            sendAmplitudeData(
              AmplitudeEventName.WEB_LP_BRANDRECOMMENDATION_LOGO_CLICK,
              { Car_Brand: value || 'Semua' },
            )
            setSelectedBrand(value)
            swiperRef.current?.slideTo(0)
            trackCountlyClickTab(value)
          }}
          isShowAnnouncementBox={false}
          className={stylep.tab}
          autoScroll={isOTO}
        />
        <div>
          {recommendationList.length === 0 ? (
            <div
              className={styles.alternativeCarWrapper}
              style={{ marginTop: 24, padding: '0 16px 32px' }}
            >
              <EmptyCarRecommendation
                onClickChangeCity={onClickOpenCityModal}
              />
            </div>
          ) : (
            <Swiper
              slidesPerView={'auto'}
              spaceBetween={16}
              className={styles.alternativeCarWrapper}
              style={{ marginTop: 24, padding: '0 16px 32px' }}
              onBeforeInit={(swiper) => (swiperRef.current = swiper)}
            >
              {recommendationList.slice(0, 5).map((item, index) => (
                <SwiperSlide key={index} style={{ width: 212 }}>
                  <AlternativeCarCard
                    recommendation={item}
                    onClickLabel={handleClickLabel}
                    isOTO={isOTO}
                    label={
                      <LabelPromo
                        className={stylec.labelCard}
                        onClick={handleClickLabel}
                      />
                    }
                  >
                    <div
                      className={styles.alternativeCarLink}
                      onClick={() => {
                        sendAmplitudeData(
                          AmplitudeEventName.WEB_LP_BRANDRECOMMENDATION_CAR_CLICK,
                          {
                            Car_Brand: selectedBrand || 'Semua',
                            Car_Model: item.model,
                          },
                        )
                        handleClickDetailCar(item)
                      }}
                      data-testid={elementId.PLP.Button.LihatSNK}
                    >
                      Lihat Detail
                    </div>
                    <Button
                      version={ButtonVersion.PrimaryDarkBlue}
                      size={ButtonSize.Big}
                      onClick={() => {
                        sendAmplitudeData(
                          AmplitudeEventName.WEB_LP_BRANDRECOMMENDATION_CTA_HITUNG_KEMAMPUAN_CLICK,
                          {
                            Car_Brand: selectedBrand || 'Semua',
                            Car_Model: item.model,
                          },
                        )
                        isOTO
                          ? setIsModalOpened(true)
                          : handleCalculateAbility(item, index)
                      }}
                      data-testid={elementId.PLP.Button.HitungKemampuan}
                    >
                      {isOTO ? 'Saya Tertarik' : 'Hitung Kemampuan'}
                    </Button>
                  </AlternativeCarCard>
                </SwiperSlide>
              ))}
              {recommendationList.length > 0 && (
                <SwiperSlide
                  className={stylep.lihatSemuaWrapper}
                  role="button"
                  onClick={lihatSemuaMobil}
                >
                  <div className={stylep.wrapper}>
                    <IconChevronRight
                      color={colors.primaryDarkBlue}
                      height={24}
                      width={24}
                    />
                    <span>Lihat semua mobil {selectedBrand}</span>
                  </div>
                </SwiperSlide>
              )}
            </Swiper>
          )}
        </div>
        {isModalOpenend && <AdaOTOdiSEVALeadsForm onCancel={closeLeadsForm} />}
      </div>
      <PopupPromo open={openPromo} onCancel={() => setOpenPromo(false)} />
    </>
  )
}

type EmptyCarRecommendationProps = {
  onClickChangeCity: () => void
}

const EmptyCarRecommendation = ({
  onClickChangeCity,
}: EmptyCarRecommendationProps) => (
  <div className={stylep.emptyCarRecommendation}>
    <Image
      src={EmptyCarImage}
      width={250}
      height={186}
      alt="empty car recommendation"
    />
    <h2>Mobil Tidak Ditemukan di Kotamu</h2>
    <span>
      Silakan{' '}
      <span className={stylep.link} onClick={onClickChangeCity}>
        ubah lokasimu
      </span>
    </span>
  </div>
)

export default LpCarRecommendations
