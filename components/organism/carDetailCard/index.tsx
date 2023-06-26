import { hundred, million, ten } from 'const/const'
import React from 'react'
import {
  loanCalculatorWithCityBrandModelVariantUrl,
  variantListUrl,
} from 'routes/routes'
import {
  getMinimumDp,
  getMinimumMonthlyInstallment,
  getVariantsPriceRange,
} from 'utils/carModelUtils/carModelUtils'
import {
  ButtonSize,
  ButtonVersion,
  LanguageCode,
  LoanRank,
  LocalStorageKey,
  SessionStorageKey,
} from 'utils/enum'
import { LabelPromo, LabelMudah, LabelSulit } from 'components/molecules'
import {
  formatNumberByLocalization,
  formatBillionPoint,
} from 'utils/numberUtils/numberUtils'
import styles from '../../../styles/saas/components/organism/cardetailcard.module.scss'
import { trackPLPCarClick } from 'helpers/amplitude/seva20Tracking'
import { useFunnelQueryData } from 'context/funnelQueryContext/funnelQueryContext'
import elementId from 'helpers/elementIds'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Location } from 'utils/types'
import { getCity } from 'utils/hooks/useCurrentCityOtr/useCurrentCityOtr'
import Image from 'next/image'
import { CarRecommendation } from 'utils/types/context'
import { Button, CardShadow } from 'components/atoms'
import { useLocalStorage } from 'utils/hooks/useLocalStorage/useLocalStorage'
import { useSessionStorage } from 'utils/hooks/useSessionStorage/useSessionStorage'

type CarDetailCardProps = {
  recommendation: CarRecommendation
  onClickLabel: () => void
  onClickResultSulit: () => void
  onClickResultMudah: () => void
  isFilter?: boolean
  isFilterTrayOpened: boolean
}

