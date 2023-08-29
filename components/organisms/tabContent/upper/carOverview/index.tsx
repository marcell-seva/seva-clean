import React, { useContext, useMemo, useState } from 'react'
import styles from 'styles/components/organisms/carOverView.module.scss'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import {
  IconEdit,
  IconInfo,
  Button,
  TextButton,
  IconDownload,
  IconShare,
} from 'components/atoms'
import { useDetectClickOutside } from 'react-detect-click-outside'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import elementId from 'helpers/elementIds'
import {
  CarVariantHitungKemampuanParam,
  trackCarVariantShareClick,
  trackDownloadBrosurClick,
  trackPDPHitungKemampuan,
} from 'helpers/amplitude/seva20Tracking'
import { variantListUrl } from 'utils/helpers/routes'
import { CityOtrOption, VariantDetail } from 'utils/types/utils'
import { useRouter } from 'next/router'
import { PdpDataLocalContext } from 'pages/mobil-baru/[brand]/[model]/[[...slug]]'
import { useCar } from 'services/context/carContext'
import { LanguageCode, LocalStorageKey } from 'utils/enum'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { Currency } from 'utils/handler/calculation'
import { formatNumberByLocalization } from 'utils/handler/rupiah'
import {
  formatPriceNumberThousandDivisor,
  formatPriceNumber,
} from 'utils/numberUtils/numberUtils'

interface Props {
  onClickCityOtrCarOverview: () => void
  onClickShareButton: () => void
  currentTabMenu: string
}

