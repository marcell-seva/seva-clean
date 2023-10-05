import {
  trackCarVariantBannerPromoClick,
  trackPromoBannerClick,
  trackPromoBannerSeeAllClick,
  trackSeeAllPromoClick,
} from 'helpers/amplitude/seva20Tracking'
import React from 'react'
import styles from 'styles/components/organisms/summary.module.scss'

const promoBannerTSO = '/revamp/illustration/PromoTSO.webp'
const promoBannerCumaDiSEVA = '/revamp/illustration/PromoCumaDiSEVA.webp'
const promoTradeIn = '/revamp/illustration/PromoTradeIn.webp'

import {
  IconChevronRight,
  IconEngine,
  IconFuel,
  IconPromo,
  IconSeat,
  IconTransmission,
  IconCar,
} from 'components/atoms'
import { CarVariantRecommendation } from 'utils/types/utils'
import {
  OTOCarResultsUrl,
  OTOVariantListUrl,
  variantListUrl,
} from 'utils/helpers/routes'
import elementId from 'helpers/elementIds'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { getLocalStorage } from 'utils/handler/localStorage'
import { LocalStorageKey } from 'utils/enum'
import { LoanRank } from 'utils/types/models'

type PromoSectionProps = {
  setPromoName?: (value: string) => void
  dataForAmplitude?: any
  onButtonClick?: (value: boolean) => void
  cheapestVariantData?: CarVariantRecommendation | undefined
  info?: any
  onPage?: string
  setSelectedTabValue?: (value: string) => void
  isOTO?: boolean
}

