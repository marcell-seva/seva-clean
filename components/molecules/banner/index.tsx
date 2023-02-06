import React, { useEffect } from 'react'
import styles from '../../../styles/Banner.module.css'
import Image from 'next/image'
import Script from 'next/script'
import TagManager from 'react-gtm-module'
import Widget from '../widget'

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

  return (
    <div className={styles.container}>
      <Script src="/lazy.js" />
      <div className={styles.wrapperForm}>
        <Widget />
      </div>
      <div className={styles.wrapperMobile}>
        <div className="swiper mySwiper">
          <div className="swiper-wrapper">
            {data.map((item: any, key: number) => {
              if (key === 0) {
                return (
                  <a href={item.url} className="swiper-slide" key={key}>
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
                )
              } else {
                return (
                  <a href={item.url} className="swiper-slide" key={key}>
                    <Image
                      src={item.attribute.web_mobile}
                      width={480}
                      height={360}
                      alt="seva-banner"
                      sizes="(max-width: 1024px) 54vw, 92.4vw"
                      className={`swiper-lazy ${styles.banner}`}
                    />
                  </a>
                )
              }
            })}
          </div>
          <div className={`swiper-pagination ${styles.paginationBullet}`}></div>
        </div>
      </div>
      <div className={styles.wrapperDesktop}>
        <div className="swiper mySwiper">
          <div className="swiper-wrapper">
            {data.map((item: any, key: number) => (
              <a
                href={item.url}
                className="swiper-slide"
                key={key}
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
            ))}
          </div>
          <div className="swiper-pagination"></div>
        </div>
      </div>
    </div>
  )
}
