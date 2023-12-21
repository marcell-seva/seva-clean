import React, { ChangeEvent, useEffect, useState } from 'react'
import styles from 'styles/components/molecules/formModal.module.scss'
import dynamic from 'next/dynamic'
import {
  ArrowLeftSmall,
  Button,
  DoneTickToast,
  IconClose,
  Input,
  NewInput,
  ToastSevaRefi,
} from 'components/atoms'
import { colors } from 'utils/helpers/style/colors'
import { useMediaQuery } from 'react-responsive'
import { useContextContactFormData } from 'services/context/contactFormContext'
import { getLocalStorage, saveLocalStorage } from 'utils/handler/localStorage'
import { LocalStorageKey } from 'utils/enum'
import { filterNonDigitCharacters } from 'utils/stringUtils'
import { decryptValue, encryptValue } from 'utils/encryptionUtils'
import {
  checkRegisteredCustomer,
  sendRefiContact,
  sendRefiQuestion,
} from 'utils/httpUtils/customerUtils'
import { getToken, savePageBeforeLogin } from 'utils/handler/auth'
import { refinancingUrl } from 'utils/helpers/routes'
import { CountryCodePlusSign } from 'utils/hooks/useContactFormData/useContactFormData'
import { LoginAlertModal } from '../loginAlertModal'
import clsx from 'clsx'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
const Modal = dynamic(() => import('antd/lib/modal'), { ssr: false })

interface ContactUsModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  onSubmitSuccess?: () => void
}

