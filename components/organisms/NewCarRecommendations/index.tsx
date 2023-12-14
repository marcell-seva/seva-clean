import elementId from 'helpers/elementIds'
import { LanguageCode, SessionStorageKey } from 'utils/enum'
import React, { useRef } from 'react'
import {
  carResultsUrl,
  loanCalculatorWithCityBrandModelUrl,
  variantListUrl,
} from 'utils/helpers/routes'
import {
  CarRecommendation,
  UsedNewCarRecommendation,
  trackDataCarType,
} from 'utils/types/utils'
import { getLowestInstallment } from 'utils/carModelUtils/carModelUtils'
import { replacePriceSeparatorByLocalization } from 'utils/handler/rupiah'
import { Button } from 'components/atoms'
import { LabelMudah } from 'components/molecules'
import styles from 'styles/components/organisms/carRecomendations.module.scss'
import { useRouter } from 'next/router'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import {
  defineRouteName,
  PreviousButton,
  saveDataForCountlyTrackerPageViewLC,
  saveDataForCountlyTrackerPageViewPDP,
} from 'utils/navigate'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import {
  getSessionStorage,
  saveSessionStorage,
} from 'utils/handler/sessionStorage'
import { capitalizeWords } from 'utils/stringUtils'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Swiper as SwiperType } from 'swiper'
import { AlternativeUsedCarCard } from '../alternativeUsedCarCard'

type NewCarRecommendationsPropss = {
  title: string
  carRecommendationList: UsedNewCarRecommendation[]
  onClick: () => void
  selectedCity: string
  additionalContainerStyle?: string
}

export default function NewCarRecommendations({
  title,
  carRecommendationList,
  onClick,
  selectedCity,
  additionalContainerStyle,
}: NewCarRecommendationsPropss) {
  const router = useRouter()
  const swiperRef = useRef<SwiperType>()
  const brand = router.query.brand
  const model = router.query.model
  const dataCar: trackDataCarType | null = getSessionStorage(
    SessionStorageKey.PreviousCarDataBeforeLogin,
  )

  const getDestinationUrl = (carDetail: UsedNewCarRecommendation) => {
    if (window.location.pathname.includes('/mobil-baru')) {
      return variantListUrl
        .replace(
          ':brand/:model',
          (carDetail.makeName + '/' + carDetail.modelName.replace(/ +/g, '-'))
            .replace(/ +/g, '')
            .toLowerCase(),
        )
        .replace(':tab', 'kredit')
    } else {
      return loanCalculatorWithCityBrandModelUrl
        .replace(
          ':cityName/:brand/:model',
          selectedCity.replace(/ +/g, '-') +
            '/' +
            carDetail.makeName.replace(/ +/g, '-') +
            '/' +
            carDetail.modelName.replace(/ +/g, '-') +
            '/',
        )
        .toLocaleLowerCase()
    }
  }

  const handleCalculateAbility = (item: UsedNewCarRecommendation) => {
    const formatLowestInstallment = replacePriceSeparatorByLocalization(
      item.startInstallmentL,
      LanguageCode.id,
    )
    const dataCarTemp = {
      ...dataCar,
      PELUANG_KREDIT_BADGE: 'Mudah disetujui',
    }
    saveSessionStorage(
      SessionStorageKey.PreviousCarDataBeforeLogin,
      JSON.stringify(dataCarTemp),
    )
    trackEventCountly(CountlyEventNames.WEB_CAR_RECOMMENDATION_CTA_CLICK, {
      PAGE_ORIGINATION: 'PDP - Kredit',
      CAR_BRAND: brand
        ? capitalizeWords(brand.toString().replaceAll('-', ' '))
        : 'Null',
      CAR_MODEL: model
        ? capitalizeWords(model.toString().replaceAll('-', ' '))
        : 'Null',
      CAR_BRAND_RECOMMENDATION: item.makeName,
      CAR_MODEL_RECOMMENDATION: item.modelName,
      CTA_BUTTON: 'Hitung Kemampuan',
      TENOR_OPTION: dataCar?.TENOR_OPTION,
      TENOR_RESULT:
        dataCar?.TENOR_RESULT && dataCar?.TENOR_RESULT === 'Green'
          ? 'Mudah disetujui'
          : dataCar?.TENOR_RESULT && dataCar?.TENOR_RESULT === 'Red'
          ? 'Sulit disetujui'
          : 'Null',
      PAGE_DIRECTION_URL: window.location.hostname + getDestinationUrl(item),
    })
    saveDataForCountlyTrackerPageViewLC(PreviousButton.CarRecommendation)
    window.location.replace(getDestinationUrl(item))
  }

  const handleClickDetailCar = (
    url: string,
    item: UsedNewCarRecommendation,
  ) => {
    const formatLowestInstallment = replacePriceSeparatorByLocalization(
      item.startInstallmentL,
      LanguageCode.id,
    )

    const path = variantListUrl
      .replace(
        ':brand/:model/:tab?',
        item.makeName.replace(/ +/g, '-') +
          '/' +
          item.modelName.replace(/ +/g, '-') +
          '/',
      )
      .toLocaleLowerCase()

    if (window.location.pathname.includes('kalkulator-kredit')) {
      saveDataForCountlyTrackerPageViewPDP(
        PreviousButton.CarRecommendation,
        defineRouteName(window.location.pathname + window.location.search),
      )
    } else {
      saveDataForCountlyTrackerPageViewPDP(PreviousButton.CarRecommendation)
    }

    window.location.href = path
  }

  return (
    <div
      className={`${styles.alternativeCarContainer} ${additionalContainerStyle}`}
    >
      <h3
        className={styles.alternativeCarTitle}
        data-testid={elementId.LoanCalculator.RekomendasiFinansial}
      >
        {title}
      </h3>
      <div>
        <Swiper
          slidesPerView={'auto'}
          spaceBetween={16}
          className={styles.alternativeCarWrapper}
          onBeforeInit={(swiper) => (swiperRef.current = swiper)}
          style={{ paddingRight: 16 }}
        >
          {carRecommendationList?.map((item, index) => (
            <SwiperSlide key={index} style={{ width: 212 }}>
              <AlternativeUsedCarCard
                key={index}
                recommendation={item}
                onClickLabel={onClick}
                label={<LabelMudah style={{ left: 0 }} />}
                pageOrigination="PDP - Kredit"
              >
                <div
                  className={styles.alternativeCarLink}
                  onClick={() =>
                    handleClickDetailCar(`${carResultsUrl}/${item.id}`, item)
                  }
                  data-testid={elementId.LoanCalculator.Button.LihatDetail}
                >
                  Lihat Detail
                </div>
                <Button
                  version={ButtonVersion.Secondary}
                  size={ButtonSize.Big}
                  onClick={() => handleCalculateAbility(item)}
                >
                  Hitung Kemampuan
                </Button>
              </AlternativeUsedCarCard>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}
