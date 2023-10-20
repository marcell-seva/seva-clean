import React, { useState, useEffect } from 'react'
import styles from 'styles/pages/ktp-edit.module.scss'
import inputDateStyles from 'styles/components/atoms/inputDate.module.scss'
import elementId from 'helpers/elementIds'
import dayjs from 'dayjs'

import Fuse from 'fuse.js'
import { useRouter } from 'next/router'
import { useQuery } from 'utils/hooks/useQuery'
import { CustomerKtpSeva } from 'utils/types/utils'
import { useGalleryContext } from 'services/context/galleryContext'
import { object, string, InferType } from 'yup'
import { useFormik } from 'formik'
import {
  getSessionStorage,
  saveSessionStorage,
} from 'utils/handler/sessionStorage'
import { LocalStorageKey, SessionStorageKey } from 'utils/enum'
import {
  cameraKtpUrl,
  ktpReviewUrl,
  uploadKtpSpouseQueryParam,
} from 'utils/helpers/routes'
import {
  Button,
  IconChevronDown,
  IconChevronLeft,
  IconChevronUp,
  Input,
  InputSelect,
  Skeleton,
  Toast,
} from 'components/atoms'
import { ProgressBar } from 'components/atoms/progressBar'
import InputPrefix from 'components/atoms/input/inputPrefix'
import { DatePicker } from 'components/atoms/inputDate'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { ToastV2 } from 'components/atoms/toastV2'
import { ToastType } from 'utils/types/models'

import { trackProfileSaveKtpChanges } from 'helpers/amplitude/seva20Tracking'
import PopupError from 'components/organisms/popupError'
import { getLocalStorage } from 'utils/handler/localStorage'
import Seo from 'components/atoms/seo'
import { defaultSeoImage } from 'utils/helpers/const'
import Image from 'next/image'
import { api } from 'services/api'
import { checkNIKAvailable } from 'utils/handler/customer'

const LogoPrimary = '/revamp/icon/logo-primary.webp'

const lostConnectionMessage =
  'Oops, koneksi Anda terputus. Silahkan coba kembali.'

const checkFirstCharacter = /^(?! |.* {2})[a-zA-Z ]*$/
const checkRtRwCharacter = /^[0-9]{1,3}\/[0-9]{1,3}$/

const searchOption = {
  keys: ['label'],
  isCaseSensitive: false,
  includeScore: true,
  threshold: 0.1,
}

