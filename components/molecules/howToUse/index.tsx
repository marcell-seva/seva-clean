import React from 'react'
import styles from 'styles/components/organisms/howToUse.module.scss'
import {
  IconCalculator,
  IconCar2,
  IconChevronRight,
  IconFast,
} from 'components/atoms/icon'
import urls from 'utils/helpers/url'
import elementId from 'utils/helpers/trackerId'
import { sendAmplitudeData } from 'services/amplitude'
import { AmplitudeEventName } from 'services/amplitude/types'
import { useRouter } from 'next/router'
import { navigateToPLP, PreviousButton } from 'utils/navigate'

const HowToUse = () => {
  const router = useRouter()
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.headerText} style={{ width: '75%' }}>
        Cara Dapatkan Mobil Impian di SEVA
      </h2>
      <div className={styles.cardSpacing}>
        <div
          className={styles.cardHowToUse}
          onClick={() => {
            sendAmplitudeData(AmplitudeEventName.WEB_LP_HOW_TO_USE_SEVA_CLICK, {
              Page_Direction_URL:
                'https://' +
                window.location.host +
                urls.internalUrls.carResultsUrl,
            })
            navigateToPLP(PreviousButton.SevaSteps)
          }}
          data-testid={elementId.Homepage.PilihMobilImpian}
        >
          <div>
            <p className={styles.cardTextBold}>Pilih Mobil</p>
            <div className={styles.row}>
              <p className={styles.headerText}>Impian</p>
              <IconCar2 width={24} height={24} color={'#B4231E'} />
            </div>
            <div className={styles.row}>
              <p className={styles.textGrey}>
                Pilih mobil impian kamu dari berbagai merek dengan jaminan
                kualitas Astra.
              </p>
            </div>
          </div>
          <div>
            <IconChevronRight width={24} height={24} color={'#05256E'} />
          </div>
        </div>
        <div
          className={styles.cardHowToUse}
          onClick={() => {
            sendAmplitudeData(AmplitudeEventName.WEB_LP_HOW_TO_USE_SEVA_CLICK, {
              Page_Direction_URL:
                'https://' +
                window.location.host +
                urls.internalUrls.loanCalculatorDefaultUrl,
            })
            router.push({
              pathname: urls.internalUrls.loanCalculatorDefaultUrl,
              query: {
                from: 'homepageHitung',
              },
            })
          }}
          data-testid={elementId.Homepage.HitungKemampuan}
        >
          <div>
            <p className={styles.cardTextBold}>Hitung</p>
            <div className={styles.row}>
              <p className={styles.headerText}>Kemampuan</p>
              <IconCalculator width={24} height={24} color={'#B4231E'} />
            </div>
            <div className={styles.row}>
              <p className={styles.textGrey}>
                Dapatkan hasil perhitungan cicilan mobil yang sesuai dengan
                kemampuan finansialmu!
              </p>
            </div>
          </div>
          <div>
            <IconChevronRight width={24} height={24} color={'#05256E'} />
          </div>
        </div>
        <div
          className={styles.cardHowToUse}
          onClick={() => {
            sendAmplitudeData(AmplitudeEventName.WEB_LP_HOW_TO_USE_SEVA_CLICK, {
              Page_Direction_URL:
                'https://' +
                window.location.host +
                urls.internalUrls.loanCalculatorDefaultUrl,
            })
            router.push({
              pathname: urls.internalUrls.loanCalculatorDefaultUrl,
              query: {
                from: 'homepageKualifikasi',
              },
            })
          }}
          data-testid={elementId.Homepage.KualifikasiKredit}
        >
          <div>
            <div className={styles.row} style={{ marginBottom: '0px' }}>
              <p className={styles.cardTextBold}>Kualifikasi</p>
              <IconFast width={24} height={24} color={'#B4231E'} />
            </div>
            <div className={styles.row}>
              <p className={styles.headerText}>Kredit</p>
            </div>
            <div className={styles.row}>
              <p className={styles.textGrey}>
                Cek kualifikasi kredit kamu sebelum mengajukan pinjaman mobil.
              </p>
            </div>
          </div>
          <div>
            <IconChevronRight width={24} height={24} color={'#05256E'} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HowToUse
