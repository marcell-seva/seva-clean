import React, { useEffect, useState } from 'react'
import {
  Button,
  IconLoading,
  Input,
  InputPhone,
  Toast,
} from '_revamp/components/atoms'
import { ButtonSize, ButtonVersion } from '_revamp/utils/enum'
import { getLocalStorage, saveLocalStorage } from 'utils/localstorageUtils'
import { LocalStorageKey } from 'models/models'
import { decryptValue, encryptValue } from 'utils/encryptionUtils'
import { filterNonDigitCharacters } from 'utils/stringUtils'
import { onlyLettersAndSpaces } from '_revamp/utils/handler'
import { useLocalStorage } from 'hooks/useLocalStorage/useLocalStorage'
import { useFunnelQueryData } from 'context/funnelQueryContext/funnelQueryContext'
import { OTP } from '../../otp'
import { useMediaQuery } from 'react-responsive'
import SupergraphicRight from '_revamp/assets/illustration/supergraphic-secondary-small.webp'
import elementId from 'helpers/elementIds'
import styles from '_revamp/styles/organism/leadsFormTertiary.module.scss'
import {
  UnverifiedLeadSubCategory,
  createUnverifiedLeadNew,
} from 'services/lead'
import {
  PageOriginationName,
  trackLandingPageLeadsFormSubmit,
  trackLeadsFormAction,
} from 'helpers/amplitude/seva20Tracking'
import { useTranslation } from 'react-i18next'
import { setTrackEventMoEngageWithoutValue } from 'helpers/moengage'
import { trackSelectHomeSendDetails } from 'helpers/amplitude/newHomePageEventTracking'
import { TrackingEventName } from 'helpers/amplitude/eventTypes'
import { useLocation } from 'react-router-dom'

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

export const LeadsFormTertiary: React.FC<PropsLeadsForm> = ({}: any) => {
  const platform = 'web'
  const location = useLocation()
  const toastSuccessInfo =
    'Nomor berhasil diverifikasi. Agen SEVA akan segera menghubungi kamu.'
  const { t } = useTranslation()
  const { funnelQuery } = useFunnelQueryData()
  const [name, setName] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isFilled, setIsFilled] = useState<boolean>(false)
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false)
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const [modalOpened, setModalOpened] = useState<
    'otp' | 'success-toast' | 'none'
  >('none')

  useEffect(() => {
    getDataCustomer()
  }, [])

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

  const verified = (): void => {
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
    trackLeadsFormAction(TrackingEventName.WEB_LEADS_FORM_SUBMIT, {
      Page_Origination: PageOriginationName.LPLeadsForm,
      ...(cityOtr && { City: cityOtr.cityName }),
    })
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

  const saveFlagLeads = (payload: { name: string; phone: string }): void => {
    const now = new Date()
    const expiry = now.getTime() + 7 * 24 * 60 * 60 * 1000
    const data = { ...payload, expiry }
    const encryptedData = encryptValue(JSON.stringify(data))
    saveLocalStorage(LocalStorageKey.flagLeads, encryptedData)
  }

  const updateFlagLeadsName = (payload: string): void => {
    const data: any = getLocalStorage(LocalStorageKey.flagLeads)
    const decryptedValue: any = JSON.parse(decryptValue(data))
    const newData = { ...decryptedValue, name: payload }
    const encryptedData = encryptValue(JSON.stringify(newData))
    saveLocalStorage(LocalStorageKey.flagLeads, encryptedData)
  }

  const sendUnverifiedLeads = async (): Promise<void> => {
    const data = {
      platform,
      name,
      phoneNumber: phone,
      origination: UnverifiedLeadSubCategory.SEVA_NEW_CAR_LP_LEADS_FORM,
      ...(cityOtr?.id && { cityId: cityOtr.id }),
      ...(funnelQuery.downPaymentAmount && {
        dp: parseInt(funnelQuery.downPaymentAmount as string),
      }),
      ...(funnelQuery.monthlyInstallment && {
        monthlyInstallment: parseInt(funnelQuery.monthlyInstallment as string),
      }),
    }
    try {
      await createUnverifiedLeadNew(data)
      trackLeadsFormAction(TrackingEventName.WEB_LEADS_FORM_SUCCESS, {
        Page_Origination: PageOriginationName.LPLeadsForm,
        ...(cityOtr && { City: cityOtr.cityName }),
      })
      setModalOpened('success-toast')
      setIsLoading(false)
      onSubmitLeadSuccess()
      setTimeout(() => setModalOpened('none'), 5000)
    } catch (error) {
      throw error
    }
  }

  const onSubmitLeadSuccess = (): void => {
    trackSelectHomeSendDetails()
    trackLandingPageLeadsFormSubmit({ WA_Chat: false })
    setTrackEventMoEngageWithoutValue('leads_created')

    // prettier-ignore
    window.dataLayer.push({
        'event':'interaction',
        'eventCategory': 'Leads Generator',
        'eventAction': 'Homepage - Leads Form - Control',
        'eventLabel': t(`advisorSection.button`),
      });
  }

  const getDataCustomer = async (): Promise<void> => {
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

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.background}>
          <div className={styles.wrapperSupergraphicRight}>
            <img
              src={SupergraphicRight}
              alt="seva-vector-red-rounded"
              width={200}
              height={140}
              className={styles.supergraphicRight}
            />
          </div>
        </div>

        <div className={styles.foreground}>
          <h2 className={styles.textHeading}>Butuh Bantuan?</h2>
          <p className={styles.textSubHeading}>
            Untuk tahu lebih lanjut, yuk ngobrol dengan Agen SEVA. Kami akan
            menghubungi kamu dalam 1x24 jam.
          </p>
          <div className={styles.form}>
            <Input
              className={styles.inputName}
              dataTestId={
                location.pathname === ''
                  ? elementId.Field.FullName
                  : elementId.PDP.LeadsForm.name
              }
              placeholder="Masukkan nama lengkap"
              title="Nama Lengkap"
              value={name}
              onChange={(e: any) => handleInputName(e.target.value)}
              data-testid={elementId.Field.FullName}
            />
            <InputPhone
              className={styles.inputPhone}
              dataTestId={
                location.pathname === ''
                  ? elementId.Field.PhoneNumber
                  : elementId.PDP.LeadsForm.phone
              }
              disabled={isUserLoggedIn}
              placeholder="Masukkan nomor HP"
              title="Nomor Handphone"
              value={phone}
              onChange={(e: any) => handleInputPhone(e.target.value)}
              data-testid={elementId.Field.FullName}
            />
            <Button
              secondaryClassName={styles.button}
              data-test-id={
                location.pathname === ''
                  ? elementId.Homepage.Button.CariMobil
                  : elementId.PDP.LeadsForm.btnSend
              }
              disabled={!isFilled}
              version={
                isFilled ? ButtonVersion.PrimaryDarkBlue : ButtonVersion.Disable
              }
              size={ButtonSize.Big}
              onClick={() => sendOtpCode()}
            >
              {isLoading && isFilled ? (
                <div className={`${styles.iconWrapper} rotateAnimation`}>
                  <IconLoading width={14} height={14} color="#FFFFFF" />
                </div>
              ) : (
                'Kirim'
              )}
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
