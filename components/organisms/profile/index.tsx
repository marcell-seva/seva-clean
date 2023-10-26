import React, { useState, useEffect } from 'react'
import styles from '/styles/pages/account-profile.module.scss'
import inputStyles from '/styles/components/atoms/inputDate.module.scss'
import { useFormik } from 'formik'
import { object, string, InferType } from 'yup'
import dayjs from 'dayjs'
import { fetchCustomerDetails } from 'utils/httpUtils/customerUtils'
import {
  MoengageEventName,
  setTrackEventMoEngageWithoutValue,
} from 'helpers/moengage'
import getCurrentEnvironment from 'helpers/environments'
import elementId from 'helpers/elementIds'
import { useRouter } from 'next/router'
import { CustomerInfoSeva } from 'utils/types/utils'
import { separatePhoneNumber } from 'utils/handler/separatePhoneNumber'
import {
  getPageBeforeProfile,
  removeInformationWhenLogout,
} from 'utils/logoutUtils'
import {
  deleteAccountUrl,
  landingKtpUrl,
  previewKtpUrl,
  rootUrl,
} from 'utils/helpers/routes'
import { PageLayout } from 'components/templates'
import {
  Avatar,
  Button,
  IconChevronDown,
  IconChevronUp,
  Input,
  InputSelect,
  Skeleton,
} from 'components/atoms'
import { DatePicker } from 'components/atoms/inputDate'
import { Gender, ToastType } from 'utils/types/models'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import Link from 'next/link'
import LabelAccount from 'components/molecules/labelAccount'
import { updateProfile } from 'utils/handler/customer'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { trackEventCountly } from 'helpers/countly/countly'
import { getSessionStorage } from 'utils/handler/sessionStorage'
import { SessionStorageKey } from 'utils/enum'
import { RegExOnlyAlphabetsAndSpaces } from 'utils/handler/regex'
import dynamic from 'next/dynamic'

const Toast = dynamic(
  () => import('components/atoms/toast').then((mod) => mod.Toast),
  { ssr: false },
)

const ToastV2 = dynamic(
  () => import('components/atoms/toastV2').then((mod) => mod.ToastV2),
  { ssr: false },
)

const PopupError = dynamic(() => import('components/organisms/popupError'), {
  ssr: false,
})

const ProfileUploadKtp = dynamic(
  () =>
    import('components/molecules/profileUploadKtp').then(
      (mod) => mod.ProfileUploadKtp,
    ),
  { ssr: false },
)

const lostConnectionMessage =
  'Oops, koneksi Anda terputus. Silahkan coba kembali.'

