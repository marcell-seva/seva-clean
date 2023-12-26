import React, { useEffect, useState } from 'react'
import { useUtils } from 'services/context/utilsContext'
import {
  DealerSearchWidget,
  HeaderMobile,
  LeadsFormTertiary,
  LpCarRecommendations,
} from 'components/organisms'
import { CitySelectorModal, FooterMobile } from 'components/molecules'
import styles from 'styles/pages/dealer.module.scss'
import { CardShadow } from 'components/atoms'
import clsx from 'clsx'
import { getCity } from 'utils/hooks/useGetCity'
import { getRecommendation } from 'services/api'
import { useCar } from 'services/context/carContext'

const Dealer = ({ dataRecommendation, ssr }: any) => {
  const { saveRecommendation } = useCar()
  const { mobileWebTopMenus, cities } = useUtils()
  const [showSidebar, setShowSidebar] = useState(false)
  const [openCitySelectorModal, setOpenCitySelectorModal] = useState(false)

  // const loadCarRecommendation = async () => {
  //   try {
  //     const params = `?city=${getCity().cityCode}&cityId=${getCity().id}`
  //     const recommendation: any = await getRecommendation(params)
  //     saveRecommendation(recommendation.carRecommendations)
  //   } catch {
  //     saveRecommendation(dataRecomendation)
  //   }
  // }
  // useEffect(() => {
  //   if (ssr !== 'success') {
  //     loadCarRecommendation()
  //   } else {
  //     saveRecommendation(dataRecomendation)
  //   }
  // }, [])

  return (
    <div className={styles.container}>
      <HeaderMobile
        isActive={showSidebar}
        setIsActive={setShowSidebar}
        emitClickCityIcon={() => setOpenCitySelectorModal(true)}
      />
      <div className={styles.mainKV}></div>
      <div className={styles.searchContainer}>
        <CardShadow
          className={clsx({
            [styles.cardContainer]: true,
          })}
        >
          <DealerSearchWidget />
        </CardShadow>
      </div>
      <LpCarRecommendations
        dataReccomendation={dataRecommendation}
        onClickOpenCityModal={() => setOpenCitySelectorModal(true)}
      />
      <LeadsFormTertiary />
      <FooterMobile />
      <CitySelectorModal
        isOpen={openCitySelectorModal}
        onClickCloseButton={() => {
          setOpenCitySelectorModal(false)
        }}
        cityListFromApi={cities}
      />
    </div>
  )
}

export default Dealer
