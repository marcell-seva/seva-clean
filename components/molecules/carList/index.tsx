import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import Image from 'next/image'
import styles from '../../../styles/CarList.module.css'
import { Card, IconBackButton, IconNextButton } from '../../atoms'
import { api } from '../../../services/api'

export default function CarList({ data }: any) {
  const brandList = ['Toyota', 'Daihatsu', 'Isuzu', 'BMW', 'Peugeot']
  const [carList, setCarList] = useState<any>(data)
  const [typeActive, setTypeActive] = useState<any>('oyota')

  const ShadowSlide = () => <div className={styles.shadowSlider} />

  const getRecommendationCar = async (params: string) => {
    try {
      const query = `?brand=${params}&city=jakarta&cityId=189`
      const res: any = await api.getRecommendation(query)
      setCarList(res.carRecommendations)
    } catch (error) {
      throw error
    }
  }
  const Brand = ({ name, isActive }: any) => (
    <div
      className={isActive ? styles.brandActive : styles.brandInActive}
      onClick={() => {
        setTypeActive(name)
        getRecommendationCar(name)
      }}
    >
      <Image
        src={require(`../../../assets/images/brandCar/${name}.png`)}
        width={50}
        height={40}
        className={styles.brandImage}
        alt={name}
      />
    </div>
  )

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.headerText}>Mobil Baru Terpopuler</h1>
        <a
          href="https://www.seva.id/mobil-baru"
          className={styles.redirectText}
        >
          LIHAT SEMUA
        </a>
      </div>
      <div className={styles.wrapperSwiper}>
        <div className={styles.brandList}>
          {brandList.map((item: string, key: number) => (
            <Brand key={key} name={item} isActive={typeActive === item} />
          ))}
        </div>
        <div className={styles.carListWrapper}>
          <div
            className={`image-swiper-button-prev-car-list ${styles.navigationBackButton}`}
          >
            <IconBackButton width={80} height={80} />
          </div>
          <div
            className={`image-swiper-button-next-car-list ${styles.navigationNextButton}`}
          >
            <IconNextButton width={80} height={80} />
          </div>
          <div className={styles.wrapperMobile}>
            <Swiper
              modules={[Navigation]}
              navigation={{
                nextEl: '.image-swiper-button-next-car-list',
                prevEl: '.image-swiper-button-prev-car-list',
                disabledClass: 'swiper-button-disabled',
              }}
              slidesPerGroup={3}
              slidesPerView={4}
              spaceBetween={140}
            >
              {carList.slice(0, 5).map((item: any, key: number) => (
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
                nextEl: '.image-swiper-button-next-car-list',
                prevEl: '.image-swiper-button-prev-car-list',
                disabledClass: 'swiper-button-disabled',
              }}
              slidesPerGroup={3}
              slidesPerView={4}
              spaceBetween={240}
            >
              {carList.slice(0, 5).map((item: any, key: number) => (
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
    </div>
  )
}
