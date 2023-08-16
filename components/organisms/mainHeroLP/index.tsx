import React, { useContext, useEffect, useState } from 'react'
import styles from 'styles/components/organisms/mainHeroLp.module.scss'
import SupergraphicImage from '/public/revamp/illustration/supergraphic-secondary-large.webp'
import MainHeroImage from '/public/revamp/illustration/main-hero-raize-cencored.webp'
import { sendAmplitudeData } from 'services/amplitude'
import { AmplitudeEventName } from 'services/amplitude/types'
import elementId from 'utils/helpers/trackerId'
import Image from 'next/image'
import { Button } from 'components/atoms'
import { useRouter } from 'next/router'
import { api } from 'services/api'
import { HomePageDataLocalContext } from 'pages'
import { HeaderMobile } from '../headerMobile'
import { CityOtrOption } from 'utils/types'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'

type MainHeroLPProps = {
  onCityIconClick: () => void
  onCtaClick: () => void
}

const MainHeroLP = ({ onCityIconClick, onCtaClick }: MainHeroLPProps) => {
  const { dataCities } = useContext(HomePageDataLocalContext)
  const history = useRouter()
  const [showSidebar, setShowSidebar] = useState(false)
  const [cityListApi, setCityListApi] =
    useState<Array<CityOtrOption>>(dataCities)

  const gotoLoanCalculator = () => {
    sendAmplitudeData(
      AmplitudeEventName.WEB_LP_KUALIFIKASI_KREDIT_TOP_CTA_CLICK,
      null,
    )
    history.push('/kalkulator-kredit')
  }

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
        <Image className={styles.mainCar} src={MainHeroImage} alt="raize" />
        <Image
          className={styles.supergraphicBg}
          src={SupergraphicImage}
          alt="supergraphic"
        />
      </div>
    </>
  )
}

export default MainHeroLP
