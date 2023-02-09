import React, { useEffect, useState } from 'react'
import styles from '../../../styles/Banner.module.css'
import Image from 'next/image'
import Script from 'next/script'
import TagManager from 'react-gtm-module'
import Widget from '../widget'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper'
import LazyLoad from 'vanilla-lazyload'
export default function Banner({ data }: any) {
  useEffect(() => {
    if (data.length > 0) {
      data.map((item: any) => pushDataLayerInit(item))
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

  const [isExpandForm, setIsExpandForm] = useState<boolean>(false)
  return (
    <div className={isExpandForm ? styles.containerActive : styles.container}>
      <div
        className={isExpandForm ? styles.wrapperFormActive : styles.wrapperForm}
      >
        <Widget expandForm={() => setIsExpandForm(!isExpandForm)} />
      </div>
      <div className={styles.wrapperMobile}>
        <Swiper
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
          {data.map((item: any, key: number) => {
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
          <div className={`swiper-pagination ${styles.paginationBullet}`}></div>
        </Swiper>
      </div>
      <div className={styles.wrapperDesktop}>
        <Swiper
          loop
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
          <div className={`swiper-pagination ${styles.paginationBullet}`}></div>
        </Swiper>
      </div>
    </div>
  )
}
