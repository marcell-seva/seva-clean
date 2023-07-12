import React from 'react'
import styles from 'styles/components/organisms/summary.module.scss'
import promoBannerTSO from 'assets/illustration/PromoTSO.webp'
import promoBannerCumaDiSEVA from 'assets/illustration/PromoCumaDiSEVA.webp'
import promoTradeIn from 'assets/illustration/PromoTradeIn.webp'
import { sendAmplitudeData } from 'services/amplitude'
import { AmplitudeEventName } from 'services/amplitude/types'
import Image from 'next/image'
import {
  IconCar,
  IconChevronRight,
  IconEngine,
  IconFuel,
  IconPromo,
  IconSeat,
  IconTransmission,
} from 'components/atoms/icons'
import { CarVariantRecommendation } from 'utils/types/props'
import urls from 'utils/helpers/url'
import elementId from 'utils/helpers/trackerId'
import { useRouter } from 'next/router'

type PromoSectionProps = {
  setPromoName?: (value: string) => void
  dataForAmplitude?: any
  onButtonClick?: (value: boolean) => void
  cheapestVariantData?: CarVariantRecommendation | undefined
  info?: any
  onPage?: string
  setSelectedTabValue?: (value: string) => void
}

const PromoSection = ({
  setPromoName,
  dataForAmplitude,
  onButtonClick,
  cheapestVariantData,
  info,
  onPage,
  setSelectedTabValue,
}: PromoSectionProps) => {
  const router = useRouter()
  const { brand, model }: any = router.query
  const navigateToSpecificationTab = () => {
    setSelectedTabValue && setSelectedTabValue('Spesifikasi')
    router.push(
      urls.internalUrls.variantListUrl
        .replace(':brand', brand)
        .replace(':model', model)
        .replace(':tab?', 'spesifikasi'),
    )
  }
  return (
    <div>
      {onPage === 'VariantListPage' && (
        <div className={styles.cardInfoDetail} style={{ padding: '16px' }}>
          <div className={styles.row}>
            <div className={styles.rowWithGap}>
              <IconCar width={24} height={24} color={'#B4231E'} />
              <span className={styles.kanyonMedium}>Detail</span>
            </div>
            <div
              className={styles.rowWithGap}
              onClick={navigateToSpecificationTab}
              style={{ justifyContent: 'end' }}
              data-testid={elementId.PDP.CTA.LihatDetail}
            >
              <span className={styles.openSans} style={{ color: '#246ED4' }}>
                {'Lihat Detil'}
              </span>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.rowWithGap}>
              <IconSeat width={24} height={24} color={'#246ED4'} />
              <span className={styles.openSans} style={{ color: '#13131B' }}>
                {info.seats + ' Kursi'}
              </span>
            </div>
            <div className={styles.rowWithGap}>
              <IconTransmission width={24} height={24} color={'#246ED4'} />
              <span className={styles.openSans} style={{ color: '#13131B' }}>
                {cheapestVariantData?.transmission}
              </span>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.rowWithGap}>
              <IconEngine width={24} height={24} color={'#246ED4'} />
              <span className={styles.openSans} style={{ color: '#13131B' }}>
                {'Mesin ' + cheapestVariantData?.engineCapacity + ' cc'}
              </span>
            </div>
            <div className={styles.rowWithGap}>
              <IconFuel width={24} height={24} color={'#246ED4'} />
              <span className={styles.openSans} style={{ color: '#13131B' }}>
                {cheapestVariantData?.fuelType}
              </span>
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
                <IconPromo width={19} height={19} color={'#B4231E'} />
                <h2 className={styles.kanyonMedium}>Promo</h2>
              </div>
            ) : (
              <span
                className={styles.kanyonMediumBlue}
                data-testid={elementId.Homepage.Button.PromoEkslusif}
              >
                Promo Eksklusif
              </span>
            )}
          </div>
          {onPage === 'VariantListPage' ? (
            <a
              href="https://www.seva.id/info/promo/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.openSans}
              style={{ color: '#246ED4', paddingRight: '16px' }}
              onClick={() =>
                sendAmplitudeData(
                  AmplitudeEventName.WEB_PDP_PROMO_LIHAT_SEMUA_CLICK,
                  dataForAmplitude,
                )
              }
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
              onClick={() =>
                sendAmplitudeData(
                  AmplitudeEventName.WEB_PROMO_BANNER_SEE_ALL_CLICK,
                  null,
                )
              }
              data-testid={elementId.Homepage.Promo.LihatSemua}
            >
              Lihat semua
            </a>
          )}
        </div>
        <div className={styles.rowScrollHorizontal}>
          <div
            className={styles.bannerPromo}
            onClick={() => {
              if (onPage === 'VariantListPage') {
                onButtonClick && onButtonClick(true)
                setPromoName && setPromoName('promo1')
                sendAmplitudeData(
                  AmplitudeEventName.WEB_PDP_BANNER_PROMO_CLICK,
                  dataForAmplitude,
                )
              } else {
                const Page_Direction_URL =
                  'https://www.seva.id/info/promo/cuma-di-seva/'
                sendAmplitudeData(AmplitudeEventName.WEB_PROMO_BANNER_CLICK, {
                  Page_Direction_URL,
                })
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
              alt="promo-banner"
              src={promoBannerCumaDiSEVA}
              className={styles.promoBannerSmall}
              height="156"
            />
            <div>
              <span className={styles.textPromoBanner}>
                Lihat detail{' '}
                <div className={styles.spacingChevronIcon}>
                  <IconChevronRight width={16} height={16} color="#FFFFFF" />
                </div>
              </span>
            </div>
          </div>
          <div
            className={styles.bannerPromo}
            onClick={() => {
              if (onPage === 'VariantListPage') {
                onButtonClick && onButtonClick(true)
                setPromoName && setPromoName('promo2')
                sendAmplitudeData(
                  AmplitudeEventName.WEB_PDP_BANNER_PROMO_CLICK,
                  dataForAmplitude,
                )
              } else {
                const Page_Direction_URL =
                  'https://www.seva.id/info/promo/toyota-spektakuler/'
                sendAmplitudeData(AmplitudeEventName.WEB_PROMO_BANNER_CLICK, {
                  Page_Direction_URL,
                })
                window.open(Page_Direction_URL, '_blank')
              }
            }}
            data-testid={elementId.Homepage.Promo.DetailPromo}
          >
            <Image
              alt="promo-banner"
              src={promoBannerTSO}
              className={styles.promoBannerSmall}
              height="156"
            />

            <div className={styles.wrapperDetail}>
              <span className={styles.textPromoBanner}>
                Lihat detail
                <div className={styles.spacingChevronIcon}>
                  <IconChevronRight width={16} height={16} color="#FFFFFF" />
                </div>
              </span>
            </div>
          </div>
          <div
            className={styles.bannerPromo}
            onClick={() => {
              if (onPage === 'VariantListPage') {
                onButtonClick && onButtonClick(true)
                setPromoName && setPromoName('promo3')
                sendAmplitudeData(
                  AmplitudeEventName.WEB_PDP_BANNER_PROMO_CLICK,
                  dataForAmplitude,
                )
              } else {
                const Page_Direction_URL =
                  'https://www.seva.id/info/promo/promo-trade-in-daihatsu/'
                sendAmplitudeData(AmplitudeEventName.WEB_PROMO_BANNER_CLICK, {
                  Page_Direction_URL,
                })
                window.open(Page_Direction_URL, '_blank')
              }
            }}
            data-testid={elementId.Homepage.Promo.DetailPromo}
          >
            <Image
              alt="promo-banner"
              src={promoTradeIn}
              className={styles.promoBannerSmall}
              height="156"
            />

            <div className={styles.wrapperDetail}>
              <span className={styles.textPromoBanner}>
                Lihat detail
                <div className={styles.spacingChevronIcon}>
                  <IconChevronRight width={16} height={16} color="#FFFFFF" />
                </div>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PromoSection