export const CarOverview = ({
  onClickCityOtrCarOverview,
  onClickShareButton,
  currentTabMenu,
}: Props) => {
  const { carModelDetailsResDefaultCity, carVariantDetailsResDefaultCity } =
    useContext(PdpDataLocalContext)

  const { carModelDetails, carVariantDetails } = useCar()
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )

  const modelDetail = carModelDetails || carModelDetailsResDefaultCity
  const variantDetail = carVariantDetails || carVariantDetailsResDefaultCity

  const [isShowTooltip, setIsShowTooltip] = useState(false)
  const tooltipRef = useDetectClickOutside({
    onTriggered: () => {
      if (isShowTooltip) {
        setIsShowTooltip(false)
      }
    },
  })
  const { funnelQuery } = useFunnelQueryData()
  const router = useRouter()
  const brand = router.query.brand as string
  const model = router.query.model as string
  const tab = router.query.tab as string

  const sortedCarModelVariant = useMemo(() => {
    return (
      modelDetail?.variants.sort(function (a: VariantDetail, b: VariantDetail) {
        return a.priceValue - b.priceValue
      }) || []
    )
  }, [modelDetail])

  const onClickToolTipIcon = () => {
    setIsShowTooltip(true)
  }

  const closeTooltip = () => {
    // need to use timeout, if not it wont work
    setTimeout(() => {
      setIsShowTooltip(false)
    }, 100)
  }

  const onClickOtrCity = () => {
    modelDetail?.brand !== 'Daihatsu' && onClickCityOtrCarOverview()
  }

  const getCity = () => {
    if (modelDetail?.brand === 'Daihatsu') {
      return 'Jakarta Pusat'
    } else if (cityOtr && cityOtr.cityName) {
      return cityOtr.cityName
    } else {
      return 'Jakarta Pusat'
    }
  }

  const getCarPriceRange = () => {
    if (sortedCarModelVariant[0].priceValue.toString().length > 9) {
      return (
        'Rp' +
        formatPriceNumberThousandDivisor(
          formatPriceNumber(sortedCarModelVariant[0].priceValue),
          LanguageCode.id,
        ) +
        ' - ' +
        formatPriceNumberThousandDivisor(
          formatPriceNumber(
            sortedCarModelVariant[sortedCarModelVariant.length - 1].priceValue,
          ),
          LanguageCode.id,
        )
      )
    } else {
      return (
        'Rp' +
        formatNumberByLocalization(
          sortedCarModelVariant[0].priceValue,
          LanguageCode.id,
          1000000,
          10,
        ) +
        ' - ' +
        formatNumberByLocalization(
          sortedCarModelVariant[sortedCarModelVariant.length - 1].priceValue,
          LanguageCode.id,
          1000000,
          10,
        )
      )
    }
  }

  const getMonthlyInstallment = () => {
    return formatNumberByLocalization(
      sortedCarModelVariant[0].monthlyInstallment,
      LanguageCode.id,
      1000000,
      10,
    )
  }

  const getDp = () => {
    return formatNumberByLocalization(
      sortedCarModelVariant[0].dpAmount,
      LanguageCode.id,
      1000000,
      10,
    )
  }

  const getTenure = () => {
    return sortedCarModelVariant[0].tenure
  }

  const trackAmplitudeShare = () => {
    trackCarVariantShareClick({
      Car_Brand: modelDetail?.brand ?? '',
      Car_Model: modelDetail?.model ?? '',
      // OTR: `Rp${replacePriceSeparatorByLocalization(
      //   modelDetail?.variants[0].priceValue as number,
      //   LanguageCode.id,
      // )}`,
      City: cityOtr?.cityName || 'null',
      Page_Origination_URL: window.location.href,
    })
  }

  const onClickShareButtonHandler = () => {
    trackAmplitudeShare()
    onClickShareButton()
  }

  const trackAmplitudeBrochure = () => {
    if (modelDetail) {
      trackDownloadBrosurClick({
        Car_Brand: modelDetail?.brand as string,
        Car_Model: modelDetail?.model as string,
        City: cityOtr?.cityName || 'null',
      })
    }
  }

  const trackHitungKemampuan = () => {
    const currentDp =
      funnelQuery.downPaymentAmount &&
      funnelQuery.downPaymentAmount?.toString().length > 0
        ? funnelQuery.downPaymentAmount
        : sortedCarModelVariant[0].dpAmount
    const properties: CarVariantHitungKemampuanParam = {
      Car_Brand: modelDetail?.brand as string,
      Car_Model: modelDetail?.model as string,
      City: cityOtr?.cityName || 'null',
      DP: `Rp${Currency(String(currentDp))}`,
      Cicilan: `Rp${getMonthlyInstallment()}`,
      Tenure: `${getTenure()} tahun`,
      Photo_Type: currentTabMenu,
    }
    trackPDPHitungKemampuan(properties)
  }

  const onClickCalculateCta = () => {
    trackHitungKemampuan()
    window.location.href =
      variantListUrl
        .replace(':brand', brand)
        .replace(':model', model)
        .replace(':tab', 'kredit') + `${tab && `tab=${tab}`}`
  }

  if (!modelDetail || !variantDetail) return <></>

  return (
    <div className={styles.container}>
      <h1
        className={styles.carBrandModelText}
        data-testid={elementId.Text + 'car-brand-model'}
      >
        {modelDetail?.brand + ' ' + modelDetail?.model}
      </h1>
      <p
        className={styles.carDescriptionText}
        data-testid={elementId.Text + 'car-description'}
      >
        {modelDetail?.brand + ' ' + modelDetail?.model} 2023 adalah{' '}
        {variantDetail?.variantDetail.carSeats} Seater{' '}
        {variantDetail?.variantDetail.bodyType}{' '}
        {sortedCarModelVariant.length === 1
          ? 'yang tersedia dalam daftar harga mulai dari ' +
            (sortedCarModelVariant[0].priceValue.toString().length > 9
              ? 'Rp ' +
                formatPriceNumberThousandDivisor(
                  formatPriceNumber(sortedCarModelVariant[0].priceValue),
                  LanguageCode.id,
                )
              : 'Rp ' +
                formatNumberByLocalization(
                  sortedCarModelVariant[0].priceValue,
                  LanguageCode.id,
                  1000000,
                  1,
                ))
          : 'yang tersedia dalam daftar harga ' + getCarPriceRange()}{' '}
        Juta di Indonesia.
      </p>

      <div className={styles.otrWrapper}>
        <div
          className={styles.cityInfoWrapper}
          data-testid={elementId.PDP.OTR.Widget.CTACitySelector}
        >
          <span className={styles.otrCityInfo}>
            Harga OTR{' '}
            <span
              style={{
                color:
                  modelDetail?.brand === 'Daihatsu' ? '#878D98' : '#246ED4',
              }}
              onClick={onClickOtrCity}
              data-testid={elementId.PDP.CarOverview.CityOtr}
            >
              {getCity()}
            </span>
          </span>
          {modelDetail?.brand === 'Daihatsu' ? (
            <div
              className={styles.tooltipWrapper}
              ref={tooltipRef}
              onClick={onClickToolTipIcon}
              data-testid={elementId.PDP.CarOverview.CityToolTip}
            >
              <div className={styles.tooltipIcon}>
                <IconInfo width={11} height={11} color="#878D98" />
              </div>
              {isShowTooltip ? (
                <div className={styles.tooltipCard}>
                  <IconInfo width={24} height={24} color="#FFFFFF" />
                  <div className={styles.tooltipContent}>
                    <span className={styles.tooltipDesc}>
                      Harga OTR Daihatsu menggunakan harga OTR Jakarta Pusat
                    </span>
                    <button
                      className={styles.tooltipCloseButton}
                      onClick={closeTooltip}
                    >
                      OK, Saya Mengerti
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <button
              className={styles.otrCityButton}
              onClick={onClickOtrCity}
              data-testid={elementId.PDP.CarOverview.CityOtr}
            >
              <IconEdit width={16} height={16} color="#246ED4" />
            </button>
          )}
        </div>
        <h3
          className={styles.carOtrPriceText}
          data-testid={elementId.PDP.OTR.Widget.Price}
        >
          {getCarPriceRange() + ' jt'}
        </h3>
      </div>

      <div className={styles.packageWrapper}>
        <div
          className={styles.packageItem}
          style={{ flex: 1 }}
          data-testid={elementId.PDP.CarOverview.Cicilan}
        >
          <span className={styles.packageLabel}>Cicilan</span>
          <span className={styles.packageValue}>
            Rp
            {getMonthlyInstallment()} jt/bln
          </span>
        </div>
        <div
          className={styles.packageItem}
          style={{ flex: 1 }}
          data-testid={elementId.PDP.CarOverview.DPValue}
        >
          <span className={styles.packageLabel}>DP</span>
          <span className={styles.packageValue}>
            Rp
            {getDp()} jt
          </span>
        </div>
        <div
          className={styles.packageItem}
          data-testid={elementId.PDP.CarOverview.TenorValue}
        >
          <span className={styles.packageLabel}>Tenor</span>
          <span className={styles.packageValue}>{getTenure()} Tahun</span>
        </div>
      </div>

      <div className={styles.downloadBrochureWrapper}>
        <a
          href={variantDetail?.variantDetail.pdfUrl}
          style={{ width: '100%' }}
          target="_blank"
          rel="noreferrer"
          data-testid={elementId.PDP.CarOverview.DownloadBrochure}
          onClick={trackAmplitudeBrochure}
        >
          <TextButton
            leftIcon={() => (
              <IconDownload width={16} height={16} color="#246ED4" />
            )}
            data-testid={elementId.PDP.CTA.UnduhBrosur}
          >
            Unduh Brosur
          </TextButton>
        </a>
      </div>

      <div className={styles.ctaAndShareGroup}>
        <div className={styles.ctaWrapper}>
          <Button
            version={ButtonVersion.PrimaryDarkBlue}
            size={ButtonSize.Big}
            onClick={onClickCalculateCta}
            data-testid={elementId.PDP.Button.HitungKemampuan}
          >
            Hitung Kemampuan
          </Button>
        </div>

        <button
          className={styles.shareButton}
          onClick={onClickShareButtonHandler}
          data-testid={elementId.PDP.Button.Share}
        >
          <IconShare width={32} height={32} color="#05256E" />
        </button>
      </div>
    </div>
  )
}
