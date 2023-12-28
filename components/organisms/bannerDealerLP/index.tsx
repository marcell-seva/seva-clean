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
import { useUtils } from 'services/context/utilsContext'
import clsx from 'clsx'
import { getCities } from 'services/api'

const main = '/public/revamp/images/banner/dealerBanner.webp'

const BannerDealerLP = () => {
  const { cities } = useUtils()
  const [showSidebar, setShowSidebar] = useState(false)
  const [cityListApi, setCityListApi] = useState<Array<CityOtrOption>>(cities)

  return (
    <>
      <div className={styles.supergraphic}>
        <div className={styles.mainContent}>
          <div
            className={clsx({
              [styles.mainWrapper]: true,
              [styles.isActive]: showSidebar,
            })}
          >
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
          </div>
        </div>
        <Image
          className={styles.supergraphicBg}
          src={DealerBanner}
          alt="supergraphic"
          priority
          fill
        />
      </div>
    </>
  )
}

export default BannerDealerLP
