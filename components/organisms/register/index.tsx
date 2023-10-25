import React, { useEffect, useState } from 'react'
import styles from 'styles/components/organisms/register.module.scss'
import { encryptValue } from 'utils/encryptionUtils'
import { setTrackEventMoEngageWithoutValue } from 'helpers/moengage'
import Image from 'next/image'
import { getPageBeforeLogin } from 'utils/loginUtils'
import elementId from 'helpers/elementIds'
import dayjs from 'dayjs'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { useRouter } from 'next/router'
import { NewFunnelCarVariantDetails } from 'utils/types'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { CustomerInfoSeva, SimpleCarVariantDetail } from 'utils/types/utils'
import { LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { usePaAmbassadorData } from 'utils/hooks/usePaAmbassadorData/usePaAmbassadorData'
import { getCarVariantDetailsById } from 'utils/handler/carRecommendation'
import {
  emailValidation,
  onlyEmailFormat,
} from 'utils/handler/stringManipulation'
import {
  preApprovalQuestionFlowUrlWithType,
  rootUrl,
} from 'utils/helpers/routes'
import { PreApprovalFlowType } from 'utils/types/models'
import { saveLocalStorage } from 'utils/handler/localStorage'
import {
  checkReferralCode,
  getCustomerInfoWrapperSeva,
} from 'utils/handler/customer'
import {
  IconApplication,
  IconCheckedBox,
  IconSecure,
  IconVoucher,
} from 'components/atoms/icon'
import { Button, Input } from 'components/atoms'
import { DatePicker } from 'components/atoms/inputDate'
import { FormReferralCode } from 'components/molecules/form/formReferralCode'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { titleCase } from 'utils/handler/titleCase'
import { registerCustomerSeva } from 'utils/httpUtils/customerUtils'
import { getSessionStorage } from 'utils/handler/sessionStorage'
import dynamic from 'next/dynamic'

const Toast = dynamic(
  () => import('components/atoms/toast').then((comp) => comp.Toast),
  { ssr: false },
)

const LogoPrimary = '/revamp/icon/logo-primary.webp'

interface RegisterForm {
  name: string
  phoneNumber: string
  email: string
  dateOfBirth: string
  subscription: boolean
  terms: boolean
  referralCode: string
}
export const Register = () => {
  const router = useRouter()
  const { phoneNumber, isPtbc } = router.query
  const termsAndConditionsUrl = 'https://ext.seva.id/syarat-ketentuan'
  const privacyPolicyUrl = 'https://ext.seva.id/kebijakan-privasi'
  const headerText = 'Daftar Akun'
  const descText =
    'Nikmati promo tambahan dari SEVA dengan cek Kualifikasi Kredit.'
  const [form, setForm] = useState<RegisterForm>({
    name: '',
    phoneNumber: `+62${phoneNumber}`,
    email: '',
    dateOfBirth: '',
    subscription: true,
    terms: false,
    referralCode: '',
  })
  const templateToastMessage =
    'Akun berhasil didaftarkan. Kamu akan dialihkan ke halaman '
  const [pathDirection, setPathDirection] = useState<string>(
    'Kualifikasi Kredit.',
  )
  const [tempRefCode, setTempRefCode] = useState<string>('')
  const [isLoadingReferralCode, setIsLoadingReferralCode] = useState(false)
  const [isErrorReferralCode, setIsErrorReferralCode] = useState(false)
  const [isSuccessReferralCode, setIsSuccessReferralCode] = useState(false)
  const [isFilled, setIsFilled] = useState<boolean>(false)
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>('')
  const [modalOpened, setModalOpened] = useState<'success-toast' | 'none'>(
    'none',
  )
  const { getDataPAAmbassador } = usePaAmbassadorData(
    getSessionStorage(SessionStorageKey.PAAmbassadorUrlId) || '',
  )
  const [isOpenToast, setIsOpenToast] = useState(false)
  const [toastMessage, setToastMessage] = useState(
    'Mohon maaf, terjadi kendala jaringan silahkan coba kembali lagi',
  )
  const [isLoading, setIsLoading] = useState(false)
  const [simpleCarVariantDetails] =
    useLocalStorage<SimpleCarVariantDetail | null>(
      LocalStorageKey.SimpleCarVariantDetails,
      null,
    )
  const [dataCar, setDataCar] = useState<NewFunnelCarVariantDetails>()

  useEffect(() => {
    if (isPtbc) {
      setTempRefCode('SEVAPTBC')
      setFormData('referralCode', 'SEVAPTBC')
    }
    if (phoneNumber === undefined) {
      router.push('/masuk-akun')
    } else {
      trackCountlyRegistrationPageView()
      setTrackEventMoEngageWithoutValue('view_registration_page')
    }
  }, [])

  useEffect(() => {
    if (
      form.name !== '' &&
      form.phoneNumber !== '' &&
      form.email !== '' &&
      form.dateOfBirth !== '' &&
      form.terms !== false
    )
      setIsFilled(true)
    else setIsFilled(false)
  }, [form])

  const setFormData = (type: string, value: string | boolean): void => {
    setForm({ ...form, [type]: value })
  }
  const trackCountlyRegistrationPageView = () => {
    if (simpleCarVariantDetails) {
      getCarVariantDetailsById(simpleCarVariantDetails?.variantId).then(
        (response: any) => {
          setDataCar(response)
          trackEventCountly(CountlyEventNames.WEB_REGISTRATION_PAGE_VIEW, {
            CAR_BRAND: response.data.modelDetail.brand,
            CAR_MODEL: response.data.modelDetail.model,
            CAR_VARIANT: response.data.variantDetail.name,
          })
        },
      )
    } else {
      trackEventCountly(CountlyEventNames.WEB_REGISTRATION_PAGE_VIEW, {
        CAR_BRAND: 'Null',
        CAR_MODEL: 'Null',
        CAR_VARIANT: 'Null',
      })
    }
  }
  const trackCountlyCtaCLick = () => {
    trackEventCountly(CountlyEventNames.WEB_REGISTRATION_PAGE_CTA_CLICK, {
      CAR_BRAND: dataCar?.modelDetail.brand,
      CAR_MODEL: dataCar?.modelDetail.model,
      CAR_VARIANT: dataCar?.variantDetail.name,
    })
  }
  const sendCustomerRegister = async (): Promise<void> => {
    trackCountlyCtaCLick()
    const resultRefCode: boolean = await checkRefCode()
    if (emailIsValidated()) {
      if (resultRefCode) await createCustomer(resultRefCode)
    }
  }

  const emailIsValidated = () => {
    let isEmailValidated = false
    if (!emailValidation(form.email)) {
      setEmailErrorMessage('Format email tidak valid')
      isEmailValidated = false
    } else {
      isEmailValidated = true
      setEmailErrorMessage('')
    }
    return isEmailValidated
  }

  const createCustomer = async (isRefCodeValidated: boolean): Promise<void> => {
    try {
      setIsLoading(true)
      await registerCustomerSeva({
        phoneNumber: form.phoneNumber,
        fullName: form.name,
        dob: form.dateOfBirth,
        email: form.email,
        promoSubscription: form.subscription,
        referralCode: isRefCodeValidated ? tempRefCode : '',
      })

      setModalOpened('success-toast')
      trackEventCountly(CountlyEventNames.WEB_REGISTRATION_PAGE_SUCCESS_VIEW)
      getDataCustomer()
      setIsLoading(false)

      setTimeout(() => {
        setModalOpened('none')
        navigateHandler()
      }, 3000)
    } catch (error: any) {
      setIsLoading(false)

      if (error?.response?.data?.message) {
        setToastMessage(`${error?.response?.data?.message}`)
      } else {
        setToastMessage(
          'Mohon maaf, terjadi kendala jaringan silahkan coba kembali lagi',
        )
      }
      setIsOpenToast(true)
    }
  }

  useEffect(() => {
    let path
    const ListPage: Array<{ key: string; name: string }> = [
      {
        key: 'mobil-baru',
        name: 'Pencarian Mobil',
      },
      {
        key: 'kalkulator-kredit',
        name: 'Kalkulator Kredit',
      },
      {
        key: 'kualifikasi-kredit',
        name: 'Kualifikasi Kredit',
      },
      {
        key: 'pre-approval-start',
        name: 'Instant Approval',
      },
      {
        key: 'teman-seva',
        name: 'Teman SEVA',
      },
      {
        key: 'fasilitas-dana',
        name: 'Fasilitas Dana',
      },
      {
        key: 'layanan-surat-kendaraan',
        name: 'Layanan Surat Kendaraan',
      },
      {
        key: 'akun',
        name: 'Akun Saya',
      },
      {
        key: 'blog',
        name: 'Artikel',
      },
      {
        key: 'hubungi-kami',
        name: 'Hubungi Kami',
      },
      {
        key: 'syarat-ketentuan',
        name: 'Syarat & Ketentuan',
      },
      {
        key: 'kebijakan-privasi',
        name: 'Kebijakan Privasi',
      },
      {
        key: 'promo',
        name: 'Promo',
      },
      {
        key: 'tentang-kami',
        name: 'Tentang SEVA',
      },
    ]
    const pathBeforeLogin = getPageBeforeLogin()
    const filteredData = ListPage.filter((item: any) =>
      pathBeforeLogin ? pathBeforeLogin.includes(item.key) : '',
    )
    path = filteredData[0]?.name || 'utama'
    if (filteredData[0]?.key === 'mobil-baru') {
      const splitPath = pathBeforeLogin!.split('/')
      if (splitPath[2] !== undefined) path = `${splitPath[2]}-${splitPath[3]}`
      path = titleCase(path.replace(/-/g, ' '))
    }
    setPathDirection(path)
  })
  useEffect(() => {
    if (form.subscription) {
      trackCountlyNotifyTickClick()
    }
    if (form.terms) {
      trackCountlySKTickClick()
    }
  }, [form.subscription, form.terms])

  const navigateHandler = (): void => {
    const nextPage = getPageBeforeLogin()
    localStorage.removeItem(LocalStorageKey.PageBeforeLogin)
    if (nextPage && nextPage.includes('https')) window.location.href = nextPage
    else {
      if (
        getPageBeforeLogin() ===
        preApprovalQuestionFlowUrlWithType.replace(
          ':paFlowType',
          PreApprovalFlowType.PAAmbassador,
        )
      ) {
        getDataPAAmbassador()
        return
      }
      sessionStorage.setItem(
        SessionStorageKey.prevLoginPath,
        nextPage ?? rootUrl,
      )
      router.push(nextPage ?? rootUrl)
    }
  }

  const setCustomerDetail = (payload: CustomerInfoSeva): void => {
    const encryptedData = encryptValue(JSON.stringify(payload))
    saveLocalStorage(LocalStorageKey.sevaCust, encryptedData)
  }

  const getDataCustomer = async (): Promise<void> => {
    try {
      const response: any = await getCustomerInfoWrapperSeva()
      const customerData: CustomerInfoSeva = response[0]
      setCustomerDetail(customerData)
    } catch (error) {}
  }

  const resetReferralCodeStatus = (): void => {
    setIsLoadingReferralCode(false)
    setIsErrorReferralCode(false)
    setIsSuccessReferralCode(false)
    setFormData('referralCode', '')
    setTempRefCode('')
  }

  const checkRefCode = async (): Promise<boolean> => {
    if (tempRefCode !== '') {
      setIsLoadingReferralCode(true)
      try {
        await checkReferralCode(tempRefCode, form.phoneNumber)
        setFormData('referralCode', tempRefCode)
        setIsLoadingReferralCode(false)
        setIsErrorReferralCode(false)
        setIsSuccessReferralCode(true)
        return true
      } catch (error) {
        setIsSuccessReferralCode(false)
        setIsLoadingReferralCode(false)
        setIsErrorReferralCode(true)
        return false
      }
    } else return true
  }

  const setAndCheckNameInput = (payload: string): void => {
    if (payload !== ' ') setFormData('name', payload)
  }

  const setAndCheckReferralCodeInput = (payload: string): void => {
    setIsErrorReferralCode(false)
    setIsSuccessReferralCode(false)
    setIsLoadingReferralCode(false)
    const value = payload
      .toUpperCase()
      .replace(' ', '')
      .replace(/[^\w\s]/gi, '')

    setTempRefCode(value)
  }

  const trackCountlyNameFieldClick = () => {
    trackEventCountly(CountlyEventNames.WEB_REGISTRATION_PAGE_NAME_CLICK)
  }

  const trackCountlyEmailFieldClick = () => {
    trackEventCountly(CountlyEventNames.WEB_REGISTRATION_PAGE_EMAIL_CLICK)
  }

  const trackCountlyDobFieldClick = () => {
    trackEventCountly(CountlyEventNames.WEB_REGISTRATION_PAGE_DOB_CLICK)
  }

  const trackCountlyRefferalFieldClick = () => {
    trackEventCountly(CountlyEventNames.WEB_REGISTRATION_PAGE_REFERRAL_CLICK)
  }

  const trackCountlyNotifyTickClick = () => {
    trackEventCountly(
      CountlyEventNames.WEB_REGISTRATION_PAGE_NOTIFY_PROMO_SELECT,
    )
  }

  const trackCountlySKTickClick = () => {
    trackEventCountly(CountlyEventNames.WEB_REGISTRATION_PAGE_SK_SELECT)
  }
  const InformationBanner: React.FC = (): JSX.Element => (
    <div className={styles.information}>
      <div className={styles.foreGroundLayer}>
        <Image
          src={LogoPrimary}
          alt="seva-logo"
          className={styles.imageLogo}
          data-testid={elementId.Register.LogoSeva}
          width={111}
          height={68}
        />
        <h2 className={styles.titleInformationText}>
          Keuntungan Kualifikasi Kredit dengan SEVA
        </h2>
        <div className={styles.wrapperInformationList}>
          <div className={styles.informationList}>
            <div className={styles.icon}>
              <IconApplication width={32} height={32} color="#246ED4" />
            </div>
            <p className={styles.listText}>
              Pengecekan kualifikasi kredit dapat dilakukan di mana pun dan
              kapan pun
            </p>
          </div>
          <div className={styles.informationList}>
            <div className={styles.icon}>
              <IconVoucher width={32} height={32} color="#246ED4" />
            </div>
            <p className={styles.listText}>
              Dapatkan promo dengan unggah KTP kamu saat melakukan pengecekan
              kualifikasi kredit di SEVA.
            </p>
          </div>
          <div className={styles.informationList}>
            <div className={styles.icon}>
              <IconSecure width={32} height={32} color="#246ED4" />
            </div>
            <p className={styles.listText}>
              Bekerja sama dengan mitra terpercaya, ACC & TAF
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const AgreementTerms: React.FC = (): JSX.Element => (
    <div className={styles.agreementTerms}>
      <div
        onMouseDown={() => setFormData('terms', !form.terms)}
        data-testid={elementId.Register.CheckBox.Setuju}
      >
        <IconCheckedBox isActive={form.terms} width={16} height={16} />
      </div>
      <p className={styles.textOption}>
        Saya setuju dengan{' '}
        <a
          className={styles.textRedirect}
          target="_blank"
          href={termsAndConditionsUrl}
          rel="noreferrer"
          data-testid={elementId.Register.Link.SNK}
        >
          Syarat & Ketentuan
        </a>{' '}
        serta{' '}
        <a
          className={styles.textRedirect}
          target="_blank"
          href={privacyPolicyUrl}
          rel="noreferrer"
          data-testid={elementId.Register.Link.KebijakanPrivasi}
        >
          Kebijakan Privasi
        </a>{' '}
        yang berlaku.
      </p>
    </div>
  )

  const AgreementSubscription: React.FC = (): JSX.Element => (
    <div className={styles.agreementSubscription}>
      <div
        onClick={() => setFormData('subscription', !form.subscription)}
        data-testid={elementId.Register.CheckBox.SayaMau}
      >
        <IconCheckedBox isActive={form.subscription} width={16} height={16} />
      </div>
      <p className={styles.textOption}>
        Ya, saya mau menerima informasi promo terbaru
      </p>
    </div>
  )

  const setAndCheckEmailInput = (payload: string) => {
    if (payload === '') setEmailErrorMessage('')
    if (onlyEmailFormat(payload))
      setFormData('email', payload.replace(/ /g, ''))
  }

  return (
    <div className={styles.container}>
      <InformationBanner />
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <Image
            src={LogoPrimary}
            alt="seva-logo"
            className={styles.imageLogo}
            data-testid={elementId.Register.LogoSeva}
            width={111}
            height={68}
          />
          <h1
            className={styles.headerText}
            data-testid={elementId.Register.HeaderText}
          >
            {headerText}
          </h1>
          <p
            className={styles.descText}
            data-testid={elementId.Register.DescriptionText}
          >
            {descText}
          </p>
          <div className={styles.form}>
            <Input
              placeholder="Masukkan nama lengkap"
              title="Nama Lengkap"
              value={form.name}
              onChange={(e: any) => setAndCheckNameInput(e.target.value)}
              dataTestId={elementId.Input.FullName}
              onFocus={trackCountlyNameFieldClick}
            />
            <div className={styles.spacing}>
              <Input
                placeholder="Masukkan email"
                title="Email"
                value={form.email}
                isError={emailErrorMessage !== ''}
                message={emailErrorMessage}
                onChange={(e: any) => setAndCheckEmailInput(e.target.value)}
                data-testid={elementId.Input.Email}
                onFocus={trackCountlyEmailFieldClick}
              />
            </div>
            <div className={styles.spacing}>
              <DatePicker
                title="Tanggal Lahir"
                placeholder="DD/MM/YYYY"
                value={new Date(form.dateOfBirth)}
                min={dayjs().add(-100, 'year').toDate()}
                max={dayjs().add(-17, 'year').toDate()}
                name="dob"
                onConfirm={(val: Date) => {
                  setFormData('dateOfBirth', dayjs(val).format('YYYY-MM-DD'))
                }}
                onOpenDate={trackCountlyDobFieldClick}
              />
            </div>
            {!isPtbc && (
              <div className={styles.spacing}>
                <FormReferralCode
                  maxInputLength={8}
                  onClearInput={resetReferralCodeStatus}
                  value={tempRefCode}
                  isLoadingReferralCode={isLoadingReferralCode}
                  isErrorReferralCode={
                    tempRefCode !== '' && isErrorReferralCode
                  }
                  isSuccessReferralCode={isSuccessReferralCode}
                  passedResetReferralCodeStatusFunc={resetReferralCodeStatus}
                  passedCheckReferralCodeFunc={checkRefCode}
                  emitOnChange={(e) => {
                    setAndCheckReferralCodeInput(e.target.value)
                  }}
                  onFocus={trackCountlyRefferalFieldClick}
                />
              </div>
            )}
          </div>
          <AgreementSubscription />
          <AgreementTerms />
          <div className={styles.button}>
            <Button
              disabled={!isFilled || isLoading}
              version={
                isFilled ? ButtonVersion.PrimaryDarkBlue : ButtonVersion.Disable
              }
              size={ButtonSize.Big}
              onClick={() => sendCustomerRegister()}
              data-testid={elementId.Register.Button.Daftar}
              loading={isLoading}
            >
              Daftar
            </Button>
          </div>
        </div>

        <div className={styles.descFooter}>
          © 2023 PT Astra Auto Digital. All Rights Reserved
        </div>
        <Toast
          open={modalOpened === 'success-toast'}
          width={343}
          text={templateToastMessage + pathDirection}
          maskStyle={{
            background: 'rgba(19, 19, 27, 0.5)',
            maxWidth: '570px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        />
        <Toast
          width={343}
          open={isOpenToast}
          text={toastMessage}
          typeToast={'error'}
          onCancel={() => setIsOpenToast(false)}
          closeOnToastClick
          maskStyle={{
            background: 'rgba(19, 19, 27, 0.5)',
            maxWidth: '570px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        />
      </div>
    </div>
  )
}
