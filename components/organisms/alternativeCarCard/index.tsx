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
import { LanguageCode, LocalStorageKey } from 'utils/enum'
import { Location } from 'utils/types'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { useRouter } from 'next/router'
import { CarRecommendation } from 'utils/types/context'
import Image from 'next/image'
import {
  PreviousButton,
  saveDataForCountlyTrackerPageViewPDP,
} from 'utils/navigate'

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
  const detailCarRoute = variantListUrl
    .replace(
      ':brand/:model',
      (recommendation.brand + '/' + recommendation.model.replace(/ +/g, '-'))
        .replace(/ +/g, '')
        .toLowerCase(),
    )
    .replace(':tab', '')

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
            onClick={() => router.push(detailCarRoute)}
            data-testid={elementId.CarRecommendation.Button.LihatDetail}
          >
            Lihat Detail
          </Button>
        )}
      </CardShadow>
    </div>
  )
}
