import React, { useContext, useEffect, useMemo, useState } from 'react'
import styles from 'styles/components/organisms/leadsFormSecondary.module.scss'
import { Button, Gap, Input, InputPhone, Toast } from 'components/atoms'
import SupergraphicLeft from 'assets/illustration/supergraphic-small.webp'
import SupergraphicRight from 'assets/illustration/supergraphic-large.webp'
import {
  ButtonSize,
  ButtonVersion,
  LoanRank,
  LocalStorageKey,
  SessionStorageKey,
  UnverifiedLeadSubCategory,
} from 'utils/types/models'
import { OTP } from 'components/organisms'
import { useMediaQuery } from 'react-responsive'
import Image from 'next/image'
import { getLocalStorage, saveLocalStorage } from 'utils/handler/localStorage'
import { IconLoading } from 'components/atoms/icons'
import {
  filterNonDigitCharacters,
  onlyLettersAndSpaces,
} from 'utils/handler/stringManipulation'
import { decryptValue, encryptValue } from 'utils/handler/encryption'
import { api } from 'services/api'
import elementId from 'utils/helpers/trackerId'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { sendAmplitudeData } from 'services/amplitude'
import { AmplitudeEventName } from 'services/amplitude/types'
import { LeadsActionParam, PageOriginationName } from 'utils/types/tracker'
import urls from 'utils/helpers/url'
import { Currency, getConvertFilterIncome } from 'utils/handler/calculation'
import { useSessionStorage } from 'utils/hooks/useSessionStorage/useSessionStorage'
import { useRouter } from 'next/router'
import {
  CarContext,
  CarContextType,
  FunnelQueryContext,
  FunnelQueryContextType,
} from 'services/context'

interface PropsLeadsForm {
  otpStatus?: any
  onVerify?: (e: any) => void
  onFailed?: (e: any) => void
}

export interface CityOtrOption {
  cityName: string
  cityCode: string
  province: string
  id?: string
}

