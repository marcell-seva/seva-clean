import React, { useState, useEffect, MutableRefObject, useRef } from 'react'
import styles from 'styles/pages/ktp-edit.module.scss'
import inputDateStyles from 'styles/components/atoms/inputDate.module.scss'
import elementId from 'helpers/elementIds'
import dayjs from 'dayjs'

import Fuse from 'fuse.js'
import { useRouter } from 'next/router'
import { useQuery } from 'utils/hooks/useQuery'
import { CustomerKtpSeva, FormLCState } from 'utils/types/utils'
import { useGalleryContext } from 'services/context/galleryContext'
import { object, string, InferType } from 'yup'
import { useFormik } from 'formik'
import {
  getSessionStorage,
  saveSessionStorage,
} from 'utils/handler/sessionStorage'
import { SessionStorageKey } from 'utils/enum'
import {
  cameraKtpUrl,
  formKtpUrl,
  ktpReviewUrl,
  uploadKtpSpouseQueryParam,
  verifyKtpUrl,
} from 'utils/helpers/routes'
import {
  Button,
  IconChevronDown,
  IconChevronLeft,
  IconChevronUp,
  Input,
  InputSelect,
  Skeleton,
} from 'components/atoms'
import { ProgressBar } from 'components/atoms/progressBar'
import { DatePicker } from 'components/atoms/inputDate'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { ToastV2 } from 'components/atoms/toastV2'
import { ToastType } from 'utils/types/models'

import { trackProfileSaveKtpChanges } from 'helpers/amplitude/seva20Tracking'
import { getLocalStorage } from 'utils/handler/localStorage'
import Seo from 'components/atoms/seo'
import { defaultSeoImage } from 'utils/helpers/const'
import Image from 'next/image'

import { checkNIKAvailable } from 'utils/handler/customer'
import dynamic from 'next/dynamic'
import { getCities } from 'services/api'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { useFinancialQueryData } from 'services/context/finnancialQueryContext'
import { useValidateUserFlowKKIA } from 'utils/hooks/useValidateUserFlowKKIA'
import { defineRouteName } from 'utils/navigate'
import { formatKTPDate } from 'utils/handler/date'
import { useAfterInteractive } from 'utils/hooks/useAfterInteractive'
import { useBeforePopState } from 'utils/hooks/useBeforePopState'

const PopupError = dynamic(() => import('components/organisms/popupError'), {
  ssr: false,
})
const Toast = dynamic(
  () => import('components/atoms').then((mod) => mod.Toast),
  { ssr: false },
)

const LogoPrimary = '/revamp/icon/logo-primary.webp'

const lostConnectionMessage =
  'Oops, koneksi Anda terputus. Silahkan coba kembali.'

const checkFirstCharacter = /^(?! |.* {2})[a-zA-Z ]*$/
const checkRtRwCharacter = /^[0-9]{1,3}\/[0-9]{1,3}$/

const errorMessageText = {
  required: 'Wajib diisi',
  nik: 'NIK harus terdiri atas 16 digit angka',
  optionMarriage: 'Harap pilih opsi yang tersedia',
  cityNotFound: 'Kota tidak terdaftar di SEVA',
}

const searchOption = {
  keys: ['label'],
  isCaseSensitive: false,
  includeScore: true,
  threshold: 0.1,
}

