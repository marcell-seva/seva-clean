import React, { HTMLAttributes, useEffect, useState } from 'react'
import { Button, CardShadow, IconInfo, Overlay } from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { LabelMudah, LabelPromo, LabelSulit } from 'components/molecules'
import { trackPLPCarClick } from 'helpers/amplitude/seva20Tracking'
import elementId from 'helpers/elementIds'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import {
  getMinimumDp,
  getMinimumMonthlyInstallment,
  getVariantsPriceRange,
} from 'utils/carModelUtils/carModelUtils'
import { LanguageCode, LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { formatNumberByLocalization } from 'utils/handler/rupiah'
import { hundred, million, ten } from 'utils/helpers/const'
import {
  OTOVariantListUrl,
  loanCalculatorWithCityBrandModelVariantUrl,
  usedCarDetailUrl,
  variantListUrl,
} from 'utils/helpers/routes'
import { getCity } from 'utils/hooks/useCurrentCityOtr/useCurrentCityOtr'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { useSessionStorage } from 'utils/hooks/useSessionStorage/useSessionStorage'
import { formatBillionPoint } from 'utils/numberUtils/numberUtils'
import { Location } from 'utils/types'
import { CarRecommendation, UsedCarRecommendation } from 'utils/types/context'
import { LoanRank } from 'utils/types/models'
import styles from 'styles/components/organisms/usedCarDetailCard.module.scss'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import {
  PreviousButton,
  saveDataForCountlyTrackerPageViewLC,
  saveDataForCountlyTrackerPageViewPDP,
} from 'utils/navigate'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { trackDataCarType } from 'utils/types/utils'
import {
  getSessionStorage,
  saveSessionStorage,
} from 'utils/handler/sessionStorage'
import { getLocalStorage } from 'utils/handler/localStorage'
import { LocationRed } from 'components/atoms/icon/LocationRed'
import urls from 'utils/helpers/url'
import { usedCar } from 'services/context/usedCarContext'
import { getUsedCarBySKU } from 'services/api'
import { capitalizeFirstLetter } from 'utils/stringUtils'

const CarSkeleton = '/revamp/illustration/car-skeleton.webp'

type CarDetailCardProps = {
  order?: number
  recommendation: UsedCarRecommendation
  onClickLabel: () => void
  onClickResultSulit: () => void
  onClickResultMudah: () => void
  setOpenInterestingModal: (value: boolean) => void
  isFilter?: boolean
  isFilterTrayOpened: boolean
}

const LogoPrimary = '/revamp/icon/logo-primary.webp'

export const UsedCarDetailCard = ({
  order = 0,
  recommendation,
}: CarDetailCardProps) => {
  const router = useRouter()
  const { funnelQuery } = useFunnelQueryData()

  const parseUrl = (url: any) => {
    const urlObj = new URL(url)

    const pathnameSegments = urlObj.pathname.split('/')

    if (pathnameSegments.length > 4) {
      const id = pathnameSegments[3].concat('-' + pathnameSegments[4])
      return id
    } else {
      const id = pathnameSegments[3]
      return id
    }
  }

  const detailCarRoute = usedCarDetailUrl.replace(
    ':id',
    parseUrl(recommendation.sevaUrl).toLowerCase(),
  )

  const detailCarScrollRoute = usedCarDetailUrl.replace(
    ':id',
    parseUrl(recommendation.sevaUrl).toLowerCase() + '#leads-form',
  )

  const onClickSeeDetail = () => {
    window.location.href = detailCarRoute
  }
  const onClickScrollDetail = () => {
    window.location.href = detailCarScrollRoute
  }

  const transmisi = recommendation?.carSpecifications?.find(
    (item) => item.specCode === 'transmission',
  )

  const bahanBakar = recommendation?.carSpecifications?.find(
    (item) => item.specCode === 'fuel-type',
  )

  const priceFormated = recommendation.priceFormatedValue.replace(/\s/g, '')

  return (
    <div className={styles.container}>
      <CardShadow className={styles.cardWrapper}>
        {order === 0 ? (
          <Image
            src={recommendation.mainImage || CarSkeleton}
            className={styles.heroImg}
            alt={`Mobil ${recommendation.brandName} ${recommendation.modelName} ${recommendation.variantName} ${recommendation.year}`}
            onClick={() => {
              onClickSeeDetail()
            }}
            data-testid={elementId.CarImage}
            width={279}
            height={209}
            loading="lazy"
          />
        ) : (
          <LazyLoadImage
            src={recommendation.mainImage || CarSkeleton}
            className={styles.heroImg}
            alt={`Mobil ${recommendation.brandName} ${recommendation.modelName} ${recommendation.variantName} ${recommendation.year}`}
            onClick={() => {
              onClickSeeDetail()
            }}
            data-testid={elementId.CarImage}
            width={279}
          />
        )}
        <div
          className={styles.contentWrapper}
          role="button"
          onClick={() => {
            onClickSeeDetail()
          }}
        >
          <h2
            className={styles.brandModelText}
            data-testid={elementId.PLP.Text + 'brand-model-mobil'}
          >
            {recommendation.brandName} {recommendation.modelName}{' '}
            {recommendation.variantName} {recommendation.year}
          </h2>
          <span
            className={styles.priceOtrRange}
            data-testid={elementId.PLP.Text + 'range-harga'}
          >
            {priceFormated}
          </span>
          <span className={styles.locationSmallRegular}>
            <LocationRed alt="SEVA Location Mobil Icon" />
            {recommendation.cityName}
          </span>
          <div className={styles.infoWrapper}>
            <div
              className={styles.detailInfoWrapper}
              data-testid={elementId.PLP.Text + 'nominal-cicilan'}
            >
              <span className={styles.smallRegular}>Kilometer</span>
              <span className={styles.bodyPriceText}>
                {recommendation.mileage.toLocaleString('id-ID')}km
              </span>
            </div>
            <div
              className={styles.detailInfoWrapper}
              data-testid={elementId.PLP.Text + 'nominal-cicilan'}
            >
              <span className={styles.smallRegular}>Transmisi</span>
              <span className={styles.bodyPriceText}>
                {capitalizeFirstLetter(transmisi?.value || '-')}
              </span>
            </div>
            <div
              className={styles.detailInfoWrapper}
              data-testid={elementId.PLP.Text + 'lama-tenor'}
            >
              <span className={styles.smallRegular}>Bahan Bakar</span>
              <span className={styles.bodyPriceText}>
                {capitalizeFirstLetter(bahanBakar?.value || '-')}
              </span>
            </div>
          </div>

          <span
            role="link"
            onClick={() => {
              onClickSeeDetail()
            }}
            className={styles.linkLihatDetail}
            data-testid={elementId.PLP.Button.LihatDetail}
          >
            Lihat Detail
          </span>
        </div>
        <Button
          version={ButtonVersion.Secondary}
          size={ButtonSize.Big}
          onClick={() => {
            onClickScrollDetail()
          }}
          data-testid={elementId.PLP.Button.HitungKemampuan}
        >
          Tanya Unit
        </Button>
      </CardShadow>
    </div>
  )
}