const Profile = () => {
  const router = useRouter()
  const [customerDetail, setCustomerDetail] = React.useState<CustomerInfoSeva>()
  const [toast, setToast] = useState('')
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState({
    status: false,
    action: '',
  })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const enableDeleteAccount =
    getCurrentEnvironment.featureToggles.enableDeleteAccount
  const enableUploadKtp = getCurrentEnvironment.featureToggles.enableUploadKtp

  const pageReferrerProfile = getSessionStorage(
    SessionStorageKey.PageReferrerProfilePage,
  )

  const userSchema = object().shape({
    fullName: string().required('Wajib diisi.'),
    email: string()
      .matches(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        {
          message: 'Gunakan format yang benar. Contoh: john@mail.com.',
        },
      )
      .required('Wajib diisi.'),
    dob: string().required('Wajib diisi.'),
    gender: string(),
  })

  type UserForm = InferType<typeof userSchema>

  const {
    values,
    handleChange,
    errors,
    handleBlur,
    touched,
    setFieldValue,
    dirty,
    isValid,
    handleSubmit,
  } = useFormik<UserForm>({
    initialValues: {
      fullName: customerDetail?.fullName || '',
      email: customerDetail?.email || '',
      dob: customerDetail?.dob || '',
      gender: customerDetail?.gender || '',
    },
    onSubmit: (value) => {
      setIsLoadingSubmit(true)
      const genderPayload = value.gender
        ? { gender: value.gender }
        : ({} as { gender: string })
      const maritalPayload = {} as { marital: string }
      updateProfile({
        ...genderPayload,
        ...maritalPayload,
        fullName: value.fullName,
        email: value.email,
        dob: dayjs(value.dob).format('YYYY-MM-DD'),
        phoneNumber: customerDetail?.phoneNumber || '+62',
      })
        .then(() => {
          sessionStorage.setItem('isProfileUpdated', 'true')
          window.location.reload()
        })
        .catch(() => {
          setIsLoadingSubmit(false)
          setErrorMessage(lostConnectionMessage)
          throw new Error('Gagal menyimpan perubahan akun')
        })
    },
    validateOnBlur: true,
    validationSchema: userSchema,
    enableReinitialize: true,
  })

  const getCustomerInfoData = async () => {
    setIsLoadingCustomer(true)
    try {
      const response = await fetchCustomerDetails()
      const customerDetails: CustomerInfoSeva = response[0]
      setCustomerDetail(customerDetails)
    } catch (error) {
      throw error
    } finally {
      setIsLoadingCustomer(false)
    }
  }

  const trackCountlyProfileWebView = () => {
    trackEventCountly(CountlyEventNames.WEB_PROFILE_PAGE_VIEW, {
      PAGE_REFERRER: pageReferrerProfile,
    })
  }

  useEffect(() => {
    setTrackEventMoEngageWithoutValue(MoengageEventName.view_profile_page)
    getCustomerInfoData()
    trackCountlyProfileWebView()
  }, [])

  useEffect(() => {
    if (sessionStorage.getItem('isProfileUpdated') === 'true') {
      setToast('Perubahan akun berhasil disimpan.')
      setTimeout(() => {
        setToast('')
      }, 3000)
      sessionStorage.removeItem('isProfileUpdated')
    }
  }, [])

  const phoneNumber = React.useMemo(() => {
    if (customerDetail) {
      return separatePhoneNumber(customerDetail.phoneNumber)
    }
  }, [customerDetail])

  const setIconNameCustomer = (payload: string) => {
    if (payload.indexOf(' ') > 0) {
      const nameTmp = payload.split(' ')
      const firstInitial = nameTmp.slice(0, 1).join('')
      const secondInitial = nameTmp.slice(1).join('')
      const initialName = firstInitial[0] + secondInitial[0]
      return initialName.toUpperCase()
    } else {
      return payload.slice(0, 2).toUpperCase()
    }
  }

  const isNeedComplete = (obj: CustomerInfoSeva | UserForm | undefined) => {
    return !obj?.fullName || !obj?.email || !obj?.dob
  }

  const logoutHandler = () => {
    removeInformationWhenLogout()

    // avoid using router.goBack(), because browser might still have the cached version
    // which will render the page with all of its previous states
    router.push(getPageBeforeProfile() ?? rootUrl)
  }
  const newKtphandler = () => {
    router.push(landingKtpUrl)
  }
  const changeKtpHandler = () => {
    router.push(previewKtpUrl)
  }

  const onClickLogout = () => {
    if (dirty) {
      setIsModalOpen({ status: true, action: 'logout' })
      return
    }
    logoutHandler()
  }

  const onClickDiscardPopupError = (status: string) => {
    if (status === 'logout') {
      logoutHandler()
    } else if (status === 'newKtp') {
      newKtphandler()
    } else if (status === 'changeKtp') {
      changeKtpHandler()
    }
  }
  const trackCountlyNameFieldClick = () => {
    trackEventCountly(CountlyEventNames.WEB_PROFILE_PAGE_NAME_CLICK, {
      PAGE_REFERRER: pageReferrerProfile,
    })
  }

  const trackCountlyEmailFieldClick = () => {
    trackEventCountly(CountlyEventNames.WEB_PROFILE_PAGE_EMAIL_CLICK, {
      PAGE_REFERRER: pageReferrerProfile,
    })
  }

  const trackCountlyDobFieldClick = () => {
    trackEventCountly(CountlyEventNames.WEB_PROFILE_PAGE_DOB_CLICK, {
      PAGE_REFERRER: pageReferrerProfile,
    })
  }

  const trackCountlyGenderFieldClick = () => {
    trackEventCountly(CountlyEventNames.WEB_PROFILE_PAGE_GENDER_CLICK, {
      PAGE_REFERRER: pageReferrerProfile,
    })
  }
  return (
    <>
      <PageLayout>
        <main className={styles.wrapper}>
          {isLoadingCustomer ? (
            <>
              <section className={styles.wrapper__form}>
                <section className={styles.info}>
                  <Skeleton
                    height={56}
                    width={56}
                    style={{
                      borderRadius: '50%',
                    }}
                  />
                  <Skeleton
                    height={44}
                    width={120}
                    className={styles.rounded}
                  />
                </section>
                <SkeletonForm />
                <SkeletonForm />
                <SkeletonForm />
                <SkeletonForm />
              </section>
              <Skeleton
                height={113}
                width={'100%'}
                className={styles.rounded}
              />
            </>
          ) : (
            <>
              <section className={styles.wrapper__form}>
                <section className={styles.info}>
                  <Avatar
                    title={
                      customerDetail?.fullName
                        ? setIconNameCustomer(customerDetail.fullName)
                        : ''
                    }
                  />
                  <div className={styles.info__phoneName}>
                    <h3 className={styles.fullnameText}>
                      {customerDetail?.fullName}
                    </h3>
                    <span>
                      {phoneNumber?.code} | {phoneNumber?.number}
                    </span>
                  </div>
                </section>
                {isNeedComplete(customerDetail) || !customerDetail?.gender ? (
                  <LabelAccount />
                ) : null}
                <Input
                  title="Nama Lengkap"
                  value={values.fullName}
                  placeholder="Masukkan nama lengkap"
                  name="fullName"
                  id="fullName"
                  onChange={(e) => {
                    if (
                      e.target.value === '' ||
                      RegExOnlyAlphabetsAndSpaces.test(e.target.value)
                    ) {
                      handleChange(e)
                    }
                  }}
                  onBlur={handleBlur}
                  isError={!!errors.fullName && touched.fullName}
                  message={errors.fullName}
                  data-testid={elementId.Input.FullName}
                  onFocus={trackCountlyNameFieldClick}
                />
                <Input
                  title="Email"
                  value={values.email}
                  placeholder="Masukkan email"
                  name="email"
                  id="email"
                  onChange={(e) => {
                    const re = /^[a-zA-Z0-9@._-]+$/
                    if (e.target.value === '' || re.test(e.target.value)) {
                      const value = e.target.value.toLowerCase()
                      setFieldValue('email', value)
                    }
                  }}
                  onBlur={handleBlur}
                  isError={!!errors.email && touched.email}
                  message={errors.email}
                  data-testid={elementId.Input.Email}
                  onFocus={trackCountlyEmailFieldClick}
                />
                <DatePicker
                  forceRender={!!values.dob}
                  title="Tanggal Lahir"
                  placeholder="DD/MM/YYYY"
                  value={new Date(values.dob)}
                  min={dayjs().add(-100, 'year').toDate()}
                  max={dayjs().add(-17, 'year').toDate()}
                  name="dob"
                  isError={!!errors.dob && touched.dob}
                  errorMessage={errors.dob}
                  data-testid={elementId.DatePicker.DOB}
                  onBlurInput={(e) => handleBlur(e)}
                  onConfirm={(val: Date) => {
                    setFieldValue('dob', dayjs(val).format('YYYY-MM-DD'))
                  }}
                  onOpenDate={trackCountlyDobFieldClick}
                />
                <div>
                  <label className={inputStyles.titleText}>Jenis Kelamin</label>
                  <InputSelect
                    id="gender"
                    name="gender"
                    value={values.gender || ''}
                    onChange={(value) => {
                      setFieldValue('gender', value)
                    }}
                    options={[
                      { value: Gender.Male, label: 'Pria' },
                      {
                        value: Gender.Female,
                        label: 'Wanita',
                      },
                    ]}
                    placeholderText="Pilih jenis kelamin"
                    onBlurInput={handleBlur}
                    isError={!!errors.gender && touched.gender}
                    rightIcon={(state) => {
                      if (state.isOpen) {
                        return (
                          <IconChevronUp
                            width={24}
                            height={24}
                            color={'#13131B'}
                          />
                        )
                      } else {
                        return (
                          <IconChevronDown
                            width={24}
                            height={24}
                            color={'#13131B'}
                          />
                        )
                      }
                    }}
                    isSearchable={false}
                    isClearable={false}
                    showValueAsLabel
                    highlightSelectedOption
                    datatestid={elementId.Dropdown.Gender}
                    onFocusInput={trackCountlyGenderFieldClick}
                  />
                  {!!errors.gender && touched.gender ? (
                    <p className={inputStyles.errorText}>{errors.gender}</p>
                  ) : null}
                </div>
              </section>

              {enableUploadKtp && (
                <ProfileUploadKtp
                  dirty={dirty}
                  onModalOpen={(val) => setIsModalOpen(val)}
                  nik={Boolean(customerDetail?.nik)}
                />
              )}
            </>
          )}
          <section className={styles.wrapper__button}>
            <Button
              onClick={() => {
                setErrorMessage(null)
                if (!navigator.onLine) {
                  setErrorMessage(lostConnectionMessage)
                  return
                }
                handleSubmit()
              }}
              version={ButtonVersion.PrimaryDarkBlue}
              size={ButtonSize.Big}
              disabled={
                isNeedComplete(values) || !dirty || !isValid || isLoadingSubmit
              }
              loading={isLoadingSubmit}
              data-testid={elementId.Profil.Button.SimpanPerubahan}
            >
              Simpan Perubahan
            </Button>
            <button
              onClick={onClickLogout}
              className={`${styles.button__link} ${styles.logoutButton}`}
              data-testid={elementId.Profil.Button.KeluarAkun}
            >
              Keluar Akun
            </button>
          </section>
        </main>
        {enableDeleteAccount && (
          <div className={styles.deleteAccountSection}>
            <Link className={styles.deleteAccountLink} href={deleteAccountUrl}>
              Hapus Akun
            </Link>
          </div>
        )}
      </PageLayout>
      <Toast
        text={toast}
        open={toast.length > 0}
        maskClosable
        closeOnToastClick
        onCancel={() => {
          setToast('')
        }}
      />
      {errorMessage ? (
        <ToastV2
          visible={errorMessage !== null}
          message={errorMessage}
          type={ToastType.Error}
          duration={3}
          onClose={() => setErrorMessage(null)}
        />
      ) : null}
      <PopupError
        open={isModalOpen.status}
        onCancel={() => setIsModalOpen({ status: false, action: '' })}
        cancelText="Kembali"
        title="Perubahan data belum disimpan."
        subTitle="Simpan perubahan datamu sebelum melakukan tahap lainnya."
        width={346}
        discardButton={{
          action: () => onClickDiscardPopupError(isModalOpen.action),
          text: 'Batalkan perubahan dan lanjutkan',
        }}
      />
    </>
  )
}

function SkeletonForm() {
  return (
    <div>
      <Skeleton
        height={14}
        width={120}
        className={styles.rounded}
        style={{
          marginBottom: 8,
        }}
      />
      <Skeleton height={48} width={'100%'} className={styles.rounded} />
    </div>
  )
}

export default Profile
