import { Button } from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import styles from 'styles/components/organisms/mainHeroLp.module.scss'
import elementId from 'utils/helpers/trackerId'
import { CityOtrOption } from 'utils/types'
import { HeaderMobile } from '../headerMobile'
import MainHeroImage from '/public/revamp/illustration/main-hero-raize-cencored.webp'
import SupergraphicImage from '/public/revamp/illustration/supergraphic-secondary-large.webp'
import { useUtils } from 'services/context/utilsContext'
import clsx from 'clsx'
import { getCities } from 'services/api'

type MainHeroLPProps = {
  onCityIconClick: () => void
  onCtaClick: () => void
  passCountlyTrackerPageView?: (() => void) | (() => Promise<void>)
}

const MainHeroLP = ({
  onCityIconClick,
  onCtaClick,
  passCountlyTrackerPageView,
}: MainHeroLPProps) => {
  const { cities } = useUtils()
  const [showSidebar, setShowSidebar] = useState(false)
  const [cityListApi, setCityListApi] = useState<Array<CityOtrOption>>(cities)

  const checkCitiesData = () => {
    if (cityListApi.length === 0) {
      getCities().then((res: any) => {
        setCityListApi(res.data)
      })
    }
  }

  useEffect(() => {
    checkCitiesData()
  }, [])

  return (
    <>
      <div className={styles.supergraphic}>
        <div className={styles.mainContent}>
          <HeaderMobile
            isActive={showSidebar}
            setIsActive={setShowSidebar}
            emitClickCityIcon={onCityIconClick}
            pageOrigination="Homepage"
            passCountlyTrackerPageView={() =>
              passCountlyTrackerPageView && passCountlyTrackerPageView()
            }
          />
          <div
            className={clsx({
              [styles.mainWrapper]: true,
              [styles.isActive]: showSidebar,
            })}
          >
            <h1 className={`${styles.mainTitle} ${styles.bold}`}>
              <span className={`${styles.mainTitle} ${styles.regular}`}>
                {`Menemani `}
              </span>
              Perjalanan Finansial Mobil Barumu
            </h1>
            <span className={`${styles.mainSubtitle} ${styles.regularGrey}`}>
              Ingin tahu mobil yang cocok untukmu?
            </span>
            <span className={`${styles.mainSubtitle} ${styles.semiboldBlack}`}>
              Cek Kualifikasi Kredit dan temukan mobil sesuai budgetmu.
            </span>
          </div>
          <div className={styles.buttonWrapper}>
            <Button
              version={ButtonVersion.PrimaryDarkBlue}
              size={ButtonSize.Big}
              onClick={onCtaClick}
              data-testid={elementId.Homepage.Button.CekKK}
            >
              Cek Kualifikasi Kredit
            </Button>
          </div>
        </div>
        <Image
          className={styles.mainCar}
          src={MainHeroImage}
          alt="raize"
          priority
        />
        <Image
          className={styles.supergraphicBg}
          src={SupergraphicImage}
          alt="supergraphic"
          priority
        />
      </div>
    </>
  )
}

export default MainHeroLP
