import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay, Lazy } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/lazy'
import styles from '../../../styles/Banner.module.css'
import Image from 'next/image'
import FlagIndonesia from '../../../assets/images/flagIndonesia.png'
export default function Banner({ data }: any) {
  const apiBanner = 'https://api.sslpots.com'

  const SelectorList = () => (
    <div className={styles.selector}>
      <p className={styles.optionPlaceholder}>18-27</p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-chevron-down"
        viewBox="0 0 16 16"
      >
        <path d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
      </svg>
    </div>
  )

  const Form = () => (
    <div className={styles.form}>
      <h1 className={styles.title}>Cari mobil baru yang pas buat kamu</h1>
      <div className={styles.wrapperRow}>
        <div className={styles.wrapperLeft}>
          <h6 className={styles.desc}>Pilih maksimal DP</h6>
          <SelectorList />
        </div>
        <div className={styles.wrapperRight}>
          <h6 className={styles.desc}>Pilih tahun tenor</h6>
          <div className={styles.wrapperRow}>
            <div className={styles.tenor}>1</div>
            <div className={styles.tenor}>2</div>
            <div className={styles.tenor}>3</div>
            <div className={styles.tenor}>4</div>
            <div className={styles.tenor}>5</div>
          </div>
        </div>
      </div>
      <p className={styles.desc}>
        Ingin bertanya langsung ke tim SEVA? Tulis nomor hp kamu untuk kami
        hubungi (Opsional)
      </p>
      <div className={styles.wrapperInputPhone}>
        <div className={styles.phoneDetail}>
          <Image
            src={FlagIndonesia}
            width={16}
            height={16}
            alt="indonesia-flag"
          />
          <p className={styles.labelRegion}>+62</p>
          <p className={styles.separator}>|</p>
        </div>
        <input
          type="text"
          className={styles.input}
          placeholder="Contoh : 0895401011469"
        ></input>
      </div>
      <label className={styles.advanceSearch}>Advanced Search</label>
      <div className={styles.wrapperRow}>
        <div className={styles.wrapperLeft}>
          <p className={styles.desc}>Kisaran pendapatan</p>
          <SelectorList />
        </div>
        <div className={styles.wrapperRight}>
          <p className={styles.desc}>Rentang Usia</p>
          <SelectorList />
        </div>
      </div>
      <button className={styles.button}>Temukan Mobilku</button>
    </div>
  )

  return (
    <div className={styles.container}>
      <div className={styles.wrapperForm}>
        <Form />
      </div>
      <div className={styles.wrapperMobile}>
        <Swiper
          pagination={{ clickable: true }}
          modules={[Pagination, Autoplay, Lazy]}
          lazy={true}
          className={`mySwiper`}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
        >
          {data.map((item: any, key: number) => (
            <SwiperSlide key={key}>
              <a href={item.url || '/'}>
                <Image
                  src={apiBanner + item.attributes.mobile.data.attributes.url}
                  width={480}
                  height={360}
                  priority
                  unoptimized
                  alt="seva-banner"
                  sizes="(max-width: 1024px) 54vw, 92.4vw"
                  className={`swiper-lazy ${styles.banner}`}
                />
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className={styles.wrapperDesktop}>
        <Swiper
          pagination={{ clickable: true }}
          modules={[Pagination, Autoplay, Lazy]}
          lazy={true}
          className={`mySwiper`}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
        >
          {data.map((item: any, key: number) => (
            <SwiperSlide key={key}>
              <a href={item.url || '/'}>
                <Image
                  src={apiBanner + item.attributes.desktop.data.attributes.url}
                  width={1040}
                  height={416}
                  priority
                  unoptimized
                  alt="seva-banner"
                  sizes="(max-width: 1024px) 54vw, 92.4vw"
                  className={`swiper-lazy ${styles.banner}`}
                />
                <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}
