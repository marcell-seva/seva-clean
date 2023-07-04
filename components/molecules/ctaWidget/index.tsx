import React from 'react'
import SupergraphicLeft from 'assets/illustration/supergraphic-small.webp'
import SupergraphicRight from 'assets/illustration/supergraphic-large.webp'
import styles from 'styles/components/organisms/ctaWidget.module.scss'
import Image from 'next/image'
import { sendAmplitudeData } from 'services/amplitude'
import { AmplitudeEventName } from 'services/amplitude/types'
import { Button } from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'utils/types/models'
import urls from 'utils/helpers/url'
import { useRouter } from 'next/router'

const CtaWidget = () => {
  const router = useRouter()
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
        <p className={styles.textCtaHeader}>
          Yuk, SEVA bantu untuk mewujudkan mobil impian kamu
        </p>
        <div className={styles.ctaWrapepr}>
          <Button
            version={ButtonVersion.Default}
            size={ButtonSize.Big}
            onClick={() => {
              sendAmplitudeData(
                AmplitudeEventName.WEB_PAGE_DIRECTION_WIDGET_CTA_CLICK,
                {
                  Page_Direction_URL:
                    'https://' +
                    window.location.host +
                    urls.internalUrls.carResultsUrl,
                },
              )
              router.push(urls.internalUrls.carResultsUrl)
            }}
          >
            Cari Mobil
          </Button>
          <p className={styles.textSmall}>atau</p>
          <Button
            version={ButtonVersion.SecondaryDark}
            size={ButtonSize.Big}
            onClick={() => {
              sendAmplitudeData(
                AmplitudeEventName.WEB_PAGE_DIRECTION_WIDGET_CTA_CLICK,
                {
                  Page_Direction_URL:
                    'https://' +
                    window.location.host +
                    urls.internalUrls.loanCalculatorDefaultUrl,
                },
              )
              router.push(urls.internalUrls.loanCalculatorDefaultUrl)
            }}
          >
            Hitung Kemampuan
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CtaWidget
