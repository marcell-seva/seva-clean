import React, { useEffect, useState } from 'react'
import styles from 'styles/components/organisms/login.module.scss'
import { filterNonDigitCharacters } from 'utils/stringUtils'
import Image from 'next/image'
import { encryptValue } from 'utils/encryptionUtils'
import {
  addAttributeMoEngageAfterLogin,
  setTrackEventMoEngageWithoutValue,
} from 'helpers/moengage'
import { getPageBeforeLogin } from 'utils/loginUtils'
import elementId from 'helpers/elementIds'
import {
  trackEventCountly,
  valueForInitialPageProperty,
  valueForUserTypeProperty,
} from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { useRouter } from 'next/router'
import { LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { getLocalStorage, saveLocalStorage } from 'utils/handler/localStorage'
import { getSessionStorage } from 'utils/handler/sessionStorage'
import { trackDataCarType } from 'utils/types/utils'
import { getToken } from 'utils/handler/auth'
import {
  getCustomerInfoSeva,
  getCustomerInfoWrapperSeva,
} from 'utils/handler/customer'
import {
  getBrandAndModelValue,
  getBrandValue,
} from 'utils/handler/getBrandAndModel'
import { Button, InputPhone } from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import {
  TemanSevaOnboardingUrl,
  TemanSevaRegisterSuccessUrl,
  preApprovalQuestionFlowUrlWithType,
  refinancingFormUrl,
  refinancingUrl,
  rootUrl,
} from 'utils/helpers/routes'
import { ContactFormKey, PreApprovalFlowType } from 'utils/types/models'
import { temanSevaUrlPath } from 'utils/types/props'
import { useContextContactFormPatch } from 'services/context/contactFormContext'
import { usePaAmbassadorData } from 'utils/hooks/usePaAmbassadorData/usePaAmbassadorData'
import {
  checkRegisteredCustomer,
  sendRefiContact,
} from 'utils/httpUtils/customerUtils'
import dynamic from 'next/dynamic'

const LoginModalMultiKK = dynamic(
  () => import('../loginModalMultiKK').then((comp) => comp.LoginModalMultiKK),
  { ssr: false },
)
const Toast = dynamic(
  () => import('components/atoms/toast').then((comp) => comp.Toast),
  { ssr: false },
)
const OTP = dynamic(() => import('../otp').then((comp) => comp.OTP), {
  ssr: false,
})
const LogoPrimary = '/revamp/icon/logo-primary.webp'

export const Login = () => {
  const headerText = 'Selamat Datang di SEVA'
  const descText =
    ' Mulai perjalananmu dengan membeli mobil baru di SEVA, nikmati segala keuntungan dan kemudahannya.'
  const toastSuccessInfo = 'Nomor berhasil diverifikasi.'
  const [phone, setPhone] = useState('')
  const router = useRouter()
  const [isFilled, setIsFilled] = useState<boolean>(false)
  const patchContactFormValue = useContextContactFormPatch()
  const [modalOpened, setModalOpened] = useState<
    'otp' | 'success-toast' | 'none'
  >('none')
  const { getDataPAAmbassador } = usePaAmbassadorData(
    getSessionStorage(SessionStorageKey.PAAmbassadorUrlId) || '',
  )
  const { source } = router.query
  const [isLoginModalOpened, setIsLoginModalOpened] = useState(false)

  const filterStorage: any = getLocalStorage(LocalStorageKey.CarFilter)

  const isUsingFilterFinancial =
    !!filterStorage?.age &&
    !!filterStorage?.downPaymentAmount &&
    !!filterStorage?.monthlyIncome &&
    !!filterStorage?.tenure

  const trackCountlyPageView = async () => {
    const referralCodeFromUrl: string | null = getLocalStorage(
      LocalStorageKey.referralTemanSeva,
    )
    const pageReferrer = getSessionStorage(
      SessionStorageKey.PageReferrerLoginPage,
    )

    const sourceSection = getSessionStorage(
      SessionStorageKey.PreviousSourceSectionLogin,
    )
    const dataCar: trackDataCarType | null = getSessionStorage(
      SessionStorageKey.PreviousCarDataBeforeLogin,
    )
    let temanSevaStatus = 'No'
    if (referralCodeFromUrl) {
      temanSevaStatus = 'Yes'
    } else if (!!getToken()) {
      const response = await getCustomerInfoSeva()
      if (response[0].temanSevaTrxCode) {
        temanSevaStatus = 'Yes'
      }
    }
    trackEventCountly(CountlyEventNames.WEB_LOGIN_PAGE_VIEW, {
      PAGE_REFERRER: pageReferrer,
      SOURCE_SECTION:
        sourceSection &&
        getPageBeforeLogin() !== 'null' &&
        !String(getPageBeforeLogin()).includes('kualifikasi')
          ? sourceSection
          : 'Null',
      FINCAP_FILTER_USAGE: isUsingFilterFinancial ? 'Yes' : 'No',
      CAR_BRAND:
        dataCar && dataCar.CAR_BRAND
          ? getBrandValue(dataCar.CAR_BRAND)
          : 'Null',
      CAR_MODEL: dataCar ? getBrandAndModelValue(dataCar.CAR_MODEL) : 'Null',
      CAR_VARIANT: dataCar?.CAR_VARIANT,
      PELUANG_KREDIT_BADGE: dataCar?.PELUANG_KREDIT_BADGE,
      TENOR_OPTION: dataCar?.TENOR_OPTION,
      USER_TYPE: valueForUserTypeProperty(),
      INITIAL_PAGE: valueForInitialPageProperty(),
      TEMAN_SEVA_STATUS: temanSevaStatus,
    })
  }

  useEffect(() => {
    setTrackEventMoEngageWithoutValue('view_login_page')
    trackCountlyPageView()

    const data: string | null = getLocalStorage(LocalStorageKey.TempLoginPhone)
    if (data !== null) {
      setPhone(data)
      setIsFilled(true)
    }

    if (source && String(source).toLowerCase() === 'pac') {
      setIsLoginModalOpened(true)
      trackEventCountly(CountlyEventNames.WEB_LOGIN_POPUP_ALERT_VIEW, {
        PAGE_REFERRER: 'Instant Approval Result Page',
      })
    }
  }, [])

  const sendOtpCode = async () => {
    trackEventCountly(CountlyEventNames.WEB_OTP_VIEW, {
      PAGE_ORIGINATION: 'Login',
    })
    setModalOpened('otp')
    saveLocalStorage(LocalStorageKey.TempLoginPhone, phone)
  }

  const handleInputPhone = (payload: any): void => {
    const temp = payload
    const checkNumber = payload.split('').splice(0, 2)
    if (checkNumber[0] === '6' && checkNumber[1] === '2') {
      const phoneNumberTemp = filterNonDigitCharacters(temp.replace('62', ''))
      setPhone(phoneNumberTemp)
      checkInputValue(phoneNumberTemp)
    } else if (payload !== '0' && payload !== '6') {
      const phoneNumberTemp = filterNonDigitCharacters(temp)
      setPhone(phoneNumberTemp)
      checkInputValue(phoneNumberTemp)
    }
  }

  const checkInputValue = (phone: string): void => {
    if (phone?.length > 8) setIsFilled(true)
    else setIsFilled(false)
  }

  const verified = async () => {
    try {
      await checkRegisteredCustomer(`+62${phone}`)
      setTrackEventMoEngageWithoutValue('login_success')
      setModalOpened('success-toast')
      getDataCustomer()
      trackEventCountly(CountlyEventNames.WEB_LOGIN_PAGE_CTA_CLICK, {
        REGISTRATION_STATUS: 'Yes',
      })
    } catch (e: any) {
      if (e.response.status === 404) {
        trackEventCountly(CountlyEventNames.WEB_LOGIN_PAGE_CTA_CLICK, {
          REGISTRATION_STATUS: 'No',
        })
        router.push({
          pathname: '/daftar-akun',
          query: { phoneNumber: phone },
        })
      }
    }
  }

  const setCustomerDetail = (payload: any) => {
    const encryptedData = encryptValue(JSON.stringify(payload))
    saveLocalStorage(LocalStorageKey.sevaCust, encryptedData)
  }

  const getDataCustomer = async () => {
    try {
      const response: any = await getCustomerInfoWrapperSeva()
      const customerData = response[0]
      setCustomerDetail(customerData)
      const data = {
        name: customerData.fullName,
        email: customerData.email,
        phoneNumber: customerData.phoneNumber,
      }
      setTimeout(() => {
        setModalOpened('none')
        redirectAndSendTrackerData(data)
      }, 3000)
    } catch (error) {}
  }

  const sendTrackingRefiDefault = (data: any) => {
    if (getPageBeforeLogin() === refinancingFormUrl) {
      sendRefiContact(
        data.phoneNumber,
        data.name,
        'SEVA_REFINANCING_DEFAULT',
        true,
      ).then((result) => {
        saveLocalStorage(
          LocalStorageKey.IdCustomerRefi,
          encryptValue(result?.data.id),
        )
      })
    }
  }

  const sendTrackingRefiQuestion = (data: any) => {
    if (getPageBeforeLogin() === refinancingUrl) {
      sendRefiContact(
        data.phoneNumber,
        data.name,
        'SEVA_REFINANCING_QUESTION',
        true,
      ).then((result) => {
        saveLocalStorage(
          LocalStorageKey.IdCustomerRefi,
          encryptValue(result?.data.id),
        )
      })
    }
  }

  const checkTemanSevaCustomer = async (data: any) => {
    if (getPageBeforeLogin() === TemanSevaOnboardingUrl) {
      try {
        const fetchAxios = (await import('axios')).default
        const temanSeva = await fetchAxios.post(temanSevaUrlPath.isTemanSeva, {
          phoneNumber: data.phoneNumber,
        })
        if (temanSeva.data.isTemanSeva) {
          router.push(TemanSevaRegisterSuccessUrl)
        }
      } catch (error) {}
    }
  }

  const getDataPAAmbassadorInfo = () => {
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
  }
  const setAttributeMoengage = (data: any) => {
    if (data.name) {
      const splitFullname = data.name
        .split(/(\s+)/)
        .filter((e: any) => e.trim().length > 0)

      addAttributeMoEngageAfterLogin(
        splitFullname[0],
        splitFullname.length > 0 ? splitFullname[1] : '-',
        data.email ? data.email : '-',
        data.phoneNumber ? data.phoneNumber : '',
      )
      patchContactFormValue({
        [ContactFormKey.Name]: data.name,
      })
    }
  }
  const redirectAndSendTrackerData = async (data: any) => {
    const nextPage = getPageBeforeLogin()
    sendTrackingRefiDefault(data)
    getDataPAAmbassadorInfo()
    sendTrackingRefiQuestion(data)
    setAttributeMoengage(data)
    checkTemanSevaCustomer(data)

    localStorage.removeItem(LocalStorageKey.PageBeforeLogin)

    if (nextPage && nextPage.includes('https'))
      return (window.location.href = nextPage)
    else {
      sessionStorage.setItem(
        SessionStorageKey.prevLoginPath,
        nextPage ?? rootUrl,
      )
      localStorage.removeItem(LocalStorageKey.PageBeforeLogin)
      router.push(nextPage ?? rootUrl)
    }
  }

  const handleClosePopup = () => {
    trackEventCountly(CountlyEventNames.WEB_LOGIN_POPUP_ALERT_CTA_CLICK)
    setIsLoginModalOpened(false)
  }
  const trackCountlyPhoneFieldClick = () => {
    trackEventCountly(CountlyEventNames.WEB_LOGIN_PAGE_PHONE_CLICK)
  }
  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.form}>
            <Image
              src={LogoPrimary}
              alt="seva-logo"
              className={styles.imageLogo}
              data-testid={elementId.Login.LogoSeva}
              width={111}
              height={68}
            />
            <h1
              className={styles.headerText}
              data-testid={elementId.Login.HeaderText}
            >
              {headerText}
            </h1>
            <p
              className={styles.descText}
              data-testid={elementId.Login.DescriptionText}
            >
              {descText}
            </p>
            <div className={styles.inputPhone}>
              <InputPhone
                placeholder="Masukkan nomor HP"
                value={phone}
                onChange={(e: any) => handleInputPhone(e.target.value)}
                data-testid={elementId.Input.PhoneNumber}
                onFocus={trackCountlyPhoneFieldClick}
              />
            </div>
            <div className={styles.button}>
              <Button
                disabled={!isFilled}
                size={ButtonSize.Big}
                onClick={() => sendOtpCode()}
                version={
                  isFilled
                    ? ButtonVersion.PrimaryDarkBlue
                    : ButtonVersion.Disable
                }
                data-testid={elementId.Login.Button.Lanjutkan}
              >
                Lanjutkan
              </Button>
            </div>
          </div>

          <div
            className={styles.descFooter}
            data-testid={elementId.Login.DescriptionFooter}
          >
            © 2023 PT Astra Auto Digital. All Rights Reserved
          </div>
          {modalOpened === 'otp' && (
            <OTP
              savedTokenAfterVerify
              isOpened
              phoneNumber={phone}
              closeModal={() => setModalOpened('none')}
              isOtpVerified={() => verified()}
              pageOrigination="Login"
            />
          )}
          <Toast
            width={343}
            open={modalOpened === 'success-toast'}
            text={toastSuccessInfo}
            maskStyle={{
              background: 'rgba(19, 19, 27, 0.5)',
              maxWidth: '570px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          />
        </div>
      </div>
      {isLoginModalOpened && (
        <LoginModalMultiKK
          onCancel={() => setIsLoginModalOpened(false)}
          overrideOnClickCta={handleClosePopup}
        />
      )}
    </>
  )
}
