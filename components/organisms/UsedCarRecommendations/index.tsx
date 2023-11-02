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
  UsedCarRecommendation,
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
import { AlternativeUsedCarRecomendationCard } from '../alternativeUsedCarRecomendationCard'

type UsedCarRecommendationsPropss = {
  title: string
  usedCarRecommendationList: UsedCarRecommendation[]
  onClick: () => void
  additionalContainerStyle: any
  scrollTo?: () => void
}

export default function UsedCarRecommendations({
  title,
  usedCarRecommendationList,
  onClick,
  additionalContainerStyle,
  scrollTo,
}: UsedCarRecommendationsPropss) {
  const router = useRouter()
  const swiperRef = useRef<SwiperType>()
  const brand = router.query.brand
  const model = router.query.model
  const dataCar: trackDataCarType | null = getSessionStorage(
    SessionStorageKey.PreviousCarDataBeforeLogin,
  )

  const handleClickDetailCar = (url: string, item: CarRecommendation) => {
    const lowestInstallment = getLowestInstallment(item.variants)
    const formatLowestInstallment = replacePriceSeparatorByLocalization(
      lowestInstallment,
      LanguageCode.id,
    )

    const path = variantListUrl
      .replace(
        ':brand/:model/:tab?',
        item.brand.replace(/ +/g, '-') +
          '/' +
          item.model.replace(/ +/g, '-') +
          '/',
      )
      .toLocaleLowerCase()

    trackEventCountly(CountlyEventNames.WEB_CAR_RECOMMENDATION_CLICK, {
      PAGE_ORIGINATION: 'PDP - Kredit',
      PELUANG_KREDIT_BADGE:
        item.loanRank === 'Green'
          ? 'Mudah disetujui'
          : item.loanRank === 'Red'
          ? 'Sulit disetujui'
          : 'Null',
      CAR_BRAND: item.brand,
      CAR_MODEL: item.model,
      CAR_BRAND_RECOMMENDATION: item.brand,
      CAR_MODEL_RECOMMENDATION: item.model,
      PAGE_DIRECTION_URL: window.location.hostname + path,
      TENOR_OPTION: dataCar?.TENOR_OPTION,
      TENOR_RESULT:
        dataCar?.TENOR_RESULT && dataCar?.TENOR_RESULT === 'Green'
          ? 'Mudah disetujui'
          : dataCar?.TENOR_RESULT && dataCar?.TENOR_RESULT === 'Red'
          ? 'Sulit disetujui'
          : 'Null',
    })

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
      <h2
        className={styles.alternativeCarTitle}
        data-testid={elementId.LoanCalculator.RekomendasiFinansial}
      >
        {title}
      </h2>
      <div>
        <Swiper
          slidesPerView={'auto'}
          spaceBetween={16}
          className={styles.alternativeCarWrapper}
          onBeforeInit={(swiper) => (swiperRef.current = swiper)}
          style={{ paddingRight: 16 }}
        >
          {usedCarRecommendationList?.map((item, index) => (
            <SwiperSlide key={index} style={{ width: 212 }}>
              <AlternativeUsedCarRecomendationCard
                key={index}
                recommendation={item}
                onClickLabel={() => {
                  onClick()
                }}
                label={<LabelMudah style={{ left: 0 }} />}
                pageOrigination="PDP - Kredit"
              >
                <div
                  className={styles.alternativeCarLink}
                  onClick={
                    () => {
                      onClick()
                    }
                    // handleClickDetailCar(`${carResultsUrl}/${item.id}`, item)
                  }
                  data-testid={elementId.LoanCalculator.Button.LihatDetail}
                >
                  Lihat Detail
                </div>
                <Button
                  version={ButtonVersion.Secondary}
                  size={ButtonSize.Big}
                  onClick={() => {
                    onClick()
                  }}
                >
                  Tanya Unit
                </Button>
              </AlternativeUsedCarRecomendationCard>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}
