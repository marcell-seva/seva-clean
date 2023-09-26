import React, { useMemo, useState } from 'react'
import { CarouselProvider, Slider, Slide } from 'pure-react-carousel'
import { useMediaQuery } from 'react-responsive'
import CardCarOfTheMonth from '../cardCarOfTheMonth'
import styles from 'styles/components/molecules/carOfTheMonth.module.scss'
import clsx from 'clsx'
import { PageOriginationName } from 'utils/types/tracker'
import elementId from 'utils/helpers/trackerId'
import { sendAmplitudeData } from 'services/amplitude'
import { AmplitudeEventName } from 'services/amplitude/types'
import { COMData, COMDataTracking } from 'utils/types/models'
import { CityOtrOption } from 'utils/types'

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
  const isMobileSmall = useMediaQuery({ query: '(max-width: 365px)' })
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

  const getVisibleSlides = () => {
    if (isMobileSmall) return 1
    return 1.23
  }
  return (
    <div
      className={styles.container}
      data-testid={elementId.Homepage.CarOfMonth}
    >
      <div className={styles.wrapper}>
        <h2 className={styles.textHeaderSection}>SEVA Car of The Month</h2>
      </div>
      <div
        className={styles.containerCarousel}
        // style={{
        //   paddingRight: Math.round(currentSlide) === 0 ? '16px' : '0px',
        // }}
      >
        <CarouselProvider
          naturalSlideWidth={288}
          naturalSlideHeight={454}
          totalSlides={Array.isArray(carModel) ? carModel.length : 0}
          visibleSlides={getVisibleSlides()}
          currentSlide={currentSlide}
        >
          <Slider>
            {carModel.map((item: carOfTheMonthData, index: number) => {
              return (
                <Slide
                  index={index}
                  key={index}
                  style={{
                    width: '288px',
                    height: '454px',
                    marginLeft: '16px',
                    marginBottom: '16px',
                  }}
                >
                  <CardCarOfTheMonth
                    item={item}
                    onCurrentSlide={(slide: any) => setCurrentSlide(slide)}
                    onSendOffer={() => {
                      sendAmplitudeData(
                        AmplitudeEventName.WEB_LEADS_FORM_OPEN,
                        {
                          Page_Origination: PageOriginationName.COTMLeadsForm,
                          ...(cityOtr && { City: cityOtr.cityName }),
                          Car_Brand: item.brand,
                          Car_Model: item.name,
                        },
                      )
                      setSelectedCarOfTheMonth({
                        Car_Brand: item.brand,
                        Car_Model: item.name,
                      })
                      onSendOffer()
                    }}
                  />
                </Slide>
              )
            })}
          </Slider>

          {/* <div className="controls">
            <DotGroup className="dot-group" />
          </div> */}
        </CarouselProvider>
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
