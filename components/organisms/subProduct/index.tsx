import React from 'react'
import styles from 'styles/components/organisms/subProduct.module.scss'
import layananSuratKendaraanBanner from 'assets/illustration/sub-product-2.webp'
import fasilitasDanaBanner from 'assets/illustration/sub-product-1.webp'
import Image from 'next/image'
import elementId from 'utils/helpers/trackerId'
import { sendAmplitudeData } from 'services/amplitude'
import { AmplitudeEventName } from 'services/amplitude/types'
import { IconChevronRight } from 'components/atoms/icons'

const SubProduct = () => {
  const title = ['Fasilitas Dana', 'Layanan Surat Kendaraan']
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
              window.open('https://www.seva.id/fasilitas-dana', '_blank')
            }}
            data-testid={elementId.Homepage.Button.LebihLanjut.Refi}
          >
            <Image
              alt="fasilitas-dana"
              src={fasilitasDanaBanner}
              className={styles.promoBannerSmall}
              height="196"
            />
            <div>
              <p className={styles.textTitlePromoBanner}>{title[0]}</p>
              <p className={styles.textDescriptionBanner}>
                Solusi untuk kebutuhan dana langsung cair dengan jaminan BPKB
                mobil
              </p>
              <p className={styles.textPromoBanner}>
                Pelajari Lebih Lanjut{' '}
                <div className={styles.spacingChevronIcon}>
                  <IconChevronRight width={16} height={16} color="#FFFFFF" />
                </div>
              </p>
            </div>
          </div>
          <div
            className={styles.bannerPromo}
            onClick={() => {
              sendAmplitudeData(AmplitudeEventName.WEB_LP_SUB_PRODUCT_CLICK, {
                Sub_Product: title[1],
              })
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
            />
            <div
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(255,0,0,0), black);`,
              }}
            >
              <p className={styles.textTitlePromoBanner}>{title[1]}</p>
              <p className={styles.textDescriptionBanner}>
                Urus surat kendaraanmu lewat SEVA
              </p>
              <p className={styles.textPromoBanner}>
                Pelajari Lebih Lanjut
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
export default SubProduct