const LeadsFormSecondary: React.FC<PropsLeadsForm> = ({}: any) => {
  const { funnelQuery } = useContext(
    FunnelQueryContext,
  ) as FunnelQueryContextType
  const { carModelDetails, carVariantDetails } = useContext(
    CarContext,
  ) as CarContextType
  const platform = 'web'
  const toastSuccessInfo = 'Agen kami akan segera menghubungimu dalam 1x24 jam.'
  const [name, setName] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [infoCar, setInfoCar] = useState<any>()
  const [isFilled, setIsFilled] = useState<boolean>(false)
  const [modalOpened, setModalOpened] = useState<
    'otp' | 'success-toast' | 'none'
  >('none')
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false)

  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )

  const [loanRankPLP] = useSessionStorage(
    SessionStorageKey.LoanRankFromPLP,
    false,
  )
  const router = useRouter()
  const { brand, model }: any = router.query

  const handleInputName = (payload: any): void => {
    if (payload !== ' ' && onlyLettersAndSpaces(payload)) {
      setName(payload)
      checkInputValue(payload, phone)
    }
  }

  const handleInputPhone = (payload: any): void => {
    const temp = payload
    const checkNumber = payload.split('').splice(0, 2)
    if (checkNumber[0] === '6' && checkNumber[1] === '2') {
      const phoneNumberTemp = filterNonDigitCharacters(temp.replace('62', ''))
      setPhone(phoneNumberTemp)
      checkInputValue(name, phoneNumberTemp)
    } else if (payload !== '0' && payload !== '6') {
      const phoneNumberTemp = filterNonDigitCharacters(temp)
      setPhone(phoneNumberTemp)
      checkInputValue(name, phoneNumberTemp)
    }
  }

  const checkInputValue = (name: string, phone: string): void => {
    if (name !== '' && phone?.length > 8) setIsFilled(true)
    else setIsFilled(false)
  }

  useEffect(() => {
    getDataCustomer()
  }, [])

  useEffect(() => {
    if (carModelDetails) {
      setInfoCar(`${carModelDetails.brand} ${carModelDetails.model}`)
    }
  }, [carModelDetails])

  const sortedCarModelVariant = useMemo(() => {
    return (
      carModelDetails?.variants.sort(function (a: any, b: any) {
        return a.priceValue - b.priceValue
      }) || []
    )
  }, [carModelDetails])

  const getDp = () => {
    return sortedCarModelVariant[0].dpAmount
  }

  const getTenure = (): number => {
    return sortedCarModelVariant[0].tenure
  }

  const trackLeads = (): LeadsActionParam => {
    let loanRank = ''
    if (
      funnelQuery.age &&
      funnelQuery.monthlyIncome &&
      funnelQuery.tenure &&
      funnelQuery.downPaymentAmount
    ) {
      if (sortedCarModelVariant[0].loanRank === LoanRank.Green) {
        loanRank = 'Mudah'
      } else if (sortedCarModelVariant[0].loanRank === LoanRank.Red) {
        loanRank = 'Sulit'
      }
    }

    const filterIncome = getConvertFilterIncome(
      String(funnelQuery.monthlyIncome),
    )

    return {
      ...(funnelQuery.monthlyIncome && {
        Income: `Rp${filterIncome}`,
      }),
      ...(funnelQuery.age && {
        Age: String(funnelQuery.age),
      }),
      Car_Brand: carModelDetails?.brand,
      Car_Model: carModelDetails?.model,
      Car_Body_Type: carVariantDetails?.variantDetail.bodyType,
      DP: `Rp${Currency(String(getDp()))}`,
      Tenure: String(getTenure()),
      ...(loanRankPLP && loanRank && { Peluang_Kredit: loanRank }),
      Page_Origination: PageOriginationName.PDPLeadsForm,
      ...(cityOtr && { City: cityOtr.cityName }),
    }
  }

  const verified = () => {
    const data = {
      name,
      phone,
    }
    setModalOpened('none')
    saveFlagLeads(data)
    sendUnverifiedLeads()
  }

  const sendOtpCode = async () => {
    setIsLoading(true)
    sendAmplitudeData(AmplitudeEventName.WEB_LEADS_FORM_SUBMIT, trackLeads())
    const dataLeads = checkDataFlagLeads()
    if (dataLeads) {
      if (phone === dataLeads.phone && name === dataLeads.name) {
        sendUnverifiedLeads()
      } else if (phone === dataLeads.phone && name !== dataLeads.name) {
        sendUnverifiedLeads()
        updateFlagLeadsName(name)
      } else {
        setModalOpened('otp')
      }
    } else if (isUserLoggedIn) {
      sendUnverifiedLeads()
    } else {
      setModalOpened('otp')
    }
  }

  const saveFlagLeads = (payload: any) => {
    const now = new Date()
    const expiry = now.getTime() + 7 * 24 * 60 * 60 * 1000
    const data = { ...payload, expiry }
    const encryptedData = encryptValue(JSON.stringify(data))
    saveLocalStorage(LocalStorageKey.flagLeads, encryptedData)
  }

  const updateFlagLeadsName = (payload: string) => {
    const data: any = getLocalStorage(LocalStorageKey.flagLeads)
    const decryptedValue: any = JSON.parse(decryptValue(data))
    const newData = { ...decryptedValue, name: payload }
    const encryptedData = encryptValue(JSON.stringify(newData))
    saveLocalStorage(LocalStorageKey.flagLeads, encryptedData)
  }

  const sendUnverifiedLeads = async () => {
    const data = {
      platform,
      name,
      phoneNumber: phone,
      origination: UnverifiedLeadSubCategory.SEVA_NEW_CAR_PDP_LEADS_FORM,
      ...(cityOtr?.id && { cityId: cityOtr.id }),
      dp: getDp(),
      tenure: getTenure(),
      monthlyInstallment: sortedCarModelVariant[0].monthlyInstallment,
      carBrand: carModelDetails?.brand,
      carModelText: carModelDetails?.model,
    }
    try {
      await api.createUnverifiedLeadsNew(data)
      setModalOpened('success-toast')
      sendAmplitudeData(AmplitudeEventName.WEB_LEADS_FORM_SUCCESS, trackLeads())
      setIsLoading(false)
      setTimeout(() => setModalOpened('none'), 3000)
    } catch (error) {
      throw error
    }
  }

  const getDataCustomer = async () => {
    const data: string | null = getLocalStorage(LocalStorageKey.sevaCust)
    if (data !== null) {
      const user = JSON.parse(decryptValue(data))
      setName(user.fullName)
      setPhone(user.phoneNumber.replace('+62', ''))
      setIsUserLoggedIn(true)
      setIsFilled(true)
    } else {
      const dataLeads = checkDataFlagLeads()
      if (dataLeads) {
        setName(dataLeads.name)
        setPhone(dataLeads.phone)
        setIsFilled(true)
      }
    }
  }

  const checkDataFlagLeads = () => {
    const now = new Date()
    const flagLeads: any | null = getLocalStorage(LocalStorageKey.flagLeads)
    if (flagLeads !== null) {
      const parsedLeads = JSON.parse(decryptValue(flagLeads))
      if (now.getTime() > parsedLeads.expiry) {
        localStorage.removeItem(LocalStorageKey.flagLeads)
        return
      } else {
        return parsedLeads
      }
    }
  }

  const onClickCalculateCta = () => {
    const urlDirection = urls.internalUrls.variantListUrl
      .replace(':brand', brand)
      .replace(':model', model)
      .replace(':tab', 'kredit')
    sendAmplitudeData(AmplitudeEventName.WEB_PAGE_DIRECTION_WIDGET_CTA_CLICK, {
      Page_Direction_URL:
        'https://' + window.location.host + urlDirection.replace('?', ''),
    })
    window.location.href = urlDirection
  }

  return (
    <div>
      <div className={styles.wrapper}>
        <div className={styles.background}>
          <div className={styles.wrapperSupergraphicLeft}>
            <Image
              src={SupergraphicLeft}
              alt="seva-vector-blue-rounded"
              width={200}
              height={140}
              className={styles.supergraphicLeft}
            />
          </div>
          <div className={styles.wrapperSupergraphicRight}>
            <Image
              src={SupergraphicRight}
              alt="seva-vector-red-rounded"
              width={200}
              height={140}
              className={styles.supergraphicRight}
            />
          </div>
        </div>

        <div className={styles.foreground}>
          <h3 className={styles.textHeading}>
            Yuk, cari tahu & tanya lebih lanjut tentang {infoCar}
          </h3>
          <div className={styles.form}>
            <Input
              dataTestId={elementId.Field.FullName}
              placeholder="Masukkan nama lengkap"
              title="Nama Lengkap"
              value={name}
              onChange={(e: any) => handleInputName(e.target.value)}
            />
            <Gap height={24} />
            <InputPhone
              dataTestId={elementId.Field.PhoneNumber}
              disabled={isUserLoggedIn}
              placeholder="Masukkan nomor HP"
              title="Nomor Handphone"
              value={phone}
              onChange={(e: any) => handleInputPhone(e.target.value)}
            />
            <Gap height={32} />
            <Button
              data-testid={elementId.PDP.Button.CariMobil}
              disabled={!isFilled}
              version={isFilled ? ButtonVersion.Default : ButtonVersion.Disable}
              size={ButtonSize.Big}
              onClick={() => sendOtpCode()}
            >
              {isLoading && isFilled ? (
                <div className={`${styles.iconWrapper} rotateAnimation`}>
                  <IconLoading width={14} height={14} color="#05256E" />
                </div>
              ) : (
                'Kirim'
              )}
            </Button>
            <p className={styles.textSuggestion}>atau</p>
            <Button
              version={ButtonVersion.SecondaryDark}
              size={ButtonSize.Big}
              onClick={onClickCalculateCta}
              data-testid={elementId.PDP.Button.HitungKemampuan}
            >
              Hitung Kemampuan
            </Button>
          </div>
        </div>
      </div>
      {modalOpened === 'otp' && (
        <OTP
          isOpened
          phoneNumber={phone}
          closeModal={() => {
            setIsLoading(false)
            setModalOpened('none')
          }}
          isOtpVerified={() => verified()}
        />
      )}
      <Toast
        width={isMobile ? 339 : 428}
        text={toastSuccessInfo}
        open={modalOpened === 'success-toast'}
      />
    </div>
  )
}

export default LeadsFormSecondary
