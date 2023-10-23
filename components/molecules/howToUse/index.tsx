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
import {
  navigateToPLP,
  PreviousButton,
  saveDataForCountlyTrackerPageViewLC,
} from 'utils/navigate'
import { trackLPHowToUseSevaClick } from 'helpers/amplitude/seva20Tracking'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { getToken } from 'utils/handler/auth'
import { carResultsUrl, loanCalculatorDefaultUrl } from 'utils/helpers/routes'

const HowToUse = () => {
  const router = useRouter()

  const onClickDreamCar = () => {
    sendAmplitudeData(AmplitudeEventName.WEB_LP_HOW_TO_USE_SEVA_CLICK, {
      Page_Direction_URL:
        'https://' + window.location.host + urls.internalUrls.carResultsUrl,
    })
    trackEventCountly(CountlyEventNames.WEB_HOMEPAGE_CAR_SEARCH_BUTTON_CLICK, {
      SOURCE_SECTION: 'SEVA Steps',
      CAR_BRAND: 'Null',
      CAR_TYPE: 'Null',
      MIN_PRICE: 'Null',
      MAX_PRICE: 'Null',
      DP_AMOUNT: 'Null',
      TENOR_OPTION: 'Null',
      INCOME_AMOUNT: 'Null',
      AGE_RANGE: 'Null',
    })
    trackLPHowToUseSevaClick({
      Page_Direction_URL: 'https://' + window.location.host + carResultsUrl,
    })
    navigateToPLP(PreviousButton.SevaSteps, history)
  }

  const onClickCalculate = () => {
    trackEventCountly(CountlyEventNames.WEB_HOMEPAGE_LOAN_CALCULATOR_CLICK, {
      SOURCE_SECTION: 'SEVA steps',
      CAR_BRAND: 'Null',
      CAR_MODEL: 'Null',
      CAR_ORDER: 'Null',
    })
    trackLPHowToUseSevaClick({
      Page_Direction_URL:
        'https://' + window.location.host + loanCalculatorDefaultUrl,
    })
    saveDataForCountlyTrackerPageViewLC(PreviousButton.SevaStepsCalculate)
    router.push({
      pathname: loanCalculatorDefaultUrl,
      search: '?from=homepageHitung',
    })
  }

  const onClickCreditQualification = () => {
    sendAmplitudeData(AmplitudeEventName.WEB_LP_HOW_TO_USE_SEVA_CLICK, {
      Page_Direction_URL:
        'https://' +
        window.location.host +
        urls.internalUrls.loanCalculatorDefaultUrl,
    })
    trackEventCountly(
      CountlyEventNames.WEB_HOMEPAGE_CHECK_CREDIT_QUALIFICATION_CLICK,
      {
        SOURCE_SECTION: 'SEVA steps',
        LOGIN_STATUS: !!getToken() ? 'Yes' : 'No',
      },
    )
    trackLPHowToUseSevaClick({
      Page_Direction_URL:
        'https://' + window.location.host + loanCalculatorDefaultUrl,
    })
    saveDataForCountlyTrackerPageViewLC(PreviousButton.SevaStepsQualification)
    router.push({
      pathname: loanCalculatorDefaultUrl,
      search: '?from=homepageKualifikasi',
    })
  }
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.headerText} style={{ width: '75%' }}>
        Cara Dapatkan Mobil Impian di SEVA
      </h2>
      <div className={styles.cardSpacing}>
        <div
          className={styles.cardHowToUse}
          onClick={onClickDreamCar}
          data-testid={elementId.Homepage.PilihMobilImpian}
        >
          <div>
            <h3>
              <p className={styles.cardTextBold}>Pilih Mobil </p>
              <div className={styles.row}>
                <p className={styles.headerText}>Impian</p>
                <IconCar2 width={24} height={24} color={'#B4231E'} />
              </div>
            </h3>
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
          onClick={onClickCalculate}
          data-testid={elementId.Homepage.HitungKemampuan}
        >
          <div>
            <h3>
              <p className={styles.cardTextBold}>Hitung </p>
              <div className={styles.row}>
                <p className={styles.headerText}>Kemampuan</p>
                <IconCalculator width={24} height={24} color={'#B4231E'} />
              </div>
            </h3>
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
          onClick={onClickCreditQualification}
          data-testid={elementId.Homepage.KualifikasiKredit}
        >
          <div>
            <h3>
              <div className={styles.row} style={{ marginBottom: '0px' }}>
                <p className={styles.cardTextBold}>Kualifikasi </p>
                <IconFast width={24} height={24} color={'#B4231E'} />
              </div>
              <div className={styles.row}>
                <p className={styles.headerText}>Kredit</p>
              </div>
            </h3>
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
