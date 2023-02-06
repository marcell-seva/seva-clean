import Image from 'next/image'
import React, { useState } from 'react'
import TagManager from 'react-gtm-module'
import { api } from '../../../services/api'
import { trackGAContact, trackGALead } from '../../../services/googleAds'
import styles from '../../../styles/Widget.module.css'
import { useComponentVisible } from '../../../utils'
import { IconChevronDown, IconChevronUp } from '../../atoms'
import FlagIndonesia from '../../../assets/images/flagIndonesia.png'

export default function Widget() {
  const [form, setForm] = useState<any>({
    tenor: '5',
  })

  const { innerBorderRef } = useComponentVisible(() => setSelectorActive(''))

  const [phone, setPhone] = useState()
  const [selectorActive, setSelectorActive] = useState<string>('')
  const [isDetailShow, setIsDetailShow] = useState<boolean>(false)
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

  const ButtonTenor = ({ termin, isActive }: any) => (
    <button
      onClick={() => {
        setForm((prevState: any) => ({ ...prevState, tenor: termin }))
      }}
      className={isActive ? styles.tenorActive : styles.tenorInActive}
    >
      {termin}
    </button>
  )

  const SelectorList = ({ placeholder, onClick, indexKey }: any) => (
    <button className={styles.selector} onClick={onClick}>
      <input
        className={styles.placeholderText}
        type="text"
        disabled
        placeholder={placeholder}
        value={form[indexKey]}
      />
      {selectorActive === indexKey ? (
        <IconChevronUp width={15} height={15} />
      ) : (
        <IconChevronDown width={15} height={15} />
      )}
    </button>
  )

  const pushDataLayerOnClick = () => {
    TagManager.dataLayer({
      dataLayer: {
        event: 'interaction',
        eventCategory: 'Leads Generator',
        eventAction: 'Homepage - Search Widget',
        eventLabel: 'Temukan Mobilku',
      },
    })
  }

  const sendRequest = () => {
    const isValidPhoneNumber = form.phoneNumber.length > 3
    setForm((prevState: any) => ({
      ...prevState,
      phone: phone,
    }))
    pushDataLayerOnClick()

    if (isValidPhoneNumber) {
      trackGALead()
      const data = {
        age: '18-26',
        income: '2M -4M',
        maxDp: 10000000,
        origination: 'Web_Homepage_Search_Widget',
        userTouchpoints: 'Web_Homepage_Search_Widget',
        phoneNumber: '+6212312312',
        tenure: '1',
        adSet: null,
        utmCampaign: null,
        utmContent: null,
        utmId: null,
        utmMedium: null,
        utmSource: null,
        utmTerm: null,
      }
      sendUnverifiedLeads(data)
    } else trackGAContact()
  }

  const handleClickDP = (payload: string) => {
    if (selectorActive === payload) setSelectorActive('')
    else setSelectorActive(payload)
    console.log('das', payload)
  }

  const onChangeDataMobile = (payload: any) => {
    setPhone(payload)
  }

  const sendUnverifiedLeads = (payload: any) => {
    try {
      api.postUnverfiedLeads(payload)
    } catch (error) {
      throw error
    }
  }

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

  return (
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
            <ButtonTenor isActive={form.tenor === '1'} termin="1" />
            <ButtonTenor isActive={form.tenor === '2'} termin="2" />
            <ButtonTenor isActive={form.tenor === '3'} termin="3" />
            <ButtonTenor isActive={form.tenor === '4'} termin="4" />
            <ButtonTenor isActive={form.tenor === '5'} termin="5" />
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
          onChange={(e: any) => onChangeDataMobile(e.target.value)}
        ></input>
      </div>
      <p
        className={styles.advanceSearch}
        onClick={() => setIsDetailShow(!isDetailShow)}
      >
        Advanced search
        <span className={styles.iconDropDown}>
          {isDetailShow ? (
            <IconChevronUp width={10} height={10} color="#246ed4" />
          ) : (
            <IconChevronDown width={10} height={10} color="#246ed4" />
          )}
        </span>
      </p>
      {isDetailShow && (
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
      )}
      <button className={styles.button} onClick={() => sendRequest()}>
        Temukan Mobilku
      </button>
    </div>
  )
}