export const FormModal = ({
  isOpen,
  onClose,
  title,
  onSubmitSuccess,
}: ContactUsModalProps) => {
  const fitLandscapeHeight = useMediaQuery({ query: '(max-height: 450px)' })
  const contactFormData = useContextContactFormData()

  const autofillName = () => {
    if (contactFormData.nameTmp) {
      return contactFormData.nameTmp ?? ''
    } else {
      return contactFormData.name ?? ''
    }
  }
  const [fullName, setFullName] = useState<string>(autofillName())

  const [textQuestion, setTextQuestion] = useState('')
  const [phoneNumber, setPhoneNumber] = useState(
    contactFormData.phoneNumber?.replace('+62', ''),
  )

  const [loading, setLoading] = useState<boolean>(false)
  // const { patchModal } = useModalContext()
  const [question, setQuestion] = useState(1)
  const [emptyName, setEmptyName] = useState(false)
  const [emptyPhoneNumber, setEmptyPhoneNumber] = useState(false)
  const [errorMessagePhoneNumber, setErrorMessagePhoneNumber] = useState('')
  const [emptyQuestion, setEmptyQuestion] = useState(false)
  const isModalFormOpen = getLocalStorage<string>(
    LocalStorageKey.refinancingOpenForm,
  )
  const idCustomerRefi = getLocalStorage(LocalStorageKey.IdCustomerRefi)
  const [isOpenLoginAlert, setIsOpenLoginAlert] = useState(false)
  const isDesktop = useMediaQuery({ query: '(min-width: 1280px)' })
  const isTablet = useMediaQuery({
    query: '(min-width: 481px) and (max-width: 1024px)',
  })
  const [showGreenToast, setShowGreenToast] = useState(false)

  const onNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value[0] != ' ') {
      setEmptyName(false)
      setFullName(event.target.value)
    }
  }
  const onPhoneNoChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value[0] != '0' && event.target.value.length <= 14) {
      const phoneNumberTemp = filterNonDigitCharacters(event.target.value)
      setEmptyPhoneNumber(false)
      setPhoneNumber(phoneNumberTemp)
    }
  }

  const onTextQuestionChange = (event: any) => {
    if (event.target.value[0] != ' ') {
      setEmptyQuestion(false)
      setTextQuestion(event.target.value)
    }
  }

  useEffect(() => {
    if (isModalFormOpen) {
      setQuestion(2)
    }
  }, [fullName, phoneNumber, isModalFormOpen])

  const onClickOK = async (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation()
    if (fullName.length === 0) {
      setEmptyName(true)
    }
    if (phoneNumber?.length === 0) {
      setEmptyPhoneNumber(true)
      setErrorMessagePhoneNumber('*Wajib Diisi')
    }
    if (phoneNumber && phoneNumber?.length < 4) {
      setErrorMessagePhoneNumber('*Nomor HP yang Anda masukkan tidak valid')
    }
    if (fullName.length !== 0 && phoneNumber && phoneNumber?.length >= 4) {
      if (question === 2) {
        if (textQuestion.length === 0) {
          setEmptyQuestion(true)
          return
        }
        setLoading(true)
        if (idCustomerRefi) {
          sendRefiQuestion(
            textQuestion,
            decryptValue(idCustomerRefi as string).replaceAll('"', ''),
          ).then(() => {
            setLoading(false)
            setShowGreenToast(true)
            setTimeout(() => {
              saveLocalStorage(LocalStorageKey.refinancingOpenForm, 'false')
              onClose()
              // patchModal({ isOpenContactUsModal: false })
            }, 3000)
          })
        }
      } else {
        let isNotRegistered = false
        try {
          await checkRegisteredCustomer('+62' + phoneNumber)
        } catch (e: any) {
          if (e.response.status === 404) {
            isNotRegistered = true
          }
        }
        if (isNotRegistered) {
          sendRefiContact(
            '+62' + phoneNumber,
            fullName,
            'SEVA_REFINANCING_QUESTION',
            false,
          ).then((result) => {
            saveLocalStorage(
              LocalStorageKey.IdCustomerRefi,
              encryptValue(JSON.stringify(result?.data.id)),
            )
          })
          setLoading(false)
          setQuestion(2)
        } else {
          if (!getToken()) {
            setLoading(false)
            saveLocalStorage(LocalStorageKey.refinancingOpenForm, 'true')
            savePageBeforeLogin(refinancingUrl)
            setIsOpenLoginAlert(true)
          } else {
            setQuestion(2)
          }
        }
      }
    }
  }

  const onClickCancel = (e: React.MouseEvent) => {
    e.stopPropagation()
    saveLocalStorage(LocalStorageKey.refinancingOpenForm, 'false')
    onClose()
    // patchModal({ isOpenContactUsModal: false })
  }

  const getToastWidth = () => {
    if (isDesktop) {
      return '729px'
    } else if (isTablet) {
      return '609px'
    } else {
      return '92%'
    }
  }

  const greenToastContent = () => {
    return (
      <>
        <DoneTickToast width={24} height={24} />
        <span className={styles.toastText}>Pertanyaan kamu sudah terkirim</span>
      </>
    )
  }

  const errorTextName = () => {
    return (
      <p className={`${styles.styledErrorText} shake-animation-X`}>
        *Wajib Diisi
      </p>
    )
  }
  const errorText = () => {
    return (
      <p className={`${styles.styledErrorText} shake-animation-X`}>
        {errorMessagePhoneNumber}
      </p>
    )
  }

  const prefixComponent = () => (
    <>
      <p className={styles.styledCodeCountry}>{CountryCodePlusSign}62</p>
      <div className={styles.spacer} />
    </>
  )

  return (
    <>
      <Modal
        closable={false}
        centered
        className="refinancing-custom-form-modal"
        open={isOpen}
        footer={null}
        width={343}
        styles={{
          mask: {
            background: 'rgba(19, 19, 27, 0.5)',
            maxWidth: '570px',
            marginLeft: 'auto',
            marginRight: 'auto',
          },
        }}
      >
        <div className={styles.styledWrapper}>
          <div className={styles.styledContent}>
            {question === 1 ? (
              <>
                <div className={styles.styledCloseIcon} onClick={onClickCancel}>
                  <IconClose
                    width={24}
                    height={24}
                    color={colors.primaryBlack}
                  />
                </div>
                <div className={styles.styledContainer}>
                  <h2
                    className={styles.styledTitle}
                    style={{ textAlign: 'start' }}
                  >
                    {question === 1
                      ? title
                      : 'Apa hal yang ingin kamu ketahui?'}
                  </h2>
                  {question === 1 && (
                    <span
                      className={styles.styledDesc}
                      style={{ textAlign: 'start' }}
                    >
                      Tulis rincian kontakmu terlebih dahulu
                    </span>
                  )}
                  <div className={styles.styledSpacing} />
                  <p className={styles.styledLabelText}>Nama Lengkap</p>
                  <div className={styles.styledSpacing} />
                  <NewInput
                    type={'text'}
                    maxLength={100}
                    placeholder={'Contoh: John Doe'}
                    value={fullName}
                    onChange={onNameChange}
                    additionalInputAreaClassname={clsx({
                      [styles.styledInput]: true,
                      [styles.redBorderInput]: emptyName,
                    })}
                    bottomComponent={emptyName ? errorTextName : undefined}
                  />
                  <div className={styles.styledSpacing} />
                  <p className={styles.styledLabelText}>Nomor HP</p>
                  <div className={styles.styledSpacing} />
                  <NewInput
                    type={'tel'}
                    prefixComponent={prefixComponent}
                    placeholder={'Contoh: 8123456789'}
                    value={phoneNumber}
                    onChange={onPhoneNoChange}
                    additionalInputAreaClassname={clsx({
                      [styles.styledInput]: true,
                      [styles.redBorderInput]:
                        emptyPhoneNumber ||
                        (phoneNumber && phoneNumber?.length < 4),
                    })}
                    bottomComponent={
                      emptyPhoneNumber ||
                      (phoneNumber && phoneNumber?.length < 4)
                        ? errorText
                        : undefined
                    }
                  />
                  <Button
                    id="contact-us-modal-submit-button-element"
                    className={styles.styledButton}
                    version={ButtonVersion.Default}
                    size={ButtonSize.Big}
                    onClick={onClickOK}
                    loading={loading}
                    style={{ marginTop: emptyPhoneNumber ? '10px' : '28px' }}
                  >
                    Selanjutnya
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className={styles.topIconWrapper}>
                  <div
                    className={styles.styledArrowBack}
                    onClick={() => {
                      saveLocalStorage(
                        LocalStorageKey.refinancingOpenForm,
                        'false',
                      )
                      setQuestion(1)
                    }}
                  >
                    <ArrowLeftSmall
                      width={20}
                      height={20}
                      color={colors.primary1}
                    />
                  </div>
                  <div
                    className={styles.styledCloseIcon}
                    onClick={onClickCancel}
                  >
                    <IconClose
                      width={24}
                      height={24}
                      color={colors.primaryBlack}
                    />
                  </div>
                </div>
                <div className={styles.styledContainer}>
                  <div
                    className={styles.styledTitle}
                    style={{
                      textAlign: 'start',
                      marginBottom: '31px',
                      width: '50%',
                    }}
                  >
                    Apa hal yang ingin kamu ketahui?
                  </div>
                  <div className={styles.styledSpacing} />
                  <p className={styles.styledLabelText}>Pertanyaan</p>
                  <div className={styles.styledSpacing} />
                  <textarea
                    className={styles.styledInputTextArea}
                    maxLength={2000}
                    placeholder={'Saya mau bertanya tentang...'}
                    value={textQuestion}
                    onChange={onTextQuestionChange}
                    style={{
                      border: emptyQuestion
                        ? `1.5px solid ${colors.primaryRed}`
                        : `1.5px solid ${colors.placeholder}`,
                    }}
                    // overrideRedBorder={emptyQuestion}
                    // placeholderFontProps={'OpenSans'}
                    // bottomComponent={
                    //   emptyQuestion ? errorTextName : undefined
                    // }
                  />

                  {emptyQuestion && errorTextName()}
                  <Button
                    id="contact-us-modal-submit-button-element"
                    className={styles.styledButton}
                    version={ButtonVersion.Default}
                    size={ButtonSize.Big}
                    onClick={onClickOK}
                    loading={loading}
                    style={{ marginTop: emptyQuestion ? '20px' : '20px' }}
                  >
                    Selanjutnya
                  </Button>
                </div>
              </>
            )}
          </div>
          {showGreenToast && <ToastSevaRefi content={greenToastContent()} />}
        </div>
      </Modal>
      <LoginAlertModal
        isOpen={isOpenLoginAlert}
        onClose={() => setIsOpenLoginAlert(false)}
      />
    </>
  )
}
