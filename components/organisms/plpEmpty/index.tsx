import React, { useEffect, useState } from 'react'
import { CitySelectorModal } from 'components/molecules'

import styles from '../../../styles/components/organisms/plpEmpty.module.scss'
import elementId from 'helpers/elementIds'
import { CarRecommendation } from 'utils/types/context'
import { Location } from 'utils/types'
import { FooterMobile } from '../footerMobile'
import { AlternativeCarCard } from '../alternativeCarCard'
import Image from 'next/image'
import { api } from 'services/api'
// import { LoanRank } from 'models/models'

const PLPEmptyImage = '/revamp/illustration/plp-empty.webp'

type PLPEmptyProps = {
  alternativeCars: CarRecommendation[]
  onClickLabel: () => void
}

export const PLPEmpty = ({ alternativeCars, onClickLabel }: PLPEmptyProps) => {
  const [isOpenCitySelectorModal, setIsOpenCitySelectorModal] = useState(false)
  const [cityListApi, setCityListApi] = useState<Array<Location>>([])

  const checkCitiesData = () => {
    if (cityListApi.length === 0) {
      api.getCities().then((res) => {
        setCityListApi(res)
      })
    }
  }

  useEffect(() => {
    checkCitiesData()
  }, [])
  return (
    <>
      <div className={styles.wrapperEmpty}>
        <Image
          src={PLPEmptyImage}
          className={styles.imageStyle}
          alt={'car empty'}
          width={250}
          height={131}
        />
        <div
          className={styles.copy}
          data-testid={elementId.PLP.Text.CarNotFound}
        >
          <div className={styles.titleCopy}>Tidak Ada Mobil yang Ditemukan</div>
          <div className={styles.textCopy}>
            Silakan coba ganti filter untuk menemukan mobil yang mendekati
            kriteriamu atau <br />{' '}
            <p
              onClick={() => {
                setIsOpenCitySelectorModal(true)
              }}
              data-testid={elementId.PLP.Button.UbahLokasi}
            >
              ubah lokasimu.
            </p>
          </div>
        </div>
      </div>
      {alternativeCars.length > 0 && (
        <div className={styles.alternativeCarContainer}>
          <h3 className={styles.alternativeCarTitle}>
            Rekomendasi Mobil Lainnya
          </h3>
          <div className={styles.alternativeCarWrapper}>
            {alternativeCars.slice(0, 5).map((item, index) => (
              <AlternativeCarCard
                key={index}
                recommendation={item}
                onClickLabel={onClickLabel}
              />
            ))}
          </div>
        </div>
      )}
      <FooterMobile />
      <CitySelectorModal
        isOpen={isOpenCitySelectorModal}
        onClickCloseButton={() => setIsOpenCitySelectorModal(false)}
        cityListFromApi={cityListApi}
      />
    </>
  )
}