const KtpForm = () => {
  useValidateUserFlowKKIA([verifyKtpUrl, ktpReviewUrl])
  useBeforePopState()
  const router = useRouter()
  const { ktpType }: { ktpType: string } = useQuery(['ktpType'])
  const isSpouse = ktpType && ktpType.toLowerCase() === 'spouse'
  const [toast, setToast] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning'>(
    'success',
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [cityListFromApi, setCityListFromApi] = useState<any[]>([])
  const [cityList, setCityList] = useState<any>([])
  const [correctWarning, setCorrectWarning] = useState(true)
  const [customerKtp, setCustomerKtp] = useState<CustomerKtpSeva>({
    nik: '',
    name: '',
    address: '',
    rtrw: '',
    kel: '',
    kec: '',
    marriage: '',
    birthdate: '',
    province: '',
    city: '',
    gender: '',
  })
  const [isLoadingCustomer] = useState(false)
  const { galleryFile } = useGalleryContext()

  const kkForm: FormLCState | null = getSessionStorage(
    SessionStorageKey.KalkulatorKreditForm,
  )
  const { fincap } = useFinancialQueryData()
  const kkFlowType = getSessionStorage(SessionStorageKey.KKIAFlowType)
  const isInPtbcFlow = kkFlowType && kkFlowType === 'ptbc'

  const fieldRef = {
    nik: useRef() as MutableRefObject<HTMLInputElement>,
    name: useRef() as MutableRefObject<HTMLInputElement>,
    city: useRef() as MutableRefObject<HTMLInputElement>,
    marriage: useRef() as MutableRefObject<HTMLInputElement>,
    birthdate: useRef() as MutableRefObject<HTMLDivElement>,
  }

  const userSchema = object().shape({
    nik: string()
      .matches(/^\d{16}$/, {
        message: errorMessageText.nik,
      })
      .required(errorMessageText.required),
    name: string().required(errorMessageText.required),
    address: string(),
    rtrw: string(),
    kel: string(),
    kec: string(),
    marriage: string()
      .required(errorMessageText.required)
      .oneOf(
        ['Belum Kawin', 'Kawin', 'Cerai Hidup', 'Cerai Mati'],
        errorMessageText.optionMarriage,
      ),
    birthdate: string().required(errorMessageText.required),
    city: string().required(errorMessageText.required),
  })

  type UserForm = InferType<typeof userSchema>

  const {
    values,
    errors,
    setErrors,
    handleBlur,
    touched,
    // setTouched,
    setFieldValue,
    // dirty,
    // isValid,
    handleSubmit,
  } = useFormik<UserForm>({
    initialValues: {
      nik: customerKtp?.nik || '',
      name: customerKtp?.name || '',
      address: checkFirstCharacter.test(customerKtp?.address)
        ? customerKtp.address
        : '',
      rtrw: checkRtRwCharacter.test(customerKtp?.rtrw) ? customerKtp.rtrw : '-',
      kel: checkFirstCharacter.test(customerKtp?.kel) ? customerKtp.kel : '-',
      kec: checkFirstCharacter.test(customerKtp?.kec) ? customerKtp.kec : '-',
      marriage: customerKtp?.marriage || '',
      birthdate: !isNaN(new Date(customerKtp.birthdate).getTime())
        ? formatKTPDate(new Date(customerKtp.birthdate))
        : '',
      city: customerKtp?.city || '',
    },
    onSubmit: async (value) => {
      if (!checkCityOCR(cityListFromApi, value.city)) {
        setErrors({ ...errors, city: errorMessageText.cityNotFound })
        return
      }
      if (correctWarning) {
        setToastType('warning')
        setToast('Pastikan data KTP-mu sudah sesuai')
        return setTimeout(() => {
          setCorrectWarning(false)
          setToast('')
        }, 3000)
      }

      setIsLoadingSubmit(true)
      const marriagePayload = value.marriage
        ? { marriage: value.marriage }
        : ({} as { marriage: string })
      try {
        const checkNik = await checkNIKAvailable(value.nik)
        const data = checkNik
        if (data.code === 'KTP has been used') {
          setIsLoadingSubmit(false)
          setIsModalOpen(true)
          trackEventCountly(
            CountlyEventNames.WEB_KTP_PAGE_NIK_DOUBLED_POPUP_VIEW,
          )
        } else {
          if (isSpouse) {
            const dataPersonal = getSessionStorage(
              SessionStorageKey.DataUploadKTP,
            ) as any
            if (dataPersonal) {
              if (value.nik === dataPersonal.nik) {
                setIsLoadingSubmit(false)
                trackEventCountly(
                  CountlyEventNames.WEB_KTP_PAGE_NIK_DOUBLED_POPUP_VIEW,
                )
                return setIsModalOpen(true)
              }
            }
          }
          saveSessionStorage(
            isSpouse
              ? SessionStorageKey.DataUploadKTPSpouse
              : SessionStorageKey.DataUploadKTP,
            JSON.stringify({
              ...value,
              birthdate: value?.birthdate || '01-01-2000',
              province: customerKtp?.province || '-',
              gender: customerKtp?.gender || '-',
              created: new Date(),
              ...marriagePayload,
            }),
          )

          sessionStorage.setItem('isKtpSaved', 'true')
          localStorage.setItem('formKtp', JSON.stringify(value))
          saveSessionStorage(
            SessionStorageKey.LastVisitedPageKKIAFlow,
            window.location.pathname,
          )
          trackEventCountly(CountlyEventNames.WEB_KTP_EDIT_PAGE_CTA_CLICK, {
            CITY: value.city,
            MARITAL_STATUS: value.marriage,
          })
          router.push(ktpReviewUrl)
        }
      } catch (e: any) {
        setToastType('error')
        if (e?.response?.data?.message) {
          setToast(`${e?.response?.data?.message}`)
        } else {
          setToast(
            'Mohon maaf, terjadi kendala jaringan silahkan coba kembali lagi',
          )
        }
        setIsLoadingSubmit(false)
      }
    },
    validateOnBlur: true,
    validateOnChange: false,
    validationSchema: userSchema,
    enableReinitialize: true,
  })

  const scrollErrorTo = (
    field: 'nik' | 'name' | 'city' | 'birthdate' | 'marriage',
  ) => {
    fieldRef[field].current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }

  const checkScrollError = () => {
    if (errors.nik) return scrollErrorTo('nik')
    if (errors.name) return scrollErrorTo('name')
    if (errors.city) return scrollErrorTo('city')
    if (errors.marriage) return scrollErrorTo('marriage')
    if (errors.birthdate) return scrollErrorTo('birthdate')
  }

  // const isNeedComplete = (obj: CustomerKtpSeva | UserForm | undefined) => {
  //   return (
  //     !obj?.nik || !obj?.name || !obj?.marriage || !obj?.birthdate || !obj?.city
  //   )
  // }

  const checkCitiesData = () => {
    if (cityListFromApi.length === 0) {
      getCities().then((res) => {
        if (res) {
          const cityOptions = res.map((item: any) => ({
            label: item.cityName,
            value: item.cityName,
          }))
          setCityListFromApi(cityOptions)
          setCityList(cityOptions)
        }
      })
    }
  }

  const generateSuggestion = (inputValue: string) => {
    const fuse = new Fuse(cityListFromApi, searchOption)
    const suggestion = fuse.search(inputValue)
    const result = suggestion.map((obj) => obj.item)

    return result.sort((a: any, b: any) => {
      if (a.label.startsWith(inputValue) && b.label.startsWith(inputValue))
        return a.label.localeCompare(b.label)
      else if (a.label.startsWith(inputValue)) return -1
      else if (b.label.startsWith(inputValue)) return 1

      return a.label.localeCompare(b.label)
    })
  }

  const cityListWithTopCity = () => {
    const topCityName = [
      'Jakarta Pusat',
      'Bogor',
      'Surabaya',
      'Bandung',
      'Medan',
      'Makassar',
    ]

    const topCityDataList: any[] = []

    for (let i = 0; i < topCityName.length; i++) {
      for (let j = 0; j < cityListFromApi.length; j++) {
        if (topCityName[i] === cityListFromApi[j].value) {
          topCityDataList.push(cityListFromApi[j])
        }
      }
    }

    const restOfCityData = cityListFromApi.filter(
      (x: any) => !topCityDataList.includes(x),
    )
    const sortedRestOfCityData = restOfCityData.sort(
      (a: { value: string }, b: { value: any }) =>
        a.value.localeCompare(b.value),
    )

    return [...topCityDataList, ...sortedRestOfCityData]
  }

  const getPopupErrorSubtitle = () => {
    if (
      getLocalStorage('change_ktp') !== 'true' &&
      getSessionStorage(SessionStorageKey.OCRKTP) !== 'profile'
    ) {
      return 'Kamu tidak dapat menggunakan KTP yang sama.'
    } else {
      return 'Kamu hanya dapat menggunakan 1(satu) KTP/NIK.'
    }
  }

  const getTitleText = () => {
    if (ktpType && ktpType.toLowerCase() === 'spouse') {
      return 'Konfirmasi Data KTP Pasangan'
    } else {
      return 'Konfirmasi Data KTP'
    }
  }

  const getSubtitleText = () => {
    if (ktpType && ktpType.toLowerCase() === 'spouse') {
      return 'Periksa kembali data KTP di bawah ini.'
    } else {
      return 'Periksa kembali data KTP kamu.'
    }
  }

  const checkCityOCR = (cityList: any[], city: string) => {
    const checkcity = cityList.some((x) =>
      city.toLowerCase().includes(x.value.toLowerCase()),
    )
    if (city && !checkcity) {
      return false
    }

    if (checkcity) {
      const filterCity = cityList.filter((x) =>
        city.toLowerCase().includes(x.value.toLowerCase()),
      )
      setFieldValue('city', filterCity[0].value)
    }
    return true
  }

  const trackKTPEdit = ({ ocrStatus = 'Yes' }) => {
    const prevPage = getSessionStorage(SessionStorageKey.PreviousPage) as any
    const brand = kkForm?.model?.brandName || 'Null'
    const model = kkForm?.model
      ? kkForm?.model?.modelName.replace(brand, '')
      : 'Null'
    const track = {
      KTP_PROFILE: ktpType ? 'Spouse' : 'Main',
      PAGE_REFERRER:
        prevPage && prevPage.refer ? defineRouteName(prevPage.refer) : 'Null',
      PELUANG_KREDIT_BADGE: fincap
        ? kkForm && kkForm.model?.loanRank
          ? kkForm.model.loanRank === 'Green'
            ? 'Mudah disetujui'
            : 'Sulit disetujui'
          : 'Null'
        : 'Null',
      CAR_BRAND: brand,
      CAR_MODEL: model,
      OCR_SUCCESS_STATUS: ocrStatus,
    }

    if (isInPtbcFlow) {
      trackEventCountly(CountlyEventNames.WEB_PTBC_KTP_EDIT_PAGE_VIEW, {
        KTP_PROFILE: ktpType ? 'Spouse' : 'Main',
      })
    } else {
      trackEventCountly(CountlyEventNames.WEB_KTP_EDIT_PAGE_VIEW, track)
    }
  }

  useEffect(() => {
    if (sessionStorage.getItem('isProfileUpdated') === 'true') {
      setToastType('success')
      setToast('Perubahan akun berhasil disimpan.')
      setTimeout(() => {
        setToast('')
      }, 2000)
      sessionStorage.removeItem('isProfileUpdated')
    }
    if (localStorage.getItem('formKtp')) {
      const data = JSON.parse(localStorage.getItem('formKtp') || '{}')
      setCustomerKtp({
        nik: data.nik,
        name: data.name,
        address: data.address,
        rtrw: data.rtrw,
        kel: data.kel,
        kec: data.kec,
        marriage: data.marriage,
        birthdate: data.birthdate,
        province: data.province,
        city: data.city,
        gender: data.gender,
      })
      checkCitiesData()
    } else {
      checkCitiesData()
      setToastType('warning')
      setToast('KTP tidak terbaca. Silakan isi datamu dengan benar.')
      setTimeout(() => {
        setToast('')
      }, 2000)
    }
  }, [])

  useAfterInteractive(() => {
    if (localStorage.getItem('formKtp')) {
      trackKTPEdit({ ocrStatus: 'yes' })
    } else {
      trackKTPEdit({ ocrStatus: 'No' })
      setTimeout(() => {
        trackEventCountly(
          CountlyEventNames.WEB_KTP_PAGE_OCR_FAILED_READ_TOAST_MESSAGE_VIEW,
        )
      }, 1000)
    }
  }, [])

  useEffect(() => {
    if (cityListFromApi.length > 0) {
      setErrors({
        ...errors,
        ...(customerKtp.nik &&
          isNaN(parseInt(customerKtp.nik)) && {
            nik: errorMessageText.nik,
          }),
        ...(!checkCityOCR(cityListFromApi, customerKtp.city) && {
          city: errorMessageText.cityNotFound,
        }),
      })
    }
  }, [cityListFromApi])

  return (
    <>
      <Seo
        title="SEVA - Beli Mobil Terbaru Dengan Cicilan Kredit Terbaik"
        description="Beli mobil terbaru dari Toyota, Daihatsu, BMW dengan Instant Approval*. Proses Aman & Mudah✅ Terintegrasi dengan ACC & TAF✅ SEVA member of ASTRA"
        image={defaultSeoImage}
      />
      <div className={styles.form_header}>
        <div
          className={styles.back__button}
          onClick={() => {
            saveSessionStorage(
              SessionStorageKey.LastVisitedPageKKIAFlow,
              window.location.pathname,
            )
            router.back()
          }}
        >
          <IconChevronLeft width={24} height={24} color="#13131B" />
        </div>
        <div className={styles.logo}>
          <Image src={LogoPrimary} alt="back" width={24} height={24} />
        </div>
        <ProgressBar percentage={85} colorPrecentage="#51A8DB" />
        <main className={styles.wrapper}>
          {isLoadingCustomer ? (
            <>
              <SkeletonForm />
              <SkeletonForm />
              <SkeletonForm />
              <SkeletonForm />
              <SkeletonForm />
              <SkeletonForm />
              <SkeletonForm />
            </>
          ) : (
            <section className={styles.wrapper__form}>
              <div className={styles.ktp__page__title}>
                <h2 className={`medium ${styles.info} ${styles.titleText}`}>
                  {getTitleText()}
                </h2>
                <span className={styles.light__text}>{getSubtitleText()}</span>
              </div>
              <Image
                src={galleryFile || ''}
                alt="KTP Image"
                width={570}
                height={200}
                className={styles.ktp__preview__image}
              />
              <Input
                ref={fieldRef.nik}
                title="NIK"
                value={values.nik}
                placeholder="1234 5678 9012 3456"
                name="nik"
                id="nik"
                type="tel"
                onFocus={() => {
                  trackEventCountly(
                    CountlyEventNames.WEB_KTP_EDIT_PAGE_NIK_CLICK,
                  )
                }}
                onChange={(e) => {
                  const enteredValue = e.target.value
                  let formattedValue = enteredValue.replace(/\D/g, '')
                  if (formattedValue.length >= 16) {
                    formattedValue = formattedValue.slice(0, 16)
                  }
                  setFieldValue('nik', formattedValue)
                  setErrors({ ...errors, nik: '' })
                }}
                onBlur={handleBlur}
                isError={!!errors.nik}
                message={errors.nik}
                dataTestId={elementId.Input.NIK}
              />
              <Input
                ref={fieldRef.name}
                title="Nama"
                value={values.name}
                placeholder="Masukkan Nama"
                name="name"
                id="name"
                onChange={(e) => {
                  const re = /^(?! |.* {2}).{0,256}$/
                  if (e.target.value === '' || re.test(e.target.value)) {
                    setFieldValue('name', e.target.value)
                  }
                }}
                onFocus={() => {
                  trackEventCountly(
                    CountlyEventNames.WEB_KTP_EDIT_PAGE_NAME_CLICK,
                  )
                }}
                onBlur={handleBlur}
                isError={!!errors.name && touched.name}
                message={errors.name}
                dataTestId={elementId.Input.Name}
              />
              <div className={styles.addressWraper}>
                <label className={inputDateStyles.titleText}>Kota</label>
                <InputSelect
                  ref={fieldRef.city}
                  id="city"
                  name="city"
                  prefix="Kota"
                  value={values.city || ''}
                  options={cityList}
                  placeholderText="Pilih Kota"
                  onFocusInput={() => {
                    trackEventCountly(
                      CountlyEventNames.WEB_KTP_EDIT_PAGE_CITY_CLICK,
                    )
                  }}
                  onChange={(value) => {
                    setFieldValue('city', value)
                    setErrors({ ...errors, city: '' })
                    const listSuggestion = value
                      ? generateSuggestion(value)
                      : cityListWithTopCity()
                    setCityList(listSuggestion)
                  }}
                  onChoose={(value) => {
                    setFieldValue('city', value.value)
                    setErrors({ ...errors, city: '' })
                  }}
                  onBlurInput={() => {
                    if (cityList.length === 0) {
                      setFieldValue('city', '')
                    }

                    if (!checkCityOCR(cityListFromApi, values.city)) return

                    return handleBlur('city')
                  }}
                  highlightSelectedOption
                  isAutoFocus={false}
                  noOptionsText="Kota tidak ditemukan"
                  isError={!!errors.city}
                />
                {!!errors.city ? (
                  <span className={inputDateStyles.errorText}>
                    {errors.city}
                  </span>
                ) : null}
              </div>
              <div className={inputDateStyles.fieldWrapper}>
                <label className={inputDateStyles.titleText}>
                  Status Perkawinan
                </label>
                <InputSelect
                  ref={fieldRef.marriage}
                  id="marriage"
                  name="marriage"
                  value={values.marriage || ''}
                  onChange={(value) => {
                    setFieldValue('marriage', value)
                  }}
                  onFocusInput={() => {
                    trackEventCountly(
                      CountlyEventNames.WEB_KTP_EDIT_PAGE_MARITAL_STATUS_CLICK,
                    )
                  }}
                  options={[
                    { value: 'Belum Kawin', label: 'Belum Kawin' },
                    {
                      value: 'Kawin',
                      label: 'Kawin',
                    },
                    {
                      value: 'Cerai Hidup',
                      label: 'Cerai Hidup',
                    },
                    {
                      value: 'Cerai Mati',
                      label: 'Cerai Mati',
                    },
                  ]}
                  placeholderText="Pilih Status Perkawinan"
                  onBlurInput={handleBlur('marriage')}
                  isError={!!errors.marriage && touched.marriage}
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
                  datatestid={elementId.Profil.Dropdown.StatusPerkawinan}
                />
                {!!errors.marriage && touched.marriage ? (
                  <span className={inputDateStyles.errorText}>
                    {errors.marriage}
                  </span>
                ) : null}
              </div>
              <div
                className={inputDateStyles.fieldWrapper}
                ref={fieldRef.birthdate}
              >
                <DatePicker
                  title="Tanggal Lahir"
                  placeholder="DD/MM/YYYY"
                  value={new Date(values.birthdate)}
                  min={dayjs().add(-100, 'year').toDate()}
                  max={dayjs().add(-17, 'year').toDate()}
                  name="birthdate"
                  data-testid={elementId.DatePicker.DOB}
                  onConfirm={(val: Date) => {
                    setFieldValue('birthdate', dayjs(val).format('YYYY-MM-DD'))
                    setErrors({ ...errors, birthdate: '' })
                  }}
                  onOpenDate={(open) => {
                    if (open)
                      trackEventCountly(
                        CountlyEventNames.WEB_KTP_EDIT_PAGE_DOB_CLICK,
                      )
                  }}
                  isError={!!errors.birthdate && touched.birthdate}
                  errorMessage={errors.birthdate}
                  onBlurInput={(e) => handleBlur(e)}
                />
              </div>
              <Button
                onClick={() => {
                  handleSubmit()
                  checkScrollError()
                  setErrorMessage(null)
                  if (!navigator.onLine) {
                    setErrorMessage(lostConnectionMessage)
                    return
                  }
                  trackProfileSaveKtpChanges()
                }}
                version={ButtonVersion.PrimaryDarkBlue}
                size={ButtonSize.Big}
                data-testid={elementId.Profil.Button.Konfirmasi}
                loading={isLoadingSubmit}
                disabled={isLoadingSubmit || isLoadingCustomer}
              >
                Konfirmasi
              </Button>
            </section>
          )}
        </main>
      </div>
      <Toast
        text={toast}
        typeToast={toastType}
        maskClosable
        closeOnToastClick
        open={Boolean(toast)}
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
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
        }}
        onCancelText={() => {
          setIsModalOpen(false)
          saveSessionStorage(
            SessionStorageKey.LastVisitedPageKKIAFlow,
            window.location.pathname,
          )
          trackEventCountly(
            CountlyEventNames.WEB_KTP_PAGE_NIK_DOUBLED_POPUP_CTA_CLICK,
          )
          router.push(
            cameraKtpUrl + `${isSpouse ? uploadKtpSpouseQueryParam : ''}`,
          )
        }}
        cancelText="Foto Ulang"
        title="KTP Sudah Terdaftar"
        subTitle={getPopupErrorSubtitle()}
        width={346}
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
export default KtpForm
