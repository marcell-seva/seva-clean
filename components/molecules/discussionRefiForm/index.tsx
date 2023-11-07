import axios from 'axios'
import clsx from 'clsx'
import { Button, NewInput } from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { OTP } from 'components/organisms/otp'
import { useRouter } from 'next/router'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useContextContactFormData } from 'services/context/contactFormContext'
import styles from 'styles/components/molecules/discussionRefiForm.module.scss'
import { LocalStorageKey } from 'utils/enum'
import { getToken } from 'utils/handler/auth'
import { checkReferralCode, getCustomerInfoSeva } from 'utils/handler/customer'
import { decryptValue, encryptValue } from 'utils/handler/encryption'
import { getLocalStorage, saveLocalStorage } from 'utils/handler/localStorage'
import { refinancingFormUrl } from 'utils/helpers/routes'
import { colors } from 'utils/helpers/style/colors'
import elementId from 'utils/helpers/trackerId'
import { sendRefiContact } from 'utils/httpUtils/customerUtils'
import { temanSevaUrlPath } from 'utils/types/props'
import { FormReferralCode } from '../form/formReferralCode'
import ErrorImg from '/public/revamp/images/refinancing/Alert-info.svg'
import Image from 'next/image'

interface Props {
  onButtonClick?: boolean
}

