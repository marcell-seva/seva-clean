import React from 'react'
import SupergraphicLeft from '/public/revamp/illustration/supergraphic-small.webp'
import SupergraphicRight from '/public/revamp/illustration/supergraphic-large.webp'
import styles from 'styles/components/organisms/ctaWidget.module.scss'
import Image from 'next/image'
import { sendAmplitudeData } from 'services/amplitude'
import { AmplitudeEventName } from 'services/amplitude/types'
import { Button } from 'components/atoms'
import urls from 'utils/helpers/url'
import { useRouter } from 'next/router'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import {
  PreviousButton,
  navigateToPLP,
  saveDataForCountlyTrackerPageViewLC,
} from 'utils/navigate'
import { trackCTAWidgetDirection } from 'helpers/amplitude/seva20Tracking'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { carResultsUrl, loanCalculatorDefaultUrl } from 'utils/helpers/routes'

const CtaWidget = () => {
  const router = useRouter()

  const onClickSearchCar = () => {
    sendAmplitudeData(AmplitudeEventName.WEB_PAGE_DIRECTION_WIDGET_CTA_CLICK, {
      Page_Direction_URL:
        'https://' + window.location.host + urls.internalUrls.carResultsUrl,
    })
    trackEventCountly(CountlyEventNames.WEB_HOMEPAGE_CAR_SEARCH_BUTTON_CLICK, {
      SOURCE_SECTION: 'Bottom section',
      CAR_BRAND: 'Null',
      CAR_TYPE: 'Null',
      MIN_PRICE: 'Null',
      MAX_PRICE: 'Null',
      DP_AMOUNT: 'Null',
      TENOR_OPTION: 'Null',
      INCOME_AMOUNT: 'Null',
      AGE_RANGE: 'Null',
    })
    trackCTAWidgetDirection({
      Page_Direction_URL: 'https://' + window.location.host + carResultsUrl,
    })
    navigateToPLP(PreviousButton.BottomSection, history)
  }

  const onClickCalculate = () => {
    trackEventCountly(CountlyEventNames.WEB_HOMEPAGE_LOAN_CALCULATOR_CLICK, {
      SOURCE_SECTION: 'Below section',
      CAR_BRAND: 'Null',
      CAR_MODEL: 'Null',
      CAR_ORDER: 'Null',
    })
    sendAmplitudeData(AmplitudeEventName.WEB_PAGE_DIRECTION_WIDGET_CTA_CLICK, {
      Page_Direction_URL:
        'https://' +
        window.location.host +
        urls.internalUrls.loanCalculatorDefaultUrl,
    })
    saveDataForCountlyTrackerPageViewLC(
      PreviousButton.SevaBelowSectionCalculate,
    )
    trackCTAWidgetDirection({
      Page_Direction_URL:
        'https://' + window.location.host + loanCalculatorDefaultUrl,
    })
    router.push(loanCalculatorDefaultUrl)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.background}>
        <div className={styles.wrapperSupergraphicLeft}>
          <Image
            src={SupergraphicLeft}
            alt="seva-vector-blue-rounded"
            width={200}
            height={140}
            className={styles.supergraphicLeft}
          />
        </div>
        <div className={styles.wrapperSupergraphicRight}>
          <Image
            src={SupergraphicRight}
            alt="seva-vector-red-rounded"
            width={200}
            height={140}
            className={styles.supergraphicRight}
          />
        </div>
      </div>
      <div className={styles.foreground}>
        <h2 className={styles.textCtaHeader}>
          Yuk, SEVA bantu untuk mewujudkan mobil impian kamu
        </h2>
        <div className={styles.ctaWrapepr}>
          <Button
            version={ButtonVersion.Default}
            size={ButtonSize.Big}
            onClick={onClickSearchCar}
          >
            Cari Mobil
          </Button>
          <p className={styles.textSmall}>atau</p>
          <Button
            version={ButtonVersion.SecondaryDark}
            size={ButtonSize.Big}
            onClick={onClickCalculate}
          >
            Hitung Kemampuan
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CtaWidget
