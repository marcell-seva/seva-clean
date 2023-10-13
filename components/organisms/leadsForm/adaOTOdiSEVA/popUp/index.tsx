import React, { useEffect, useState } from 'react'
import styles from '/styles/components/organisms/leadsFormPrimary.module.scss'
import {
  Button,
  Gap,
  IconLoading,
  Input,
  InputPhone,
  Toast,
} from 'components/atoms'
import { LocalStorageKey, UnverifiedLeadSubCategory } from 'utils/enum'
import { getLocalStorage, saveLocalStorage } from 'utils/handler/localStorage'
import { decryptValue, encryptValue } from 'utils/encryptionUtils'
import { filterNonDigitCharacters } from 'utils/stringUtils'
import elementId from 'helpers/elementIds'
import { Modal } from 'components/atoms'
import {
  LeadsActionParam,
  trackLeadsFormAction,
} from 'helpers/amplitude/seva20Tracking'
import { TrackingEventName } from 'helpers/amplitude/eventTypes'
import { useMediaQuery } from 'react-responsive'
import { onlyLettersAndSpaces } from 'utils/handler/regex'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { OTP } from 'components/organisms/otp'
import Image from 'next/image'
import { CityOtrOption } from 'utils/types'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import {
  trackEventCountly,
  valueForUserTypeProperty,
  valueMenuTabCategory,
} from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { getToken } from 'utils/handler/auth'
import { getCustomerInfoSeva } from 'utils/handler/customer'
import { createUnverifiedLeadNew } from 'utils/handler/lead'

const SupergraphicSecondarySmall =
  '/revamp/illustration/supergraphic-secondary-small.webp'
const SupergraphicSecondaryLarge =
  '/revamp/illustration/supergraphic-secondary-large.webp'

interface PropsLeadsForm {
  otpStatus?: any
  onVerify?: (e: any) => void
  onFailed?: (e: any) => void
  onCancel?: () => void
  trackerProperties?: LeadsActionParam
  onPage?: string
}