const PromoSection = ({
  setPromoName,
  dataForAmplitude,
  onButtonClick,
  cheapestVariantData,
  info,
  onPage,
  setSelectedTabValue,
  isOTO = false,
}: PromoSectionProps) => {
  const router = useRouter()
  const brand = router.query.brand as string
  const model = router.query.model as string
  const enablePromoCumaDiSeva = false

  const filterStorage: any = getLocalStorage(LocalStorageKey.CarFilter)

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

  const navigateToSpecificationTab = () => {
    setSelectedTabValue && setSelectedTabValue('Spesifikasi')
    window.location.href = (isOTO ? OTOVariantListUrl : variantListUrl)
      .replace(':brand', brand)
      .replace(':model', model)
      .replace(':tab?', 'spesifikasi')
  }
  const trackCountlePromoCLick = (promoDetail: string, promoOrder: number) => {
    trackEventCountly(CountlyEventNames.WEB_PROMO_CLICK, {
      CAR_BRAND: brand,
      CAR_MODEL: model,
      PROMO_DETAILS: promoDetail,
      PROMO_ORDER: promoOrder,
      PELUANG_KREDIT_BADGE: isUsingFilterFinancial
        ? getCreditBadgeForCountly()
        : 'Null',
      PAGE_ORIGINATION: 'PDP',
    })
  }
  return (
    <div>
      {onPage === 'VariantListPage' && (
        <div className={styles.cardInfoDetail} style={{ padding: '16px' }}>
          <div className={styles.row}>
            <div className={styles.rowWithGap}>
              <IconCar
                width={24}
                height={24}
                color={'#B4231E'}
                alt="SEVA Car Icon"
              />
              <h3 className={styles.kanyonMedium}>Detail</h3>
            </div>
            <div
              className={styles.rowWithGap}
              onClick={navigateToSpecificationTab}
              style={{ justifyContent: 'end' }}
              data-testid={elementId.PDP.CTA.LihatDetail}
            >
              <p className={styles.openSans} style={{ color: '#246ED4' }}>
                {'Lihat Detil'}
              </p>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.rowWithGap}>
              <IconSeat
                width={24}
                height={24}
                color={'#246ED4'}
                alt="SEVA Chair Icon"
              />
              <p className={styles.openSans} style={{ color: '#13131B' }}>
                {info.seats + ' Kursi'}
              </p>
            </div>
            <div className={styles.rowWithGap}>
              <IconTransmission
                width={24}
                height={24}
                color={'#246ED4'}
                alt="SEVA Transmition gear Icon"
              />
              <p className={styles.openSans} style={{ color: '#13131B' }}>
                {cheapestVariantData?.transmission}
              </p>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.rowWithGap}>
              <IconEngine
                width={24}
                height={24}
                color={'#246ED4'}
                alt="SEVA Engine Icon"
              />
              <p className={styles.openSans} style={{ color: '#13131B' }}>
                {'Mesin ' + cheapestVariantData?.engineCapacity + ' cc'}
              </p>
            </div>
            <div className={styles.rowWithGap}>
              <IconFuel
                width={24}
                height={24}
                color={'#246ED4'}
                alt="SEVA Gas Station icon"
              />
              <p className={styles.openSans} style={{ color: '#13131B' }}>
                {cheapestVariantData?.fuelType}
              </p>
            </div>
          </div>
        </div>
      )}
      <div
        className={styles.cardInfoDetail}
        style={{ height: 'auto', paddingTop: '7px' }}
      >
        <div
          className={styles.row}
          style={{ justifyContent: 'space-between', paddingLeft: '16px' }}
        >
          <div className={styles.rowWithGap}>
            {onPage === 'VariantListPage' ? (
              <div className={styles.headerWrapper}>
                <IconPromo
                  width={19}
                  height={19}
                  color={'#B4231E'}
                  alt="SEVA Price Tag icon"
                />
                <h3 className={styles.kanyonMedium}>Promo</h3>
              </div>
            ) : (
              <p
                className={styles.kanyonMediumBlue}
                data-testid={elementId.Homepage.Button.PromoEkslusif}
              >
                Promo Eksklusif
              </p>
            )}
          </div>
          {onPage === 'VariantListPage' ? (
            <a
              href="https://www.seva.id/info/promo/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.openSans}
              style={{ color: '#246ED4', paddingRight: '16px' }}
              onClick={() => trackSeeAllPromoClick(dataForAmplitude)}
              data-testid={elementId.PDP.CTA.LihatSemuaPromo}
            >
              Lihat Semua
            </a>
          ) : (
            <a
              href="https://www.seva.id/info/promo/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.openSansMedium}
              style={{ color: '#246ED4', paddingRight: '16px' }}
              onClick={() => trackPromoBannerSeeAllClick()}
              data-testid={elementId.Homepage.Promo.LihatSemua}
            >
              Lihat semua
            </a>
          )}
        </div>
        <div className={styles.rowScrollHorizontal}>
          {enablePromoCumaDiSeva ? (
            <div
              className={styles.bannerPromo}
              onClick={() => {
                if (onPage === 'VariantListPage') {
                  onButtonClick && onButtonClick(true)
                  setPromoName && setPromoName('promo1')
                  trackCarVariantBannerPromoClick(dataForAmplitude)
                  trackCountlePromoCLick('Promo Cuma di SEVA', 1)
                } else {
                  const Page_Direction_URL =
                    'https://www.seva.id/info/promo/cuma-di-seva/'
                  trackPromoBannerClick({ Page_Direction_URL })
                  window.open(Page_Direction_URL, '_blank')
                }
              }}
              data-testid={
                onPage === 'VariantListPage'
                  ? elementId.PDP.CTA.LihatDetail
                  : elementId.Homepage.Promo.DetailPromo
              }
            >
              <Image
                src={promoBannerCumaDiSEVA}
                className={styles.promoBannerSmall}
                height={156}
                width={208}
                alt="Promo Cuma di SEVA dapat Asuransi Comprehensive dan Cashback"
                loading="lazy"
              />
              <div>
                <p className={styles.textPromoBanner}>
                  Lihat detail{' '}
                  <div className={styles.spacingChevronIcon}>
                    <IconChevronRight width={16} height={16} color="#FFFFFF" />
                  </div>
                </p>
              </div>
            </div>
          ) : (
            <></>
          )}
          <div
            className={styles.bannerPromo}
            onClick={() => {
              if (onPage === 'VariantListPage') {
                onButtonClick && onButtonClick(true)
                setPromoName && setPromoName('promo2')
                trackCountlePromoCLick('Toyota Spektakuler', 2)
                trackCarVariantBannerPromoClick(dataForAmplitude)
              } else {
                const Page_Direction_URL =
                  'https://www.seva.id/info/promo/toyota-spektakuler/'
                trackPromoBannerClick({ Page_Direction_URL })
                window.open(Page_Direction_URL, '_blank')
              }
            }}
            data-testid={elementId.Homepage.Promo.DetailPromo}
          >
            <Image
              src={promoBannerTSO}
              className={styles.promoBannerSmall}
              height={156}
              width={208}
              alt="Promo Toyota Spektakuler Hemat Puluhan Juta"
              loading="lazy"
            />

            <div
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(255,0,0,0), black)`,
              }}
            >
              <p className={styles.textPromoBanner}>
                Lihat detail
                <div className={styles.spacingChevronIcon}>
                  <IconChevronRight width={16} height={16} color="#FFFFFF" />
                </div>
              </p>
            </div>
          </div>
          <div
            className={styles.bannerPromo}
            onClick={() => {
              if (onPage === 'VariantListPage') {
                onButtonClick && onButtonClick(true)
                setPromoName && setPromoName('promo3')
                trackCountlePromoCLick('Promo Trade-In Daihatsu', 3)
                trackCarVariantBannerPromoClick(dataForAmplitude)
              } else {
                const Page_Direction_URL =
                  'https://www.seva.id/info/promo/promo-trade-in-daihatsu/'
                trackPromoBannerClick({ Page_Direction_URL })
                window.open(Page_Direction_URL, '_blank')
              }
            }}
            data-testid={elementId.Homepage.Promo.DetailPromo}
          >
            <Image
              src={promoTradeIn}
              className={styles.promoBannerSmall}
              height={156}
              width={208}
              alt="Promo Daihatsu Tukar Mobil Kamu Dengan Mobil Daihatsu Baru"
              loading="lazy"
            />

            <div
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(255,0,0,0), black)`,
              }}
            >
              <p className={styles.textPromoBanner}>
                Lihat detail
                <div className={styles.spacingChevronIcon}>
                  <IconChevronRight width={16} height={16} color="#FFFFFF" />
                </div>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PromoSection
