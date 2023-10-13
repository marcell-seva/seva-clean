import { Button } from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import Image from 'next/image'
import { HomePageDataLocalContext } from 'pages'
import { useContext, useEffect, useState } from 'react'
import { api } from 'services/api'
import styles from 'styles/components/organisms/mainHeroLp.module.scss'
import elementId from 'utils/helpers/trackerId'
import { CityOtrOption } from 'utils/types'
import { HeaderMobile } from '../headerMobile'
import MainHeroImage from '/public/revamp/illustration/main-hero-raize-cencored.webp'
import SupergraphicImage from '/public/revamp/illustration/supergraphic-secondary-large.webp'
import { HomePageDataLocalContext2 } from 'pages/adaSEVAdiOTO'
import { useUtils } from 'services/context/utilsContext'

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
      api.getCities().then((res: any) => {
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
          <div className={styles.mainWrapper}>
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
          loading="lazy"
        />
        <Image
          className={styles.supergraphicBg}
          src={SupergraphicImage}
          alt="supergraphic"
          loading="lazy"
        />
      </div>
    </>
  )
}

export default MainHeroLP