export const AdaOTOdiSEVALeadsForm: React.FC<PropsLeadsForm> = ({
  onCancel,
  trackerProperties,
  onPage,
}: PropsLeadsForm) => {
  const platform = 'web'
  const toastSuccessInfo = 'Agen kami akan segera menghubungimu dalam 1x24 jam.'
  const [name, setName] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [phone, setPhone] = useState<string>('')
  const [isFilled, setIsFilled] = useState<boolean>(false)
  const [modalOpened, setModalOpened] = useState<
    'leads-form' | 'otp' | 'success-toast' | 'none'
  >('leads-form')
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false)
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )

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

  const verified = () => {
    const data = {
      name,
      phone,
    }
    saveFlagLeads(data)
    sendUnverifiedLeads()
  }

  const sendOtpCode = async () => {
    setIsLoading(true)
    if (trackerProperties)
      trackLeadsFormAction(
        TrackingEventName.WEB_LEADS_FORM_SUBMIT,
        trackerProperties,
      )
    const dataLeads = checkDataFlagLeads()
    if (dataLeads) {
      if (phone === dataLeads.phone && name === dataLeads.name) {
        trackCountlySendLeads('Yes')
        sendUnverifiedLeads()
      } else if (phone === dataLeads.phone && name !== dataLeads.name) {
        trackCountlySendLeads('Yes')
        sendUnverifiedLeads()
        updateFlagLeadsName(name)
      } else {
        trackCountlySendLeads('No')
        trackEventCountly(CountlyEventNames.WEB_OTP_VIEW, {
          PAGE_ORIGINATION: 'PLP',
        })
        setModalOpened('otp')
      }
    } else if (isUserLoggedIn) {
      sendUnverifiedLeads()
    } else {
      trackCountlySendLeads('No')
      trackEventCountly(CountlyEventNames.WEB_OTP_VIEW, {
        PAGE_ORIGINATION: 'PLP',
      })
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

  const trackCountlySendLeads = async (verifiedPhone: string) => {
    let temanSevaStatus = 'No'
    let pageOrigination = 'PLP'

    if (onPage === 'LP') {
      pageOrigination = 'PLP'
    }
    trackEventCountly(CountlyEventNames.WEB_LEADS_FORM_SEND_CLICK, {
      PAGE_ORIGINATION: 'PLP',
      LOGIN_STATUS: isUserLoggedIn ? 'Yes' : 'No',
      PHONE_VERIFICATION_STATUS: verifiedPhone,
      PHONE_NUMBER: '+62' + phone,
    })
  }
  const onClose = () => {
    if (trackerProperties)
      trackLeadsFormAction(
        TrackingEventName.WEB_LEADS_FORM_CLOSE,
        trackerProperties,
      )
    onCancel && onCancel()
  }

  const sendUnverifiedLeads = async () => {
    let data
    let temanSevaStatus = 'No'
    let pageOrigination = 'PLP'
    const referralCodeFromUrl: string | null = getLocalStorage(
      LocalStorageKey.referralTemanSeva,
    )

    if (onPage === 'LP') {
      pageOrigination = 'PLP'
    }
    if (referralCodeFromUrl) {
      temanSevaStatus = 'Yes'
    } else if (!!getToken()) {
      const response = await getCustomerInfoSeva()
      if (response[0].temanSevaTrxCode) {
        temanSevaStatus = 'Yes'
      }
    }
    if (onPage === 'LP') {
      data = {
        origination: UnverifiedLeadSubCategory.SEVA_NEW_CAR_CAR_OF_THE_MONTH,
        name,
        phoneNumber: phone,
        ...(cityOtr?.id && { cityId: cityOtr.id }),
        platform,
      }
    } else {
      data = {
        origination: UnverifiedLeadSubCategory.SEVA_NEW_CAR_PLP_LEADS_FORM,
        name,
        phoneNumber: phone,
        ...(cityOtr?.id && { cityId: cityOtr.id }),
        platform,
      }
    }
    try {
      await createUnverifiedLeadNew(data)
      if (trackerProperties)
        trackLeadsFormAction(
          TrackingEventName.WEB_LEADS_FORM_SUCCESS,
          trackerProperties,
        )
      trackEventCountly(CountlyEventNames.WEB_LEADS_FORM_SUCCESS_VIEW, {
        PAGE_ORIGINATION: 'PLP',
        LOGIN_STATUS: isUserLoggedIn ? 'Yes' : 'No',
        TEMAN_SEVA_STATUS: temanSevaStatus,
        PHONE_NUMBER: '+62' + phone,
      })
      setIsLoading(false)
      setModalOpened('success-toast')
      setTimeout(() => {
        setModalOpened('none')
        onCancel && onCancel()
      }, 3000)
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

  const onClickNameField = () => {
    if (onPage === 'LP') {
      trackEventCountly(CountlyEventNames.WEB_LEADS_FORM_NAME_CLICK, {
        PAGE_ORIGINATION: 'PLP',
        USER_TYPE: valueForUserTypeProperty(),
      })
    }
  }

  const onClickPhoneField = () => {
    if (onPage === 'LP') {
      trackEventCountly(CountlyEventNames.WEB_LEADS_FORM_PHONE_NUMBER_CLICK, {
        PAGE_ORIGINATION: 'PLP',
        USER_TYPE: valueForUserTypeProperty(),
      })
    }
  }
  return (
    <>
      {modalOpened === 'leads-form' && (
        <Modal open onCancel={onClose} isFull>
          <div className={styles.wrapper}>
            <div className={styles.background}>
              <div className={styles.wrapperSupergraphicSmall}>
                <Image
                  src={SupergraphicSecondarySmall}
                  alt="seva-vector-blue-rounded"
                  width={200}
                  height={140}
                  className={styles.supergraphicSmall}
                />
              </div>
              <div className={styles.wrapperSupergraphicLarge}>
                <Image
                  src={SupergraphicSecondaryLarge}
                  alt="seva-vector-red-rounded"
                  width={343}
                  height={428}
                  className={styles.supergraphicLarge}
                />
              </div>
            </div>
            <div className={styles.foreground}>
              <h2 className={styles.textHeading}>Tim Kami Siap Membantumu</h2>
              <p className={styles.textDesc}>
                Untuk tahu lebih lanjut, yuk ngobrol dengan <br /> tim kami.
                Kami akan menghubungi kamu <br /> dalam 1x24 jam.
              </p>
              <div className={styles.form}>
                <Input
                  dataTestId={elementId.PLP.LeadsForm.FullName}
                  placeholder="Masukkan nama lengkap"
                  title="Nama Lengkap"
                  value={name}
                  onChange={(e: any) => handleInputName(e.target.value)}
                  onFocus={onClickNameField}
                />
                <Gap height={24} />
                <InputPhone
                  dataTestId={elementId.PLP.LeadsForm.PhoneNumber}
                  disabled={isUserLoggedIn}
                  placeholder="Masukkan nomor HP"
                  title="Nomor HP"
                  value={phone}
                  onChange={(e: any) => handleInputPhone(e.target.value)}
                  onFocus={onClickPhoneField}
                />
                <Gap height={32} />
                <Button
                  data-test-id={elementId.PLP.Button.KirimLeads}
                  disabled={!isFilled}
                  version={
                    isFilled
                      ? ButtonVersion.PrimaryDarkBlue
                      : ButtonVersion.Disable
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
        </Modal>
      )}
      {modalOpened === 'otp' && (
        <OTP
          isOpened
          phoneNumber={phone}
          closeModal={onCancel}
          isOtpVerified={() => verified()}
          pageOrigination={
            onPage === 'LP' ? 'PLP' : 'PDP - ' + valueMenuTabCategory()
          }
        />
      )}
      <Toast
        text={toastSuccessInfo}
        width={isMobile ? 339 : 428}
        open={modalOpened === 'success-toast'}
        data-testid={elementId.PLP.Text.SuccessToastMessageLeads}
      />
    </>
  )
}
