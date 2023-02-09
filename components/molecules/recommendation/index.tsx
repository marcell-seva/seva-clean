import React, { useContext, useEffect, useState } from 'react'
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
import {
  LocationContext,
  LocationContextType,
} from '../../../services/context/locationContext'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper'
interface ShadowProps {
  type: string
}

export default function Recommendation({ data, categoryCar }: any) {
  const { location, isInit } = useContext(
    LocationContext,
  ) as LocationContextType
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

  const handleClick = (payload: string) => {
    setTypeCar(payload)
    const params = isInit
      ? `?bodyType=${payload}&city=jakarta&cityId=189`
      : `?bodyType=${payload}&city=${location.cityName}&cityId=${location.id}`
    getRecommendationCar(params)
  }

  const getRecommendationCar = async (params: string) => {
    try {
      setDataCar([])
      const res: any = await api.getRecommendation(params)
      setDataCar(res.carRecommendations)
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    if (!isInit) {
      const params = `?bodyType=${typeCar}&city=${location.cityCode}&cityId=${location.id}`
      getRecommendationCar(params)
    }
  }, [location.cityCode])

  return (
    <div className={styles.container}>
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
            onClick={() => handleClick(item.body_type)}
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

        <Swiper
          slidesPerGroup={2}
          cssMode
          slidesPerView={3}
          spaceBetween={140}
          navigation={{
            nextEl: '.image-swiper-button-next-recommendation',
            prevEl: '.image-swiper-button-prev-recommendation',
          }}
          breakpoints={{
            1024: {
              slidesPerGroup: 3,
              slidesPerView: 4,
              spaceBetween: 160,
              cssMode: false,
            },
            480: {
              slidesPerGroup: 3,
              slidesPerView: 4,
              spaceBetween: 140,
              cssMode: false,
            },
          }}
          modules={[Navigation]}
        >
          {dataCar.slice(0, 5).map((item: any, key: number) => (
            <SwiperSlide className="swiper-slide" key={key}>
              <Card item={item} />
            </SwiperSlide>
          ))}
          <SwiperSlide className="swiper-slide">
            <ShadowSlideWithContent type={typeCar} />
          </SwiperSlide>
          <SwiperSlide className="swiper-slide">
            <ShadowSlide />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  )
}