export const CarDetailCard = ({
  recommendation,
  onClickLabel,
  isFilter,
  onClickResultSulit,
  onClickResultMudah,
  isFilterTrayOpened,
}: CarDetailCardProps) => {
  const router = useRouter()
  const { funnelQuery } = useFunnelQueryData()
  const [cityOtr] = useLocalStorage<Location | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const [, setLoanRankPLP] = useSessionStorage(
    SessionStorageKey.LoanRankFromPLP,
    false,
  )

  const singleVariantPrice = formatNumberByLocalization(
    recommendation.variants[0].priceValue,
    LanguageCode.id,
    million,
    hundred,
  )

  const variantPriceRange = getVariantsPriceRange(
    recommendation.variants,
    LanguageCode.id,
  )

  const priceRange =
    recommendation.variants.length > 1
      ? variantPriceRange
      : formatBillionPoint(singleVariantPrice)

  const lowestInstallment = getMinimumMonthlyInstallment(
    recommendation.variants,
    LanguageCode.id,
    million,
    hundred,
  )

  const lowestDp = getMinimumDp(
    recommendation.variants,
    LanguageCode.id,
    million,
    ten,
  )

  const detailCarRoute = variantListUrl
    .replace(
      ':brand/:model',
      (recommendation.brand + '/' + recommendation.model.replace(/ +/g, '-'))
        .replace(/ +/g, '')
        .toLowerCase(),
    )
    .replace(':tab', '')

  const cityName =
    recommendation.brand === 'Daihatsu'
      ? 'Jakarta Pusat'
      : getCity()?.cityName || 'Jakarta Pusat'

  const navigateToLoanCalculator = () => {
    const cityNameSlug = cityName.toLowerCase().trim().replace(/ +/g, '-')
    const brandSlug = recommendation.brand
      .toLowerCase()
      .trim()
      .replace(/ +/g, '-')
    const modelSlug = recommendation.model
      .toLowerCase()
      .trim()
      .replace(/ +/g, '-')
    const destinationUrl = loanCalculatorWithCityBrandModelVariantUrl
      .replace(':cityName', cityNameSlug)
      .replace(':brand', brandSlug)
      .replace(':model', modelSlug)
      .replace(':variant', '')

    router.push(destinationUrl)
  }

  const getPeluangKredit = (carModel: CarRecommendation) => {
    if (
      funnelQuery.monthlyIncome &&
      funnelQuery.age &&
      funnelQuery.downPaymentAmount &&
      funnelQuery.tenure
    ) {
      if (carModel.loanRank === LoanRank.Green) {
        return 'Mudah'
      } else if (carModel.loanRank === LoanRank.Red) {
        return 'Sulit'
      } else {
        return 'Null'
      }
    } else {
      return 'Null'
    }
  }

  const trackCarClick = () => {
    trackPLPCarClick({
      Car_Brand: recommendation.brand,
      Car_Model: recommendation.model,
      Peluang_Kredit: getPeluangKredit(recommendation),
      DP: `Rp${lowestDp} Juta`,
      Tenure: `${funnelQuery.tenure || 5}`,
      Cicilan: `Rp${lowestInstallment} jt/bln`,
      ...(cityOtr && { City: cityOtr?.cityName }),
    })
    setLoanRankPLP(true)
  }

  const navigateToPDP = () => {
    if (!isFilterTrayOpened) {
      trackCarClick()
      router.push(detailCarRoute)
    }
  }

  return (
    <div className={styles.container}>
      <CardShadow className={styles.cardWrapper}>
        <Image
          src={recommendation.images[0]}
          className={styles.heroImg}
          alt={`${recommendation.brand} ${recommendation.model}`}
          onClick={navigateToPDP}
          data-testid={elementId.CarImage}
        />
        <LabelPromo
          className={styles.labelCard}
          onClick={onClickLabel}
          data-testid={elementId.PLP.Button.Promo}
        />
        {isFilter && recommendation.loanRank === 'Red' && (
          <LabelSulit onClick={onClickResultSulit} />
        )}
        {isFilter && recommendation.loanRank === 'Green' && (
          <LabelMudah onClick={onClickResultMudah} />
        )}
        <div
          className={styles.contentWrapper}
          role="button"
          onClick={navigateToPDP}
        >
          <h3
            className={styles.brandModelText}
            data-testid={elementId.PLP.Text + 'brand-model-mobil'}
          >
            {recommendation.brand} {recommendation.model}
          </h3>
          <div
            className={styles.hargaOtrWrapper}
            data-testid={elementId.PLP.Text + 'harga-otr'}
          >
            <span className={styles.smallRegular}>Harga OTR</span>
            <span className={styles.smallSemibold}>{cityName}</span>
          </div>
          <span
            className={styles.priceOtrRange}
            data-testid={elementId.PLP.Text + 'range-harga'}
          >
            Rp{priceRange} jt
          </span>
          <div className={styles.infoWrapper}>
            <div
              className={styles.detailInfoWrapper}
              data-testid={elementId.PLP.Text + 'nominal-cicilan'}
            >
              <span className={styles.smallRegular}>Cicilan</span>
              <span className={styles.bodyPriceText}>
                Rp{lowestInstallment} jt
              </span>
            </div>
            <div
              className={styles.detailInfoWrapper}
              data-testid={elementId.PLP.Text + 'nominal-cicilan'}
            >
              <span className={styles.smallRegular}>DP</span>
              <span className={styles.bodyPriceText}>Rp{lowestDp} jt</span>
            </div>
            <div
              className={styles.detailInfoWrapper}
              data-testid={elementId.PLP.Text + 'lama-tenor'}
            >
              <span className={styles.smallRegular}>Tenor</span>
              <span className={styles.bodyPriceText}>
                {funnelQuery.tenure} Tahun
              </span>
            </div>
          </div>
          <Link
            href={detailCarRoute}
            className={styles.linkLihatDetail}
            onClick={trackCarClick}
            data-testid={elementId.PLP.Button.LihatDetail}
          >
            Lihat Detail
          </Link>
        </div>
        <Button
          version={ButtonVersion.Secondary}
          size={ButtonSize.Big}
          onClick={navigateToLoanCalculator}
          data-testid={elementId.PLP.Button.HitungKemampuan}
        >
          Hitung Kemampuan
        </Button>
      </CardShadow>
    </div>
  )
}
