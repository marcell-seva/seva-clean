import React, {
  ChangeEvent,
  MutableRefObject,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import styles from 'styles/pages/multi-kk.module.scss'
import stylex from 'styles/components/molecules/searchWidget/tenureOptionWidget.module.scss'
import { Slider } from 'antd'
import { colors } from 'styles/colors'
import { filterNonDigitCharacters } from 'utils/stringUtils'
import clsx from 'clsx'
import Fuse from 'fuse.js'
import dayjs from 'dayjs'
import elementId from 'helpers/elementIds'
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

import {
  FormControlValue,
  MobileWebTopMenuType,
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
import { MobileView } from 'components/atoms/mobileView'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { NotFoundMultiUnit } from 'components/organisms/NotFoundMultiUnitModal'
import Seo from 'components/atoms/seo'
import { defaultSeoImage } from 'utils/helpers/const'
import { checkReferralCode, getCustomerInfoSeva } from 'utils/handler/customer'
import dynamic from 'next/dynamic'
import {
  getCities,
  getAnnouncementBox as gab,
  getMobileFooterMenu,
  getMobileHeaderMenu,
  postMultiCreditQualification,
} from 'services/api'
import { PageLayout } from 'components/templates'
import { useAnnouncementBoxContext } from 'services/context/announcementBoxContext'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { MobileWebFooterMenuType, temanSevaUrlPath } from 'utils/types/props'
import { useUtils } from 'services/context/utilsContext'
import { RouteName } from 'utils/navigate'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import {
  trackEventCountly,
  valueForUserTypeProperty,
  valueForInitialPageProperty,
} from 'helpers/countly/countly'
import {
  getSessionStorage,
  removeSessionStorage,
} from 'utils/handler/sessionStorage'
import { getLocalStorage } from 'utils/handler/localStorage'
import { FormReferralCode } from 'components/molecules/form/formReferralCode'
import { serverSideManualNavigateToErrorPage } from 'utils/handler/navigateErrorPage'

const DatePicker = dynamic(
  () => import('components/atoms/inputDate/datepicker'),
  { ssr: false },
)

const FooterMobile = dynamic(
  () => import('components/organisms').then((mod) => mod.FooterMobile),
  { ssr: false },
)

const CitySelectorModal = dynamic(() =>
  import('components/molecules').then((mod) => mod.CitySelectorModal),
)
const Toast = dynamic(
  () => import('components/atoms/toast').then((mod) => mod.Toast),
  { ssr: false },
)

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

const MultiKK = ({
  dataMobileMenu,
  dataFooter,
  dataCities,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  useProtectPage()
  const router = useRouter()
  const currentCity = getCity()
  const { setMultiUnitQuery } = useMultiUnitQueryContext()
  const [openNotFound, setOpenNotFound] = useState(false)
  const [notFoundMessage, setNotFoundMessage] = useState({
    desc: '',
    submit: '',
  })
  const [loadSubmit, setLoadSubmit] = useState(false)
  const [shake, setShake] = useState({ priceRange: false })
  const priceRangeRef = useRef() as MutableRefObject<HTMLDivElement>
  const dpRef = useRef() as MutableRefObject<HTMLDivElement>
  const incomeRef = useRef() as MutableRefObject<HTMLDivElement>
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
  const [isOpenToast, setIsOpenToast] = useState(false)
  const [toastMessage, setToastMessage] = useState(
    'Mohon maaf, terjadi kendala jaringan silahkan coba kembali lagi',
  )
  const { showAnnouncementBox } = useAnnouncementBoxContext()
  const {
    saveDataAnnouncementBox,
    saveMobileWebTopMenus,
    saveMobileWebFooterMenus,
    saveCities,
  } = useUtils()

  const getAnnouncementBox = async () => {
    try {
      const res: any = await gab({
        headers: {
          'is-login': getToken() ? 'true' : 'false',
        },
      })
      saveDataAnnouncementBox(res.data)
    } catch (error) {}
  }

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
  const referralCodeFromUrl: string =
    getLocalStorage(LocalStorageKey.referralTemanSeva) ?? ''
  const [connectedCode, setConnectedCode] = useState('')
  const [referralCodeInput, setReferralCodeInput] = useState('')
  const [currentUserOwnCode, setCurrentUserOwnCode] = useState('') // code that can be seen in teman seva dashboard
  const [isLoadingReferralCode, setIsLoadingReferralCode] = useState(false)
  const [isErrorReferralCodeInvalid, setIsErrorReferralCodeInvalid] =
    useState(false)
  const [isErrorRefCodeUsingOwnCode, setIsErrorRefCodeUsingOwnCode] =
    useState(false)
  const [isSuccessReferralCode, setisSuccessReferralCode] = useState(false)
  const [customerDob, setCustomerDob] = useState('')
  const [isOpenCitySelectorOTRPrice, setIsOpenCitySelectorOTRPrice] =
    useState(false)

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

  const getCurrentUserOwnCode = async () => {
    const axios = (await import('axios')).default
    axios
      .get(temanSevaUrlPath.profile, {
        headers: { phoneNumber: getToken()?.phoneNumber ?? '' },
      })
      .then((res) => {
        setCurrentUserOwnCode(res.data.temanSevaRefCode)
      })
      .catch(() => {})
  }

  const getCustomerInfo = () => {
    getCustomerInfoSeva().then((response) => {
      if (!!response[0].dob) {
        setCustomerDob(response[0].dob)
        setMultiForm((prev: any) => ({ ...prev, dob: response[0].dob }))
      }

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
      sendDataTracker(response[0].temanSevaTrxCode)
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

    setMultiForm((prev: any) => ({
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
    const timeout = setTimeout(() => {
      setShake({ priceRange: true })
      clearTimeout(timeout)
    }, 600)

    const timoeout2 = setTimeout(() => {
      priceRangeRef.current.click()
      setShake({ priceRange: false })
      clearTimeout(timoeout2)
    }, 400)
  }

  const enableSubmit = useMemo(() => {
    return Boolean(
      multiForm.downPaymentAmount &&
        multiForm.monthlyIncome &&
        multiForm.occupation &&
        (price.max || multiForm.priceRangeGroup) &&
        (price.min || multiForm.priceRangeGroup) &&
        multiForm.tenure &&
        multiForm.transmission &&
        multiForm.transmission.length > 0 &&
        multiForm.dob &&
        !errorMin() &&
        !errorMax(),
    )
  }, [multiForm, price])

  const checkEmpty = (): boolean => {
    const { downPaymentAmount } = multiForm

    if (!downPaymentAmount) return true

    const formatRawDP = filterNonDigitCharacters(
      downPaymentAmount.replace('Rp', ''),
    )

    const errorDp = errorDownPayment(
      Number(formatRawDP),
      limitMaximumDp,
      limitMinimumDp,
      gotoPriceRange,
    )

    if (!errorDp) {
      if (errorFinance.monthlyIncome) {
        incomeRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
        return false
      }
      return true
    } else {
      dpRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }

    setErrorFinance((prev: any) => ({
      ...prev,
      downPaymentAmount: errorDp,
    }))

    return false
  }

  const filteredCarList = (list: MultKKCarRecommendation[]) => {
    const temp = list
    return temp
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
          await checkReferralCode(value, getToken()?.phoneNumber ?? '')
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
      return 'Kode Teman SEVA ini tidak tersedia. Gunakan kode lainnya.'
    } else if (isErrorRefCodeUsingOwnCode) {
      return 'Kamu tidak bisa menggunakan kode referral milikmu sendiri.'
    } else {
      return 'Kode referral tidak ditemukan'
    }
  }

  const autofillRefCodeValue = () => {
    // priority : code from URL > code from register page
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

  const submit = async () => {
    const incomeAmount =
      Currency(filterNonDigitCharacters(String(multiForm.monthlyIncome)))
        .length === 0
        ? multiForm.monthlyIncome
        : `Rp${Currency(
            filterNonDigitCharacters(String(multiForm.monthlyIncome)),
          )}`

    const dpAmount =
      Currency(filterNonDigitCharacters(String(multiForm.downPaymentAmount)))
        .length === 0
        ? multiForm.downPaymentAmount
        : `Rp${Currency(
            filterNonDigitCharacters(String(multiForm.downPaymentAmount)),
          )}`

    let transmission
    if (multiForm.transmission.length === 2) {
      transmission =
        multiForm.transmission[0] + ' , ' + multiForm.transmission[1]
    } else transmission = multiForm.transmission[0]

    const data = {
      OTR_LOCATION: currentCity.cityName,
      MIN_PRICE: `Rp${Currency(
        filterNonDigitCharacters(
          String(multiForm.priceRangeGroup.split('-')[0]),
        ),
      )}`,
      MAX_PRICE: `Rp${Currency(
        filterNonDigitCharacters(
          String(multiForm.priceRangeGroup.split('-')[1]),
        ),
      )}`,
      INCOME_AMOUNT: incomeAmount,
      DP_AMOUNT: dpAmount,
      TENOR_OPTION: multiForm.tenure,
      CAR_TRANSMISSION: transmission,
      REFERRAL_CODE: referralCodeInput,
    }

    trackEventCountly(CountlyEventNames.WEB_MULTI_IA_PAGE_CTA_CLICK, data)
    if (!checkEmpty()) return

    const refCodeValidity = await checkRefCode(referralCodeInput)

    if (!refCodeValidity) return

    setLoadSubmit(true)
    const fmtDp = filterNonDigitCharacters(
      multiForm.downPaymentAmount.replace('Rp', ''),
    )
    const fmtIncome = multiForm.monthlyIncome.toString().includes('Rp')
      ? filterNonDigitCharacters(multiForm.monthlyIncome.replace('Rp', ''))
      : multiForm.monthlyIncome

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
      ...(multiForm.transmission.length === 1 && {
        transmission: multiForm.transmission[0],
      }),
      occupation: getOptionValue(
        occupations.options,
        multiForm.occupation,
      ) as string,
      tsTrxCode: isSuccessReferralCode ? referralCodeInput : '',
    }
    localStorage.setItem(
      'MultiKKFormData',
      JSON.stringify({
        ...sendData,
        downPaymentAmount: fmtDp,
        occupation: multiForm.occupation,
        ...(multiForm.transmission.length === 2 && {
          transmission: multiForm.transmission,
        }),
      }),
    )
    postMultiCreditQualification(sendData, {
      headers: { Authorization: getToken()?.idToken },
    })
      .then((result) => {
        const carListNonSulit = filteredCarList(result.carRecommendations)

        if (
          result.carRecommendations.length === 0 ||
          carListNonSulit.length === 0
        ) {
          setNotFoundMessage({
            desc: 'Kamu perlu menyesuaikan kisaran harga mobil untuk meningkatkan hasil peluang kreditmu.',
            submit: 'Sesuaikan Kisaran Harga',
          })
          setMultiUnitQuery({
            ...multiForm,
            downPaymentAmount: fmtDp,
            monthlyIncome: fmtIncome,
            cityName: currentCity?.cityName,
            trxCode: sendData.tsTrxCode ?? '',
          })
          trackModalRetryPopUp()
          setOpenNotFound(true)
        } else {
          setMultiUnitQuery({
            ...multiForm,
            downPaymentAmount: fmtDp,
            monthlyIncome: fmtIncome,
            cityName: currentCity?.cityName,
            multikkResponse: result,
            filteredCarList: carListNonSulit,
            trxCode: sendData.tsTrxCode ?? '',
          })
          removeSessionStorage(SessionStorageKey.KKIAFlowType)
          router.push(multiResultCreditQualificationPageUrl)
        }
        setLoadSubmit(false)
      })
      .catch((e) => {
        if (e?.response?.status === 400) {
          setNotFoundMessage({
            desc: 'Kamu perlu menyesuaikan nominal DP dan pilihan tenor untuk meningkatkan hasil peluang kreditmu.',
            submit: 'Sesuaikan DP dan Tenor',
          })
          setMultiUnitQuery({
            ...multiForm,
            downPaymentAmount: fmtDp,
            monthlyIncome: fmtIncome,
            cityName: currentCity?.cityName,
            trxCode: sendData.tsTrxCode ?? '',
          })
          trackModalRetryPopUp()
          setOpenNotFound(true)
        } else if (e?.response?.data?.message) {
          setToastMessage(`${e?.response?.data?.message}`)
          setIsOpenToast(true)
        } else {
          setToastMessage(
            'Mohon maaf, terjadi kendala jaringan silahkan coba kembali lagi',
          )
          setIsOpenToast(true)
        }

        setLoadSubmit(false)
      })
  }

  const trackCountlyCityOTRClick = () => {
    trackEventCountly(CountlyEventNames.WEB_CITY_SELECTOR_OPEN_CLICK, {
      PAGE_ORIGINATION: RouteName.MultiUnitForm,
      USER_TYPE: valueForUserTypeProperty(),
      SOURCE_SECTION: 'City Field (Multi Unit KK)',
    })
  }

  const sendDataTracker = (payload: string | null) => {
    const pageReferrer =
      getSessionStorage(SessionStorageKey.PageReferrerMultiKK) || null
    const loginStatus = sessionStorage.getItem(SessionStorageKey.prevLoginPath)

    let temanSevaStatus = 'No'
    if (referralCodeFromUrl) {
      temanSevaStatus = 'Yes'
    } else if (payload) {
      temanSevaStatus = 'Yes'
    }

    const data = {
      PAGE_REFERRER: pageReferrer,
      USER_TYPE: 'Returning',
      INITIAL_PAGE: valueForInitialPageProperty(),
      PREVIOUS_LOGIN_STATUS:
        loginStatus === '/kualifikasi-kredit/multi' ? 'No' : 'Yes',
      TEMAN_SEVA_STATUS: temanSevaStatus,
    }
    trackEventCountly(CountlyEventNames.WEB_MULTI_KK_PAGE_VIEW, data)
  }

  const [hasSlidePrice, setHasSlidePrice] = useState<boolean>(false)
  const trackMinPrice = () =>
    trackEventCountly(CountlyEventNames.WEB_MULTI_IA_PAGE_CAR_MIN_PRICE_CLICK)
  const trackMaxPrice = () =>
    trackEventCountly(CountlyEventNames.WEB_MULTI_IA_PAGE_CAR_MAX_PRICE_CLICK)
  const trackSliderPrice = () => {
    if (!hasSlidePrice) {
      setHasSlidePrice(true)
      trackEventCountly(
        CountlyEventNames.WEB_MULTI_IA_PAGE_PRICE_SLIDER_PRICE_CLICK,
      )
    }
  }
  const trackDpPrice = () =>
    trackEventCountly(CountlyEventNames.WEB_MULTI_IA_PAGE_DP_CLICK)
  const trackIncomePrice = () =>
    trackEventCountly(CountlyEventNames.WEB_MULTI_IA_PAGE_INCOME_CLICK)
  const trackTenor = () =>
    trackEventCountly(CountlyEventNames.WEB_MULTI_IA_PAGE_TENOR_CLICK)
  const trackOcupation = () =>
    trackEventCountly(CountlyEventNames.WEB_MULTI_IA_PAGE_OCCUPATION_CLICK)
  const trackTransmission = () =>
    trackEventCountly(CountlyEventNames.WEB_MULTI_IA_PAGE_TRANSMISION_CLICK)
  const trackReferralCode = () =>
    trackEventCountly(CountlyEventNames.WEB_MULTI_IA_PAGE_REFERRAL_CLICK)
  const trackModalRetryPopUp = () =>
    trackEventCountly(CountlyEventNames.WEB_MULTI_IA_PAGE_RETRY_POPUP_VIEW)
  const trackAdjustPrice = () =>
    trackEventCountly(CountlyEventNames.WEB_MULTI_IA_PAGE_RETRY_POPUP_CTA_CLICK)
  const trackCloseModalRetry = () =>
    trackEventCountly(
      CountlyEventNames.WEB_MULTI_IA_PAGE_RETRY_POPUP_CLOSE_CLICK,
    )

  useEffect(() => {
    saveMobileWebTopMenus(dataMobileMenu)
    saveMobileWebFooterMenus(dataFooter)
    saveCities(dataCities)
    getAnnouncementBox()
    if (!!getToken()) {
      getCustomerInfo()
      getCurrentUserOwnCode()
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
    setMultiForm((prev: any) => ({
      ...prev,
      priceRangeGroup:
        rawPrice.max && rawPrice.min ? `${rawPrice.min}-${rawPrice.max}` : '',
    }))
  }, [rawPrice])

  useEffect(() => {
    autofillRefCodeValue()
  }, [connectedCode])

  return (
    <>
      <Seo
        title="SEVA - Beli Mobil Terbaru Dengan Cicilan Kredit Terbaik"
        description="Beli mobil terbaru dari Toyota, Daihatsu, BMW dengan Instant Approval*. Proses Aman & Mudah✅ Terintegrasi dengan ACC & TAF✅ SEVA member of ASTRA"
        image={defaultSeoImage}
      />
      <PageLayout
        shadowBox={false}
        pageOrigination={RouteName.MultiUnitForm}
        sourceButton={
          isOpenCitySelectorOTRPrice ? 'City Field (Multi Unit KK)' : ''
        }
        onShowCity={(show) => {
          if (show) {
            setIsOpenCitySelectorOTRPrice(false)
          }
        }}
      >
        {({ onShowCity }: any) => (
          <MobileView
            className={clsx({
              [styles.container]: !showAnnouncementBox,
              [styles.contentWithSpace]: showAnnouncementBox,
              [styles.announcementboxpadding]: showAnnouncementBox,
              [styles.announcementboxpadding]: false,
            })}
          >
            <div className={styles.titleWrapper}>
              <h1 className={styles.title}>
                Ingin Cari Mobil Sesuai Budgetmu?
              </h1>
              <span className={styles.info}>
                Lengkapi data di bawah ini agar SEVA bisa kasih rekomendasi
                sesuai yang kamu cari!
              </span>
            </div>
            <div>
              <div className={styles.cityWrapper}>
                <span className={styles.kisaran}>Kisaran Harga di</span>
                <span
                  className={styles.linkCity}
                  onClick={() => {
                    setIsOpenCitySelectorOTRPrice(true)
                    trackCountlyCityOTRClick()
                    onShowCity(true)
                  }}
                >
                  {currentCity.cityName}
                </span>
                <div role="button" onClick={() => onShowCity(true)}>
                  <IconEdit width={16} height={16} color={colors.primaryBlue} />
                </div>
              </div>
              <div className={styles.formRange} ref={priceRangeRef}>
                <div>
                  <Input
                    onFocus={() => trackMinPrice()}
                    maxLength={15}
                    type="tel"
                    title="Minimum Harga"
                    defaultValue={price.min ? 'Rp' + price.min : price.min}
                    onChange={onChangeInputMinimum}
                    placeholder="Masukkan harga"
                    isError={errorMin()}
                    value={
                      multiForm.priceRangeGroup.split('-')[0]
                        ? 'Rp' +
                          Currency(
                            filterNonDigitCharacters(
                              String(multiForm.priceRangeGroup.split('-')[0]),
                            ),
                          )
                        : price.min
                        ? 'Rp' + price.min
                        : price.min
                    }
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
                      <span className={styles.errorText}>
                        {overMaxTwoWarning}
                      </span>
                    )}
                </div>
                <div
                  className={clsx({ ['shake-animation-X']: shake.priceRange })}
                >
                  <Input
                    onFocus={() => trackMaxPrice()}
                    maxLength={15}
                    type="tel"
                    title="Maksimum Harga"
                    defaultValue={price.max ? 'Rp' + price.max : price.max}
                    value={
                      multiForm.priceRangeGroup.split('-')[1]
                        ? 'Rp' +
                          Currency(
                            filterNonDigitCharacters(
                              String(multiForm.priceRangeGroup.split('-')[1]),
                            ),
                          )
                        : price.max
                        ? 'Rp' + price.max
                        : price.max
                    }
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
                      <span className={styles.errorText}>
                        {underMinTwoWarning}
                      </span>
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
                    onChange={(e) => {
                      trackSliderPrice()
                      onChangeSlider(e)
                    }}
                    defaultValue={[
                      rawPrice.min || limitPrice.min,
                      rawPrice.max || limitPrice.max,
                    ]}
                    value={[
                      rawPrice.min || limitPrice.min,
                      rawPrice.max || limitPrice.max,
                    ]}
                    styles={{
                      track:
                        errorMin() || errorMax()
                          ? { backgroundColor: colors.primaryRed }
                          : { backgroundColor: colors.primarySkyBlue },
                    }}
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
                <div ref={dpRef}>
                  <Input
                    maxLength={15}
                    type="tel"
                    name="downPaymentAmount"
                    title="Maksimum DP"
                    placeholder="Masukkan DP"
                    onFocus={trackDpPrice}
                    isError={Boolean(errorFinance.downPaymentAmount)}
                    value={
                      multiForm.downPaymentAmount.length === 0 &&
                      Currency(
                        filterNonDigitCharacters(
                          String(multiForm.downPaymentAmount),
                        ),
                      ).length === 0
                        ? multiForm.downPaymentAmount
                        : `Rp${Currency(
                            filterNonDigitCharacters(
                              String(multiForm.downPaymentAmount),
                            ),
                          )}`
                    }
                    onChange={onChange}
                  />
                  {errorFinance.downPaymentAmount && (
                    <span className={styles.errorText}>
                      {errorFinance.downPaymentAmount}
                    </span>
                  )}
                </div>
                <div ref={incomeRef}>
                  <Input
                    onFocus={trackIncomePrice}
                    maxLength={15}
                    type="tel"
                    name="monthlyIncome"
                    title="Pendapatan Bulanan"
                    placeholder="Masukkan Pendapatan"
                    isError={Boolean(errorFinance.monthlyIncome)}
                    value={
                      multiForm.monthlyIncome.length === 0 &&
                      Currency(
                        filterNonDigitCharacters(
                          String(multiForm.monthlyIncome),
                        ),
                      ).length === 0
                        ? multiForm.monthlyIncome
                        : `Rp${Currency(
                            filterNonDigitCharacters(
                              String(multiForm.monthlyIncome),
                            ),
                          )}`
                    }
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
                          trackTenor()
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
                    <span className={styles.errorText}>
                      {errorFinance.tenure}
                    </span>
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
                          [stylex.active]:
                            multiForm.transmission.includes(item),
                        })}
                        key={index}
                        onClick={() => {
                          let currentTransmission = multiForm.transmission
                            ? multiForm.transmission
                            : []
                          if (
                            multiForm.transmission &&
                            multiForm.transmission.some((x: any) => x === item)
                          ) {
                            const filterCurrent = multiForm.transmission.filter(
                              (x: any) => x !== item,
                            )
                            currentTransmission = filterCurrent
                          } else {
                            trackTransmission()
                            currentTransmission = [...currentTransmission, item]
                          }
                          setMultiForm((prev: any) => ({
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
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                >
                  <span className={styles.textTitle}>Pekerjaan</span>
                  <InputSelect
                    value={multiForm.occupation}
                    options={suggestionsLists}
                    onChange={onChangeInputHandler}
                    onChoose={onChooseHandler}
                    placeholderText="Pilih Pekerjaan"
                    noOptionsText="Pekerjaan tidak ditemukan"
                    isSearchable={true}
                    isError={Boolean(errorFinance.occupation)}
                    onFocusInput={() => trackOcupation()}
                    rightIcon={
                      <IconChevronDown
                        width={24}
                        height={24}
                        color={'#13131B'}
                      />
                    }
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
                <FormReferralCode
                  onFocus={trackReferralCode}
                  onClearInput={resetReferralCodeStatus}
                  value={referralCodeInput}
                  isLoadingReferralCode={isLoadingReferralCode}
                  isErrorReferralCode={
                    referralCodeInput !== '' &&
                    (isErrorReferralCodeInvalid || isErrorRefCodeUsingOwnCode)
                  }
                  isSuccessReferralCode={isSuccessReferralCode}
                  passedResetReferralCodeStatusFunc={resetReferralCodeStatus}
                  passedCheckReferralCodeFunc={() =>
                    checkRefCode(referralCodeInput)
                  }
                  emitOnChange={handleInputRefferal}
                  checkedIconColor={'#05256E'}
                  errorIconColor={'#D83130'}
                  errorMessage={getErrorMesssageRefCode()}
                  maxInputLength={8}
                  vibrateErrorMessage={true}
                  fieldLabel={'Kode Referral Teman SEVA (Opsional)'}
                  placeholderText={'Contoh: SEVA0000'}
                  additionalContainerStyle={styles.additionalRefCodeStyle}
                />
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
        )}
      </PageLayout>

      <NotFoundMultiUnit
        open={openNotFound}
        onAdjustForm={() => {
          if (notFoundMessage.desc.toLowerCase().includes('kisaran harga')) {
            trackAdjustPrice()
            gotoPriceRange()
          }
          setOpenNotFound(false)
        }}
        onCancel={() => {
          trackCloseModalRetry()
          setOpenNotFound(false)
        }}
      />
      <Toast
        width={339}
        open={isOpenToast}
        text={toastMessage}
        typeToast={'error'}
        onCancel={() => setIsOpenToast(false)}
        closeOnToastClick
      />
    </>
  )
}

export default MultiKK

export const getServerSideProps: GetServerSideProps<{
  dataMobileMenu: MobileWebTopMenuType[]
  dataFooter: MobileWebFooterMenuType[]
  dataCities: CityOtrOption[]
}> = async (ctx) => {
  ctx.res.setHeader(
    'Cache-Control',
    'public, s-maxage=59, stale-while-revalidate=3000',
  )

  try {
    const [menuMobileRes, footerRes, cityRes]: any = await Promise.all([
      getMobileHeaderMenu(),
      getMobileFooterMenu(),
      getCities(),
    ])

    return {
      props: {
        dataMobileMenu: menuMobileRes.data,
        dataFooter: footerRes.data,
        dataCities: cityRes,
      },
    }
  } catch (e: any) {
    return serverSideManualNavigateToErrorPage(e?.response?.status)
  }
}
