import React, { useContext, useEffect, useState } from 'react'
import SupergraphicRight from '/public/revamp/illustration/supergraphic-secondary-small.webp'
import styles from 'styles/components/organisms/leadsFormTertiary.module.scss'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { UnverifiedLeadSubCategory } from 'utils/types/models'
import {
  filterNonDigitCharacters,
  onlyLettersAndSpaces,
} from 'utils/handler/stringManipulation'
import { AmplitudeEventName } from 'services/amplitude/types'
import { sendAmplitudeData } from 'services/amplitude'
import { decryptValue, encryptValue } from 'utils/handler/encryption'
import { getLocalStorage, saveLocalStorage } from 'utils/handler/localStorage'
import elementId from 'utils/helpers/trackerId'
import { Button, Input, InputPhone, Toast } from 'components/atoms'
import Image from 'next/image'
import { IconLoading } from 'components/atoms/icon'
import { PageOriginationName } from 'utils/types/tracker'
import { api } from 'services/api'
import { setTrackEventMoEngageWithoutValue } from 'services/moengage'
import { FunnelQueryContext, FunnelQueryContextType } from 'services/context'
import { useRouter } from 'next/router'
import { OTP } from 'components/organisms/otp'
import { LocalStorageKey } from 'utils/enum'
import { CityOtrOption } from 'utils/types'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import {
  trackEventCountly,
  valueForUserTypeProperty,
} from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { getToken } from 'utils/handler/auth'
import { getCustomerInfoSeva } from 'utils/handler/customer'

interface PropsLeadsForm {
  otpStatus?: any
  onVerify?: (e: any) => void
  onFailed?: (e: any) => void
}