const KtpForm = () => {
  const router = useRouter()
  const { ktpType }: { ktpType: string } = useQuery(['ktpType'])
  const isSpouse = ktpType && ktpType.toLowerCase() === 'spouse'
  const [toast, setToast] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [cityListFromApi, setCityListFromApi] = useState<any>([])
  const [cityList, setCityList] = useState<any>([])
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

  const userSchema = object().shape({
    nik: string()
      .matches(/^\d{16}$/, {
        message: 'NIK harus terdiri atas 16 digit.',
      })
      .required('Wajib diisi.'),
    name: string().required('Wajib diisi.'),
    address: string().required('Wajib diisi.'),
    rtrw: string()
      .matches(/^.{7,}$/, { message: 'RT/RW harus terdiri atas 6 digit.' })
      .required('Wajib diisi.'),
    kel: string().required('Wajib diisi.'),
    kec: string().required('Wajib diisi.'),
    marriage: string()
      .required('Wajib diisi.')
      .oneOf(
        ['Belum Kawin', 'Kawin', 'Cerai Hidup', 'Cerai Mati'],
        'Harap pilih opsi yang tersedia.',
      ),
    birthdate: string().required('Wajib diisi.'),
    city: string().required('Wajib diisi.'),
  })

  type UserForm = InferType<typeof userSchema>

  const {
    values,
    errors,
    setFieldError,
    handleBlur,
    touched,
    setFieldValue,
    dirty,
    isValid,
    handleSubmit,
  } = useFormik<UserForm>({
    initialValues: {
      nik: customerKtp?.nik || '',
      name: customerKtp?.name || '',
      address: checkFirstCharacter.test(customerKtp?.address)
        ? customerKtp.address
        : '',
      rtrw: checkRtRwCharacter.test(customerKtp?.rtrw) ? customerKtp.rtrw : '',
      kel: checkFirstCharacter.test(customerKtp?.kel) ? customerKtp.kel : '',
      kec: checkFirstCharacter.test(customerKtp?.kec) ? customerKtp.kec : '',
      marriage: customerKtp?.marriage || '',
      birthdate: !isNaN(new Date(customerKtp.birthdate).getTime())
        ? customerKtp.birthdate
        : '',
      city: customerKtp?.city || '',
    },
    onSubmit: async (value) => {
      setIsLoadingSubmit(true)
      const marriagePayload = value.marriage
        ? { marriage: value.marriage }
        : ({} as { marriage: string })
      try {
        const data = await checkNIKAvailable(value.nik)
        if (data.code === 'KTP has been used') {
          setIsModalOpen(true)
        } else {
          if (isSpouse) {
            const dataPersonal = getSessionStorage(
              SessionStorageKey.DataUploadKTP,
            ) as any
            if (dataPersonal) {
              if (value.nik === dataPersonal.nik) {
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
          router.push(ktpReviewUrl)
          // const ocrktpJourney = getSessionStorage(SessionStorageKey.OCRKTP)
          // if (localStorage.getItem('change_ktp') === 'true') {
          //   localStorage.removeItem('change_ktp')
          //   router.push(successChangeKtpUrl)
          // } else {
          //   if (ocrktpJourney === 'profile') {
          //     sessionStorage.removeItem(SessionStorageKey.OCRKTP)
          //     router.push(successKtpUrl)
          //   } else {

          //   }
          // }
        }
      } catch (e) {
        console.error(e)
      }
    },
    validateOnBlur: true,
    validationSchema: userSchema,
    enableReinitialize: true,
  })

  const isNeedComplete = (obj: CustomerKtpSeva | UserForm | undefined) => {
    return (
      !obj?.nik ||
      !obj?.name ||
      !obj?.address ||
      !obj?.kec ||
      !obj?.kel ||
      !obj?.rtrw ||
      !obj?.marriage ||
      !obj?.birthdate ||
      !obj?.city
    )
  }

  const checkCitiesData = (city: string) => {
    if (cityListFromApi.length === 0) {
      api.getCities().then((res) => {
        if (res) {
          const cityOptions = res.map((item: any) => ({
            label: item.cityName,
            value: item.cityName,
          }))
          setCityListFromApi(cityOptions)
          setCityList(cityOptions)
          checkCityOCR(cityOptions, city)
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
      getLocalStorage(LocalStorageKey.ChangeKtp) !== 'true' &&
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
      setFieldError('city', 'Kota tidak terdaftar di SEVA.')
      return false
    }

    return true
  }

  useEffect(() => {
    if (sessionStorage.getItem('isProfileUpdated') === 'true') {
      setToast('Perubahan akun berhasil disimpan.')
      setTimeout(() => {
        setToast('')
      }, 3000)
      sessionStorage.removeItem('isProfileUpdated')
    }
    if (getLocalStorage(LocalStorageKey.FormKtp)) {
      const data: any = getLocalStorage(LocalStorageKey.FormKtp) || {}
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
      checkCitiesData(data.city)
    }

    if (!galleryFile) {
      router.push(cameraKtpUrl)
    }
  }, [])

  return (
    <>
      <Seo
        title="SEVA - Beli Mobil Terbaru Dengan Cicilan Kredit Terbaik"
        description="Beli mobil terbaru dari Toyota, Daihatsu, BMW dengan Instant Approval*. Proses Aman & Mudah✅ Terintegrasi dengan ACC & TAF✅ SEVA member of ASTRA"
        image={defaultSeoImage}
      />
      <div className={styles.form_header}>
        <div className={styles.back__button} onClick={() => router.back()}>
          <IconChevronLeft width={24} height={24} color="#13131B" />
        </div>
        <div className={styles.logo}>
          <Image src={LogoPrimary} alt="back" />
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
                className={styles.ktp__preview__image}
              />
              <Input
                title="NIK"
                value={values.nik}
                placeholder="Masukkan NIK"
                name="nik"
                id="nik"
                onChange={(e) => {
                  const enteredValue = e.target.value
                  let formattedValue = enteredValue.replace(/\D/g, '')
                  if (formattedValue.length > 16) {
                    formattedValue = formattedValue.slice(0, 16)
                  }
                  setFieldValue('nik', formattedValue)
                }}
                onBlur={handleBlur}
                isError={!!errors.nik && touched.nik}
                message={errors.nik}
                dataTestId={elementId.Input.NIK}
              />
              <Input
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
                onBlur={handleBlur}
                isError={!!errors.name && touched.name}
                message={errors.name}
                dataTestId={elementId.Input.Name}
              />
              <div className={styles.addressWraper}>
                <Input
                  title="Alamat"
                  value={values.address}
                  placeholder="Masukkan Alamat"
                  name="address"
                  id="address"
                  onChange={(e) => {
                    const re = /^(?! |.* {2}).*$/
                    if (
                      (e.target.value === '' || re.test(e.target.value)) &&
                      checkFirstCharacter.test(e.target.value[0])
                    ) {
                      setFieldValue('address', e.target.value)
                    }
                  }}
                  onBlur={handleBlur}
                  isError={!!errors.address && touched.address}
                  message={errors.address}
                  dataTestId={elementId.Input.Address}
                />
                <InputPrefix
                  title="RT/RW"
                  value={values.rtrw}
                  placeholder="Masukkan RT/RW"
                  id="rtrw"
                  isError={!!errors.rtrw && touched.rtrw}
                  message={errors.rtrw}
                  onBlur={handleBlur('rtrw')}
                  onChange={(e) => {
                    const enteredValue = e.target.value
                    let formattedValue = enteredValue.replace(/\D/g, '')

                    if (formattedValue.length > 3) {
                      formattedValue =
                        formattedValue.slice(0, 3) +
                        '/' +
                        formattedValue.substring(3, 6)
                    }

                    setFieldValue('rtrw', formattedValue)
                  }}
                  dataTestId={elementId.Input.RTRW}
                />
                <InputPrefix
                  title="Kel/Desa"
                  value={values.kel}
                  id="kel"
                  placeholder="Masukkan Kelurahan/Desa"
                  isError={!!errors.kel && touched.kel}
                  onBlur={handleBlur('kel')}
                  message={errors.kel}
                  onChange={(e) => {
                    const re = /^(?! |.* {2}).*$/
                    if (
                      (e.target.value === '' || re.test(e.target.value)) &&
                      checkFirstCharacter.test(e.target.value[0])
                    ) {
                      setFieldValue('kel', e.target.value)
                    }
                  }}
                  dataTestId={elementId.Input.KelurahanDesa}
                />

                <InputPrefix
                  title="Kecamatan"
                  value={values.kec}
                  placeholder="Masukkan Kecamatan"
                  id="kec"
                  isError={!!errors.kec && touched.kec}
                  message={errors.kec}
                  onBlur={handleBlur('kec')}
                  onChange={(e) => {
                    const re = /^(?! |.* {2}).*$/
                    if (
                      (e.target.value === '' || re.test(e.target.value)) &&
                      checkFirstCharacter.test(e.target.value[0])
                    ) {
                      setFieldValue('kec', e.target.value)
                    }
                  }}
                  dataTestId={elementId.Input.Kecamatan}
                />
                <InputSelect
                  id="city"
                  name="city"
                  prefix="Kota"
                  value={values.city || ''}
                  options={cityList}
                  onChange={(value) => {
                    setFieldValue('city', value)
                    const listSuggestion = value
                      ? generateSuggestion(value)
                      : cityListWithTopCity()
                    setCityList(listSuggestion)
                  }}
                  onChoose={(value) => setFieldValue('city', value.value)}
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
                  <p className={inputDateStyles.errorText}>{errors.city}</p>
                ) : null}
              </div>
              <div>
                <label className={inputDateStyles.titleText}>
                  Status Perkawinan
                </label>
                <InputSelect
                  id="marriage"
                  name="marriage"
                  value={values.marriage || ''}
                  onChange={(value) => {
                    setFieldValue('marriage', value)
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
                  <p className={inputDateStyles.errorText}>{errors.marriage}</p>
                ) : null}
              </div>
              <div>
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
                  }}
                  isError={!!errors.birthdate && touched.birthdate}
                  errorMessage={errors.birthdate}
                  onBlurInput={(e) => handleBlur(e)}
                />
              </div>
              <Button
                onClick={() => {
                  handleSubmit()
                  setErrorMessage(null)
                  if (!navigator.onLine) {
                    setErrorMessage(lostConnectionMessage)
                    return
                  }
                  trackProfileSaveKtpChanges()
                }}
                version={ButtonVersion.PrimaryDarkBlue}
                size={ButtonSize.Big}
                disabled={
                  isNeedComplete(values) ||
                  !dirty ||
                  !isValid ||
                  isLoadingSubmit ||
                  !checkCityOCR(cityListFromApi, values.city)
                }
                data-testid={elementId.Profil.Button.Konfirmasi}
              >
                Konfirmasi
              </Button>
            </section>
          )}
        </main>
      </div>
      {toast ? (
        <Toast
          text={toast}
          maskClosable
          closeOnToastClick
          onCancel={() => {
            setToast('')
          }}
        />
      ) : null}
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
