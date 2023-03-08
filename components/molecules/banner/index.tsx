import React, { lazy, useEffect, useRef, useState } from 'react'
import styles from 'styles/Banner.module.css'
import Image from 'next/image'
import Widget from '../widget'
import amplitude from 'amplitude-js'
import TagManager from 'react-gtm-module'
import { Banner } from 'utils/types'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper'
import LazyLoad from 'vanilla-lazyload'

type TypesBanner = {
  data: Array<Banner>
}

const Banner: React.FC<TypesBanner> = ({ data }): JSX.Element => {
  const [isExpandForm, setIsExpandForm] = useState<boolean>(false)
  const [index, setIndex] = useState<number>(0)
  const [isActiveSending, setIsActiveSending] = useState<boolean>(true)
  const [dataSentIndex, setDataSentIndex] = useState<Array<number>>([0])
  const [isUserOnBannerScreen, setIsUserOnBannerScreen] =
    useState<boolean>(true)

  const pushDataLayerInit = (payload: any): void => {
    TagManager.dataLayer({
      dataLayer: {
        ecommerce: {
          promoView: {
            promotions: [
              {
                name: payload.name,
                creative: payload.creativeContext,
                position: payload.slot,
              },
            ],
          },
        },
        eventCategory: 'Ecommerce',
        eventAction: 'Promotion View - Control',
        eventLable: 'Homebanner',
      },
    })
  }

  const pushDataLayerWidgetOnClick = (index: number) => {
    TagManager.dataLayer({
      dataLayer: {
        promoClick: {
          promotions: [
            {
              name: data[index].name,
              creative: data[index].creativeContext,
              position: data[index].slot,
            },
          ],
        },
        eventCategory: 'Ecommerce',
        eventAction: 'PromotionClick - Control',
        eventLabel: 'HomepagePromoClick',
      },
    })
  }

  const getTimeStamp = (): string | null => {
    const timestamp: string | null = localStorage.getItem('timestamp')
    return timestamp
  }

  const setTimestamp = (): void => {
    const currentTime = new Date().getTime()
    localStorage.setItem('timestamp', currentTime.toString())
  }

  const isInBorderTime = (payload: number): boolean => {
    const currentTime = new Date().getTime()
    const constrainTime = 5 * 60 * 1000
    const diffTime = currentTime - payload
    return diffTime <= constrainTime
  }

  const isDataExist = (data: Array<number>, key: number): boolean => {
    const filtered: Array<number> = data.filter((item: number) => item === key)
    return filtered.length > 0
  }

  const handleScroll = (): void => {
    const position: number = window.pageYOffset
    if (position > 470) {
      setIsUserOnBannerScreen(false)
    } else setIsUserOnBannerScreen(true)
  }

  const sendAmplitudeBanner = (payload: any): void => {
    amplitude.getInstance().logEvent('WEB_TOP_BANNER_VIEW', {
      Name: payload.name,
      Page_direction_URL: payload.url,
      Creative_context: payload.creativeContext,
    })
  }

  const eventListenerScroll = () => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }

  useEffect(() => {
    const timestamp: string | null = getTimeStamp()
    if (timestamp === null) {
      setTimestamp()
      setIsActiveSending(true)
      pushDataLayerInit(data[0])
      sendAmplitudeBanner(data[0])
    } else {
      if (isInBorderTime(parseInt(timestamp))) {
        setIsActiveSending(false)
      } else {
        setTimestamp()
        setIsActiveSending(true)
        pushDataLayerInit(data[0])
        sendAmplitudeBanner(data[0])
      }
    }
  }, [])

  useEffect(() => {
    eventListenerScroll()
  }, [])

  useEffect(() => {
    if (isActiveSending && data.length > 0 && isUserOnBannerScreen) {
      const isDataSlideExists = isDataExist(dataSentIndex, index)
      if (!isDataSlideExists) {
        const dataIndex: Array<number> = dataSentIndex
        dataIndex.push(index)
        setDataSentIndex(dataIndex)
        pushDataLayerInit(data[index])
        sendAmplitudeBanner(data[index])
      }
    }
  }, [isActiveSending, index, data])

  return (
    <div className={isExpandForm ? styles.containerActive : styles.container}>
      <div
        className={isExpandForm ? styles.wrapperFormActive : styles.wrapperForm}
      >
        <Widget expandForm={() => setIsExpandForm(!isExpandForm)} />
      </div>
      <div className={styles.wrapperMobile}>
        <Swiper
          onActiveIndexChange={(swiper) => {
            setIndex(swiper.realIndex)
          }}
          on={{
            afterInit: (swiper) => {
              new LazyLoad({
                container: swiper.el,
                cancel_on_exit: false,
              })
            },
          }}
          loop
          cssMode
          pagination={{
            clickable: true,
            el: '.swiper-pagination',
          }}
          breakpoints={{
            1024: {
              cssMode: false,
            },
          }}
          lazy
          autoplay={{ delay: 8000 }}
          modules={[Pagination, Autoplay]}
        >
          {data.map((item: Banner, key: number) => {
            if (key === 0) {
              return (
                <SwiperSlide key={key}>
                  <a href={item.url} className="swiper-slide">
                    <Image
                      src={item.attribute.web_mobile}
                      width={480}
                      height={360}
                      priority
                      alt="seva-banner"
                      sizes="(max-width: 1024px) 54vw, 92.4vw"
                      className={`swiper-lazy ${styles.banner}`}
                    />
                  </a>
                </SwiperSlide>
              )
            } else {
              return (
                <SwiperSlide key={key}>
                  <a href={item.url} className="swiper-slide">
                    <Image
                      src={item.attribute.web_mobile}
                      width={480}
                      height={360}
                      alt="seva-banner"
                      sizes="(max-width: 1024px) 54vw, 92.4vw"
                      className={`swiper-lazy ${styles.banner}`}
                    />
                  </a>
                </SwiperSlide>
              )
            }
          })}
          <div className={`swiper-pagination ${styles.paginationBullet}`} />
        </Swiper>
      </div>
      <div className={styles.wrapperDesktop}>
        <Swiper
          loop
          onActiveIndexChange={(swiper) => {
            setIndex(swiper.realIndex)
          }}
          on={{
            afterInit: (swiper) => {
              new LazyLoad({
                container: swiper.el,
                cancel_on_exit: false,
              })
            },
          }}
          cssMode
          pagination={{
            clickable: true,
            el: '.swiper-pagination',
          }}
          breakpoints={{
            1024: {
              cssMode: false,
            },
          }}
          lazy
          autoplay={{ delay: 8000 }}
          modules={[Pagination, Autoplay]}
        >
          {data.map((item: Banner, key: number) => (
            <SwiperSlide key={key}>
              <a
                href={item.url}
                onClick={() => pushDataLayerWidgetOnClick(key)}
              >
                <Image
                  src={item.attribute.web_desktop}
                  width={1040}
                  height={416}
                  alt="seva-banner"
                  sizes="(max-width: 1024px) 54vw, 92.4vw"
                  className={`lazy-loader swiper-lazy ${styles.banner}`}
                />
              </a>
            </SwiperSlide>
          ))}
          <div className={`swiper-pagination ${styles.paginationBullet}`} />
        </Swiper>
      </div>
    </div>
  )
}

export default Banner