const LeadsFormTertiary: React.FC<PropsLeadsForm> = ({}: any) => {
  const router = useRouter()
  const { funnelQuery } = useContext(
    FunnelQueryContext,
  ) as FunnelQueryContextType
  const platform = 'web'
  const toastSuccessInfo =
    'Nomor berhasil diverifikasi. Agen SEVA akan segera menghubungi kamu.'
  const [name, setName] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isFilled, setIsFilled] = useState<boolean>(false)
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false)
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const referralCodeFromUrl: string | null = getLocalStorage(
    LocalStorageKey.referralTemanSeva,
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
    sendAmplitudeData(AmplitudeEventName.WEB_LEADS_FORM_SUBMIT, {
      Page_Origination: PageOriginationName.LPLeadsForm,
      ...(cityOtr && { City: cityOtr.cityName }),
    })
    const dataLeads = checkDataFlagLeads()
    if (dataLeads) {
      if (phone === dataLeads.phone && name === dataLeads.name) {
        sendUnverifiedLeads()
        onClickSendLeads('Yes')
      } else if (phone === dataLeads.phone && name !== dataLeads.name) {
        sendUnverifiedLeads()
        updateFlagLeadsName(name)
        onClickSendLeads('Yes')
      } else {
        setModalOpened('otp')
        trackEventCountly(CountlyEventNames.WEB_OTP_VIEW, {
          PAGE_ORIGINATION: 'Homepage - Bottom Section',
        })
        onClickSendLeads('No')
      }
    } else if (isUserLoggedIn) {
      sendUnverifiedLeads()
      onClickSendLeads('Yes')
    } else {
      setModalOpened('otp')
      trackEventCountly(CountlyEventNames.WEB_OTP_VIEW, {
        PAGE_ORIGINATION: 'Homepage - Bottom Section',
      })
      onClickSendLeads('No')
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
      let temanSevaStatus = 'No'
      if (referralCodeFromUrl) {
        temanSevaStatus = 'Yes'
      } else if (!!getToken()) {
        const response = await getCustomerInfoSeva()
        if (response[0].temanSevaTrxCode) {
          temanSevaStatus = 'Yes'
        }
      }
      await api.postUnverifiedLeadsNew(data)
      sendAmplitudeData(AmplitudeEventName.WEB_LEADS_FORM_SUCCESS, {
        Page_Origination: PageOriginationName.LPLeadsForm,
        ...(cityOtr && { City: cityOtr.cityName }),
      })
      trackEventCountly(CountlyEventNames.WEB_LEADS_FORM_SUCCESS_VIEW, {
        PAGE_ORIGINATION: 'Homepage - Bottom Section',
        LOGIN_STATUS: isUserLoggedIn ? 'Yes' : 'No',
        TEMAN_SEVA_STATUS: temanSevaStatus,
        PHONE_NUMBER: '+62' + phone,
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
    sendAmplitudeData(AmplitudeEventName.SELECT_HOME_SEND_DETAILS, {})
    sendAmplitudeData(AmplitudeEventName.WEB_LANDING_PAGE_LEADS_FORM_SUBMIT, {
      WA_Chat: false,
    })
    setTrackEventMoEngageWithoutValue('leads_created')

    if (typeof window !== undefined) {
      window.dataLayer.push({
        event: 'interaction',
        eventCategory: 'Leads Generator',
        eventAction: 'Homepage - Leads Form - Control',
        eventLabel: 'Kirim Rincian',
      })
    }
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

  const onClickNameField = () => {
    trackEventCountly(CountlyEventNames.WEB_LEADS_FORM_NAME_CLICK, {
      PAGE_ORIGINATION: 'Homepage - Floating Icon',
      USER_TYPE: valueForUserTypeProperty(),
    })
  }

  const onClickPhoneField = () => {
    trackEventCountly(CountlyEventNames.WEB_LEADS_FORM_PHONE_NUMBER_CLICK, {
      PAGE_ORIGINATION: 'Homepage - Floating Icon',
      USER_TYPE: valueForUserTypeProperty(),
    })
  }

  const onClickSendLeads = async (PHONE_VERIFICATION_STATUS: string) => {
    trackEventCountly(CountlyEventNames.WEB_LEADS_FORM_SEND_CLICK, {
      PAGE_ORIGINATION: 'Homepage - Bottom Section',
      LOGIN_STATUS: isUserLoggedIn ? 'Yes' : 'No',
      PHONE_VERIFICATION_STATUS: PHONE_VERIFICATION_STATUS,
      PHONE_NUMBER: '+62' + phone,
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.background}>
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
          <h2 className={styles.textHeading}>Butuh Bantuan?</h2>
          <p className={styles.textSubHeading}>
            Untuk tahu lebih lanjut, yuk ngobrol dengan Agen SEVA. Kami akan
            menghubungi kamu dalam 1x24 jam.
          </p>
          <div className={styles.form}>
            <Input
              className={styles.inputName}
              dataTestId={
                router.pathname === ''
                  ? elementId.Field.FullName
                  : elementId.PDP.LeadsForm.name
              }
              placeholder="Masukkan nama lengkap"
              title="Nama Lengkap"
              value={name}
              onChange={(e: any) => handleInputName(e.target.value)}
              data-testid={elementId.Field.FullName}
              onFocus={onClickNameField}
            />
            <InputPhone
              className={styles.inputPhone}
              dataTestId={
                router.pathname === ''
                  ? elementId.Field.PhoneNumber
                  : elementId.PDP.LeadsForm.phone
              }
              disabled={isUserLoggedIn}
              placeholder="Masukkan nomor HP"
              title="Nomor Handphone"
              value={phone}
              onChange={(e: any) => handleInputPhone(e.target.value)}
              data-testid={elementId.Field.FullName}
              onFocus={onClickPhoneField}
            />
            <Button
              secondaryClassName={styles.button}
              data-test-id={
                router.pathname === ''
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
        width={343}
        text={toastSuccessInfo}
        open={modalOpened === 'success-toast'}
      />
    </div>
  )
}

export default LeadsFormTertiary
