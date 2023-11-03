import elementId from 'helpers/elementIds'
import React from 'react'
import {
  OTOVariantListUrl,
  loanCalculatorDefaultUrl,
  variantListUrl,
} from 'utils/helpers/routes'
import { getLowestInstallment } from 'utils/carModelUtils/carModelUtils'
import { replacePriceSeparatorByLocalization } from 'utils/handler/rupiah'
import { Button, CardShadow } from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { LabelPromo } from 'components/molecules'
import styles from '../../../styles/components/organisms/alternativeCarCard.module.scss'
import { LanguageCode, LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { Location } from 'utils/types'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { useRouter } from 'next/router'
import { CarRecommendation } from 'utils/types/context'
import Image from 'next/image'
import {
  PreviousButton,
  defineRouteName,
  saveDataForCountlyTrackerPageViewPDP,
} from 'utils/navigate'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import {
  CarVariantListPageUrlParams,
  UsedNewCarRecommendation,
  trackDataCarType,
} from 'utils/types/utils'
import {
  getSessionStorage,
  saveSessionStorage,
} from 'utils/handler/sessionStorage'
import { removeCarBrand } from 'utils/handler/removeCarBrand'

type AlternativeUsedCarCardProps = {
  recommendation: UsedNewCarRecommendation
  onClickLabel: () => void
  children?: React.ReactNode
  label?: React.ReactNode
  pageOrigination?: string
  carBrand?: string // for value brand after calculated
  carModel?: string // for value model after calculated
  isOTO?: boolean
}

export const AlternativeUsedCarCard = ({
  recommendation,
  onClickLabel,
  children,
  label,
  pageOrigination,
  carBrand,
  carModel,
  isOTO = false,
}: AlternativeUsedCarCardProps) => {
  const router = useRouter()
  const [cityOtr] = useLocalStorage<Location | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const dataCar: trackDataCarType | null = getSessionStorage(
    SessionStorageKey.PreviousCarDataBeforeLogin,
  )
  const brand = router.query.brand as string
  const model = router.query.model as string

  const detailCarRoute = (isOTO ? OTOVariantListUrl : variantListUrl)
    .replace(
      ':brand/:model',
      (
        recommendation.makeName +
        '/' +
        recommendation.modelName.replace(/ +/g, '-')
      )
        .replace(/ +/g, '')
        .toLowerCase(),
    )
    .replace(':tab', '')

  const getValueBrandAndModel = (value: string) => {
    if (value && value.length !== 0 && value.includes('-')) {
      return value
        .replaceAll('-', ' ')
        .toLowerCase()
        .split(' ')
        .map((s: any) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ')
    } else if (value && value.length !== 0) {
      return value
    } else {
      return 'Null'
    }
  }
  const getValueBrand = (value: string) => {
    if (value) {
      return value
        .replaceAll('-', ' ')
        .toLowerCase()
        .split(' ')
        .map((s: any) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ')
    } else {
      return 'Null'
    }
  }

  const trackCountlyCarRecommendation = () => {
    trackEventCountly(CountlyEventNames.WEB_CAR_RECOMMENDATION_CLICK, {
      PAGE_ORIGINATION: pageOrigination ? pageOrigination : 'PLP - Empty Page',
      PELUANG_KREDIT_BADGE:
        !label || pageOrigination?.toLowerCase() === 'homepage'
          ? 'Null'
          : 'Mudah disetujui',

      CAR_BRAND:
        pageOrigination?.toLowerCase() === 'homepage' ||
        !pageOrigination?.toLowerCase().includes('pdp')
          ? 'Null'
          : carBrand
          ? getValueBrandAndModel(carBrand)
          : getValueBrand(brand),
      CAR_MODEL:
        pageOrigination?.toLowerCase() === 'homepage'
          ? 'Null'
          : carModel
          ? getValueBrandAndModel(removeCarBrand(carModel))
          : getValueBrandAndModel(model),
      CAR_BRAND_RECOMMENDATION: recommendation.makeName,
      CAR_MODEL_RECOMMENDATION: recommendation.modelName,
      PAGE_DIRECTION_URL:
        'https://' + window.location.hostname + detailCarRoute,
      TENOR_OPTION: dataCar?.TENOR_OPTION,
      TENOR_RESULT:
        dataCar?.TENOR_RESULT && dataCar?.TENOR_RESULT === 'Green'
          ? 'Mudah disetujui'
          : dataCar?.TENOR_RESULT && dataCar?.TENOR_RESULT === 'Red'
          ? 'Sulit disetujui'
          : 'Null',
    })
  }

  const navigateToPDP = () => {
    trackCountlyCarRecommendation()
    const dataCarTemp = {
      ...dataCar,
      PELUANG_KREDIT_BADGE: 'Mudah disetujui',
    }
    saveSessionStorage(
      SessionStorageKey.PreviousCarDataBeforeLogin,
      JSON.stringify(dataCarTemp),
    )
    if (window.location.pathname.includes('kalkulator-kredit')) {
      saveDataForCountlyTrackerPageViewPDP(
        PreviousButton.CarRecommendation,
        defineRouteName(window.location.pathname + window.location.search),
      )
    } else {
      saveDataForCountlyTrackerPageViewPDP(PreviousButton.CarRecommendation)
    }
    window.location.href = detailCarRoute
  }

  const formatLowestInstallment = replacePriceSeparatorByLocalization(
    recommendation.startInstallment,
    LanguageCode.id,
  )

  console.log(recommendation)

  const onClickSeeDetail = () => {
    trackEventCountly(CountlyEventNames.WEB_CAR_RECOMMENDATION_CTA_CLICK, {
      PAGE_ORIGINATION: 'PLP - Empty Page',
      CAR_BRAND: 'Null',
      CAR_MODEL: 'Null',
      CAR_BRAND_RECOMMENDATION: recommendation.makeName,
      CAR_MODEL_RECOMMENDATION: recommendation.modelName,
      CTA_BUTTON: 'Lihat Detail',
      PAGE_DIRECTION_URL: window.location.hostname + detailCarRoute,
    })

    if (window.location.pathname.includes('kalkulator-kredit')) {
      saveDataForCountlyTrackerPageViewPDP(
        PreviousButton.CarRecommendation,
        defineRouteName(window.location.pathname + window.location.search),
      )
    } else {
      saveDataForCountlyTrackerPageViewPDP(PreviousButton.CarRecommendation)
    }

    window.location.href = detailCarRoute
  }

  return (
    <div className={styles.container}>
      <CardShadow className={styles.cardWrapper}>
        <Image
          src={recommendation.mainImageUrl}
          className={styles.heroImg}
          alt={`${recommendation.makeName} ${recommendation.modelName}`}
          onClick={navigateToPDP}
          data-testid={elementId.CarRecommendation.Image}
          width={180}
          height={135}
          loading="lazy"
        />
        <div
          className={styles.contentWrapper}
          onClick={navigateToPDP}
          data-testid={elementId.CarRecommendation.BrandModel}
        >
          <h4 className={styles.brandModelText}>
            {recommendation.makeName} {recommendation.modelName}
          </h4>
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
        <Button
          version={ButtonVersion.Secondary}
          size={ButtonSize.Big}
          onClick={onClickSeeDetail}
          data-testid={elementId.CarRecommendation.Button.LihatDetail}
        >
          Lihat Detail
        </Button>
      </CardShadow>
    </div>
  )
}
