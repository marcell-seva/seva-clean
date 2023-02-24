import React, { useEffect, useState } from 'react'
import styles from '../../../styles/Testimony.module.css'
import Image from 'next/image'
import { IconBackButton, IconNextButton, IconStar } from '../../atoms'
import { timeSince, useIsMobile } from '../../../utils'
import { Testimony } from '../../../utils/types'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper'

type TypesTestimony = {
  data: Array<Testimony>
}
type TypesTestimonyDetail = {
  item: Testimony
}
const Testimony: React.FC<TypesTestimony> = ({ data }): JSX.Element => {
  const isMobile = useIsMobile()
  const headerText = 'Cerita Pengguna SEVA'

  const Slide: React.FC<TypesTestimonyDetail> = ({ item }): JSX.Element => (
    <div className={styles.card}>
      <div className={styles.imagesWrapper}>
        <Image
          src={item.pictureUrl}
          width={360}
          height={230}
          alt="seva-testimony"
          sizes="(max-width: 1024px) 46vw, 27vw"
          className={styles.image}
        />
        <div className={styles.wrapperInfo}>
          <p className={styles.name}>{item.name}</p>
          <div className={styles.info}>
            <p className={styles.date}>
              {timeSince(item.purchaseDate)} | {item.cityName}
            </p>
            <div className={styles.rating}>
              {[...Array(item.rating).fill(0)].map((_, i) => (
                <div key={i} className={styles.star}>
                  <IconStar width={14} height={14} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className={styles.desc}>{item.detail}</p>
    </div>
  )
  const ShadowSlide = (): JSX.Element => <div className={styles.shadowSlide} />

  return (
    <div className={styles.container}>
      <h1 className={styles.headerText}>{headerText}</h1>
      <div className={styles.testimonyWrapper}>
        {!isMobile && (
          <>
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
          </>
        )}
        <Swiper
          cssMode
          slidesPerGroup={1}
          slidesPerView={2}
          spaceBetween={270}
          navigation={{
            nextEl: '.image-swiper-button-next-testimony',
            prevEl: '.image-swiper-button-prev-testimony',
          }}
          breakpoints={{
            1024: {
              slidesPerGroup: 2,
              slidesPerView: 3,
              spaceBetween: 80,
              cssMode: false,
            },
            480: {
              slidesPerGroup: 1,
              slidesPerView: 2,
              spaceBetween: 160,
              cssMode: false,
            },
          }}
          modules={[Navigation]}
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

export default Testimony
