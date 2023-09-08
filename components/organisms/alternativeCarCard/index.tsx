import elementId from 'helpers/elementIds'
import React from 'react'
import { loanCalculatorDefaultUrl, variantListUrl } from 'utils/helpers/routes'
import { getLowestInstallment } from 'utils/carModelUtils/carModelUtils'
import { replacePriceSeparatorByLocalization } from 'utils/handler/rupiah'
import { Button, CardShadow } from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { LabelPromo } from 'components/molecules'
import styles from '../../../styles/components/organisms/alternativeCarCard.module.scss'
import {
  trackCarBrandRecomItemClick,
  trackLCCarRecommendationClick,
} from 'helpers/amplitude/seva20Tracking'
import { LanguageCode, LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { Location } from 'utils/types'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { useRouter } from 'next/router'
import { CarRecommendation } from 'utils/types/context'
import Image from 'next/image'
import {
  PreviousButton,
  saveDataForCountlyTrackerPageViewPDP,
} from 'utils/navigate'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { trackDataCarType } from 'utils/types/utils'
import { getSessionStorage } from 'utils/handler/sessionStorage'

type AlternativeCarCardProps = {
  recommendation: CarRecommendation
  onClickLabel: () => void
  children?: React.ReactNode
  label?: React.ReactNode
}

export const AlternativeCarCard = ({
  recommendation,
  onClickLabel,
  children,
  label,
}: AlternativeCarCardProps) => {
  const router = useRouter()
  const [cityOtr] = useLocalStorage<Location | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const dataCar: trackDataCarType | null = getSessionStorage(
    SessionStorageKey.PreviousCarDataBeforeLogin,
  )
  const detailCarRoute = variantListUrl
    .replace(
      ':brand/:model',
      (recommendation.brand + '/' + recommendation.model.replace(/ +/g, '-'))
        .replace(/ +/g, '')
        .toLowerCase(),
    )
    .replace(':tab', '')

  const trackCountlyCarRecommendation = () => {
    trackEventCountly(CountlyEventNames.WEB_CAR_RECOMMENDATION_CLICK, {
      PAGE_ORIGINATION: 'PLP - Empty Page',
      PELUANG_KREDIT_BADGE:
        recommendation.loanRank === 'Green'
          ? 'Mudah disetujui'
          : recommendation.loanRank === 'Red'
          ? 'Sulit disetujui'
          : 'Null',
      CAR_BRAND: recommendation.brand,
      CAR_MODEL: recommendation.model,
      CAR_BRAND_RECOMMENDATION: recommendation.brand,
      CAR_MODEL_RECOMMENDATION: recommendation.model,
      PAGE_DIRECTION_URL: window.location.hostname + detailCarRoute,
      TENOR_OPTION: dataCar?.TENOR_OPTION,
      TENOR_RESULT:
        dataCar?.TENOR_RESULT && dataCar?.TENOR_RESULT === 'Green'
          ? 'Mudah disetujui'
          : dataCar?.TENOR_RESULT && dataCar?.TENOR_RESULT === 'Red'
          ? 'Sulit disetujui'
          : 'Null',
    })
  }
  const trackCarRecommendation = () => {
    if (location.pathname.includes(loanCalculatorDefaultUrl)) {
      const lowestInstallment = getLowestInstallment(recommendation.variants)
      const formatLowestInstallment = replacePriceSeparatorByLocalization(
        lowestInstallment,
        LanguageCode.id,
      )
      trackLCCarRecommendationClick({
        Car_Brand: recommendation.brand,
        Car_Model: recommendation.model,
        City: cityOtr?.cityName,
        Monthly_Installment: `Rp${formatLowestInstallment}`,
        Page_Origination: window.location.href,
      })
    } else {
      trackCarBrandRecomItemClick({
        Car_Brand: recommendation.brand,
        Car_Model: recommendation.model,
      })
    }
  }

  const navigateToPDP = () => {
    trackCarRecommendation()
    saveDataForCountlyTrackerPageViewPDP(PreviousButton.CarRecommendation)
    if (!label) {
      trackCountlyCarRecommendation()
    }
    router.push(detailCarRoute)
  }

  const lowestInstallment = getLowestInstallment(recommendation.variants)
  const formatLowestInstallment = replacePriceSeparatorByLocalization(
    lowestInstallment,
    LanguageCode.id,
  )

  return (
    <div className={styles.container}>
      <CardShadow className={styles.cardWrapper}>
        <Image
          src={recommendation.images[0]}
          className={styles.heroImg}
          alt={`${recommendation.brand} ${recommendation.model}`}
          onClick={navigateToPDP}
          data-testid={elementId.CarRecommendation.Image}
          width={180}
          height={135}
          loading="lazy"
        />
        {label ?? (
          <LabelPromo
            className={styles.labelCard}
            onClick={onClickLabel}
            data-testid={elementId.CarRecommendation.Button.Promo}
          />
        )}
        <div
          className={styles.contentWrapper}
          onClick={navigateToPDP}
          data-testid={elementId.CarRecommendation.BrandModel}
        >
          <h3 className={styles.brandModelText}>
            {recommendation.brand} {recommendation.model}
          </h3>
          <div
            className={styles.infoWrapper}
            data-testid={elementId.CarRecommendation.NominalCicilan}
          >
            <div className={styles.detailInfoWrapper}>
              <span className={styles.smallRegular}>Cicilan mulai dari</span>
              <span className={styles.bodyPriceText}>
                Rp{formatLowestInstallment}/bln
              </span>
            </div>
          </div>
        </div>
        {children ?? (
          <Button
            version={ButtonVersion.Secondary}
            size={ButtonSize.Big}
            onClick={() => {
              trackEventCountly(
                CountlyEventNames.WEB_CAR_RECOMMENDATION_CTA_CLICK,
                {
                  PAGE_ORIGINATION: 'PLP - Empty Page',
                  CAR_BRAND: recommendation.brand,
                  CAR_MODEL: recommendation.model,
                  CAR_BRAND_RECOMMENDATION: recommendation.brand,
                  CAR_MODEL_RECOMMENDATION: recommendation.model,
                  CTA_BUTTON: 'Lihat Detail',
                  PAGE_DIRECTION_URL: window.location.hostname + detailCarRoute,
                },
              )
              router.push(detailCarRoute)
            }}
            data-testid={elementId.CarRecommendation.Button.LihatDetail}
          >
            Lihat Detail
          </Button>
        )}
      </CardShadow>
    </div>
  )
}
