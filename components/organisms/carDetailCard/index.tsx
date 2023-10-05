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
  variantListUrl,
} from 'utils/helpers/routes'
import { getCity } from 'utils/hooks/useCurrentCityOtr/useCurrentCityOtr'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { useSessionStorage } from 'utils/hooks/useSessionStorage/useSessionStorage'
import { formatBillionPoint } from 'utils/numberUtils/numberUtils'
import { Location } from 'utils/types'
import { CarRecommendation } from 'utils/types/context'
import { LoanRank } from 'utils/types/models'
import styles from '../../../styles/components/organisms/cardetailcard.module.scss'
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

type CarDetailCardProps = {
  order?: number
  recommendation: CarRecommendation
  onClickLabel: () => void
  onClickResultSulit: () => void
  onClickResultMudah: () => void
  setOpenInterestingModal: (value: boolean) => void
  isFilter?: boolean
  isFilterTrayOpened: boolean
  isOTO?: boolean
}

const LogoPrimary = '/revamp/icon/logo-primary.webp'

export const CarDetailCard = ({
  order = 0,
  recommendation,
  onClickLabel,
  isFilter,
  onClickResultSulit,
  onClickResultMudah,
  isFilterTrayOpened,
  setOpenInterestingModal,
  isOTO,
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
  const [, setCarModelLoanRankPLP] = useLocalStorage(
    LocalStorageKey.carModelLoanRank,
    null,
  )

  const dataCar: trackDataCarType | null = getSessionStorage(
    SessionStorageKey.PreviousCarDataBeforeLogin,
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
  const filterStorage: any = getLocalStorage(LocalStorageKey.CarFilter)

  const isUsingFilterFinancial =
    !!filterStorage?.age &&
    !!filterStorage?.downPaymentAmount &&
    !!filterStorage?.monthlyIncome &&
    !!filterStorage?.tenure

  const detailCarRoute = isOTO
    ? OTOVariantListUrl.replace(
        ':brand/:model',
        (recommendation.brand + '/' + recommendation.model.replace(/ +/g, '-'))
          .replace(/ +/g, '')
          .toLowerCase(),
      )
        .replace(':tab', '')
        .replace('?', `?loanRankCVL=${recommendation.loanRank}&source=plp`)
    : variantListUrl
        .replace(
          ':brand/:model',
          (
            recommendation.brand +
            '/' +
            recommendation.model.replace(/ +/g, '-')
          )
            .replace(/ +/g, '')
            .toLowerCase(),
        )
        .replace(':tab', '')
        .replace('?', `?loanRankCVL=${recommendation.loanRank}&source=plp`)

  const cityName = getCity()?.cityName || 'Jakarta Pusat'

  const navigateToLoanCalculator = () => {
    saveDataForCountlyTrackerPageViewLC(PreviousButton.ProductCardCalculate)
    const cityNameSlug = cityName.toLowerCase().trim().replace(/ +/g, '-')
    const brandSlug = recommendation.brand
      .toLowerCase()
      .trim()
      .replace(/ +/g, '-')
    const modelSlug = recommendation.model
      .toLowerCase()
      .trim()
      .replace(/ +/g, '-')
    const destinationUrl =
      loanCalculatorWithCityBrandModelVariantUrl
        .replace(':cityName', cityNameSlug)
        .replace(':brand', brandSlug)
        .replace(':model', modelSlug)
        .replace(':variant', '') + `?loanRankCVL=${recommendation.loanRank}`
    trackCarClick(order + 1, false, destinationUrl)
    setTimeout(() => {
      window.location.href = destinationUrl
    }, 1000)
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

  const saveDataCarForLoginPageView = () => {
    saveSessionStorage(SessionStorageKey.IsShowBadgeCreditOpportunity, 'true')
    const dataCarTemp = {
      ...dataCar,
      PELUANG_KREDIT_BADGE:
        isUsingFilterFinancial && recommendation.loanRank === LoanRank.Green
          ? 'Mudah disetujui'
          : isUsingFilterFinancial && recommendation.loanRank === LoanRank.Red
          ? 'Sulit disetujui'
          : 'Null',
    }

    saveSessionStorage(
      SessionStorageKey.PreviousCarDataBeforeLogin,
      JSON.stringify(dataCarTemp),
    )
  }
  const trackCarClick = (index: number, detailClick = true, url?: string) => {
    const peluangKredit = getPeluangKredit(recommendation)
    trackPLPCarClick({
      Car_Brand: recommendation.brand,
      Car_Model: recommendation.model,
      Peluang_Kredit: getPeluangKredit(recommendation),
      DP: `Rp${lowestDp} Juta`,
      Tenure: `${funnelQuery.tenure || 5}`,
      Cicilan: `Rp${lowestInstallment} jt/bln`,
      ...(cityOtr && { City: cityOtr?.cityName }),
    })
    setCarModelLoanRankPLP(recommendation.loanRank)
    const datatrack = {
      CAR_BRAND: recommendation.brand,
      CAR_MODEL: recommendation.model,
      CAR_ORDER: index,
      PAGE_DIRECTION_URL: window.location.origin + (url || detailCarRoute),
      PELUANG_KREDIT_BADGE:
        peluangKredit === 'Null' ? peluangKredit : peluangKredit + ' disetujui',
    }

    setLoanRankPLP(true)

    if (detailClick) {
      setTimeout(() => {
        trackEventCountly(CountlyEventNames.WEB_PLP_CAR_DETAIL_CLICK, datatrack)
      }, 500)
    } else {
      trackEventCountly(
        CountlyEventNames.WEB_PLP_PRODUCT_CARD_CTA_CLICK,
        datatrack,
      )
    }
  }

  const navigateToPDP = (index: number) => () => {
    if (!isFilterTrayOpened) {
      trackCarClick(index + 1)
      saveDataCarForLoginPageView()
      saveDataForCountlyTrackerPageViewPDP(PreviousButton.ProductCard)
      window.location.href = detailCarRoute
    }
  }

  const onClickSeeDetail = () => {
    saveDataForCountlyTrackerPageViewPDP(PreviousButton.ProductCard, 'PLP')
  }

  return (
    <div className={styles.container}>
      <CardShadow className={styles.cardWrapper}>
        {order === 0 ? (
          <Image
            src={recommendation.images[0]}
            className={styles.heroImg}
            alt={`${recommendation.brand} ${recommendation.model}`}
            onClick={navigateToPDP(order)}
            data-testid={elementId.CarImage}
            width={279}
            height={209}
            priority
          />
        ) : (
          <LazyLoadImage
            src={recommendation.images[0]}
            className={styles.heroImg}
            alt={`${recommendation.brand} ${recommendation.model}`}
            onClick={navigateToPDP(order)}
            data-testid={elementId.CarImage}
            width={279}
          />
        )}

        <LabelPromo
          className={styles.labelCard}
          onClick={onClickLabel}
          data-testid={elementId.PLP.Button.Promo}
        />
        {isOTO && (
          <Image
            src={LogoPrimary}
            height={30}
            width={50}
            alt="Logo SEVA"
            className={styles.logoImg}
            data-testid={elementId.Homepage.GlobalHeader.IconLogoSeva}
            priority={true}
          />
        )}
        {isFilter && recommendation.loanRank === 'Red' && (
          <LabelSulit onClick={onClickResultSulit} />
        )}
        {isFilter && recommendation.loanRank === 'Green' && (
          <LabelMudah onClick={onClickResultMudah} />
        )}
        <div
          className={styles.contentWrapper}
          role="button"
          onClick={navigateToPDP(order)}
        >
          <h2
            className={styles.brandModelText}
            data-testid={elementId.PLP.Text + 'brand-model-mobil'}
          >
            {recommendation.brand} {recommendation.model}
          </h2>
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
          onClick={() =>
            isOTO ? setOpenInterestingModal(true) : navigateToLoanCalculator()
          }
          data-testid={elementId.PLP.Button.HitungKemampuan}
        >
          {isOTO ? 'Saya Tertarik' : 'Hitung Kemampuan'}
        </Button>
      </CardShadow>
    </div>
  )
}