export const DiscussionRefiForm = ({ onButtonClick }: Props) => {
  const router = useRouter()
  const id = router.query.id as string
  const contactFormData = useContextContactFormData()
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false)
  const [formField, setFormField] = useState<{
    fullName: string
    phoneNumber: string
  }>({
    fullName: contactFormData?.name || '',
    phoneNumber: contactFormData?.phoneNumber?.replace('+62', '') || '',
  })
  const [modalOpened, setModalOpened] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [errorEmptyFullName, setErrorEmptyFullName] = useState<
    'init' | 'error' | 'custom'
  >('init')
  const [errorEmptyPhoneNumber, setErrorEmptyPhoneNumber] = useState<
    'init' | 'error' | 'custom'
  >('init')
  const [errorPhoneNumberText, setErrorPhoneNumberText] = useState('')
  const [labelForm, setLabelForm] = useState('')

  const [connectedCode, setConnectedCode] = useState('')
  const [referralCodeInput, setReferralCodeInput] = useState('')
  const [currentUserOwnCode, setCurrentUserOwnCode] = useState('')
  const [isLoadingReferralCode, setIsLoadingReferralCode] = useState(false)
  const [isErrorReferralCodeInvalid, setIsErrorReferralCodeInvalid] =
    useState(false)
  const [isErrorRefCodeUsingOwnCode, setIsErrorRefCodeUsingOwnCode] =
    useState(false)
  const [isSuccessReferralCode, setisSuccessReferralCode] = useState(false)
  const [referralCodeFromUrl, setReferralCodeFromUrl] = useState(
    getLocalStorage(LocalStorageKey.referralTemanSeva) ?? '',
  )

  useEffect(() => {
    if (id) {
      if (id.includes('SEVA')) {
        saveLocalStorage(LocalStorageKey.referralTemanSeva, id)
        setReferralCodeFromUrl(id)
      }
    }
  }, [])

  const validateInputForm = () => {
    let flagCheck = true
    if (formField.fullName === '') {
      setErrorEmptyFullName('error')
      flagCheck = false
    }
    if (
      formField.phoneNumber?.length == 0 &&
      formField.phoneNumber?.length < 4
    ) {
      flagCheck = false
      setErrorEmptyPhoneNumber('error')
      setErrorPhoneNumberText('Nomor HP yang Anda masukkan tidak valid')
    }
    if (formField.phoneNumber?.length == 0) {
      setErrorEmptyPhoneNumber('error')
      setErrorPhoneNumberText('Wajib diisi')
      flagCheck = false
    }
    return flagCheck
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

  const proceedRefinancing = async () => {
    saveLocalStorage(
      LocalStorageKey.FullNameRefi,
      encryptValue(formField?.fullName),
    )
    saveLocalStorage(
      LocalStorageKey.PhoneNumberRefi,
      encryptValue('+62' + formField?.phoneNumber),
    )
    // Add referral code below
    sendRefiContact(
      '+62' + formField?.phoneNumber,
      formField?.fullName,
      'SEVA_REFINANCING_LEADS',
      getToken() !== null ? true : false,
      referralCodeInput || '',
    ).then((result) => {
      saveLocalStorage(
        LocalStorageKey.IdCustomerRefi,
        encryptValue(result?.data.id),
      )
    })
    setLoading(false)
    router.push(refinancingFormUrl)
  }

  const verified = () => {
    const data = {
      name: formField.fullName,
      phone: formField.phoneNumber,
    }
    setModalOpened(false)
    saveFlagLeads(data)
    proceedRefinancing()
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

  const handleInputRefferal = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsErrorReferralCodeInvalid(false)
    setIsErrorRefCodeUsingOwnCode(false)
    setIsLoadingReferralCode(false)
    setisSuccessReferralCode(false)
    const input = e.target.value
      .toUpperCase()
      .replace(' ', '')
      .replace(/[^\w\s]/gi, '')

    setReferralCodeInput(input)
  }

  const getCurrentUserInfo = () => {
    getCustomerInfoSeva()
      .then((response) => {
        if (response[0].temanSevaTrxCode && referralCodeInput === '') {
          setReferralCodeInput(response[0].temanSevaTrxCode)
          localStorage.setItem(
            LocalStorageKey.ReferralCodePrelimQuestion,
            response[0].temanSevaTrxCode,
          )
        }

        if (response[0].temanSevaTrxCode) {
          setConnectedCode(response[0].temanSevaTrxCode ?? '')
        } else {
          setConnectedCode('')
        }
      })
      .catch((err) => {
        console.error(err)
      })
  }

  const autofillRefCodeValue = () => {
    if (referralCodeFromUrl && referralCodeFromUrl.length > 0) {
      setReferralCodeInput(referralCodeFromUrl)
      checkRefCode(referralCodeFromUrl)
    } else if (connectedCode.length > 0) {
      setReferralCodeInput(connectedCode)
      checkRefCode(connectedCode)
    } else {
      setReferralCodeInput('')
    }
  }

  const resetReferralCodeStatus = (): void => {
    setIsLoadingReferralCode(false)
    setIsErrorReferralCodeInvalid(false)
    setIsErrorRefCodeUsingOwnCode(false)
    setisSuccessReferralCode(false)
    setReferralCodeInput('')
  }

  const checkRefCode = async (value: string): Promise<boolean> => {
    if (value !== '') {
      if (value === currentUserOwnCode) {
        setIsErrorReferralCodeInvalid(false)
        setIsErrorRefCodeUsingOwnCode(true)
        localStorage.setItem(LocalStorageKey.ReferralCodePrelimQuestion, '')
        return false
      } else {
        setIsLoadingReferralCode(true)
        try {
          await checkReferralCode(
            value,
            getToken()?.phoneNumber ?? '+62' + formField.phoneNumber,
          )
          setIsLoadingReferralCode(false)
          setIsErrorReferralCodeInvalid(false)
          setIsErrorRefCodeUsingOwnCode(false)
          setisSuccessReferralCode(true)
          localStorage.setItem(
            LocalStorageKey.ReferralCodePrelimQuestion,
            value,
          )
          return true
        } catch (error) {
          setIsLoadingReferralCode(false)
          setIsErrorReferralCodeInvalid(true)
          setIsErrorRefCodeUsingOwnCode(false)
          setisSuccessReferralCode(false)
          localStorage.setItem(LocalStorageKey.ReferralCodePrelimQuestion, '')
          return false
        }
      }
    } else {
      localStorage.setItem(LocalStorageKey.ReferralCodePrelimQuestion, '')
      return true
    }
  }

  const getErrorMesssageRefCode = () => {
    if (isErrorReferralCodeInvalid) {
      return 'Kode referral tidak tersedia.'
    } else if (isErrorRefCodeUsingOwnCode) {
      return 'Kamu tidak bisa menggunakan kode referral milikmu sendiri.'
    } else {
      return 'Kode referral tidak ditemukan.'
    }
  }

  const getCurrentUserOwnCode = () => {
    axios
      .get(temanSevaUrlPath.profile, {
        headers: { phoneNumber: getToken()?.phoneNumber ?? '' },
      })
      .then((res) => {
        setCurrentUserOwnCode(res.data.temanSevaRefCode)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const sendForm = async () => {
    const refCodeValidity = await checkRefCode(referralCodeInput)
    if (validateInputForm() && refCodeValidity) {
      setLoading(true)
      if (referralCodeInput && referralCodeInput.length > 0) {
        saveLocalStorage(LocalStorageKey.referralTemanSeva, referralCodeInput)
      }
      const dataLeads = checkDataFlagLeads()
      if (isUserLoggedIn) {
        proceedRefinancing()
      } else if (dataLeads) {
        if (
          formField.phoneNumber === dataLeads.phone &&
          formField.fullName === dataLeads.name
        ) {
          proceedRefinancing()
        } else if (
          formField.phoneNumber === dataLeads.phone &&
          formField.fullName !== dataLeads.name
        ) {
          proceedRefinancing()
          updateFlagLeadsName(formField.fullName)
        } else {
          setModalOpened(true)
        }
      } else {
        setModalOpened(true)
      }
    }
  }

  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setFormField({ ...formField, fullName: event.target.value })
    if (event.target.value !== '') {
      setErrorEmptyFullName('init')
    }
  }
  const onChangePhoneNumber = (event: ChangeEvent<HTMLInputElement>) => {
    if (
      event.target.value.length <= 14 &&
      event.target.value.substring(0) !== 'init'
    ) {
      setFormField({ ...formField, phoneNumber: event.target.value })
      event.target.value.length
    }
    if (event.target.value.length > 3 && event.target.value.length < 14) {
      setErrorEmptyPhoneNumber('init')
    }
  }

  useEffect(() => {
    getDataCustomer()
    if (!!getToken()) {
      getCurrentUserInfo
      getCurrentUserOwnCode()
    }
  }, [])

  useEffect(() => {
    autofillRefCodeValue()
  }, [connectedCode, referralCodeFromUrl])

  const getDataCustomer = async () => {
    const data: string | null = getLocalStorage(LocalStorageKey.sevaCust)
    if (data !== null) {
      const user = JSON.parse(decryptValue(data))
      setIsUserLoggedIn(true)
      setErrorEmptyPhoneNumber('custom')
      setErrorEmptyFullName('custom')
      setFormField({
        fullName: user.fullName,
        phoneNumber: user.phoneNumber.replace('+62', ''),
      })
      setLabelForm(
        'Dengan mengirim data di bawah ini, kami akan segera menghubungi kamu.',
      )
    } else {
      const dataLeads = checkDataFlagLeads()
      setLabelForm(
        'Lengkapi data di bawah ini agar kami dapat segera membantu kamu.',
      )
      if (dataLeads) {
        setFormField({
          fullName: dataLeads.name,
          phoneNumber: dataLeads.phone,
        })
      }
    }
  }

  return (
    <>
      <div
        className={styles.container}
        data-testid={elementId.Refinancing.DiscussSeva}
      >
        <h3 className={styles.title}>Yuk, diskusi dengan SEVA!</h3>
        <span className={styles.subtitle}>{labelForm}</span>
        <div className={styles.paddingForm}>
          <p className={styles.labelForm}>Nama Lengkap</p>
          <NewInput
            name={elementId.Refinancing.FullName}
            value={formField.fullName}
            placeholder="Contoh: John Doe"
            type="text"
            disabled={getToken() !== null}
            onChange={onChangeName}
            additionalInputAreaClassname={clsx({
              [styles.styledInput]: true,
              [styles.styledInputError]: errorEmptyFullName === 'error',
              [styles.styledInputCustom]: errorEmptyFullName === 'custom',
              ['shake-animation-X-2']: onButtonClick,
            })}
          />
          {errorEmptyFullName === 'error' && (
            <div className={`${styles.styledTextError} shake-animation-X`}>
              <Image
                width={20}
                height={20}
                style={{ paddingTop: '6.37px' }}
                alt="seva-required-img"
                src={ErrorImg}
              />
              <div className={styles.itemInfo}>Wajib diisi</div>
            </div>
          )}
          <p className={styles.labelForm} style={{ paddingTop: '20px' }}>
            Nomor HP
          </p>
          <NewInput
            name={elementId.Refinancing.PhoneNumber}
            style={{ marginBottom: '0px' }}
            value={formField.phoneNumber}
            prefixComponent={() => (
              <span
                className={clsx({
                  [styles.prefix]: true,
                  [styles.prefixCustom]: errorEmptyPhoneNumber === 'custom',
                })}
              >
                +62
              </span>
            )}
            placeholder="Contoh: 81212345678"
            type="tel"
            disabled={getToken() !== null}
            onChange={onChangePhoneNumber}
            onKeyPress={(event) => {
              if (!/[0-9]/.test(event.key)) {
                event.preventDefault()
              }
            }}
            additionalInputAreaClassname={clsx({
              [styles.styledInput]: true,
              [styles.styledInputError]: errorEmptyPhoneNumber === 'error',
              [styles.styledInputCustom]: errorEmptyPhoneNumber === 'custom',
              ['shake-animation-X-2']: onButtonClick,
            })}
          />
          {errorEmptyPhoneNumber === 'error' && (
            <div className={`${styles.styledTextError} shake-animation-X`}>
              <Image
                width={20}
                height={20}
                style={{ paddingTop: '6.37px' }}
                alt="seva-required-img"
                src={ErrorImg}
              />
              <div className={styles.itemInfo}>{errorPhoneNumberText}</div>
            </div>
          )}
          <FormReferralCode
            onClearInput={resetReferralCodeStatus}
            value={referralCodeInput}
            isLoadingReferralCode={isLoadingReferralCode}
            isErrorReferralCode={
              referralCodeInput !== '' &&
              (isErrorReferralCodeInvalid || isErrorRefCodeUsingOwnCode)
            }
            isSuccessReferralCode={isSuccessReferralCode}
            passedResetReferralCodeStatusFunc={resetReferralCodeStatus}
            passedCheckReferralCodeFunc={() => checkRefCode(referralCodeInput)}
            emitOnChange={handleInputRefferal}
            checkedIconColor={'#05256E'}
            errorIconColor={'#D83130'}
            errorMessage={getErrorMesssageRefCode()}
            maxInputLength={8}
            vibrateErrorMessage={true}
            fieldLabel={'Kode Referral Teman SEVA (Opsional)'}
            placeholderText={'Contoh: SEVA0000'}
            additionalContainerStyle={clsx({
              [styles.styledReferralInput]: true,
              [styles.styledReferralInputError]:
                referralCodeInput !== '' &&
                (isErrorReferralCodeInvalid || isErrorRefCodeUsingOwnCode),
            })}
          />
          <Button
            data-testid={elementId.Refinancing.ButtonSend}
            loading={loading}
            version={ButtonVersion.Default}
            size={ButtonSize.Big}
            onClick={sendForm}
            className={styles.styledButton}
          >
            Selanjutnya
          </Button>
        </div>
      </div>
      {modalOpened && (
        <OTP
          isOpened
          phoneNumber={formField.phoneNumber}
          closeModal={() => {
            setLoading(false)
            setModalOpened(false)
          }}
          isOtpVerified={() => verified()}
        />
      )}
    </>
  )
}
