import { Gap } from 'components/atoms'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import styles from 'styles/components/molecules/dealerLocationWidget.module.scss'
import { capitalizeFirstLetter, capitalizeWords } from 'utils/stringUtils'
import { Info } from '../section/info'
import { useUtils } from 'services/context/utilsContext'
import { DealerBrandLocation } from 'utils/types/utils'

function DealerLocationWidget() {
  const { dealerBrandLocation } = useUtils()
  const router = useRouter()
  const getUrlBrand = router.query.brand?.toString() ?? ''
  const getUrlLocation =
    router.query.location?.toString().replace('-', ' ') ?? 'Indonesia'
  const descText = `Kami siap menawarkan pengalaman terbaik dan membantu dalam pembelian mobil baru kamu. Dapatkan berbagai promo dan diskon di setiap pembelian mobil baru melalui dealer rekanan SEVA. Temukan pilihan mobil paling lengkap di dealer ${
    getUrlBrand !== 'bmw'
      ? capitalizeFirstLetter(getUrlBrand)
      : getUrlBrand.toUpperCase()
  } ${capitalizeWords(getUrlLocation)} hanya di Seva.id`

  return (
    <div className={styles.container}>
      <Info
        descText={descText}
        headingText={` Dealer
          ${
            getUrlBrand !== 'bmw'
              ? capitalizeFirstLetter(getUrlBrand)
              : getUrlBrand.toUpperCase()
          }
          di ${capitalizeWords(getUrlLocation)}`}
        isDealer={true}
      />

      <div className={styles.contentWrapper}>
        <h3 className={styles.alternativeTitle}>
          {dealerBrandLocation.length.toString()}{' '}
          {getUrlBrand !== 'bmw'
            ? capitalizeFirstLetter(getUrlBrand)
            : getUrlBrand.toUpperCase()}{' '}
          Dealers di {capitalizeWords(getUrlLocation)}
        </h3>
        {dealerBrandLocation.map((item: DealerBrandLocation, index: number) => (
          <div className={styles.cardDealer} key={index}>
            <div className={styles.cardTitle}>{item.dealerName}</div>
            <div className={styles.cardDesc}>{item.dealerAddress}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DealerLocationWidget
