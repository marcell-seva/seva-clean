import React, { useEffect, useState } from 'react'
import styles from '../../../styles/Testimony.module.css'
import Image from 'next/image'
import { IconBackButton, IconNextButton, IconStar } from '../../atoms'
import { timeSince, useIsMobile } from '../../../utils'
import Script from 'next/script'

export default function Testimony({ data }: any) {
  const isMobile = useIsMobile()

  const Slide = ({ item }: any) => {
    return (
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
  }
  const ShadowSlide = () => <div className={styles.shadowSlide}></div>

  return (
    <div className={styles.container}>
      <h1 className={styles.headerText}>Cerita Pengguna SEVA</h1>
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

        <div className="swiper mySwiperTestimony">
          <div className="swiper-wrapper">
            {data.map((item: any, key: number) => (
              <div key={key} className="swiper-slide">
                <Slide item={item} />
              </div>
            ))}
            <div className="swiper-slide">
              <ShadowSlide />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
