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
import { ShimmerCardProduct } from '../../atoms/shimmer'
interface ShadowProps {
  type: string
}

export default function Recommendation({ data, categoryCar }: any) {
  const { location, isInit } = useContext(
    LocationContext,
  ) as LocationContextType
  const isMobile = useIsMobile()
  const ShadowSlide = () => <div className={styles.shadowSlider}></div>
  const [typeCarActive, setTypeCarActive] = useState<string>('MPV')
  const [category, setCategory] = useState<any>(categoryCar)
  const [loading, setLoading] = useState<boolean>(false)
  const [dataCar, setDataCar] = useState<any>(data)
  const redirectUrlNewCar = 'https://www.seva.id/mobil-baru'

  useEffect(() => {
    if (!isInit) {
      const params = `?bodyType=${typeCarActive}&city=${location.cityCode}&cityId=${location.id}`
      const paramsCategory = `?city=${location.cityCode}`
      getRecommendationCar(params)
      getTypeCar(paramsCategory)
    }
  }, [location.cityCode])

  const removeUnnecessaryDataFilter = (type: string): void => {
    const dataFilterLocal = localStorage.getItem('filter')
    const dataFilterParsed =
      dataFilterLocal !== null ? JSON.parse(dataFilterLocal) : null
    const newDataFilter = {
      ...dataFilterParsed,
      brand: [],
      bodyType: [type],
      tenure: 5,
      downPaymentAmount: '',
      monthlyIncome: '',
      age: '',
      sortBy: 'highToLow',
    }

    localStorage.setItem('filter', JSON.stringify(newDataFilter))
  }

  const ShadowSlideWithContent = ({ type }: ShadowProps) => (
    <a
      href={redirectUrlNewCar}
      onClick={() => removeUnnecessaryDataFilter(type)}
      className={styles.shadowSlider}
    >
      <IconArrowRight width={24} height={24} />
      <div className={styles.wrapperLabel}>
        <p className={styles.labelText}>Lihat semua</p>
        <p className={styles.labelText}>mobil {type}</p>
      </div>
    </a>
  )

  const handleClick = (payload: string) => {
    setTypeCarActive(payload)
    const params = isInit
      ? `?bodyType=${payload}&city=jakarta&cityId=189`
      : `?bodyType=${payload}&city=${location.cityCode}&cityId=${location.id}`
    getRecommendationCar(params)
  }

  const getTypeCar = async (params: string) => {
    try {
      setLoading(true)
      const res: any = await api.getTypeCar(params)
      setCategory(res)
    } catch (error) {
      throw error
    }
  }

  const getRecommendationCar = async (params: string) => {
    try {
      setLoading(true)
      setDataCar([])
      const res: any = await api.getRecommendation(params)
      setDataCar(res.carRecommendations)
      setLoading(false)
    } catch (error) {
      throw error
    }
  }

  const Undefined = () => (
    <div className={styles.undefined}>
      <h1 className={styles.undefinedTitleText}>
        Tipe mobil yang kamu pilih belum tersedia di kotamu.
      </h1>
      <p className={styles.undefinedDescText}>Silakan pilih tipe mobil lain.</p>
    </div>
  )

  const renderContent = () => {
    if (loading) {
      return (
        <div className={styles.shimmer}>
          <ShimmerCardProduct />
          <ShimmerCardProduct />
          <ShimmerCardProduct />
          <ShimmerCardProduct />
        </div>
      )
    } else if (dataCar.length !== 0) {
      return (
        <>
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
            navigation={{
              nextEl: '.image-swiper-button-next-recommendation',
              prevEl: '.image-swiper-button-prev-recommendation',
            }}
            slidesPerGroup={2}
            cssMode={true}
            slidesPerView={3}
            spaceBetween={140}
            breakpoints={{
              1024: {
                slidesPerGroup: 3,
                slidesPerView: 4,
                spaceBetween: 100,
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
              <SwiperSlide key={key}>
                <Card item={item} />
              </SwiperSlide>
            ))}
            <SwiperSlide>
              <ShadowSlideWithContent type={typeCarActive} />
            </SwiperSlide>
            <SwiperSlide>
              <ShadowSlide />
            </SwiperSlide>
          </Swiper>
        </>
      )
    } else if (dataCar.length === 0) {
      return <Undefined />
    }
  }

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
        {category.map((item: any, key: number) => (
          <TypeCar
            src={require(`../../../assets/images/typeCar/${item?.body_type}.png`)}
            key={key}
            isActive={typeCarActive === item.body_type}
            onClick={() => handleClick(item.body_type)}
            name={`${item.body_type} (${item.data_count})`}
          />
        ))}
      </div>

      <div className={styles.recommendationWrapper}>{renderContent()}</div>
    </div>
  )
}
