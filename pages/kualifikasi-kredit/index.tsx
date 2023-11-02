import React, { useEffect, useState } from 'react'
import styles from 'styles/pages/kualifikasi-kredit.module.scss'
import { Progress } from 'antd'
import {
  IconChevronDown,
  InputSelect,
  Button,
  IconChevronRight,
  DatePicker,
} from '../../components/atoms'
import { ButtonSize, ButtonVersion } from '../../components/atoms/button'
import Fuse from 'fuse.js'
import axios from 'axios'
import { MoengageEventName, setTrackEventMoEngage } from 'helpers/moengage'
import SpouseIncomeForm from '../../components/molecules/credit/spouseIncome'
import { useProtectPage } from 'utils/hooks/useProtectPage/useProtectPage'
import { useRouter } from 'next/router'
import { getLocalStorage } from 'utils/handler/localStorage'
import {
  LanguageCode,
  LocalStorageKey,
  SessionStorageKey,
  TemanSeva,
} from 'utils/enum'
import { useFinancialQueryData } from 'services/context/finnancialQueryContext'
import { CityOtrOption, NewFunnelCarVariantDetails, Option } from 'utils/types'
import { occupations } from 'utils/occupations'
import { TrackerFlag } from 'utils/types/models'
import { useSessionStorageWithEncryption } from 'utils/hooks/useSessionStorage/useSessionStorage'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import {
  FormControlValue,
  LoanCalculatorInsuranceAndPromoType,
  SimpleCarVariantDetail,
  trackDataCarType,
} from 'utils/types/utils'
import { getToken } from 'utils/handler/auth'
import { isIsoDateFormat } from 'utils/handler/regex'
import {
  CreditQualificationFlowParam,
  trackKualifikasiKreditCarDetailClick,
  trackKualifikasiKreditCarDetailClose,
  trackKualifikasiKreditFormPageCTAClick,
  trackKualifikasiKreditFormPageView,
} from 'helpers/amplitude/seva20Tracking'
import {
  formatNumberByLocalization,
  replacePriceSeparatorByLocalization,
} from 'utils/handler/rupiah'
import {
  creditQualificationReviewUrl,
  creditQualificationUrl,
  loanCalculatorDefaultUrl,
} from 'utils/helpers/routes'
import { filterNonDigitCharacters } from 'utils/stringUtils'
import HeaderCreditClasificationMobile from 'components/organisms/headerCreditClasificationMobile'
import { FormReferralCode } from 'components/molecules/form/formReferralCode'
import PopupCreditDetail from 'components/organisms/popupCreditDetail'
import Seo from 'components/atoms/seo'
import { defaultSeoImage } from 'utils/helpers/const'
import Image from 'next/image'
import { checkReferralCode, getCustomerInfoSeva } from 'utils/handler/customer'
import { temanSevaUrlPath } from 'utils/types/props'
import { getCarVariantDetailsById } from 'utils/handler/carRecommendation'
import dynamic from 'next/dynamic'
import { default as customAxiosGet } from 'services/api/get'
import dayjs from 'dayjs'
import {
  trackEventCountly,
  valueForInitialPageProperty,
} from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import elementId from 'helpers/elementIds'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import { Currency } from 'utils/handler/calculation'
import {
  getSessionStorage,
  saveSessionStorage,
} from 'utils/handler/sessionStorage'
import { getCity } from 'utils/hooks/useGetCity'
import { useBadgePromo } from 'utils/hooks/usebadgePromo'
import { RouteName } from 'utils/navigate'
import { useCar } from 'services/context/carContext'

const Modal = dynamic(() => import('antd/lib/modal'), { ssr: false })

const searchOption = {
  keys: ['label'],
  isCaseSensitive: false,
  includeScore: true,
  threshold: 0.3,
}

