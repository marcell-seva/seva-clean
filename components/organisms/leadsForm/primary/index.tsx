import React, { useEffect, useState } from 'react'
import styles from 'styles/components/organisms/leadsFormPrimary.module.scss'
import SupergraphicSecondarySmall from 'assets/illustration/supergraphic-secondary-small.webp'
import SupergraphicSecondaryLarge from 'assets/illustration/supergraphic-secondary-large.webp'
import { useMediaQuery } from 'react-responsive'
import Image from 'next/image'
import { getLocalStorage, saveLocalStorage } from 'utils/handler/localStorage'
import {
  ButtonSize,
  ButtonVersion,
  LocalStorageKey,
  UnverifiedLeadSubCategory,
} from 'utils/types/models'
import { decryptValue, encryptValue } from 'utils/handler/encryption'
import elementId from 'utils/helpers/trackerId'
import {
  filterNonDigitCharacters,
  onlyLettersAndSpaces,
} from 'utils/handler/stringManipulation'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { LeadsActionParam } from 'utils/types/tracker'
import { sendAmplitudeData } from 'services/amplitude'
import { AmplitudeEventName } from 'services/amplitude/types'
import {
  Button,
  CustomModal,
  Gap,
  Input,
  InputPhone,
  Toast,
} from 'components/atoms'
import { IconLoading } from 'components/atoms/icons'
import { OTP } from 'components/organisms'
import { api } from 'services/api'

interface PropsLeadsForm {
  otpStatus?: any
  onVerify?: (e: any) => void
  onFailed?: (e: any) => void
  onCancel?: () => void
  trackerProperties?: LeadsActionParam
  onPage?: string
}

export interface CityOtrOption {
  cityName: string
  cityCode: string
  province: string
  id?: string
}

const LeadsFormPrimary: React.FC<PropsLeadsForm> = ({
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
      sendAmplitudeData(
        AmplitudeEventName.WEB_LEADS_FORM_SUBMIT,
        trackerProperties,
      )
    const dataLeads = checkDataFlagLeads()
    if (dataLeads) {
      if (phone === dataLeads.phone && name === dataLeads.name) {
        sendUnverifiedLeads()
      } else if (phone === dataLeads.phone && name !== dataLeads.name) {
        sendUnverifiedLeads()
        updateFlagLeadsName(name)
      } else setModalOpened('otp')
    } else if (isUserLoggedIn) {
      sendUnverifiedLeads()
    } else setModalOpened('otp')
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

  const onClose = () => {
    if (trackerProperties)
      sendAmplitudeData(
        AmplitudeEventName.WEB_LEADS_FORM_CLOSE,
        trackerProperties,
      )
    onCancel && onCancel()
  }

  const sendUnverifiedLeads = async () => {
    let data
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
      await api.createUnverifiedLeadsNew(data)
      if (trackerProperties)
        sendAmplitudeData(
          AmplitudeEventName.WEB_LEADS_FORM_SUCCESS,
          trackerProperties,
        )
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

  return (
    <>
      {modalOpened === 'leads-form' && (
        <CustomModal open onCancel={onClose} isFull>
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
              <h2 className={styles.textHeading}>Agen SEVA Siap Membantumu</h2>
              <p className={styles.textDesc}>
                Untuk tahu lebih lanjut, yuk ngobrol dengan Agen SEVA. Kami akan
                menghubungi kamu <br />
                dalam 1x24 jam.
              </p>
              <div className={styles.form}>
                <Input
                  dataTestId={elementId.PLP.LeadsForm.FullName}
                  placeholder="Masukkan nama lengkap"
                  title="Nama Lengkap"
                  value={name}
                  onChange={(e: any) => handleInputName(e.target.value)}
                />
                <Gap height={24} />
                <InputPhone
                  dataTestId={elementId.PLP.LeadsForm.PhoneNumber}
                  disabled={isUserLoggedIn}
                  placeholder="Masukkan nomor HP"
                  title="Nomor Handphone"
                  value={phone}
                  onChange={(e: any) => handleInputPhone(e.target.value)}
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
        </CustomModal>
      )}
      {modalOpened === 'otp' && (
        <OTP
          isOpened
          phoneNumber={phone}
          closeModal={onCancel}
          isOtpVerified={() => verified()}
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
export default LeadsFormPrimary
