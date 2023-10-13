import React, {
  ChangeEvent,
  MutableRefObject,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { getSessionStorage } from 'utils/handler/sessionStorage'
import styles from 'styles/pages/multi-kk.module.scss'
import stylex from 'styles/components/molecules/searchWidget/tenureOptionWidget.module.scss'
import { Slider } from 'antd'
import { colors } from 'styles/colors'
import { filterNonDigitCharacters } from 'utils/stringUtils'
import clsx from 'clsx'
import Fuse from 'fuse.js'
import dayjs from 'dayjs'
import elementId from 'helpers/elementIds'
import { AxiosResponse } from 'axios'
import { useProtectPage } from 'utils/hooks/useProtectPage/useProtectPage'
import { useRouter } from 'next/router'
import { getCity } from 'utils/hooks/useCurrentCityOtr/useCurrentCityOtr'
import {
  initEmptyData,
  useMultiUnitQueryContext,
} from 'services/context/multiUnitQueryContext'
import { CityOtrOption, Option } from 'utils/types'
import { usePriceRange } from 'utils/hooks/usePriceRange'
import { useDownPayment } from 'utils/hooks/useDownPayment'
import { getToken } from 'utils/handler/auth'
import { LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { occupations } from 'utils/occupations'
import { api } from 'services/api'
import {
  AnnouncementBoxDataType,
  FormControlValue,
  MultKKCarRecommendation,
  SendMultiKualifikasiKredit,
} from 'utils/types/utils'
import { MinAmount } from 'utils/types/models'
import {
  MinAmountMessage,
  overMaxTwoWarning,
  overMaxWarning,
  RequiredFunnelErrorMessage,
  underMinTwoWarning,
  underMinWarning,
} from 'utils/config/funnel.config'
import { Currency } from 'utils/handler/calculation'
import { getOptionValue } from 'utils/handler/optionLabel'
import { multiResultCreditQualificationPageUrl } from 'utils/helpers/routes'
import { HeaderMobile } from 'components/organisms'
import {
  Button,
  IconChevronDown,
  IconEdit,
  Input,
  InputSelect,
} from 'components/atoms'
import { CitySelectorModal, FooterMobile } from 'components/molecules'
import { MobileView } from 'components/atoms/mobileView'
import { DatePicker } from 'components/atoms/inputDate'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { NotFoundMultiUnit } from 'components/organisms/NotFoundMultiUnitModal'
import Seo from 'components/atoms/seo'
import { defaultSeoImage } from 'utils/helpers/const'
import { getCustomerInfoSeva } from 'utils/handler/customer'

const initErrorFinancial = {
  downPaymentAmount: '' as any,
  tenure: '',
  monthlyIncome: '',
  transmission: '',
  occupation: '',
}

const searchOption = {
  keys: ['label'],
  isCaseSensitive: false,
  includeScore: true,
  threshold: 0.3,
}

const MultiKK = () => {
  useProtectPage()
  const router = useRouter()
  const currentCity = getCity()
  const { setMultiUnitQuery } = useMultiUnitQueryContext()
  const [isOpenCitySelectorModal, setIsOpenCitySelectorModal] = useState(false)
  const [cityListApi, setCityListApi] = useState<Array<CityOtrOption>>([])
  const [openNotFound, setOpenNotFound] = useState(false)
  const [loadSubmit, setLoadSubmit] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const priceRangeRef = useRef() as MutableRefObject<HTMLDivElement>
  const {
    price,
    limitPrice,
    rawPrice,
    errorMaxField,
    errorMinField,
    errorMinTwoField,
    errorMaxTwoField,
    onChangeSlider,
    onChangeInputMaximum,
    onChangeInputMinimum,
  } = usePriceRange() // trying separation of concern
  const { errorDownPayment } = useDownPayment()
  const [multiForm, setMultiForm] = useState(initEmptyData)
  const [errorFinance, setErrorFinance] = useState(initErrorFinancial)
  const [showAnnouncementBox, setIsShowAnnouncementBox] = useState<
    boolean | null
  >(
    getSessionStorage(
      getToken()
        ? SessionStorageKey.ShowWebAnnouncementLogin
        : SessionStorageKey.ShowWebAnnouncementNonLogin,
    ) ?? true,
  )

  const errorMin = () => {
    return Boolean(errorMinField.min || errorMinField.max || errorMinTwoField)
  }

  const errorMax = () => {
    return Boolean(errorMaxField.max || errorMaxField.min || errorMaxTwoField)
  }

  const [modelOccupationListOptionsFull] = useState<Option<string>[]>(
    occupations.options,
  )
  const [, setLastChoosenValue] = useState('')
  const [suggestionsLists, setSuggestionsLists] = useState<Option<string>[]>([])
  const [customerDob, setCustomerDob] = useState('')

  const limitMinimumDp = useMemo(() => {
    if (!multiForm.priceRangeGroup) return limitPrice.min * 0.2

    const currentMinimumPrice = multiForm.priceRangeGroup.split('-')[0]
    return Number(currentMinimumPrice) * (20 / 100)
  }, [multiForm.priceRangeGroup, limitPrice.min])

  const limitMaximumDp = useMemo(() => {
    if (!multiForm.priceRangeGroup) return limitPrice.max * (90 / 100)

    const currentMaximumPrice = multiForm.priceRangeGroup.split('-')[1]
    return Number(currentMaximumPrice) * 0.9
  }, [multiForm.priceRangeGroup, limitPrice.max])

  const getAnnouncementBox = () => {
    api
      .getAnnouncementBox({
        headers: {
          'is-login': getToken() ? 'true' : 'false',
        },
      })
      .then((res: AxiosResponse<{ data: AnnouncementBoxDataType }>) => {
        if (res.data === undefined) {
          setIsShowAnnouncementBox(false)
        }
      })
  }

  const checkCitiesData = () => {
    if (cityListApi.length === 0) {
      api.getCities().then((res) => {
        setCityListApi(res)
      })
    }
  }

  const getCustomerInfo = () => {
    getCustomerInfoSeva().then((response) => {
      if (!!response[0].dob) {
        setCustomerDob(response[0].dob)
        setMultiForm((prev) => ({ ...prev, dob: response[0].dob }))
      }
    })
  }

  const checkDP = (value: number) => {
    let downPaymentAmount = ''
    if (value) {
      if (value < MinAmount.downPaymentAmount) {
        downPaymentAmount = MinAmountMessage.downPayemntAmount
      } else {
        if (!isValidElement(errorFinance.downPaymentAmount))
          downPaymentAmount = ''
      }
    }

    setErrorFinance((prev) => ({ ...prev, downPaymentAmount }))
  }

  const errorIncome = (value: number) => {
    if (!value) return RequiredFunnelErrorMessage.monthlyIncome

    if (value < MinAmount.monthlyIncome) return MinAmountMessage.monthlyIncome

    return ''
  }

  const checkIncome = (value: number) => {
    let monthlyIncome = ''
    if (value) {
      monthlyIncome = errorIncome(value)
    }

    setErrorFinance((prev) => ({ ...prev, monthlyIncome }))
  }

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value
    const repalceRp = val.replace('Rp', '')
    const name = event.target.name
    const rawVal = filterNonDigitCharacters(repalceRp)

    if (val === '0') return

    setMultiForm((prev) => ({
      ...prev,
      [name]: Boolean(rawVal) ? `Rp${Currency(rawVal)}` : '',
    }))

    if (name === 'downPaymentAmount') {
      checkDP(Number(rawVal))
    } else if (name === 'monthlyIncome') {
      checkIncome(Number(rawVal))
    }
  }

  const onChoose = (key: string, value: string) => {
    setMultiForm((prev) => ({ ...prev, [key]: value }))
  }

  const onChangeInputHandler = (value: string) => {
    if (value === '') {
      setLastChoosenValue('')
    }

    setMultiForm((prev) => ({
      ...prev,
      occupation: value
        .toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' '),
    }))
  }

  const onChooseHandler = (item: Option<FormControlValue>) => {
    setLastChoosenValue(String(item.value))
    setMultiForm((prev) => ({ ...prev, occupation: String(item.label) }))
  }

  const gotoPriceRange = () => {
    priceRangeRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
    const timoeout = setTimeout(() => {
      priceRangeRef.current.click()
      clearTimeout(timoeout)
    }, 400)
  }

  const enableSubmit = useMemo(() => {
    return Boolean(
      multiForm.downPaymentAmount &&
        multiForm.monthlyIncome &&
        multiForm.occupation &&
        price.max &&
        price.min &&
        multiForm.tenure &&
        multiForm.transmission.length > 0 &&
        multiForm.dob,
    )
  }, [multiForm, price])

  const checkEmpty = (): boolean => {
    const { downPaymentAmount } = multiForm

    if (!downPaymentAmount) return true

    const formatRawDP = filterNonDigitCharacters(
      downPaymentAmount.replace('Rp', ''),
    )

    if (
      !errorDownPayment(
        Number(formatRawDP),
        limitMaximumDp,
        limitMinimumDp,
        gotoPriceRange,
      )
    )
      return true

    setErrorFinance((prev) => ({
      ...prev,
      downPaymentAmount: errorDownPayment(
        Number(formatRawDP),
        limitMaximumDp,
        limitMinimumDp,
        gotoPriceRange,
      ),
    }))

    return false
  }

  const filteredCarList = (list: MultKKCarRecommendation[]) => {
    const temp = list.filter(
      (item) => item.creditQualificationStatus.toLowerCase() !== 'sulit',
    )
    return temp
  }

  const submit = () => {
    if (!checkEmpty()) return
    setLoadSubmit(true)
    const fmtDp = filterNonDigitCharacters(
      multiForm.downPaymentAmount.replace('Rp', ''),
    )
    const fmtIncome = filterNonDigitCharacters(
      multiForm.monthlyIncome.replace('Rp', ''),
    )
    const sendData: SendMultiKualifikasiKredit = {
      cityId: Number(getCity().id),
      city: getCity().cityCode,
      priceRangeGroup: multiForm.priceRangeGroup,
      recommendationType: 'downPayment',
      dpType: 'amount',
      maxDpAmount: fmtDp,
      monthlyIncome: Number(fmtIncome),
      tenure: Number(multiForm.tenure),
      sortBy: 'lowToHigh',
      dob: multiForm.dob,
      occupation: getOptionValue(
        occupations.options,
        multiForm.occupation,
      ) as string,
      ...(multiForm.transmission.length === 1 && {
        transmission: multiForm.transmission[0],
      }),
    }

    api
      .postMultiCreditQualification(sendData, {
        headers: { Authorization: getToken()?.idToken },
      })
      .then((result) => {
        const carListNonSulit = filteredCarList(result.carRecommendations)
        if (
          result.carRecommendations.length === 0 ||
          carListNonSulit.length === 0
        ) {
          setMultiUnitQuery({
            ...multiForm,
            downPaymentAmount: fmtDp,
            monthlyIncome: fmtIncome,
            cityName: currentCity?.cityName,
          })
          setOpenNotFound(true)
        } else {
          setMultiUnitQuery({
            ...multiForm,
            downPaymentAmount: fmtDp,
            monthlyIncome: fmtIncome,
            cityName: currentCity?.cityName,
            multikkResponse: result,
            filteredCarList: carListNonSulit,
          })
          router.push(multiResultCreditQualificationPageUrl)
        }
        setLoadSubmit(false)
      })
      .catch((e) => {
        if (e?.response?.status === 400) {
          setMultiUnitQuery({
            ...multiForm,
            downPaymentAmount: fmtDp,
            monthlyIncome: fmtIncome,
            cityName: currentCity?.cityName,
          })
          setOpenNotFound(true)
        }

        setLoadSubmit(false)
      })
  }

  useEffect(() => {
    checkCitiesData()
    getAnnouncementBox()
    if (!!getToken()) {
      getCustomerInfo()
    }
    localStorage.removeItem(LocalStorageKey.SelectablePromo)
  }, [])

  useEffect(() => {
    if (multiForm.occupation === '') {
      setSuggestionsLists(modelOccupationListOptionsFull)
      return
    }

    const fuse = new Fuse(modelOccupationListOptionsFull, searchOption)
    const suggestion = fuse.search(multiForm.occupation)
    const result = suggestion.map((obj) => obj.item)

    const sorted = result.sort((a: any, b: any) => {
      if (
        a.label.startsWith(multiForm.occupation) &&
        b.label.startsWith(multiForm.occupation)
      )
        return a.label.localeCompare(b.label)
      else if (a.label.startsWith(multiForm.occupation)) return -1
      else if (b.label.startsWith(multiForm.occupation)) return 1

      return a.label.localeCompare(b.label)
    })

    setSuggestionsLists(sorted)
  }, [multiForm.occupation, modelOccupationListOptionsFull])

  useEffect(() => {
    if (rawPrice.max && rawPrice.min) {
      setMultiForm((prev) => ({
        ...prev,
        priceRangeGroup: `${rawPrice.min}-${rawPrice.max}`,
      }))
    }
  }, [rawPrice])

  return (
    <>
      <Seo
        title="SEVA - Beli Mobil Terbaru Dengan Cicilan Kredit Terbaik"
        description="Beli mobil terbaru dari Toyota, Daihatsu, BMW dengan Instant Approval*. Proses Aman & Mudah✅ Terintegrasi dengan ACC & TAF✅ SEVA member of ASTRA"
        image={defaultSeoImage}
      />
      <HeaderMobile
        isActive={isActive}
        setIsActive={setIsActive}
        emitClickCityIcon={() => setIsOpenCitySelectorModal(true)}
        setShowAnnouncementBox={setIsShowAnnouncementBox}
        isShowAnnouncementBox={showAnnouncementBox}
      />
      <MobileView
        className={clsx({
          [styles.container]: !showAnnouncementBox,
          [styles.contentWithSpace]: showAnnouncementBox,
          [styles.announcementboxpadding]: showAnnouncementBox,
          [styles.announcementboxpadding]: false,
        })}
      >
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>Ingin Cari Mobil Sesuai Budgetmu?</h1>
          <span className={styles.info}>
            Lengkapi data di bawah ini agar SEVA bisa kasih rekomendasi sesuai
            yang kamu cari!
          </span>
        </div>
        <div>
          <div className={styles.cityWrapper}>
            <span className={styles.kisaran}>Kisaran Harga di</span>
            <span
              className={styles.linkCity}
              onClick={() => setIsOpenCitySelectorModal(true)}
            >
              {currentCity.cityName}
            </span>
            <div role="button" onClick={() => setIsOpenCitySelectorModal(true)}>
              <IconEdit width={16} height={16} color={colors.primaryBlue} />
            </div>
          </div>
          <div className={styles.formRange} ref={priceRangeRef}>
            <div>
              <Input
                maxLength={15}
                type="tel"
                title="Minimum Harga"
                defaultValue={price.min ? 'Rp' + price.min : price.min}
                onChange={onChangeInputMinimum}
                placeholder="Masukkan harga"
                isError={errorMin()}
                value={price.min ? 'Rp' + price.min : price.min}
              />
              {(errorMinField.min || errorMinField.max) &&
                !errorMinTwoField && (
                  <span className={styles.errorText}>
                    {errorMinField.min
                      ? underMinWarning
                      : errorMinField.max
                      ? overMaxWarning
                      : ''}
                  </span>
                )}
              {(!errorMinField.min || !errorMinField.max) &&
                errorMinTwoField && (
                  <span className={styles.errorText}>{overMaxTwoWarning}</span>
                )}
            </div>
            <div>
              <Input
                maxLength={15}
                type="tel"
                title="Maksimum Harga"
                defaultValue={price.max ? 'Rp' + price.max : price.max}
                value={price.max ? 'Rp' + price.max : price.max}
                onChange={onChangeInputMaximum}
                placeholder="Masukkan harga"
                isError={errorMax()}
              />
              {(errorMaxField.max || errorMaxField.min) &&
                !errorMaxTwoField && (
                  <span className={styles.errorText}>
                    {errorMaxField.min
                      ? underMinWarning
                      : errorMaxField.max
                      ? overMaxWarning
                      : ''}
                  </span>
                )}
              {(!errorMaxField.min || !errorMaxField.max) &&
                errorMaxTwoField && (
                  <span className={styles.errorText}>{underMinTwoWarning}</span>
                )}
            </div>
            <div className={styles.slider}>
              <Slider
                range
                min={limitPrice.min}
                max={limitPrice.max}
                step={1000000}
                className={clsx({
                  ['multiKKSliderError']: errorMin() || errorMax(),
                })}
                onChange={onChangeSlider}
                defaultValue={[
                  rawPrice.min || limitPrice.min,
                  rawPrice.max || limitPrice.max,
                ]}
                value={[
                  rawPrice.min || limitPrice.min,
                  rawPrice.max || limitPrice.max,
                ]}
                trackStyle={[
                  {
                    backgroundColor:
                      errorMin() || errorMax()
                        ? colors.primaryRed
                        : colors.primarySkyBlue,
                  },
                ]}
              />
            </div>
            <div className={styles.textWrapperSlider}>
              <div className={styles.left}>
                Rp{Currency(String(limitPrice.min))}
              </div>
              <div className={styles.right}>
                Rp{Currency(String(limitPrice.max))}
              </div>
            </div>
          </div>
          <div className={styles.form}>
            <div>
              <Input
                maxLength={15}
                type="tel"
                name="downPaymentAmount"
                title="Maksimum DP"
                placeholder="Masukkan DP"
                isError={Boolean(errorFinance.downPaymentAmount)}
                value={multiForm.downPaymentAmount}
                onChange={onChange}
              />
              {errorFinance.downPaymentAmount && (
                <span className={styles.errorText}>
                  {errorFinance.downPaymentAmount}
                </span>
              )}
            </div>
            <div>
              <Input
                maxLength={15}
                type="tel"
                name="monthlyIncome"
                title="Pendapatan Bulanan"
                placeholder="Masukkan Pendapatan"
                isError={Boolean(errorFinance.monthlyIncome)}
                value={multiForm.monthlyIncome}
                onChange={onChange}
              />
              {errorFinance.monthlyIncome && (
                <span className={styles.errorText}>
                  {errorFinance.monthlyIncome}
                </span>
              )}
            </div>
            <div>
              <span className={styles.textTitle}>Tenor (Tahun)</span>
              <div
                className={stylex.containerTenure}
                style={{ marginBottom: 0, marginTop: 8, padding: 0 }}
              >
                {[1, 2, 3, 4, 5].map((item, index) => (
                  <div
                    className={clsx({
                      [stylex.box]: true,
                      [stylex.active]:
                        String(multiForm.tenure) === String(item),
                    })}
                    key={index}
                    onClick={() => {
                      if (multiForm.tenure === String(item))
                        onChoose('tenure', '')
                      else onChoose('tenure', String(item))
                    }}
                  >
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              {errorFinance.tenure && (
                <span className={styles.errorText}>{errorFinance.tenure}</span>
              )}
            </div>
            <div>
              <span className={styles.textTitle}>Transmisi</span>
              <div
                className={stylex.containerTenure}
                style={{ marginBottom: 0, marginTop: 8, padding: 0 }}
              >
                {['Manual', 'Otomatis'].map((item, index) => (
                  <div
                    style={{ width: '47%', height: 44 }}
                    className={clsx({
                      [stylex.box]: true,
                      [stylex.active]: multiForm.transmission.includes(item),
                    })}
                    key={index}
                    onClick={() => {
                      let currentTransmission = multiForm.transmission
                      if (multiForm.transmission.some((x) => x === item)) {
                        const filterCurrent = multiForm.transmission.filter(
                          (x) => x !== item,
                        )
                        currentTransmission = filterCurrent
                      } else {
                        currentTransmission = [...currentTransmission, item]
                      }
                      setMultiForm((prev) => ({
                        ...prev,
                        transmission: currentTransmission,
                      }))
                    }}
                  >
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              {errorFinance.transmission && (
                <span className={styles.errorText}>
                  {errorFinance.transmission}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span className={styles.textTitle}>Pekerjaan</span>
              <InputSelect
                value={multiForm.occupation}
                options={suggestionsLists}
                onChange={onChangeInputHandler}
                onChoose={onChooseHandler}
                placeholderText="Pilih Pekerjaan"
                noOptionsText="Pekerjaan tidak ditemukan"
                isSearchable={true}
                rightIcon={
                  <IconChevronDown width={24} height={24} color={'#13131B'} />
                }
                isError={Boolean(errorFinance.occupation)}
              />
              {errorFinance.occupation && (
                <span className={styles.errorText}>
                  {errorFinance.occupation}
                </span>
              )}
            </div>
            {!customerDob ? (
              <DatePicker
                title="Tanggal Lahir"
                placeholder="DD/MM/YYYY"
                value={dayjs(multiForm.dob).toDate()}
                min={dayjs().add(-100, 'year').toDate()}
                max={dayjs().add(-17, 'year').toDate()}
                name="dob"
                data-testid={elementId.DatePicker.DOB}
                onConfirm={(val: Date) => {
                  onChoose('dob', dayjs(val).format('YYYY-MM-DD'))
                }}
              />
            ) : (
              <></>
            )}
            <Button
              version={ButtonVersion.PrimaryDarkBlue}
              size={ButtonSize.Big}
              onClick={submit}
              disabled={loadSubmit || !enableSubmit}
              loading={loadSubmit}
            >
              Lihat Rekomendasi Mobil
            </Button>
          </div>
        </div>
      </MobileView>
      <FooterMobile />
      <CitySelectorModal
        isOpen={isOpenCitySelectorModal}
        onClickCloseButton={() => setIsOpenCitySelectorModal(false)}
        cityListFromApi={cityListApi}
      />
      <NotFoundMultiUnit
        open={openNotFound}
        onAdjustForm={() => {
          setOpenNotFound(false)
        }}
        onCancel={() => setOpenNotFound(false)}
      />
    </>
  )
}

export default MultiKK
