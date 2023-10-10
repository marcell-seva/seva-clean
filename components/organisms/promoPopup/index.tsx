import { BottomSheet } from 'react-spring-bottom-sheet'
import 'react-spring-bottom-sheet/dist/style.css'
import React from 'react'
import styles from 'styles/components/organisms/promoPopupPdp.module.scss'
import { IconClose } from 'components/atoms'
import { trackCarVariantBannerPromoPopupClose } from 'helpers/amplitude/seva20Tracking'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { CityOtrOption, trackDataCarType } from 'utils/types/utils'
import { useCar } from 'services/context/carContext'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { getLocalStorage } from 'utils/handler/localStorage'
import { useRouter } from 'next/router'
import { LoanRank } from 'utils/types/models'
import Image from 'next/image'
import { getSessionStorage } from 'utils/handler/sessionStorage'

const promoBannerTSO = '/revamp/illustration/PromoTSO.webp'
const promoBannerCumaDiSEVA = '/revamp/illustration/PromoCumaDiSEVA.webp'
const promoBannerTradeIn = '/revamp/illustration/PromoTradeIn.webp'

type FilterMobileProps = {
  onButtonClick?: (value: boolean) => void
  isButtonClick?: boolean
  promoName: string
}
const PromoPopup = ({
  onButtonClick,
  isButtonClick,
  promoName,
}: FilterMobileProps) => {
  const { carModelDetails } = useCar()
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )

  const router = useRouter()
  const filterStorage: any = getLocalStorage(LocalStorageKey.CarFilter)
  const dataCar: trackDataCarType | null = getSessionStorage(
    SessionStorageKey.PreviousCarDataBeforeLogin,
  )
  const IsShowBadgeCreditOpportunity = getSessionStorage(
    SessionStorageKey.IsShowBadgeCreditOpportunity,
  )
  const isUsingFilterFinancial =
    !!filterStorage?.age &&
    !!filterStorage?.downPaymentAmount &&
    !!filterStorage?.monthlyIncome &&
    !!filterStorage?.tenure

  const loanRankcr = router.query.loanRankCVL ?? ''

  const getCreditBadgeForCountly = () => {
    let creditBadge = 'Null'
    if (loanRankcr && loanRankcr.includes(LoanRank.Green)) {
      creditBadge = 'Mudah disetujui'
    } else if (loanRankcr && loanRankcr.includes(LoanRank.Red)) {
      creditBadge = 'Sulit disetujui'
    }
    return creditBadge
  }

  const getDataForAmplitude = () => {
    return {
      Car_Brand: carModelDetails?.brand,
      Car_Model: carModelDetails?.model,
      City: cityOtr?.cityName || 'null',
      Page_Origination_URL: window.location.href,
    }
  }
  const onClickClose = () => {
    onButtonClick && onButtonClick(false)
    trackCarVariantBannerPromoPopupClose(getDataForAmplitude())
  }
  const trackClickPromoSK = (promoDetail: string, promoOrder: number) => {
    trackEventCountly(CountlyEventNames.WEB_PROMO_SK_CLICK, {
      CAR_BRAND: carModelDetails?.brand,
      CAR_MODEL: carModelDetails?.model,
      PROMO_DETAILS: promoDetail,
      PROMO_ORDER: promoOrder,
      PELUANG_KREDIT_BADGE:
        isUsingFilterFinancial && IsShowBadgeCreditOpportunity
          ? dataCar?.PELUANG_KREDIT_BADGE
          : 'Null',
      PAGE_ORIGINATION: 'PDP',
    })
  }
  const PromoCumanDiSeva = (): JSX.Element => (
    <div className={styles.container}>
      <div className={styles.popupSubHeader}>
        <p className={styles.kanyonMedium}>Promo Cuma di SEVA</p>
        <div onClick={() => onClickClose()}>
          <IconClose width={24} height={24} />
        </div>
      </div>
      <div className={styles.imagePromoSpacing}>
        <Image
          src={promoBannerCumaDiSEVA}
          alt="promo banner cuma di seva"
          className={styles.promoBanner}
          width={373}
          height={280}
        />
      </div>
      <div>
        <p className={styles.openSans}>
          <b className={styles.openSansSemiBold}>Cashback 1 Angsuran</b>
          <br />
          Dapatkan max. cashback 4 juta rupiah setelah melakukan pembayaran
          Angsuran Pertama. Khusus pembelian mobil secara kredit dengan tenor 1
          - 5 tahun melalui ACC dan TAF.
          <br />
          <br />
          <b className={styles.openSansSemiBold}>
            Bebas 1 Tahun Asuransi Comprehensive Garda Oto
          </b>
          <br />
          Berlaku untuk pembelian mobil baru Toyota dan Daihatsu dengan tipe
          mobil passenger car. Khusus pembelian mobil secara kredit dengan tenor
          3 - 5 tahun.
          <br />
          <br />
          <a
            className={styles.openSans}
            color={'#246ed4'}
            href="https://www.seva.id/info/promo/cuma-di-seva/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClickPromoSK('Promo Cuma di SEVA', 1)}
          >
            {' '}
            Lihat S&K.
          </a>
        </p>
      </div>
    </div>
  )

  const PromoTSO = (): JSX.Element => (
    <div className={styles.container}>
      <div className={styles.popupSubHeader}>
        <p className={styles.kanyonMedium}>Toyota Spektakuler</p>
        <div onClick={() => onClickClose()}>
          <IconClose width={24} height={24} />
        </div>
      </div>
      <div className={styles.imagePromoSpacing}>
        <Image
          src={promoBannerTSO}
          alt="promo banner TSO"
          className={styles.promoBanner}
        />
      </div>
      <div>
        <p className={styles.openSans}>
          <b className={styles.openSansSemiBold}>Paket Toyota Spektakuler</b>
          <br />
          Dapatkan bunga spesial mulai dari 0%, bebas biaya administrasi atau
          bebas 2 tahun asuransi comprehensive hingga 20 juta rupiah untuk
          pembelian mobil baru Toyota Veloz, Avanza, Raize, dan Rush secara
          kredit. Khusus tipe Zenix Gasoline, berlaku bunga spesial mulai dari
          2.77%.
          <br />
          <br />
          <a
            className={styles.openSans}
            color={'#246ed4'}
            href="https://www.seva.id/info/promo/toyota-spektakuler/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClickPromoSK('Toyota Spektakuler', 1)} // because promo "cuma di seva" hidden
          >
            {' '}
            Lihat S&K.
          </a>
        </p>
      </div>
    </div>
  )
  const PromoTradeInDaihatsu = (): JSX.Element => (
    <div className={styles.container}>
      <div className={styles.popupSubHeader}>
        <p className={styles.kanyonMedium}> Promo Trade-In Daihatsu </p>
        <div onClick={() => onClickClose()}>
          <IconClose width={24} height={24} />
        </div>
      </div>
      <div className={styles.imagePromoSpacing}>
        <Image
          src={promoBannerTradeIn}
          alt="promo banner trade In"
          className={styles.promoBanner}
          width={373}
          height={280}
        />
      </div>
      <div>
        <p className={styles.openSans}>
          <b className={styles.openSansSemiBold}>
            Promo Potongan DP & Cashback Daihatsu
          </b>
          <br />
          Dapatkan cashback tambahan trade-in senilai 1 juta rupiah untuk
          pembelian mobil baru Brand Daihatsu semua tipe (LCGC dan non-LCGC).
          <br />
          <br />
          <a
            className={styles.openSans}
            color={'#246ed4'}
            href="https://www.seva.id/info/promo/promo-trade-in-daihatsu/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClickPromoSK('Promo Trade-In Daihatsu', 2)} // because promo "cuma di seva" hidden
          >
            {' '}
            Lihat S&K.
          </a>
        </p>
      </div>
    </div>
  )

  const renderPromoSection = (key: string) => {
    switch (key) {
      case 'promo1':
        return <PromoCumanDiSeva />
      case 'promo2':
        return <PromoTSO />
      case 'promo3':
        return <PromoTradeInDaihatsu />
      default:
        return <PromoCumanDiSeva />
    }
  }
  return (
    <div>
      <BottomSheet
        open={isButtonClick || false}
        onDismiss={() => onClickClose()}
      >
        {renderPromoSection(promoName)}
      </BottomSheet>
    </div>
  )
}

export default PromoPopup
