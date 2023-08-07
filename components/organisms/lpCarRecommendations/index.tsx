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
import { ButtonSize, ButtonVersion, LocalStorageKey } from 'utils/types/models'
import urls from 'utils/helpers/url'
import { Button } from 'components/atoms'
import { IconChevronRight } from 'components/atoms/icons'
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

type LPCarRecommendationsProps = {
  dataReccomendation: any
  onClickOpenCityModal: () => void
}

const LpCarRecommendations = ({
  dataReccomendation,
  onClickOpenCityModal,
}: LPCarRecommendationsProps) => {
  const router = useRouter()
  const swiperRef = useRef<SwiperType>()
  const { recommendation } = useContext(CarContext) as CarContextType

  const [recommendationList, setRecommendationList] =
    useState<CarRecommendation[]>(dataReccomendation)
  const [city] = useLocalStorage(LocalStorageKey.CityOtr, null)
  const [openPromo, setOpenPromo] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState('')
  const [load, setLoad] = useState(false)

  const handleCalculateAbility = (item: CarRecommendation) => {
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
    router.push(path)
  }

  const handleClickDetailCar = (item: CarRecommendation) => {
    const path = urls.internalUrls.variantListUrl
      .replace(
        ':brand/:model/:tab?',
        item.brand.replace(/ +/g, '-') +
          '/' +
          item.model.replace(/ +/g, '-') +
          '/',
      )
      .toLocaleLowerCase()

    router.push(path)
  }

  const handleClickLabel = () => {
    setOpenPromo(true)
  }

  const handleShowRecommendation = () => {
    if (!selectedBrand) {
      const mainRecommendation: any = dataReccomendation?.sort(
        (a: any, b: any) => a.lowestAssetPrice - b.lowestAssetPrice,
      )

      setRecommendationList(mainRecommendation)
    } else {
      const filterCar: any = dataReccomendation?.filter(
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

  const lihatSemuaMobil = () => {
    sendAmplitudeData(
      AmplitudeEventName.WEB_LP_BRANDRECOMMENDATION_CAR_SEE_ALL_CLICK,
      { Car_Brand: selectedBrand || 'Semua' },
    )
    if (!selectedBrand) return router.push(urls.internalUrls.carResultsUrl)

    router.push({
      pathname: urls.internalUrls.carResultsUrl,
      search: new URLSearchParams({ brand: selectedBrand }).toString(),
    })
  }

  useEffect(() => {
    handleShowRecommendation()

    return () => {
      setRecommendationList([])
    }
  }, [selectedBrand])

  if (load) return <LPCRSkeleton />

  return (
    <>
      <div className={`${stylex.container}`}>
        <h2 className={stylex.title} style={{ marginBottom: 16 }}>
          Rekomendasi
        </h2>
        <NavigationTabV2
          itemList={brandList}
          onPage={'PDP'}
          onSelectTab={(value: any) => {
            sendAmplitudeData(
              AmplitudeEventName.WEB_LP_BRANDRECOMMENDATION_LOGO_CLICK,
              { Car_Brand: value || 'Semua' },
            )
            setSelectedBrand(value)
            swiperRef.current?.slideTo(0)
          }}
          isShowAnnouncementBox={false}
          className={stylep.tab}
          autoScroll={false}
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
                        handleCalculateAbility(item)
                      }}
                      data-testid={elementId.PLP.Button.HitungKemampuan}
                    >
                      Hitung Kemampuan
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
