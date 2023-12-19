import React, { useContext, useEffect, useState, useRef } from 'react'
import styles from 'styles/components/organisms/descriptionTab.module.scss'
import { LeadsFormUsedCar } from 'components/organisms'
import DescriptionSection from 'components/organisms/descriptionSection/index'
import dynamic from 'next/dynamic'
import { useAnnouncementBoxContext } from 'services/context/announcementBoxContext'
import { UsedPdpDataLocalContext } from 'pages/mobil-bekas/p/[[...slug]]'
import {
  UsedCarRecommendation,
  UsedNewCarRecommendation,
} from 'utils/types/utils'

const NewCarRecommendations = dynamic(
  () => import('components/organisms/NewCarRecommendations'),
)
const UsedCarRecommendations = dynamic(
  () => import('components/organisms/UsedCarRecommendations'),
)

export const DescriptionTab = () => {
  const {
    usedCarModelDetailsRes,
    usedCarRecommendations,
    usedCarNewRecommendations,
  } = useContext(UsedPdpDataLocalContext)

  const { showAnnouncementBox } = useAnnouncementBoxContext()

  const [usedCarRecommendationList, setUsedCarRecommendationList] = useState<
    UsedCarRecommendation[]
  >([])
  const [usedCarNewRecommendationList, setUsedCarNewRecommendationList] =
    useState<UsedNewCarRecommendation[]>([])

  useEffect(() => {
    const temp = usedCarRecommendations.filter(
      (data: any) => data.id !== usedCarModelDetailsRes?.carId,
    )

    temp.slice(0, 10)

    setUsedCarRecommendationList(temp.slice(0, 10))
  }, [usedCarRecommendations, usedCarModelDetailsRes])

  useEffect(() => {
    const temp = usedCarNewRecommendations

    const result = temp.slice(0, 10)

    setUsedCarNewRecommendationList(result)
  }, [usedCarNewRecommendations, usedCarModelDetailsRes])

  const toLeads = useRef<null | HTMLDivElement>(null)
  const scrollToLeads = () => {
    toLeads.current?.scrollIntoView({ behavior: 'smooth', inline: 'start' })
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <DescriptionSection scrollToLeads={scrollToLeads} />
      </div>
      <div
        ref={toLeads}
        className={
          showAnnouncementBox
            ? styles.reference
            : styles.referenceWithoutAnnounce
        }
        id="leads-form"
      ></div>
      <LeadsFormUsedCar />
      <div className={styles.wrapper}>
        {usedCarNewRecommendationList?.length > 0 && (
          <NewCarRecommendations
            carRecommendationList={usedCarNewRecommendationList}
            title="Rekomendasi Mobil Baru"
            onClick={() => {
              return
            }}
            selectedCity={'Jakarta Pusat'}
            additionalContainerStyle={styles.recommendationAdditionalStyle}
          />
        )}
      </div>
      {usedCarRecommendationList?.length > 0 && (
        <UsedCarRecommendations
          usedCarRecommendationList={usedCarRecommendationList}
          title="Beli Mobil Bekas Berkualitas"
          onClick={() => {
            scrollToLeads()
          }}
          additionalContainerStyle={styles.recommendationAdditionalStyle}
        />
      )}
    </div>
  )
}
