import React from 'react'
import styles from '/styles/components/organisms/alternativeCarCard.module.scss'
import Image from 'next/image'
import elementId from 'utils/helpers/trackerId'
import urls from 'utils/helpers/url'
import { sendAmplitudeData } from 'services/amplitude'
import { AmplitudeEventName } from 'services/amplitude/types'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { CarRecommendation, CityOtrOption } from 'utils/types/props'
import { Button, CardShadow } from 'components/atoms'
import { LabelPromo } from 'components/molecules'
import { useRouter } from 'next/router'
import {
  getLowestInstallment,
  replacePriceSeparatorByLocalization,
} from 'utils/handler/calculation'
import {
  ButtonSize,
  ButtonVersion,
  LanguageCode,
  LocalStorageKey,
} from 'utils/types/models'

type AlternativeCarCardProps = {
  recommendation: CarRecommendation
  onClickLabel: () => void
  children?: React.ReactNode
  label?: React.ReactNode
}

const AlternativeCarCard = ({
  recommendation,
  onClickLabel,
  children,
  label,
}: AlternativeCarCardProps) => {
  const router = useRouter()
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const detailCarRoute = urls.internalUrls.variantListUrl
    .replace(
      ':brand/:model',
      (recommendation.brand + '/' + recommendation.model.replace(/ +/g, '-'))
        .replace(/ +/g, '')
        .toLowerCase(),
    )
    .replace(':tab', '')

  const trackCarRecommendation = () => {
    if (
      window.location.pathname.includes(
        urls.internalUrls.loanCalculatorDefaultUrl,
      )
    ) {
      const lowestInstallment = getLowestInstallment(recommendation.variants)
      const formatLowestInstallment = replacePriceSeparatorByLocalization(
        lowestInstallment,
        LanguageCode.id,
      )
      sendAmplitudeData(AmplitudeEventName.WEB_LC_CAR_RECOMMENDATION_CLICK, {
        Car_Brand: recommendation.brand,
        Car_Model: recommendation.model,
        City: cityOtr?.cityName,
        Monthly_Installment: `Rp${formatLowestInstallment}`,
        Page_Origination: window.location.href,
      })
    } else {
      sendAmplitudeData(
        AmplitudeEventName.WEB_LP_BRANDRECOMMENDATION_CAR_CLICK,
        {
          Car_Brand: recommendation.brand,
          Car_Model: recommendation.model,
        },
      )
    }
  }

  const navigateToPDP = () => {
    trackCarRecommendation()
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
export default AlternativeCarCard
