import Image from 'next/image'
import React, { useContext, useState } from 'react'
import { CarContext, CarContextType } from 'services/context'
import styles from 'styles/saas/components/molecules/CarofTheMonth.module.scss'
import { IconForwardRight } from 'components/atoms'
import { CarDetail } from 'utils/types'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper'

type TypesCarOfTheMonth = {
  data: Array<CarDetail>
  openModalOffering: any
}
const CarofTheMonth: React.FC<TypesCarOfTheMonth> = ({
  data,
  openModalOffering,
}): JSX.Element => {
  const { saveCar } = useContext(CarContext) as CarContextType
  const [activeType, setActiveType] = useState<string>('Toyota')
  const [info, setInfo] = useState<CarDetail>(data[0])
  const headerText: string = 'SEVA Car of The Month'
  const redirectDetailText: string = 'LIHAT RINCIAN'
  const buttonOfferingText: string = 'MINTA PENAWARAN'

  const handleClick = (payload: string): void => {
    setActiveType(payload)
    filterData(payload)
  }

  const filterData = (type: string): void => {
    const tempData = data
    const newData = tempData.filter((item: any) => {
      const itemData = `${item.brand.toUpperCase()}`
      const paramsData = type.toUpperCase()
      return itemData.indexOf(paramsData) > -1
    })

    if (newData.length > 0) setInfo(newData[0])
    else setInfo(data[0])
  }

  const handleModalOffering = (payload: CarDetail): void => {
    saveCar(payload)
    openModalOffering()
  }
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.headerText}>{headerText}</h1>
      <div className={styles.bundle}>
        <div className={styles.content}>
          <div className={styles.bgContent}></div>
          <Image
            src={info.model.data.image}
            width={480}
            height={168}
            unoptimized
            alt="seva-car-of-the-month"
            className={styles.image}
          />
          <div className={styles.categoryMobile}>
            <div
              className={`image-swiper-button-prev-car-month ${styles.navigationBackButton}`}
            >
              <IconForwardRight width={15} height={15} />
            </div>
            <div
              className={`image-swiper-button-next-car-month ${styles.navigationNextButton}`}
            >
              <IconForwardRight width={15} height={15} />
            </div>
            <Swiper
              navigation={{
                nextEl: '.image-swiper-button-next-car-month',
                prevEl: '.image-swiper-button-prev-car-month',
              }}
              cssMode
              slidesPerGroup={2}
              slidesPerView={3}
              spaceBetween={10}
              breakpoints={{
                1024: {
                  slidesPerGroup: 3,
                  slidesPerView: 4,
                  spaceBetween: 10,
                  cssMode: false,
                },
              }}
              modules={[Navigation]}
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
              {redirectDetailText}
            </a>
            <button
              onClick={() => handleModalOffering(info)}
              className={styles.buttonOffering}
            >
              {buttonOfferingText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarofTheMonth
