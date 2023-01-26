import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import styles from '../../../styles/Testimony.module.css'
import Image from 'next/image'
import { IconBackButton, IconNextButton, IconStar } from '../../atoms'

export default function Testimony({ data }: any) {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    setIsMobile(window.innerWidth < 1024)
  }, [isMobile])

  const Slide = ({ item }: any) => {
    return (
      <div className={styles.card}>
        <div className={styles.imagesWrapper}>
          <Image
            src={item.pictureUrl}
            width={360}
            height={230}
            alt="seva-testimony"
            className={styles.image}
          />
          <div className={styles.wrapperInfo}>
            <p className={styles.name}>{item.name}</p>
            <div className={styles.info}>
              <p className={styles.date}>
                {item.purchaseDate} | {item.cityName}
              </p>
              <div className={styles.rating}>
                {/* {[...Array(item.rating)].map((key: number) => (
                  <div key={key + 100} className={styles.star}>
                    <IconStar width={14} height={14} />
                  </div>
                ))} */}
              </div>
            </div>
          </div>
        </div>
        <p className={styles.desc}>{item.detail}</p>
      </div>
    )
  }
  const ShadowSlide = () => <div className={styles.shadowSlide}></div>

  return (
    <div className={styles.container}>
      <h1 className={styles.headerText}>Cerita Pengguna SEVA</h1>
      <div className={styles.testimonyWrapper}>
        <div
          className={`image-swiper-button-prev-testimony ${styles.navigationBackButton}`}
        >
          <IconBackButton width={80} height={80} />
        </div>
        <div
          className={`image-swiper-button-next-testimony ${styles.navigationNextButton}`}
        >
          <IconNextButton width={80} height={80} />
        </div>
        <Swiper
          navigation={{
            nextEl: '.image-swiper-button-next',
            prevEl: '.image-swiper-button-prev',
            disabledClass: 'swiper-button-disabled',
          }}
          modules={[Navigation]}
          slidesPerGroup={1}
          slidesPerView={2}
          spaceBetween={170}
          className={styles.swiperMobile}
        >
          {data.map((item: any, key: number) => (
            <SwiperSlide key={key}>
              <Slide item={item} />
            </SwiperSlide>
          ))}
          <SwiperSlide>
            <ShadowSlide />
          </SwiperSlide>
        </Swiper>
        {/* find another solution */}
        <Swiper
          navigation={{
            nextEl: '.image-swiper-button-next',
            prevEl: '.image-swiper-button-prev',
            disabledClass: 'swiper-button-disabled',
          }}
          modules={[Navigation]}
          slidesPerGroup={2}
          slidesPerView={3}
          spaceBetween={100}
          className={styles.swiperDesktop}
        >
          {data.map((item: any, key: number) => (
            <SwiperSlide key={key}>
              <Slide item={item} />
            </SwiperSlide>
          ))}
          <SwiperSlide>
            <ShadowSlide />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  )
}
