import Image from 'next/image'
import React, { useState } from 'react'
import styles from '../../../styles/carofTheMonth.module.css'
import { Swiper, SwiperSlide } from 'swiper/react'

import { Navigation } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'

export default function CarofTheMonth({ data }: any) {
  const [activeType, setActiveType] = useState<string>('Toyota')
  const [info, setInfo] = useState(data[0])

  const handleClick = (payload: string) => {
    setActiveType(payload)
    filterData(payload)
  }

  const filterData = (type: string) => {
    const tempData = data
    const newData = tempData.filter((item: any) => {
      const itemData = `${item.brand.toUpperCase()}`
      const paramsData = type.toUpperCase()

      return itemData.indexOf(paramsData) > -1
    })

    if (newData.length > 0) setInfo(newData[0])
    else setInfo(data[0])
  }

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.headerText}>SEVA Car of The Month</h1>
      <div className={styles.bundle}>
        <div className={styles.content}>
          <Image
            src={info.model.data.image}
            width={480}
            height={168}
            unoptimized
            alt="seva-car-of-the-month"
            className={styles.image}
          />

          <div className={styles.categoryMobile}>
            <Swiper
              modules={[Navigation]}
              navigation={{
                nextEl: '.image-swiper-button-next-car-list',
                prevEl: '.image-swiper-button-prev-car-list',
                disabledClass: 'swiper-button-disabled',
              }}
              slidesPerGroup={2}
              slidesPerView={3}
              spaceBetween={1}
            >
              {data.map((item: any) => {
                return (
                  <SwiperSlide key={item.id}>
                    <button
                      onClick={() => handleClick(item.brand)}
                      className={
                        activeType === item.brand
                          ? styles.buttonCategoryActive
                          : styles.buttonCategoryInActive
                      }
                    >
                      {item.brand}
                    </button>
                  </SwiperSlide>
                )
              })}
            </Swiper>
          </div>
          <div className={styles.categoryDesktop}>
            {data.map((item: any) => {
              return (
                <button
                  key={item.id}
                  onClick={() => handleClick(item.brand)}
                  className={
                    activeType === item.brand
                      ? styles.buttonCategoryActive
                      : styles.buttonCategoryInActive
                  }
                >
                  {item.brand}
                </button>
              )
            })}
          </div>
        </div>
        <div className={styles.description}>
          <div>
            <h2 className={styles.titleText}>{info.model.carModel.model}</h2>
            <p className={styles.descText}>
              {info.model.description.replace('<p>', '').replace('</p>', '')}
            </p>
          </div>
          <div className={styles.wrapperButton}>
            <a href={info.model.url} className={styles.buttonDetail}>
              LIHAT RINCIAN
            </a>
            <button className={styles.buttonOffering}>MINTA PENAWARAN</button>
          </div>
        </div>
      </div>
    </div>
  )
}
