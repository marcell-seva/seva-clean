import React, { useContext, useEffect } from 'react'
import styles from '/styles/components/organisms/carOfTheMonth.module.scss'
import DOMPurify from 'dompurify'
import LogoToyota from '/public/revamp/icon/Logo-Potrait-Toyota.webp'
import LogoDaihatsu from '/public/revamp/icon/Logo-Potrait-Daihatsu.webp'
import LogoIsuzu from '/public/revamp/icon/Logo-Potrait-Isuzu.webp'
import LogoBmw from '/public/revamp/icon/Logo-Potrait-BMW.webp'
import LogoPeugeot from '/public/revamp/icon/Logo-Potrait-Peugeot.webp'
import elementId from 'utils/helpers/trackerId'
import {
  formatBillionPoint,
  formatNumberByLocalization,
} from 'utils/handler/rupiah'
import Image from 'next/image'
import { sendAmplitudeData } from 'services/amplitude'
import { AmplitudeEventName } from 'services/amplitude/types'
import { Button } from 'components/atoms'
import { saveLocalStorage } from 'utils/handler/localStorage'
import { client } from 'utils/helpers/const'
import { LanguageCode, LocalStorageKey } from 'utils/enum'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import {
  PreviousButton,
  saveDataForCountlyTrackerPageViewPDP,
} from 'utils/navigate'

type carOfTheMonthData = {
  name: string
  desc: string
  link: string
  brand: string
  price: number
  imageUrl: string
  priceValue: number
  priceValueJkt: number
}
interface CarOfTheMonthProps {
  item: carOfTheMonthData
  onSendOffer: () => void
}
const CardCarOfTheMonth = ({ item, onSendOffer }: CarOfTheMonthProps) => {
  const renderBrandLogo = (carBrand: string) => {
    switch (carBrand) {
      case 'Toyota':
        return (
          <Image
            src={LogoToyota}
            className={styles.imgLogo}
            alt="Toyota"
            style={{ width: '40px', height: '100%' }}
            loading="lazy"
          />
        )
      case 'Daihatsu':
        return (
          <Image
            src={LogoDaihatsu}
            className={styles.imgLogo}
            alt="Daihatsu"
            style={{ width: '40px', height: '100%' }}
            loading="lazy"
          />
        )
      case 'Isuzu':
        return (
          <Image
            src={LogoIsuzu}
            className={styles.imgLogo}
            alt="Isuzu"
            style={{ width: '40px', height: '100%' }}
            loading="lazy"
          />
        )
      case 'BMW':
        return (
          <Image
            src={LogoBmw}
            className={styles.imgLogo}
            alt="BMW"
            style={{ width: '40px', height: '100%' }}
            loading="lazy"
          />
        )
      case 'Peugeot':
        return (
          <Image
            src={LogoPeugeot}
            className={styles.imgLogo}
            alt="Peugeot"
            style={{ width: '40px', height: '100%' }}
            loading="lazy"
          />
        )
      default:
        return null
    }
  }
  const price = item.priceValue ?? item.priceValueJkt ?? 0
  return (
    <div className={styles.cardContainer}>
      <Image
        alt="seva-image"
        src={item.imageUrl}
        className={styles.imageCar}
        width={256}
        height={144}
        loading="lazy"
      />
      <div className={styles.cardCarOfTheMonth}>
        <div>
          <div className={styles.carDetailWrapper}>
            {renderBrandLogo(item.brand)}
            <div>
              <h3 className={styles.textModel}>{item.name}</h3>
              <p
                className={styles.textOtr}
                style={{ fontSize: '12px', lineHeight: '18px' }}
              >
                {'Harga mulai dari '}
                <span>
                  {price.toString().length <= 9
                    ? item.price !== 0
                      ? 'Rp' +
                        formatNumberByLocalization(
                          item.price,
                          LanguageCode.id,
                          1000000,
                          100,
                        ) +
                        ' Jt'
                      : 'Rp' +
                        formatNumberByLocalization(
                          price,
                          LanguageCode.id,
                          1000000,
                          1,
                        ) +
                        ' Jt'
                    : 'Rp' +
                      formatBillionPoint(
                        formatNumberByLocalization(
                          price,
                          LanguageCode.id,
                          1000000,
                          1,
                        ),
                      ) +
                      ' Jt'}
                </span>
              </p>
            </div>
          </div>
          <div className={styles.line} />
          <div>
            <div
              className={styles.descriptionWrapper}
              dangerouslySetInnerHTML={{
                __html: client ? DOMPurify.sanitize(item.desc) : item.desc,
              }}
            />
            <div className={styles.ctaWrapper}>
              <Button
                version={ButtonVersion.Secondary}
                size={ButtonSize.Small}
                onClick={() => {
                  sendAmplitudeData(
                    AmplitudeEventName.WEB_LP_CAROFTHEMONTH_CAR_CLICK,
                    {
                      Car_Brand: item.brand,
                      Car_Model: item.name,
                    },
                  )
                  saveDataForCountlyTrackerPageViewPDP(
                    PreviousButton.CarOfTheMonth,
                  )
                  window.location.href = item.link
                }}
                data-testid={elementId.Homepage.Button.LihatRincian}
              >
                <span className={styles.textButton}>Lihat Rincian</span>
              </Button>
              <Button
                version={ButtonVersion.Secondary}
                size={ButtonSize.Small}
                onClick={() => {
                  const currentCar = JSON.stringify({
                    Car_Brand: item.brand,
                    Car_Model: item.name,
                  })
                  saveLocalStorage(
                    LocalStorageKey.CurrentCarOfTheMonthItem,
                    currentCar,
                  )
                  onSendOffer()
                }}
                data-testid={elementId.Homepage.Button.LihatPenawaran}
              >
                <span className={styles.textButton}>Minta Penawaran</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardCarOfTheMonth
