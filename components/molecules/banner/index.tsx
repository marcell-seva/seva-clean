import React, { lazy, useEffect, useState } from 'react'
import styles from '../../../styles/Banner.module.css'
import Image from 'next/image'
import TagManager from 'react-gtm-module'
import Widget from '../widget'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper'
import LazyLoad from 'vanilla-lazyload'
export default function Banner({ data }: any) {
  const [isExpandForm, setIsExpandForm] = useState<boolean>(false)
  const [isUserOnBannerScreen, setIsUserOnBannerScreen] =
    useState<boolean>(false)

  const handleScroll = () => {
    const position: number = window.pageYOffset
    if (position > 470) setIsUserOnBannerScreen(false)
    else setIsUserOnBannerScreen(true)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

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
        ecommerce: {
          promoClick: {
            promotions: [
              {
                name: data[index].name,
                creative: data[index].creativeContext,
                position: data[index].slot,
              },
            ],
          },
        },
        eventCategory: 'Ecommerce',
        eventAction: 'PromotionClick - Control',
        eventLabel: 'HomepagePromoClick',
      },
    })
  }
  const swiperOptions = {
    loop: true,
    pagination: {
      el: '.swiper-pagination',
    },
    autoplay: {
      delay: 8000,
    },
    cssMode: true,
    breakpoints: {
      1024: {
        cssMode: false,
      },
    },
    on: {
      // LazyLoad swiper images after swiper initialization
      afterInit: (swiper: any) => {
        new LazyLoad({
          container: swiper.el,
          cancel_on_exit: false,
        })
      },
    },
  }

  return (
    <div className={isExpandForm ? styles.containerActive : styles.container}>
      <div
        className={isExpandForm ? styles.wrapperFormActive : styles.wrapperForm}
      >
        <Widget expandForm={() => setIsExpandForm(!isExpandForm)} />
      </div>
      <div className={styles.wrapperMobile}>
        <Swiper
          cssMode={true}
          pagination={{
            el: '.swiper-pagination',
          }}
          autoplay={{ delay: 8000 }}
          modules={[Autoplay]}
          breakpoints={{ 1024: { cssMode: false } }}
          on={{
            afterInit: (swiper: any) => {
              new LazyLoad({
                container: swiper.el,
                cancel_on_exit: false,
              })
            },
          }}
        >
          {data.map((item: any, key: number) => {
            if (key === 0) {
              return (
                <SwiperSlide key={key}>
                  <a href={item.url}>
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
                  <a href={item.url}>
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
          <div className={`swiper-pagination ${styles.paginationBullet}`}></div>
        </Swiper>
      </div>
      <div className={styles.wrapperDesktop}>
        <Swiper
          cssMode={true}
          pagination={{
            el: '.swiper-pagination',
          }}
          autoplay={{ delay: 8000 }}
          modules={[Autoplay]}
          breakpoints={{ 1024: { cssMode: false } }}
          on={{
            afterInit: (swiper: any) => {
              new LazyLoad({
                container: swiper.el,
                cancel_on_exit: false,
              })
            },
          }}
        >
          {data.map((item: any, key: number) => (
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
          <div className="swiper-pagination"></div>
        </Swiper>
      </div>
    </div>
  )
}
