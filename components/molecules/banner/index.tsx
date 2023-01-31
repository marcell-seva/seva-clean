import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay, Lazy } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/lazy'
import styles from '../../../styles/Banner.module.css'
import Image from 'next/image'
import FlagIndonesia from '../../../assets/images/flagIndonesia.png'
import Script from 'next/script'
export default function Banner({ data }: any) {
  const [form, setForm] = useState<any>({})
  const [phone, setPhone] = useState()
  const [selectorActive, setSelectorActive] = useState<string>('')

  const selectorData = {
    dp: ['Rp 30 jt', 'Rp 40 jt', , 'Rp 50 jt', 'Rp 75 jt', 'Rp 100 jt'],
    income: [
      '< 2 juta/bulan',
      '2-4 juta/bulan',
      '4-6 juta/bulan',
      '6-8 juta/bulan',
      '8-10 juta/bulan',
    ],
    age: ['18-27', '29-34', '25-50', '>51'],
  }
  const apiBanner = 'https://api.sslpots.com'

  const SelectorList = ({ placeholder, onClick, indexKey }: any) => (
    <button className={styles.selector} onClick={onClick}>
      <input
        className={styles.placeholderText}
        type="text"
        disabled
        placeholder={placeholder}
        value={form[indexKey]}
      />
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
    </button>
  )

  const DetailList = ({ data, indexKey }: any) => {
    return (
      <div className={styles.list}>
        {data.map((item: any, key: number) => (
          <button
            key={key}
            className={styles.buttonIncome}
            onClick={() => {
              setSelectorActive('')
              setForm((prevState: any) => ({ ...prevState, [indexKey]: item }))
            }}
          >
            <label className={styles.buttonListText}>{item}</label>
          </button>
        ))}
      </div>
    )
  }

  const handleClickDP = (payload: string) => {
    setSelectorActive(payload)
  }

  const handleChange = (payload: any) => {
    setPhone(payload)
  }

  const sendRequest = () => {
    setForm((prevState: any) => ({
      ...prevState,
      phone: phone,
    }))
    console.log('phone', form)
  }

  const ButtonTenor = ({ termin }: any) => (
    <button
      onClick={() => {
        setForm((prevState: any) => ({ ...prevState, tenor: termin }))
      }}
      className={
        form.tenor === termin ? styles.tenorActive : styles.tenorInActive
      }
    >
      {termin}
    </button>
  )

  interface Props {
    onChangeDataMobile: any
  }

  const Form: React.FC<Props> = ({ onChangeDataMobile }: any) => (
    <div className={styles.form}>
      <h1 className={styles.title}>Cari mobil baru yang pas buat kamu</h1>
      <div className={styles.wrapperRow}>
        <div className={styles.wrapperLeft}>
          <h6 className={styles.desc}>Pilih maksimal DP</h6>
          <SelectorList
            placeholder=">Rp 350 Jt"
            indexKey="dp"
            onClick={() => handleClickDP('dp')}
          />
          {selectorActive === 'dp' && (
            <DetailList indexKey="dp" data={selectorData.dp} />
          )}
        </div>
        <div className={styles.wrapperRight}>
          <h6 className={styles.desc}>Pilih tahun tenor</h6>
          <div className={styles.wrapperRow}>
            <ButtonTenor termin="1" />
            <ButtonTenor termin="2" />
            <ButtonTenor termin="3" />
            <ButtonTenor termin="4" />
            <ButtonTenor termin="5" />
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
            priority
            alt="indonesia-flag"
          />
          <p className={styles.labelRegion}>+62</p>
          <p className={styles.separator}>|</p>
        </div>
        <input
          type="text"
          value={phone}
          className={styles.input}
          placeholder="Contoh : 0895401011469"
          onChange={onChangeDataMobile}
        ></input>
      </div>
      <label className={styles.advanceSearch}>Advanced Search</label>
      <div className={styles.wrapperRow}>
        <div className={styles.wrapperLeft}>
          <p className={styles.desc}>Kisaran pendapatan</p>
          <SelectorList
            indexKey="income"
            placeholder="< 2 juta/bulan"
            onClick={() => handleClickDP('income')}
          />
          {selectorActive === 'income' && (
            <DetailList indexKey="income" data={selectorData.income} />
          )}
        </div>
        <div className={styles.wrapperRight}>
          <p className={styles.desc}>Rentang Usia</p>
          <SelectorList
            indexKey="age"
            placeholder="18-27"
            onClick={() => handleClickDP('age')}
          />
          {selectorActive === 'age' && (
            <DetailList indexKey="age" data={selectorData.age} />
          )}
        </div>
      </div>
      <button className={styles.button} onClick={() => sendRequest()}>
        Temukan Mobilku
      </button>
    </div>
  )

  return (
    <div className={styles.container}>
      <Script src="/lazy.js" />
      <div className={styles.wrapperForm}>
        <Form onChangeDataMobile={(e: any) => handleChange(e.target.value)} />
      </div>
      <div className={styles.wrapperMobile}>
        <div className="swiper mySwiper">
          <div className="swiper-wrapper">
            {data.map((item: any, key: number) => {
              if (key === 0) {
                return (
                  <div className="swiper-slide" key={key}>
                    <Image
                      src={
                        apiBanner + item.attributes.mobile.data.attributes.url
                      }
                      width={480}
                      height={360}
                      priority
                      alt="seva-banner"
                      sizes="(max-width: 1024px) 54vw, 92.4vw"
                      className={`swiper-lazy ${styles.banner}`}
                    />
                  </div>
                )
              } else {
                return (
                  <div className="swiper-slide" key={key}>
                    <Image
                      src={
                        apiBanner + item.attributes.mobile.data.attributes.url
                      }
                      width={480}
                      height={360}
                      alt="seva-banner"
                      sizes="(max-width: 1024px) 54vw, 92.4vw"
                      className={`swiper-lazy ${styles.banner}`}
                    />
                  </div>
                )
              }
            })}
          </div>
        </div>
      </div>
      <div className={styles.wrapperDesktop}>
        <div className="swiper mySwiper">
          <div className="swiper-wrapper">
            {data.map((item: any, key: number) => (
              <div className="swiper-slide" key={key}>
                <Image
                  src={apiBanner + item.attributes.desktop.data.attributes.url}
                  width={1040}
                  height={416}
                  alt="seva-banner"
                  sizes="(max-width: 1024px) 54vw, 92.4vw"
                  className={`lazy-loader swiper-lazy ${styles.banner}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
