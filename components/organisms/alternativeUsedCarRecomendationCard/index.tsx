import elementId from 'helpers/elementIds'
import React from 'react'
import {
  OTOVariantListUrl,
  loanCalculatorDefaultUrl,
  usedCarDetailUrl,
  variantListUrl,
} from 'utils/helpers/routes'
import { getLowestInstallment } from 'utils/carModelUtils/carModelUtils'
import { replacePriceSeparatorByLocalization } from 'utils/handler/rupiah'
import { Button, CardShadow } from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { LabelPromo } from 'components/molecules'
import styles from 'styles/components/organisms/alternativeUsedCarRecomendationCard.module.scss'
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
  UsedCarRecommendation,
  trackDataCarType,
} from 'utils/types/utils'
import {
  getSessionStorage,
  saveSessionStorage,
} from 'utils/handler/sessionStorage'
import { removeCarBrand } from 'utils/handler/removeCarBrand'
import { LocationRed } from 'components/atoms/icon/LocationRed'

type AlternativeUsedCarCardRecomendationProps = {
  recommendation: UsedCarRecommendation
  onClickLabel: () => void
  children?: React.ReactNode
  label?: React.ReactNode
  pageOrigination?: string
  carBrand?: string // for value brand after calculated
  carModel?: string // for value model after calculated
  isOTO?: boolean
}

export const AlternativeUsedCarRecomendationCard = ({
  recommendation,
  onClickLabel,
  children,
  label,
  pageOrigination,
  carBrand,
  carModel,
  isOTO = false,
}: AlternativeUsedCarCardRecomendationProps) => {
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

  const parseUrl = (url: any) => {
    const urlObj = new URL(url)

    const pathnameSegments = urlObj.pathname.split('/')

    const id = pathnameSegments[3].concat('-' + pathnameSegments[4])

    return id
  }

  const detailCarRoute = usedCarDetailUrl.replace(
    ':id',
    parseUrl(recommendation.sevaUrl).toLowerCase(),
  )

  const detailCarScrollRoute = usedCarDetailUrl.replace(
    ':id',
    parseUrl(recommendation.sevaUrl).toLowerCase() + '#leads-form',
  )

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

  // const trackCountlyCarRecommendation = () => {
  //   trackEventCountly(CountlyEventNames.WEB_CAR_RECOMMENDATION_CLICK, {
  //     PAGE_ORIGINATION: pageOrigination ? pageOrigination : 'PLP - Empty Page',
  //     PELUANG_KREDIT_BADGE:
  //       !label || pageOrigination?.toLowerCase() === 'homepage'
  //         ? 'Null'
  //         : 'Mudah disetujui',

  //     CAR_BRAND:
  //       pageOrigination?.toLowerCase() === 'homepage' ||
  //       !pageOrigination?.toLowerCase().includes('pdp')
  //         ? 'Null'
  //         : carBrand
  //         ? getValueBrandAndModel(carBrand)
  //         : getValueBrand(brand),
  //     CAR_MODEL:
  //       pageOrigination?.toLowerCase() === 'homepage'
  //         ? 'Null'
  //         : carModel
  //         ? getValueBrandAndModel(removeCarBrand(carModel))
  //         : getValueBrandAndModel(model),
  //     CAR_BRAND_RECOMMENDATION: recommendation.brand,
  //     CAR_MODEL_RECOMMENDATION: recommendation.model,
  //     PAGE_DIRECTION_URL:
  //       'https://' + window.location.hostname + detailCarRoute,
  //     TENOR_OPTION: dataCar?.TENOR_OPTION,
  //     TENOR_RESULT:
  //       dataCar?.TENOR_RESULT && dataCar?.TENOR_RESULT === 'Green'
  //         ? 'Mudah disetujui'
  //         : dataCar?.TENOR_RESULT && dataCar?.TENOR_RESULT === 'Red'
  //         ? 'Sulit disetujui'
  //         : 'Null',
  //   })
  // }

  const navigateToPDP = () => {
    // trackCountlyCarRecommendation()
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

  // const lowestInstallment = getLowestInstallment(recommendation.variants)
  // const formatLowestInstallment = replacePriceSeparatorByLocalization(
  //   lowestInstallment,
  //   LanguageCode.id,
  // )

  const onClickSeeDetail = () => {
    // trackEventCountly(CountlyEventNames.WEB_CAR_RECOMMENDATION_CTA_CLICK, {
    //   PAGE_ORIGINATION: 'PLP - Empty Page',
    //   CAR_BRAND: 'Null',
    //   CAR_MODEL: 'Null',
    //   CAR_BRAND_RECOMMENDATION: recommendation.brand,
    //   CAR_MODEL_RECOMMENDATION: recommendation.model,
    //   CTA_BUTTON: 'Lihat Detail',
    //   PAGE_DIRECTION_URL: window.location.hostname + detailCarRoute,
    // })

    window.location.href = detailCarRoute
  }

  const onClickScrollDetail = () => {
    // trackEventCountly(CountlyEventNames.WEB_CAR_RECOMMENDATION_CTA_CLICK, {
    //   PAGE_ORIGINATION: 'PLP - Empty Page',
    //   CAR_BRAND: 'Null',
    //   CAR_MODEL: 'Null',
    //   CAR_BRAND_RECOMMENDATION: recommendation.brand,
    //   CAR_MODEL_RECOMMENDATION: recommendation.model,
    //   CTA_BUTTON: 'Lihat Detail',
    //   PAGE_DIRECTION_URL: window.location.hostname + detailCarRoute,
    // })

    window.location.href = detailCarScrollRoute
  }

  const formatToRupiah = (priceValue: string) => {
    const numericValue = parseFloat(priceValue)
    const formattedRupiah = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(numericValue)
    return formattedRupiah
  }

  return (
    <div className={styles.container}>
      <CardShadow className={styles.cardWrapper}>
        <Image
          src={recommendation.urlMedia}
          className={styles.heroImg}
          alt={`${recommendation.variantTitle}`}
          onClick={onClickSeeDetail}
          data-testid={elementId.CarRecommendation.Image}
          width={180}
          height={135}
          loading="lazy"
        />
        <div className={styles.contentWrapper} role="button">
          <h2
            className={styles.brandModelText}
            data-testid={elementId.PLP.Text + 'brand-model-mobil'}
          >
            {/* {recommendation.brandName} {recommendation.modelName}{' '}
            {recommendation.variantName} {recommendation.year} */}
            {recommendation.variantTitle} {recommendation.nik}
          </h2>
          <span
            className={styles.priceOtrRange}
            data-testid={elementId.PLP.Text + 'range-harga'}
          >
            {formatToRupiah(recommendation.priceValue)}
          </span>
          <span className={styles.locationSmallRegular}>
            <LocationRed />
            {recommendation.cityName}
          </span>
          <span
            role="link"
            onClick={onClickSeeDetail}
            className={styles.linkLihatDetail}
            data-testid={elementId.PLP.Button.LihatDetail}
          >
            Lihat Detail
          </span>
        </div>
        <Button
          version={ButtonVersion.Secondary}
          size={ButtonSize.Big}
          onClick={onClickSeeDetail}
          data-testid={elementId.PLP.Button.HitungKemampuan}
        >
          Tanya Unit
        </Button>
      </CardShadow>
    </div>
  )
}
