import React, { useState } from 'react'
import styles from '../../../styles/Recommendation.module.css'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import { Card, IconBackButton, IconNextButton, TypeCar } from '../../atoms'
import { api } from '../../../services/api'

export default function Recommendation({ data, categoryCar }: any) {
  const ShadowSlide = () => <div className={styles.shadowSlider}></div>
  const [typeCar, setTypeCar] = useState<string>('MPV')
  const [dataCar, setDataCar] = useState<any>(data)

  const getRecommendationCar = async (params: string) => {
    try {
      const query = `?bodyType=${params}&city=jakarta&cityId=118`
      const res: any = await api.getRecommendation(query)
      setDataCar(res.carRecommendations)
    } catch (error) {
      throw error
    }
  }
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.headerText}>Tipe Mobil Baru</h1>
        <h1 className={styles.redirectText}>LIHAT SEMUA</h1>
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
        <div className={styles.wrapperMobile}>
          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: '.image-swiper-button-next-recommendation',
              prevEl: '.image-swiper-button-prev-recommendation',
              disabledClass: 'swiper-button-disabled',
            }}
            slidesPerView={4}
            spaceBetween={140}
            slidesPerGroup={3}
            className="mySwiper"
          >
            {dataCar.slice(0, 5).map((item: any, key: number) => (
              <SwiperSlide key={key}>
                <Card item={item} />
              </SwiperSlide>
            ))}
            <SwiperSlide>
              <ShadowSlide />
            </SwiperSlide>
          </Swiper>
        </div>
        <div className={styles.wrapperDesktop}>
          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: '.image-swiper-button-next-recommendation',
              prevEl: '.image-swiper-button-prev-recommendation',
              disabledClass: 'swiper-button-disabled',
            }}
            slidesPerView={4}
            spaceBetween={250}
            slidesPerGroup={3}
            className="mySwiper"
          >
            {dataCar.slice(0, 5).map((item: any, key: number) => (
              <SwiperSlide key={key}>
                <Card item={item} />
              </SwiperSlide>
            ))}
            <SwiperSlide>
              <ShadowSlide />
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>
  )
}
