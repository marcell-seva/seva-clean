import React, { useState } from 'react'
import styles from '../../../styles/Recommendation.module.css'
import {
  Card,
  IconArrowRight,
  IconBackButton,
  IconNextButton,
  TypeCar,
} from '../../atoms'
import { api } from '../../../services/api'
import { useIsMobile } from '../../../utils'
import Script from 'next/script'
interface ShadowProps {
  type: string
}
export default function Recommendation({ data, categoryCar }: any) {
  const isMobile = useIsMobile()
  const ShadowSlide = () => <div className={styles.shadowSlider}></div>
  const [typeCar, setTypeCar] = useState<string>('MPV')
  const [dataCar, setDataCar] = useState<any>(data)

  const ShadowSlideWithContent = ({ type }: ShadowProps) => (
    <a href="https://www.seva.id/mobil-baru" className={styles.shadowSlider}>
      <IconArrowRight width={24} height={24} />
      <div className={styles.wrapperLabel}>
        <p className={styles.labelText}>Lihat semua</p>
        <p className={styles.labelText}>mobil {type}</p>
      </div>
    </a>
  )

  const getRecommendationCar = async (params: string) => {
    try {
      setDataCar([])
      const query = `?bodyType=${params}&city=jakarta&cityId=118`
      const res: any = await api.getRecommendation(query)
      setDataCar(res.carRecommendations)
    } catch (error) {
      throw error
    }
  }
  return (
    <div className={styles.container}>
      <Script src="/lazy.js" />
      <div className={styles.header}>
        <h1 className={styles.headerText}>Tipe Mobil Baru</h1>
        <a
          href="https://www.seva.id/mobil-baru"
          className={styles.redirectText}
        >
          LIHAT SEMUA
        </a>
      </div>
      <div className={styles.wrapperType}>
        {categoryCar.map((item: any, key: number) => (
          <TypeCar
            src={require(`../../../assets/images/typeCar/${item?.body_type}.png`)}
            key={key}
            isActive={typeCar === item.body_type}
            onClick={() => {
              setTypeCar(item.body_type)
              getRecommendationCar(item.body_type)
            }}
            name={`${item.body_type} (${item.data_count})`}
          />
        ))}
      </div>

      <div className={styles.recommendationWrapper}>
        {!isMobile && (
          <>
            <div
              className={`image-swiper-button-prev-recommendation ${styles.navigationBackButton}`}
            >
              <IconBackButton width={80} height={80} />
            </div>
            <div
              className={`image-swiper-button-next-recommendation ${styles.navigationNextButton}`}
            >
              <IconNextButton width={80} height={80} />
            </div>
          </>
        )}

        <div className="swiper mySwiperRecommendation">
          <div className="swiper-wrapper">
            {dataCar.slice(0, 5).map((item: any, key: number) => (
              <div className="swiper-slide" key={key}>
                <Card item={item} />
              </div>
            ))}
            <div className="swiper-slide">
              <ShadowSlideWithContent type={typeCar} />
            </div>
            <div className="swiper-slide">
              <ShadowSlide />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
