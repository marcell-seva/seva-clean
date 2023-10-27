import React from 'react'
import styles from 'styles/components/organisms/subProduct.module.scss'
import layananSuratKendaraanBanner from '/public/revamp/illustration/sub-product-2.webp'
import fasilitasDanaBanner from '/public/revamp/illustration/sub-product-1.webp'
import Image from 'next/image'
import elementId from 'utils/helpers/trackerId'
import { sendAmplitudeData } from 'services/amplitude'
import { AmplitudeEventName } from 'services/amplitude/types'
import { IconChevronRight } from 'components/atoms/icon'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'

const SubProduct = () => {
  const title = ['Fasilitas Dana', 'Layanan Surat Kendaraan']
  const trackCountly = (promoUrl: string, promoOrder: number) => {
    trackEventCountly(CountlyEventNames.WEB_HOMEPAGE_LAYANAN_LAIN_CLICK, {
      PAGE_DIRECTION_URL: promoUrl,
      BANNER_ORDER: promoOrder,
    })
  }
  return (
    <div data-testid={elementId.Homepage.LayananLainSeva}>
      <div className={styles.wrapperTitleSection}>
        <h2 className={styles.textHeaderSection}>Layanan Lain dari SEVA</h2>
      </div>
      <div
        className={styles.cardInfoDetail}
        style={{ height: 'auto', paddingTop: '16px' }}
      >
        <div className={styles.rowScrollHorizontal}>
          <div
            className={styles.bannerPromo}
            onClick={() => {
              sendAmplitudeData(AmplitudeEventName.WEB_LP_SUB_PRODUCT_CLICK, {
                Sub_Product: title[0],
              })
              trackCountly('https://www.seva.id/fasilitas-dana', 1)
              window.open('https://www.seva.id/fasilitas-dana', '_blank')
            }}
            data-testid={elementId.Homepage.Button.LebihLanjut.Refi}
          >
            <Image
              alt="fasilitas-dana"
              src={fasilitasDanaBanner}
              className={styles.promoBannerSmall}
              height="196"
              loading="lazy"
            />
            <div>
              <h3 className={styles.textTitlePromoBanner}>{title[0]}</h3>
              <p className={styles.textDescriptionBanner}>
                Solusi untuk kebutuhan dana langsung cair dengan jaminan BPKB
                mobil
              </p>
              <div className={styles.textPromoBanner}>
                Pelajari Lebih Lanjut{' '}
                <div className={styles.spacingChevronIcon}>
                  <IconChevronRight width={16} height={16} color="#FFFFFF" />
                </div>
              </div>
            </div>
          </div>
          <div
            className={styles.bannerPromo}
            onClick={() => {
              sendAmplitudeData(AmplitudeEventName.WEB_LP_SUB_PRODUCT_CLICK, {
                Sub_Product: title[1],
              })
              trackCountly('https://www.seva.id/layanan-surat-kendaraan', 2)
              window.open(
                'https://www.seva.id/layanan-surat-kendaraan',
                '_blank',
              )
            }}
            data-testid={elementId.Homepage.Button.LebihLanjut.LayananKendaraan}
          >
            <Image
              alt="layanan-surat-kendaraan"
              src={layananSuratKendaraanBanner}
              className={styles.promoBannerSmall}
              height="196"
              loading="lazy"
            />
            <div className={styles.wrapperDetail}>
              <h3 className={styles.textTitlePromoBanner}>{title[1]}</h3>
              <p className={styles.textDescriptionBanner}>
                Urus surat kendaraanmu lewat SEVA
              </p>
              <div className={styles.textPromoBanner}>
                Pelajari Lebih Lanjut
                <div className={styles.spacingChevronIcon}>
                  <IconChevronRight width={16} height={16} color="#FFFFFF" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default SubProduct
