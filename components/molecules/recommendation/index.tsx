import React, { useContext, useEffect, useState } from 'react'
import styles from 'styles/components/molecules/Recommendation.module.scss'
import {
  Card,
  IconArrowRight,
  IconBackButton,
  IconNextButton,
  TypeCar,
} from 'components/atoms'
import { api } from 'services/api'
import {
  AuthContext,
  AuthContextType,
  LocationContext,
  LocationContextType,
} from 'services/context'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper'
import { ShimmerCardProduct } from 'components/atoms/shimmer'
import { Car, BodyType, PropsShadow } from 'utils/types'

type TypesCar = {
  data: Array<Car>
  categoryCar: Array<BodyType>
}

const Recommendation: React.FC<TypesCar> = ({
  data,
  categoryCar,
}): JSX.Element => {
  const { location, isInit } = useContext(
    LocationContext,
  ) as LocationContextType
  const { saveFilterData } = useContext(AuthContext) as AuthContextType
  const [typeCarActive, setTypeCarActive] = useState<string>('MPV')
  const [category, setCategory] = useState<Array<BodyType>>(categoryCar)
  const [loading, setLoading] = useState<boolean>(false)
  const [dataCar, setDataCar] = useState<Array<Car>>(data)
  const redirectUrlNewCar: string = 'https://www.seva.id/mobil-baru'
  const headerText: string = 'Tipe Mobil Baru'
  const buttonText: string = 'LIHAT SEMUA'

  useEffect(() => {
    if (!isInit) {
      const params: string = `?bodyType=${typeCarActive}&city=${location.cityCode}&cityId=${location.id}`
      const paramsCategory: string = `?city=${location.cityCode}`
      getRecommendationCar(params)
      getTypeCar(paramsCategory)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.cityCode])

  const ShadowSlide: React.FC = (): JSX.Element => (
    <div className={styles.shadowSlider}></div>
  )

  const removeUnnecessaryDataFilter = (type: string): void => {
    const newDataFilter = {
      brand: [],
      carModel: '',
      bodyType: [type],
      tenure: 5,
      downPaymentAmount: '',
      monthlyIncome: '',
      age: '',
      sortBy: 'highToLow',
    }
    saveFilterData(newDataFilter)
  }

  const ShadowSlideWithContent = ({ type }: PropsShadow) => (
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

  const handleClick = (payload: string): void => {
    setTypeCarActive(payload)
    const params = isInit
      ? `?bodyType=${payload}&city=jakarta&cityId=189`
      : `?bodyType=${payload}&city=${location.cityCode}&cityId=${location.id}`
    getRecommendationCar(params)
  }

  const getTypeCar = async (params: string): Promise<any> => {
    try {
      setLoading(true)
      const res: any = await api.getTypeCar(params)
      setCategory(res)
    } catch (error) {
      throw error
    }
  }

  const getRecommendationCar = async (params: string): Promise<any> => {
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

  const Undefined: React.FC = (): JSX.Element => (
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
          <div className={styles.navigationWrapper}>
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
          </div>
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
        <h1 className={styles.headerText}>{headerText}</h1>
        <a href={redirectUrlNewCar} className={styles.redirectText}>
          {buttonText}
        </a>
      </div>
      <div className={styles.wrapperType}>
        {category.map((item: any, key: number) => (
          <TypeCar
            src={require(`assets/images/typeCar/${item?.body_type}.png`)}
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

export default Recommendation
