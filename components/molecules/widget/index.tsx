import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'
import { api } from 'services/api'
import styles from 'styles/saas/components/molecules/Widget.module.scss'
import { rupiah, useComponentVisible } from 'utils'
import { IconChevronDown, IconChevronUp } from 'components/atoms'
import FlagIndonesia from 'assets/images/flagIndonesia.png'
import {
  AuthContext,
  ConfigContext,
  AuthContextType,
  ConfigContextType,
} from 'services/context'
import {
  FormWidget,
  PropsButtonTenure,
  PropsSelectorList,
  PropsDetailList,
} from 'utils/types'

interface PropsWidget {
  expandForm: () => void
}

const Widget: React.FC<PropsWidget> = ({ expandForm }): JSX.Element => {
  const { userData, filter, saveFilterData } = useContext(
    AuthContext,
  ) as AuthContextType
  const { utm } = useContext(ConfigContext) as ConfigContextType
  const [isFieldErrorType, setIsFieldErrorType] = useState<string>('')
  const carListUrl: string = 'https://seva.id/mobil-baru'
  const [form, setForm] = useState<any>({
    tenure: 5,
  })
  const { innerBorderRef } = useComponentVisible(() => setSelectorActive(''))
  const [phone, setPhone] = useState<string | number>('')
  const [selectorActive, setSelectorActive] = useState<string>('')
  const [isDetailShow, setIsDetailShow] = useState<boolean>(false)
  const selectorData = {
    dp: [
      30000000, 40000000, 50000000, 75000000, 100000000, 150000000, 250000000,
      350000000,
    ],
    income: [
      '< 2M',
      '2M-4M',
      '4M-6M',
      '6M-8M',
      '8-M10M',
      '10M-20M',
      '20M-50M',
      '50M-75M',
      '75M-100M',
      '100M-150M',
      '150M-200M',
      '> 200M',
    ],
    age: ['18-27', '28-34', '35-50', '>51'],
  }
  const buttonText: string = 'Temukan Mobilku'
  const headerText: string = 'Cari mobil baru yang pas buat kamu'
  const descText: string =
    'Ingin bertanya langsung ke tim SEVA? Tulis nomor hp kamu untuk kami hubungi (Opsional)'

  useEffect(() => {
    if (userData !== null) {
      const parsedPhone = userData.phoneNumber.toString().replace('+62', '')
      setPhone(parseInt(parsedPhone))
    }
    if (filter !== null)
      setForm((prevState: any) => ({
        ...prevState,
        dp:
          filter.downPaymentAmount === ''
            ? undefined
            : filter.downPaymentAmount,
        income: filter.monthlyIncome === '' ? undefined : filter.monthlyIncome,
        tenure: filter.tenure,
        age: filter.age,
      }))
  }, [userData, filter])

  const ButtonTenure: React.FC<PropsButtonTenure> = ({
    tenure,
    isActive,
  }): JSX.Element => (
    <button
      onClick={() => {
        setForm((prevState: any) => ({ ...prevState, tenure: tenure }))
      }}
      className={isActive ? styles.tenureActive : styles.tenureInActive}
    >
      {tenure}
    </button>
  )

  const SelectorList: React.FC<PropsSelectorList> = ({
    placeholder,
    onClick,
    indexKey,
    isError,
    fallback,
  }): JSX.Element => {
    if (isError) {
      return (
        <div>
          <button className={styles.selectorError} onClick={onClick}>
            <input
              className={styles.placeholderText}
              type="text"
              disabled
              placeholder={placeholder}
              value={
                fallback !== undefined && form[indexKey] !== undefined
                  ? fallback(form[indexKey])
                  : form[indexKey]
              }
            />
            {selectorActive === indexKey ? (
              <IconChevronUp width={15} height={15} color="#e01f29" />
            ) : (
              <IconChevronDown width={15} height={15} color="#e01f29" />
            )}
          </button>
          <p className={styles.infoErrorText}>* Wajib diisi</p>
        </div>
      )
    } else {
      return (
        <button className={styles.selector} onClick={onClick}>
          <input
            className={styles.placeholderText}
            type="text"
            disabled
            placeholder={placeholder}
            value={
              fallback !== undefined && form[indexKey] !== undefined
                ? fallback(form[indexKey])
                : form[indexKey]
            }
          />
          {selectorActive === indexKey ? (
            <IconChevronUp width={15} height={15} color="#002373" />
          ) : (
            <IconChevronDown width={15} height={15} />
          )}
        </button>
      )
    }
  }

  const sendRequest = (): void => {
    if (form.dp === undefined) setIsFieldErrorType('dp')
    else if (form.age === undefined && form.income !== undefined)
      setIsFieldErrorType('age')
    else if (form.age !== undefined && form.income === undefined)
      setIsFieldErrorType('income')
    else {
      setForm((prevState: any) => ({
        ...prevState,
        phone: phone,
      }))
      execUnverifiedLeads(form)
      setDataFilterLocalStorage(form)
    }
  }

  const incomeTextSplitter = (payload: string): string => {
    const result = payload.replace(/M/g, '')
    return result + ' juta/bulan'
  }

  const execUnverifiedLeads = (payload: FormWidget): void => {
    const isValidPhoneNumber = phone.toString().length > 3

    if (isValidPhoneNumber) {
      const data = {
        age: payload.age || '',
        income: payload.income || '',
        maxDp: parseInt(payload.dp),
        phoneNumber: `+62${phone}`,
        tenure: payload.tenure.toString(),
        origination: 'Web_Homepage_Search_Widget',
        userTouchpoints: 'Web_Homepage_Search_Widget',
        adSet: utm?.adset,
        utmCampaign: utm?.utm_campaign,
        utmContent: utm?.utm_content,
        utmId: utm?.utm_id,
        utmMedium: utm?.utm_medium,
        utmSource: utm?.utm_source,
        utmTerm: utm?.utm_term,
      }
      sendUnverifiedLeads(data)
    } else {
      window.location.href = carListUrl
    }
  }

  const handleClickDP = (payload: string): void => {
    if (selectorActive === payload) setSelectorActive('')
    else setSelectorActive(payload)
  }

  const sendUnverifiedLeads = (payload: any): void => {
    try {
      api.postUnverfiedLeads(payload)
      window.location.href = carListUrl
    } catch (error) {
      throw error
    }
  }

  const setDataFilterLocalStorage = (payload: FormWidget): void => {
    saveFilterData({
      age: payload.age || '',
      downPaymentAmount: payload.dp.toString(),
      monthlyIncome: payload.income || '',
      tenure: payload.tenure,
      carModel: '',
      downPaymentType: 'amount',
      monthlyInstallment: '',
      sortBy: 'highToLow',
      brand: [],
      bodyType: [],
    })
  }

  const constraintTopDownPayment: number = 350000000

  const DetailList: React.FC<PropsDetailList> = ({
    data,
    indexKey,
    fallback,
  }): JSX.Element => {
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
            {fallback !== undefined ? (
              <label className={styles.buttonListText}>
                {fallback(item, item === constraintTopDownPayment)}
              </label>
            ) : (
              <label className={styles.buttonListText}>{item}</label>
            )}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className={styles.form}>
      <h1 className={styles.title}>{headerText}</h1>
      <div className={styles.wrapperRow}>
        <div className={styles.wrapperLeft}>
          <p className={styles.desc}>Pilih maksimal DP</p>
          <SelectorList
            placeholder=">Rp 350 Jt"
            indexKey="dp"
            isError={isFieldErrorType === 'dp' && form.dp === undefined}
            onClick={() => handleClickDP('dp')}
            fallback={rupiah}
          />
          {selectorActive === 'dp' && (
            <DetailList
              indexKey="dp"
              data={selectorData.dp}
              fallback={rupiah}
            />
          )}
        </div>
        <div className={styles.wrapperRight}>
          <p className={styles.desc}>Pilih tahun tenor</p>
          <div className={styles.wrapperRow}>
            <ButtonTenure isActive={form.tenure === 1} tenure={1} />
            <ButtonTenure isActive={form.tenure === 2} tenure={2} />
            <ButtonTenure isActive={form.tenure === 3} tenure={3} />
            <ButtonTenure isActive={form.tenure === 4} tenure={4} />
            <ButtonTenure isActive={form.tenure === 5} tenure={5} />
          </div>
        </div>
      </div>
      <p className={styles.desc}>{descText}</p>
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
          <div className={styles.separator} />
        </div>
        <input
          type="number"
          value={phone}
          className={styles.input}
          placeholder="Contoh : 0895401011469"
          onChange={(e: any) => setPhone(e.target.value)}
        ></input>
      </div>
      <p
        className={styles.advanceSearch}
        onClick={() => {
          setIsDetailShow(!isDetailShow)
          expandForm()
        }}
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
              isError={
                isFieldErrorType === 'income' && form.income === undefined
              }
              onClick={() => handleClickDP('income')}
              fallback={incomeTextSplitter}
            />
            {selectorActive === 'income' && (
              <DetailList
                indexKey="income"
                data={selectorData.income}
                fallback={incomeTextSplitter}
              />
            )}
          </div>
          <div className={styles.wrapperRight}>
            <p className={styles.desc}>Rentang Usia</p>
            <SelectorList
              indexKey="age"
              placeholder="18-27"
              isError={isFieldErrorType === 'age' && form.age === undefined}
              onClick={() => handleClickDP('age')}
            />
            {selectorActive === 'age' && (
              <DetailList indexKey="age" data={selectorData.age} />
            )}
          </div>
        </div>
      )}
      <button className={styles.button} onClick={() => sendRequest()}>
        {buttonText}
      </button>
    </div>
  )
}

export default Widget
