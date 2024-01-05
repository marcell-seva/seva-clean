import { Button } from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import styles from 'styles/components/organisms/bannerDealerLP.module.scss'
import elementId from 'utils/helpers/trackerId'
import { CityOtrOption } from 'utils/types'
import { HeaderMobile } from '../headerMobile'
import MainHeroImage from '/public/revamp/illustration/main-hero-raize-cencored.webp'
import SupergraphicImage from '/public/revamp/illustration/supergraphic-secondary-large.webp'
import DealerBanner from '/public/revamp/images/banner/dealerBanner.webp'
import Toyota from '/public/revamp/images/banner/toyotaBanner.webp'
import Hyundai from '/public/revamp/images/banner/hyundaiBanner.webp'
import Peugeot from '/public/revamp/images/banner/peugeotBanner.webp'
import Daihatsu from '/public/revamp/images/banner/daihatsuBanner.webp'
import BMW from '/public/revamp/images/banner/bmwBanner.webp'
import Isuzu from '/public/revamp/images/banner/isuzuBanner.webp'
import { useUtils } from 'services/context/utilsContext'
import clsx from 'clsx'
import { getCities } from 'services/api'
import { useRouter } from 'next/router'
import { capitalizeFirstLetter, capitalizeWords } from 'utils/stringUtils'

interface BannerProps {
  onPage: string
}

const main = DealerBanner
const toyota = Toyota
const hyundai = Hyundai
const isuzu = Isuzu
const peugeot = Peugeot
const daihatsu = Daihatsu
const bmw = BMW

const BannerDealerLP = ({ onPage }: BannerProps) => {
  const router = useRouter()
  const getUrlBrand = router.query.brand?.toString() ?? ''
  const getUrlLocation =
    router.query.location?.toString().replace('-', ' ') ?? 'Indonesia'

  const logoList = {
    toyota: toyota,
    daihatsu: daihatsu,
    isuzu: isuzu,
    bmw: bmw,
    peugeot: peugeot,
    hyundai: hyundai,
  }

  useEffect(() => {}, [])

  return (
    <>
      <div className={styles.supergraphic}>
        <div className={styles.mainContent}>
          <div className={styles.mainWrapper}>
            {onPage === 'main' ? (
              <>
                <h1 className={`${styles.mainTitle} ${styles.bold}`}>
                  Temukan Dealer <br />
                  Rekanan SEVA
                </h1>

                <h1 className={`${styles.mainTitle} ${styles.bold}`}>
                  <span className={`${styles.mainSubtitle} ${styles.regular}`}>
                    di{' '}
                  </span>
                  Seluruh Indonesia
                </h1>
              </>
            ) : (
              <>
                <h1 className={`${styles.mainTitle} ${styles.bold}`}>
                  Dealer{' '}
                  {getUrlBrand !== 'bmw'
                    ? capitalizeFirstLetter(getUrlBrand)
                    : getUrlBrand.toUpperCase()}
                </h1>

                <h1 className={`${styles.mainTitle} ${styles.bold}`}>
                  <span className={`${styles.mainSubtitle} ${styles.regular}`}>
                    di{' '}
                  </span>
                  {getUrlLocation === 'Indonesia'
                    ? getUrlLocation
                    : capitalizeWords(getUrlLocation)}
                </h1>
              </>
            )}
          </div>
        </div>
        {onPage === 'main' ? (
          <>
            <Image
              className={styles.supergraphicBg}
              src={main}
              alt="supergraphic"
              priority
            />
          </>
        ) : (
          <>
            <Image
              className={styles.supergraphicBg}
              src={logoList[getUrlBrand as keyof typeof logoList]}
              alt={`${
                getUrlBrand !== 'bmw'
                  ? capitalizeFirstLetter(getUrlBrand)
                  : getUrlBrand.toUpperCase()
              }`}
              priority
            />
          </>
        )}
      </div>
    </>
  )
}

export default BannerDealerLP
