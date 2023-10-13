import {
  trackLCCarRecommendationClick,
  trackLCCarRecommendationCTAClick,
} from 'helpers/amplitude/seva20Tracking'
import elementId from 'helpers/elementIds'
import { LanguageCode, SessionStorageKey } from 'utils/enum'
import React from 'react'
import {
  carResultsUrl,
  loanCalculatorWithCityBrandModelUrl,
  variantListUrl,
} from 'utils/helpers/routes'
import { CarRecommendation, trackDataCarType } from 'utils/types/utils'
import { getLowestInstallment } from 'utils/carModelUtils/carModelUtils'
import { replacePriceSeparatorByLocalization } from 'utils/handler/rupiah'
import { Button } from 'components/atoms'
import { LabelMudah } from 'components/molecules'
import styles from 'styles/components/organisms/carRecomendations.module.scss'
import { AlternativeCarCard } from '../alternativeCarCard'
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

type CarRecommendationsPropss = {
  title: string
  carRecommendationList: CarRecommendation[]
  onClick: () => void
  selectedCity: string
  additionalContainerStyle?: string
}

export default function CarRecommendations({
  title,
  carRecommendationList,
  onClick,
  selectedCity,
  additionalContainerStyle,
}: CarRecommendationsPropss) {
  const router = useRouter()

  const brand = router.query.brand
  const model = router.query.model
  const dataCar: trackDataCarType | null = getSessionStorage(
    SessionStorageKey.PreviousCarDataBeforeLogin,
  )

  const getDestinationUrl = (carDetail: CarRecommendation) => {
    if (window.location.pathname.includes('/mobil-baru')) {
      return variantListUrl
        .replace(
          ':brand/:model',
          (carDetail.brand + '/' + carDetail.model.replace(/ +/g, '-'))
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
            carDetail.brand.replace(/ +/g, '-') +
            '/' +
            carDetail.model.replace(/ +/g, '-') +
            '/',
        )
        .toLocaleLowerCase()
    }
  }

  const handleCalculateAbility = (item: CarRecommendation) => {
    const lowestInstallment = getLowestInstallment(item.variants)
    const formatLowestInstallment = replacePriceSeparatorByLocalization(
      lowestInstallment,
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
    trackLCCarRecommendationCTAClick({
      Car_Brand: item.brand,
      Car_Model: item.model,
      City: selectedCity,
      Monthly_Installment: `Rp${formatLowestInstallment}`,
      Page_Origination: window.location.href,
    })
    trackEventCountly(CountlyEventNames.WEB_CAR_RECOMMENDATION_CTA_CLICK, {
      PAGE_ORIGINATION: 'PDP - Kredit',
      CAR_BRAND: brand
        ? capitalizeWords(brand.toString().replaceAll('-', ' '))
        : 'Null',
      CAR_MODEL: model
        ? capitalizeWords(model.toString().replaceAll('-', ' '))
        : 'Null',
      CAR_BRAND_RECOMMENDATION: item.brand,
      CAR_MODEL_RECOMMENDATION: item.model,
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

    trackLCCarRecommendationClick({
      Car_Brand: item.brand,
      Car_Model: item.model,
      City: selectedCity,
      Monthly_Installment: `Rp${formatLowestInstallment}`,
      Page_Origination: window.location.href,
    })
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
      <h3
        className={styles.alternativeCarTitle}
        data-testid={elementId.LoanCalculator.RekomendasiFinansial}
      >
        {title}
      </h3>
      <div className={styles.alternativeCarWrapper}>
        {carRecommendationList?.map((item, index) => (
          <AlternativeCarCard
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
          </AlternativeCarCard>
        ))}
      </div>
    </div>
  )
}