const CreditQualificationPage = () => {
  useProtectPage()
  const router = useRouter()
  const optionADDM = getLocalStorage(LocalStorageKey.SelectedAngsuranType)
  const [isIncomeTooLow, setIsIncomeTooLow] = useState(false)
  const { financialQuery, fincap } = useFinancialQueryData()
  const { filterFincap } = useFunnelQueryData()
  const currentMonthlyIncome = financialQuery.monthlyIncome
  const [joinIncomeValueFormatted, setJoinIncomeValueFormatted] = useState(
    financialQuery.monthlyIncome || '0',
  )
  const [joinIncomeValue, setJoinIncomeValue] = useState(
    Number(financialQuery.monthlyIncome) || 0,
  )
  const [dataCar, setDataCar] = useState<NewFunnelCarVariantDetails>()
  const [inputValue, setInputValue] = useState('')
  const [email, setEmail] = useState('')
  const [lastChoosenValue, setLastChoosenValue] = useState('')
  const [modelOccupationListOptionsFull] = useState<Option<string>[]>(
    occupations.options,
  )
  const [suggestionsLists, setSuggestionsLists] = useState<Option<string>[]>([])
  const [flag, setFlag] = useState<TrackerFlag>(TrackerFlag.Init)
  const [customerYearBorn, setCustomerYearBorn] = useState('')
  const [isShowDobField, setIsShowDobField] = useState(false)
  const [customerDobForm, setCustomerDobForm] = useState('')
  const selectablePromo = getLocalStorage<LoanCalculatorInsuranceAndPromoType>(
    LocalStorageKey.SelectablePromo,
  )
  const { selectedPromoList } = useBadgePromo()
  const kkFlowType = getSessionStorage(SessionStorageKey.KKIAFlowType)
  const isInPtbcFlow = kkFlowType && kkFlowType === 'ptbc'
  const { recommendation } = useCar()
  const dataCarStorage: trackDataCarType | null = getSessionStorage(
    SessionStorageKey.PreviousCarDataBeforeLogin,
  )

  const onChangeInputHandler = (value: string) => {
    if (value === '') {
      setLastChoosenValue('')
    }

    setInputValue(
      value
        .toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' '),
    )
  }

  const [promoCode] = useSessionStorageWithEncryption<string>(
    SessionStorageKey.PromoCodeGiiass,
    '',
  )
  const [openModal, setOpenModal] = useState(false)
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const [simpleCarVariantDetails] =
    useLocalStorage<SimpleCarVariantDetail | null>(
      LocalStorageKey.SimpleCarVariantDetails,
      null,
    )
  const referralCodeFromUrl: string =
    getLocalStorage(LocalStorageKey.referralTemanSeva) ?? ''
  const [connectedCode, setConnectedCode] = useState<string | undefined>()
  const [referralCodeInput, setReferralCodeInput] = useState('')
  const [currentUserOwnCode, setCurrentUserOwnCode] = useState('') // code that can be seen in teman seva dashboard
  const [isLoadingReferralCode, setIsLoadingReferralCode] = useState(false)
  const [isErrorReferralCodeInvalid, setIsErrorReferralCodeInvalid] =
    useState(false)
  const [isErrorRefCodeUsingOwnCode, setIsErrorRefCodeUsingOwnCode] =
    useState(false)
  const [isSuccessReferralCode, setisSuccessReferralCode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const onInputJoinIncome = () => {
    if (joinIncomeValueFormatted === '') {
      setJoinIncomeValueFormatted('0')
      setJoinIncomeValue(0)
    }
    if (joinIncomeValue < 3000000) {
      setIsIncomeTooLow(true)
    } else {
      setIsIncomeTooLow(false)
    }
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

  const getCurrentUserOwnCode = () => {
    // setLoadShimmer1(true)
    customAxiosGet(temanSevaUrlPath.profile, {
      headers: { phoneNumber: getToken()?.phoneNumber ?? '' },
    })
      .then((res) => {
        // setLoadShimmer1(false)
        setCurrentUserOwnCode(res.temanSevaRefCode)
      })
      .catch(() => {
        // setLoadShimmer1(false)
        // showToast()
      })
  }

  const getCurrentUserInfo = () => {
    getCustomerInfoSeva()
      .then((response) => {
        // setLoadShimmer2(false)
        if (!!response[0].dob) {
          setIsShowDobField(false)
          setCustomerDobForm(response[0].dob)
        } else {
          setIsShowDobField(true)
        }

        if (!!response[0].dob && isIsoDateFormat(response[0].dob)) {
          setCustomerYearBorn(response[0].dob.slice(0, 4))
        }

        if (response[0].temanSevaTrxCode && referralCodeInput === '') {
          setReferralCodeInput(response[0].temanSevaTrxCode)
          setEmail(response[0].email)
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
        // setLoadShimmer2(false)
        // showToast()
      })
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
      trackCreditQualificationView({ trx: referralCodeFromUrl })
    } else if (connectedCode && connectedCode.length > 0) {
      setReferralCodeInput(connectedCode)
      checkRefCode(connectedCode)
      trackCreditQualificationView({ trx: connectedCode })
    } else {
      setReferralCodeInput('')
      trackCreditQualificationView({ trx: '' })
    }
  }
  const onChooseHandler = (item: Option<FormControlValue>) => {
    setLastChoosenValue(String(item.value))
    setInputValue(String(item.label))
  }

  const getDataForTracker = (): CreditQualificationFlowParam => {
    return {
      Car_Brand: dataCar?.modelDetail?.brand ?? '',
      Car_Model: dataCar?.modelDetail?.model ?? '',
      Car_Variant: dataCar?.variantDetail?.name ?? '',
      DP: `Rp${formatNumberByLocalization(
        simpleCarVariantDetails?.loanDownPayment ?? 0,
        LanguageCode.id,
        1000000,
        10,
      )} Juta`,
      Monthly_Installment: `Rp${formatNumberByLocalization(
        simpleCarVariantDetails?.loanMonthlyInstallment ?? 0,
        LanguageCode.id,
        1000000,
        10,
      )} jt/bln`,
      Tenure: `${simpleCarVariantDetails?.loanTenure ?? 0} Tahun`,
      Income: `Rp${formatNumberByLocalization(
        Number(financialQuery.monthlyIncome),
        LanguageCode.id,
        1000000,
        10,
      )} Juta`,
      Promo: !!promoCode ? promoCode : null,
      Year_Born: customerYearBorn,
      City: cityOtr?.cityName || 'Jakarta Pusat',
    }
  }

  const trackAmplitudeAndMoengagePageView = () => {
    trackKualifikasiKreditFormPageView(getDataForTracker())
    setTrackEventMoEngage(
      MoengageEventName.view_kualifikasi_kredit_form_page,
      getDataForTracker(),
    )
  }

  const updateValueForTrackingWaDirect = () => {
    const updateDataCar = {
      ...dataCarStorage,
      INCOME_KK: joinIncomeValue,
    }
    saveSessionStorage(
      SessionStorageKey.PreviousCarDataBeforeLogin,
      JSON.stringify(updateDataCar),
    )
  }
  const onClickCtaNext = async () => {
    const dataCarValue = {
      ...dataCarStorage,
      IA_FLOW: 'Instant Approval (Reg)',
      INCOME_KK: joinIncomeValue,
    }

    updateValueForTrackingWaDirect()

    setIsLoading(true)

    saveSessionStorage(
      SessionStorageKey.PreviousCarDataBeforeLogin,
      JSON.stringify(dataCarValue),
    )

    setIsLoading(true)

    const refcode =
      kkFlowType && kkFlowType === 'ptbc'
        ? TemanSeva.PTBC
        : referralCodeInput || ''
    // ref code input field is removed in PTBC flow, no need to check validitity
    let refCodeValidity = true
    if (!isInPtbcFlow) {
      refCodeValidity = await checkRefCode(referralCodeInput)
    }

    setIsLoading(false)

    if (refCodeValidity) {
      const qualificationData = {
        modelId: simpleCarVariantDetails?.modelId,
        variantId: simpleCarVariantDetails?.variantId,
        loanTenure: simpleCarVariantDetails?.loanTenure,
        loanDownPayment: simpleCarVariantDetails.loanDownPayment,
        loanMonthlyInstallment: simpleCarVariantDetails.loanMonthlyInstallment,
        loanRank: simpleCarVariantDetails.loanRank,
        totalFirstPayment: simpleCarVariantDetails.totalFirstPayment,
        flatRate: simpleCarVariantDetails.flatRate,
        monthlyIncome: joinIncomeValue,
        address: {
          province: '',
          city: '',
          zipCode: '',
        },
        email: email || null,
        citySelector: cityOtr ? cityOtr?.cityName : 'Jakarta Pusat',
        spouseIncome: joinIncomeValue,
        promoCode: promoCode || '',
        temanSevaTrxCode: refcode,
        angsuranType: optionADDM,
        rateType: getLocalStorage(LocalStorageKey.SelectedRateType),
        platform: 'web',
        occupations: lastChoosenValue,
        dob: customerDobForm,
      }
      localStorage.setItem(
        'qualification_credit',
        JSON.stringify(qualificationData),
      )
      const track = {
        CAR_BRAND: dataCar?.modelDetail.brand,
        CAR_VARIANT: dataCar?.variantDetail.name,
        CAR_MODEL: dataCar?.modelDetail.model,
        INCOME_CHANGE:
          Number(currentMonthlyIncome) === Number(joinIncomeValue)
            ? 'No'
            : 'Yes',
        INCOME_KUALIFIKASI_KREDIT: `Rp${Currency(joinIncomeValue)}`,
        INCOME_LOAN_CALCULATOR: `Rp${Currency(Number(currentMonthlyIncome))}`,
        INSURANCE_TYPE: selectablePromo?.selectedInsurance.label || 'Null',
        PROMO_AMOUNT: selectedPromoList ? selectedPromoList.length : 'Null',
        OCCUPATION: lastChoosenValue.replace('&', ''),
        TEMAN_SEVA_REFERRAL_CODE: refcode || 'Null',
      }
      setTimeout(() => {
        if (isInPtbcFlow) {
          trackEventCountly(
            CountlyEventNames.WEB_PTBC_CREDIT_QUALIFICATION_FORM_PAGE_CTA_CLICK,
          )
        } else {
          trackEventCountly(
            CountlyEventNames.WEB_CREDIT_QUALIFICATION_FORM_PAGE_CTA_CLICK,
            track,
          )
        }
      }, 500)

      router.push(creditQualificationReviewUrl)
      // saveLocalStorage(QualificationCredit, 'REGULAR')
      // only proceed if currently inputted ref code is valid
    }
  }

  const trackCreditQualificationDetailClick = () => {
    const track = {
      CAR_BRAND: dataCar?.modelDetail.brand,
      CAR_VARIANT: dataCar?.variantDetail.name,
      CAR_MODEL: dataCar?.modelDetail.model,
      PAGE_ORIGINATION: RouteName.KKForm,
      PAGE_ORIGINATION_URL: window.location.href,
    }

    trackEventCountly(
      CountlyEventNames.WEB_CREDIT_QUALIFICATION_FORM_PAGE_CAR_DETAIL_CLICK,
      track,
    )
  }

  const handleOpenModal = () => {
    trackCreditQualificationDetailClick()
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  const trackCreditQualificationView = ({ trx = '' }) => {
    const prevPage = getSessionStorage(SessionStorageKey.PreviousPage) as any
    const loginStatus = localStorage.getItem(LocalStorageKey.prevLoginPath)
    const infoCarRecommendation = recommendation.filter(
      (x) => x.id === dataCar?.modelDetail.id,
    )[0]
    const track = {
      PAGE_REFERRER: prevPage,
      FINCAP_FILTER_USAGE: filterFincap ? 'Yes' : 'No',
      CAR_BRAND: dataCar?.modelDetail.brand,
      CAR_VARIANT: dataCar?.variantDetail.name,
      CAR_MODEL: dataCar?.modelDetail.model,
      PELUANG_KREDIT_BADGE: fincap
        ? infoCarRecommendation
          ? infoCarRecommendation.loanRank === 'Green'
            ? 'Mudah disetujui'
            : 'Sulit disetujui'
          : 'Null'
        : 'Null',
      TENOR_OPTION: simpleCarVariantDetails.loanTenure + ' tahun',
      TENOR_RESULT:
        simpleCarVariantDetails.loanRank === 'Green'
          ? 'Mudah disetujui'
          : simpleCarVariantDetails.loanRank === 'Red'
          ? 'Sulit disetujui'
          : 'Null',
      INCOME_LOAN_CALCULATOR: `Rp${Currency(
        Number(financialQuery.monthlyIncome),
      )}`,
      INITIAL_PAGE: valueForInitialPageProperty(),
      INSURANCE_TYPE: selectablePromo?.selectedInsurance.label || 'Null',
      PROMO_AMOUNT: selectedPromoList ? selectedPromoList.length : 'Null',
      INITIAL_LOGIN_STATUS:
        loginStatus && loginStatus === creditQualificationUrl ? 'No' : 'Yes',
      TEMAN_SEVA_STATUS: trx ? 'Yes' : 'No',
    }

    setTimeout(() => {
      if (isInPtbcFlow) {
        trackEventCountly(
          CountlyEventNames.WEB_PTBC_CREDIT_QUALIFICATION_FORM_PAGE_VIEW,
        )
      } else {
        trackEventCountly(
          CountlyEventNames.WEB_CREDIT_QUALIFICATION_FORM_PAGE_VIEW,
          track,
        )
      }
    }, 1000)
  }

  useEffect(() => {
    setJoinIncomeValue(Number(financialQuery.monthlyIncome))
  }, [financialQuery.monthlyIncome])

  useEffect(() => {
    if (!!getToken()) {
      if (
        !simpleCarVariantDetails ||
        !simpleCarVariantDetails.variantId ||
        !optionADDM
      ) {
        router.push(loanCalculatorDefaultUrl)
      } else {
        getCarVariantDetailsById(simpleCarVariantDetails.variantId)
          .then((response) => {
            if (response) {
              setDataCar(response)
            } else {
              router.push(loanCalculatorDefaultUrl)
            }
          })
          .catch(() => {
            router.push(loanCalculatorDefaultUrl)
          })
        getCurrentUserInfo()
        getCurrentUserOwnCode()
      }
    }
  }, [])

  useEffect(() => {
    // autofill using useEffect hook because connectedCode value is from API
    if (typeof connectedCode !== 'undefined' && dataCar) autofillRefCodeValue()
  }, [connectedCode, dataCar])

  useEffect(() => {
    if (inputValue === '') {
      setSuggestionsLists(modelOccupationListOptionsFull)
      return
    }

    const fuse = new Fuse(modelOccupationListOptionsFull, searchOption)
    const suggestion = fuse.search(inputValue)
    const result = suggestion.map((obj) => obj.item)

    // sort alphabetically
    // result.sort((a: any, b: any) => a.label.localeCompare(b.label))

    // sort based on input
    const sorted = result.sort((a: any, b: any) => {
      if (a.label.startsWith(inputValue) && b.label.startsWith(inputValue))
        return a.label.localeCompare(b.label)
      else if (a.label.startsWith(inputValue)) return -1
      else if (b.label.startsWith(inputValue)) return 1

      return a.label.localeCompare(b.label)
    })

    setSuggestionsLists(sorted)
  }, [inputValue, modelOccupationListOptionsFull])

  useEffect(() => {
    if (
      !!dataCar &&
      !!simpleCarVariantDetails &&
      !!customerYearBorn &&
      flag === TrackerFlag.Init
    ) {
      trackAmplitudeAndMoengagePageView()
      setFlag(TrackerFlag.Sent)
    }
  }, [dataCar, customerYearBorn])

  const handleChange = (name: string, value: any) => {
    if (name === 'monthlyIncome') {
      while (value.charAt(0) === '0' && value.length > 1) {
        value = value.substring(1)
      }
      const formatted = replacePriceSeparatorByLocalization(
        filterNonDigitCharacters(value.toString()),
        LanguageCode.id,
      )
      setJoinIncomeValueFormatted(formatted)
      setJoinIncomeValue(Number(filterNonDigitCharacters(value)))

      const dataCarTemp = {
        ...dataCarStorage,
        INCOME_CHANGE: 'Yes',
        INCOME_KK: Number(filterNonDigitCharacters(value)),
      }
      saveSessionStorage(
        SessionStorageKey.PreviousCarDataBeforeLogin,
        JSON.stringify(dataCarTemp),
      )
    }
  }

  const renderIncomeErrorMessage = () => {
    if (isIncomeTooLow) {
      return (
        <div className={`${styles.errorMessageWrapper}`}>
          <span className={styles.errorMessage}>
            Pendapatan yang kamu masukkan terlalu rendah
          </span>
        </div>
      )
    } else {
      return <></>
    }
  }

  const onBlurHandler = () => {
    setLastChoosenValue(lastChoosenValue || '')
    if (lastChoosenValue !== '') {
      const inputValue: any = suggestionsLists.filter(
        (item) => item.value === lastChoosenValue,
      )[0]
      setInputValue(String(inputValue?.label) || '')
    }
  }

  const cityName = getCity()?.cityName || 'Jakarta Pusat'

  return (
    <>
      <Seo
        title="SEVA - Beli Mobil Terbaru Dengan Cicilan Kredit Terbaik"
        description="Beli mobil terbaru dari Toyota, Daihatsu, BMW dengan Instant Approval*. Proses Aman & Mudah✅ Terintegrasi dengan ACC & TAF✅ SEVA member of ASTRA"
        image={defaultSeoImage}
      />
      <HeaderCreditClasificationMobile />
      <div className={styles.progressBar}>
        <Progress
          className={styles.antProgress}
          percent={50}
          showInfo={false}
          size="small"
          strokeColor={{ '0%': '#51A8DB', '100%': '#51A8DB' }}
          trailColor="#EBECEE"
        />
      </div>
      <div className={styles.container}>
        <div className={styles.paddingInfoCar} onClick={handleOpenModal}>
          <div className={styles.cardInfoCar}>
            <Image
              src={dataCar?.variantDetail?.images[0] || ''}
              alt="car-images"
              width="82"
              height="61"
              className={styles.imageCar}
            />
            <div className={styles.frameTextInfoCar}>
              <div className={styles.titleTextCar}>
                {dataCar?.modelDetail.brand} {dataCar?.modelDetail.model}
              </div>
              <div className={styles.textType}>
                {dataCar?.variantDetail.name}
              </div>
              <div className={styles.textPrice}>
                Rp
                {replacePriceSeparatorByLocalization(
                  Number(dataCar?.variantDetail.priceValue),
                  LanguageCode.id,
                )}
              </div>
              <div className={styles.hargaOtrWrapper}>
                <span className={styles.smallRegular}>Harga OTR</span>
                <span className={styles.smallSemibold}>{cityName}</span>
              </div>
              {/*{promoCode && (*/}
              {/*  <div className={styles.textPromo}>*/}
              {/*    <span className={styles.textPromoSelect}>*/}
              {/*      Promo yang kamu pilih:*/}
              {/*    </span>*/}
              {/*    <span className={styles.textPromoBold}>{promoCode}</span>*/}
              {/*  </div>*/}
              {/*)}*/}
            </div>
            <div className={styles.frameIcon}>
              <IconChevronRight width={24} height={24} color={'#13131B'} />
            </div>
          </div>
        </div>
        <div className={styles.titleText}>Kualifikasi Kredit</div>
        <div className={styles.subTitleText}>Sumber Pendapatan</div>
        <div className={styles.paddingFormJob}>
          <p className={styles.titleTextTwoForm}>Pekerjaan Saya</p>
          <InputSelect
            value={inputValue}
            options={suggestionsLists}
            onFocusInput={() => {
              trackEventCountly(
                CountlyEventNames.WEB_CREDIT_QUALIFICATION_FORM_PAGE_OCCUPATION_CLICK,
              )
            }}
            onChange={onChangeInputHandler}
            onChoose={onChooseHandler}
            placeholderText="Pilih Pekerjaan"
            noOptionsText="Pekerjaan tidak ditemukan"
            isSearchable={true}
            onBlurInput={onBlurHandler}
            rightIcon={
              <IconChevronDown width={35} height={35} color={'#13131B'} />
            }
          />
        </div>
        <div className={styles.paddingFormIncome}>
          <SpouseIncomeForm
            name="monthlyIncome"
            title="Pendapatan Bulananmu"
            value={Number(joinIncomeValue)}
            defaultValue={Number(joinIncomeValue)}
            handleChange={handleChange}
            isErrorTooLow={isIncomeTooLow}
            emitOnBlurInput={onInputJoinIncome}
          />
          {renderIncomeErrorMessage()}
        </div>

        {isShowDobField ? (
          <div className={styles.paddingFormDob}>
            <DatePicker
              title="Tanggal Lahir"
              placeholder="DD/MM/YYYY"
              value={dayjs(customerDobForm).toDate()}
              min={dayjs().add(-100, 'year').toDate()}
              max={dayjs().add(-17, 'year').toDate()}
              name="dob"
              data-testid={elementId.DatePicker.DOB}
              onConfirm={(val: Date) => {
                setCustomerDobForm(dayjs(val).format('YYYY-MM-DD'))
              }}
            />
          </div>
        ) : (
          <></>
        )}
        {kkFlowType !== 'ptbc' && (
          <div className={styles.paddingFormReferral}>
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
              onFocus={() => {
                trackEventCountly(
                  CountlyEventNames.WEB_CREDIT_QUALIFICATION_FORM_PAGE_REFERRAL_CLICK,
                )
              }}
            />
          </div>
        )}

        <div className={styles.paddingButton}>
          <Button
            version={ButtonVersion.PrimaryDarkBlue}
            size={ButtonSize.Big}
            disabled={
              lastChoosenValue === '' ||
              isIncomeTooLow ||
              joinIncomeValue < 3000000 ||
              !customerDobForm ||
              isLoading
            }
            onClick={onClickCtaNext}
            loading={isLoading}
          >
            Lanjutkan
          </Button>
        </div>
      </div>
      <Modal
        open={openModal}
        onCancel={handleCloseModal}
        title=""
        footer={null}
        className="custom-modal-credit"
        width={343}
        styles={{
          mask: {
            background: 'rgba(19, 19, 27, 0.5)',
            maxWidth: '570px',
            marginLeft: 'auto',
            marginRight: 'auto',
          },
        }}
        style={{ borderRadius: '8px' }}
      >
        <PopupCreditDetail
          carVariant={dataCar}
          dataFinancial={financialQuery}
          city={cityOtr ? cityOtr?.cityName : 'Jakarta Pusat'}
          promoCode={promoCode}
          simpleCarVariantDetails={simpleCarVariantDetails}
          optionADDM={optionADDM}
        />
      </Modal>
    </>
  )
}

export default CreditQualificationPage
