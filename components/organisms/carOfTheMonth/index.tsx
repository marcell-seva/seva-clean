import React, { useMemo, useRef, useState } from 'react'
import 'pure-react-carousel/dist/react-carousel.es.css'
import styles from 'styles/components/organisms/carOfTheMonth.module.scss'
import clsx from 'clsx'
import { sendAmplitudeData } from 'services/amplitude'
import { AmplitudeEventName } from 'services/amplitude/types'
import { COMData, COMDataTracking } from 'utils/types/models'
import CardCarOfTheMonth from 'components/molecules/cardCarOfTheMonth'
import elementId from 'utils/helpers/trackerId'
import { CityOtrOption } from 'utils/types'
import { PageOriginationName } from 'utils/types/props'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Swiper as SwiperType } from 'swiper'

type CarOfTheMonthProps = {
  carOfTheMonthData: COMData[]
  onSendOffer: () => void
  cityOtr: CityOtrOption | null
  setSelectedCarOfTheMonth: (value: COMDataTracking) => void
}

export type carOfTheMonthData = {
  name: string
  desc: string
  link: string
  brand: string
  price: number
  imageUrl: string
  priceValue: number
  priceValueJkt: number
}
const CarOfTheMonth = ({
  carOfTheMonthData,
  onSendOffer,
  cityOtr,
  setSelectedCarOfTheMonth,
}: CarOfTheMonthProps) => {
  const swiperRef = useRef<SwiperType>()
  const [currentSlide, setCurrentSlide] = useState(0)

  const carModel = useMemo(() => {
    const model = carOfTheMonthData?.map((item) => ({
      name: item.model?.carModel.model ?? '',
      desc: item.model?.description ?? '',
      link: item.model?.url ?? '',
      brand: item.brand ?? '',
      price: item.model?.price ?? 0,
      imageUrl: item.model?.data.image ?? '',
      priceValue: item.model?.priceValue ?? item.model?.priceValueJkt ?? 0,
      priceValueJkt: item.model?.priceValueJkt ?? 0,
    }))

    return model ?? []
  }, [carOfTheMonthData])

  return (
    <div
      className={styles.container}
      data-testid={elementId.Homepage.CarOfMonth}
    >
      <div className={styles.wrapper}>
        <h2 className={styles.textHeaderSection}>SEVA Car of The Month</h2>
      </div>
      <div className={styles.containerCarousel}>
        <Swiper
          slidesPerView={'auto'}
          spaceBetween={16}
          onBeforeInit={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => {
            setCurrentSlide(swiper.realIndex)
          }}
          style={{ padding: '0 16px ' }}
        >
          {carModel.map((item, index) => (
            <SwiperSlide
              key={index}
              style={{
                width: '288px',
              }}
            >
              <CardCarOfTheMonth
                item={item}
                onSendOffer={() => {
                  sendAmplitudeData(AmplitudeEventName.WEB_LEADS_FORM_OPEN, {
                    Page_Origination: PageOriginationName.COTMLeadsForm,
                    ...(cityOtr && { City: cityOtr.cityName }),
                    Car_Brand: item.brand,
                    Car_Model: item.name,
                  })
                  setSelectedCarOfTheMonth({
                    Car_Brand: item.brand,
                    Car_Model: item.name,
                  })
                  onSendOffer()
                }}
              />
            </SwiperSlide>
          ))}
          <SwiperSlide style={{ width: 100 }}></SwiperSlide>
        </Swiper>
      </div>
      <div className={styles.dotsCarouselWrapper}>
        {carModel.map((item: carOfTheMonthData, index: number) => {
          return (
            <button
              key={index}
              onClick={() => {
                setCurrentSlide(index)
              }}
              className={clsx({
                [styles.dotsCarouselActive]: index === Math.round(currentSlide),
                [styles.dotsCarouselInactive]:
                  index !== Math.round(currentSlide),
              })}
            ></button>
          )
        })}
      </div>
    </div>
  )
}

export default CarOfTheMonth
