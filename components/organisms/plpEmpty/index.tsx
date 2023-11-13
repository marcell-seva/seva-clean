import React, { useEffect, useRef, useState } from 'react'
import { CitySelectorModal } from 'components/molecules'

import styles from '../../../styles/components/organisms/plpEmpty.module.scss'
import elementId from 'helpers/elementIds'
import { CarRecommendation } from 'utils/types/context'
import { Location } from 'utils/types'
import { AlternativeCarCard } from '../alternativeCarCard'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Swiper as SwiperType } from 'swiper'
import { getCities } from 'services/api'
// import { LoanRank } from 'models/models'

const PLPEmptyImage = '/revamp/illustration/plp-empty.webp'

type PLPEmptyProps = {
  alternativeCars: CarRecommendation[]
  onClickLabel: () => void
}

export const PLPEmpty = ({ alternativeCars, onClickLabel }: PLPEmptyProps) => {
  const [isOpenCitySelectorModal, setIsOpenCitySelectorModal] = useState(false)
  const [cityListApi, setCityListApi] = useState<Array<Location>>([])
  const swiperRef = useRef<SwiperType>()
  const checkCitiesData = () => {
    if (cityListApi.length === 0) {
      getCities().then((res) => {
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
          <div>
            <Swiper
              slidesPerView={'auto'}
              spaceBetween={16}
              className={styles.alternativeCarWrapper}
              onBeforeInit={(swiper) => (swiperRef.current = swiper)}
              style={{ paddingRight: 16, overflowX: 'hidden' }}
            >
              {alternativeCars.slice(0, 5).map((item, index) => (
                <SwiperSlide key={index} style={{ width: 212 }}>
                  <AlternativeCarCard
                    key={index}
                    recommendation={item}
                    onClickLabel={onClickLabel}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
      <CitySelectorModal
        isOpen={isOpenCitySelectorModal}
        onClickCloseButton={() => setIsOpenCitySelectorModal(false)}
        cityListFromApi={cityListApi}
      />
    </>
  )
}
