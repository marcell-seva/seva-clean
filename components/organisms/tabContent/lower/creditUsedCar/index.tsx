import {
  CityOtrOption,
  CreditCarCalculation,
  LoanCalculatorInsuranceAndPromoType,
  SelectedCalculateLoanUsedCar,
  UsedCarRecommendation,
  UsedNewCarRecommendation,
  trackDataCarType,
} from 'utils/types/utils'
import { MoengageEventName, setTrackEventMoEngage } from 'helpers/moengage'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import {
  InstallmentTypeOptions,
  LoanRank,
  TrackerFlag,
} from 'utils/types/models'
import React, { useEffect, useMemo, useState, useContext, useRef } from 'react'
import { EducationalContentPopupUsedCar } from 'components/organisms'
import styles from 'styles/components/organisms/creditUsedCarTab.module.scss'
import { Button, IconLoading } from 'components/atoms'
import { client } from 'utils/helpers/const'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import DpUsedCarForm from 'components/molecules/credit/dpUsedCar'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { variantEmptyValue } from 'components/molecules/form/formSelectCarVariant'
import { getLocalStorage } from 'utils/handler/localStorage'
import elementId from 'helpers/elementIds'
import { useRouter } from 'next/router'
import { ModelVariant } from 'utils/types/carVariant'
import { useCar } from 'services/context/carContext'
import { LanguageCode, LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { formatPriceNumberThousandDivisor } from 'utils/numberUtils/numberUtils'
import { getToken } from 'utils/handler/auth'
import {
  getSessionStorage,
  removeSessionStorage,
  saveSessionStorage,
} from 'utils/handler/sessionStorage'
import {
  trackEventCountly,
  valueForInitialPageProperty,
  valueForUserTypeProperty,
} from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { removeCarBrand } from 'utils/handler/removeCarBrand'
import dynamic from 'next/dynamic'
import { getCarCreditsSk } from 'services/api'
import { getCarModelDetailsById } from 'utils/handler/carRecommendation'
import { getCustomerInfoSeva } from 'utils/handler/customer'
import { IconMoney } from 'components/atoms/icon'
import { LeadsFormUsedCar } from 'components/organisms'
import { useAnnouncementBoxContext } from 'services/context/announcementBoxContext'
import { UsedPdpDataLocalContext } from 'pages/mobil-bekas/p/[[...slug]]'

const CalculationUsedCarResult = dynamic(() =>
  import('components/organisms').then((mod) => mod.CalculationUsedCarResult),
)
const NewCarRecommendations = dynamic(
  () => import('components/organisms/NewCarRecommendations'),
)

const UsedCarRecommendations = dynamic(
  () => import('components/organisms/UsedCarRecommendations'),
)
const AssuranceCreditModal = dynamic(() =>
  import('components/molecules/assuranceCreditModal').then(
    (mod) => mod.AssuranceCreditModal,
  ),
)
const Toast = dynamic(() => import('components/atoms').then((mod) => mod.Toast))

const CarSillhouete = '/revamp/illustration/car-sillhouete.webp'

interface FormState {
  city: CityOtrOption
  model:
    | {
        modelId: string
        modelName: string
        modelImage: string
        brandName: string
        loanRank: string
      }
    | undefined
  variant:
    | {
        variantId: string
        variantName: string
        otr: string
        discount: number
      }
    | undefined
  promoCode: string
  isValidPromoCode: boolean
  age: string
  monthlyIncome: string
  downPaymentAmount: string
  paymentOption: InstallmentTypeOptions
}

interface ChoosenAssurance {
  label: string
  value: string
  tenureAR: number
  tenureTLO: number
}

export const CreditUsedCarTab = () => {
  const {
    usedCarModelDetailsRes,
    usedCarRecommendations,
    usedCarNewRecommendations,
  } = useContext(UsedPdpDataLocalContext)

  const router = useRouter()
  const { carModelDetails, carVariantDetails, recommendation } = useCar()
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )

  const [usedCarRecommendationList, setUsedCarRecommendationList] = useState<
    UsedCarRecommendation[]
  >([])
  const [usedCarNewRecommendationList, setUsedCarNewRecommendationList] =
    useState<UsedNewCarRecommendation[]>([])

  const { funnelQuery } = useFunnelQueryData()
  const [isDisableCtaCalculate, setIsDisableCtaCalculate] = useState(true)
  const [disableBtnCalculate, setDisableBtnCalculate] = useState(false)
  const [isValidatingEmptyField, setIsValidatingEmptyField] = useState(false)
  const [isLoadingCalculation, setIsLoadingCalculation] = useState(false)
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)
  const [carVariantList, setCarVariantList] = useState<ModelVariant[]>([])
  const [dpValue, setDpValue] = useState<number>(0)
  const [dpPercentage, setDpPercentage] = useState<number>(20)
  const [isDpTooLow, setIsDpTooLow] = useState<boolean>(false)
  const [isDpExceedLimit, setIsDpExceedLimit] = useState<boolean>(false)
  const [calculationResult, setCalculationResult] = useState([])
  const [defaultCalculcationResult, setDefaultCalculationResult] = useState([])
  const [isTooltipOpen, setIsTooltipOpen] = useState(false)
  const [isAssuranceModalOpen, setIsAssuranceModalOpen] = useState(false)
  const [chosenAssurance, setChosenAssurance] = useState<ChoosenAssurance>({
    label: '',
    value: '',
    tenureAR: 0,
    tenureTLO: 60,
  })
  const [hidden, setHidden] = useState(false)
  const { showAnnouncementBox } = useAnnouncementBoxContext()
  const [selectedLoan, setSelectedLoan] =
    useState<SelectedCalculateLoanUsedCar | null>(null)
  const [storedFilter] = useLocalStorage<null>(
    LocalStorageKey.FinancialData,
    null,
  )
  const [flag, setFlag] = useState<TrackerFlag>(TrackerFlag.Init)
  const [flagMoengage, setFlagMoengage] = useState<TrackerFlag>(
    TrackerFlag.Init,
  )
  const [insuranceAndPromoForAllTenure, setInsuranceAndPromoForAllTenure] =
    useState<LoanCalculatorInsuranceAndPromoType[]>([])
  const [isSelectPassengerCar, setIsSelectPassengerCar] = useState(false)
  const [calculationApiPayload, setCalculationApiPayload] =
    useState<CreditCarCalculation>()
  const [isOpenEducationalDpPopup, setIsOpenEducationalDpPopup] =
    useState(false)
  const [isOpenToast, setIsOpenToast] = useState(false)
  const [toastMessage, setToastMessage] = useState(
    'Mohon maaf, terjadi kendala jaringan silahkan coba kembali lagi',
  )
  const [isSentCountlyPageView, setIsSentCountlyPageView] = useState(false)
  const loanRankcr = router.query.loanRankCVL ?? ''
  const filterStorage: any = getLocalStorage(LocalStorageKey.CarFilter)
  const dataCar: trackDataCarType | null = getSessionStorage(
    SessionStorageKey.PreviousCarDataBeforeLogin,
  )
  const referralCodeFromUrl: string | null = getLocalStorage(
    LocalStorageKey.referralTemanSeva,
  )

  const isUsingFilterFinancial =
    !!filterStorage?.age &&
    !!filterStorage?.downPaymentAmount &&
    !!filterStorage?.monthlyIncome &&
    !!filterStorage?.tenure

  const getAutofilledCityData = () => {
    // related to logic inside component "FormSelectCity"
    // no need to check "isHasCarParameter" props
    if (cityOtr) {
      return cityOtr
    } else {
      return null
    }
  }

  const [forms, setForms] = React.useState<FormState>({
    city: getAutofilledCityData(),
    model: {
      brandName: '',
      modelName: '',
      modelId: '',
      modelImage: CarSillhouete,
      loanRank: '',
    },
    variant: {
      variantId: '',
      variantName: '',
      otr: '',
      discount: 0,
    },
    promoCode: '',
    age: (storedFilter?.age && storedFilter?.age.toString()) || '',
    monthlyIncome:
      (storedFilter?.monthlyIncome && storedFilter?.monthlyIncome.toString()) ||
      '',
    downPaymentAmount:
      (storedFilter?.downPaymentAmount &&
        storedFilter?.downPaymentAmount.toString()) ||
      '',
    paymentOption: InstallmentTypeOptions.ADDM,
    isValidPromoCode: true,
  })

  const autofillCarModelAndVariantData = () => {
    const tempData = {
      model: {
        brandName: '',
        modelName: '',
        modelId: '',
        modelImage: '',
        loanRank: '',
      },
      variant: {
        ...variantEmptyValue,
      },
    }

    if (carModelDetails) {
      tempData.model.brandName = carModelDetails.brand
      tempData.model.modelName = `${carModelDetails.brand} ${carModelDetails.model}`
      tempData.model.modelId = carModelDetails.id
      tempData.model.modelImage = carModelDetails.images[0]
    }

    if (carModelDetails && router.query?.selectedVariantId) {
      if (passedVariantData.length > 0 && forms?.city?.cityCode) {
        tempData.variant.variantId = passedVariantData[0].id
        tempData.variant.variantName = passedVariantData[0].name
        tempData.variant.otr = `Rp${formatPriceNumberThousandDivisor(
          passedVariantData[0].priceValue,
          LanguageCode.id,
        )}`
        tempData.variant.discount = passedVariantData[0].discount
      }
    }

    setForms({
      ...forms,
      ...tempData,
    })
  }

  const trackMoengageLoanCalc = (data: any) => {
    const obj = {
      product_name: usedCarModelDetailsRes?.variantTitle,
      price: usedCarModelDetailsRes?.priceValue.split('.')[0],
      monthly_installment: data?.totalInstallment,
      downpayment: data?.totalDP,
      loan_tenure: data?.tenor,
    }
    setTrackEventMoEngage(MoengageEventName.view_loan_calculator_result, obj)
  }

  const defaultValueCalculcator = async () => {
    const priceValue = parseInt(usedCarModelDetailsRes.priceValue.split('.')[0])
    const initialDpValue = Math.round((priceValue * 20) / 100)

    const payloadUsedCar: CreditCarCalculation = {
      nik: usedCarModelDetailsRes.nik,
      DP: dpValue === 0 ? initialDpValue : dpValue,
      priceValue: Number(usedCarModelDetailsRes.priceValue.split('.')[0]),
      tenureAR: 0,
      tenureTLO: 60,
      presentaseDP: dpPercentage,
    }

    const queryParam = new URLSearchParams()
    queryParam.append('nik', payloadUsedCar.nik.toString())
    queryParam.append('DP', payloadUsedCar.DP.toString())
    queryParam.append('priceValue', payloadUsedCar.priceValue.toString())
    queryParam.append('tenureAR', payloadUsedCar.tenureAR.toString())
    queryParam.append('tenureTLO', payloadUsedCar.tenureTLO.toString())
    queryParam.append('presentaseDP', payloadUsedCar.presentaseDP.toString())
    getCarCreditsSk('', { params: queryParam })
      .then((response) => {
        const result = response.data.reverse()
        const filteredResult = getFilteredCalculationResults(result)
        setDefaultCalculationResult(filteredResult)
        const selectedLoanInitialValue = filteredResult[0] ?? null
        trackMoengageLoanCalc(selectedLoanInitialValue)
        setSelectedLoan(selectedLoanInitialValue)
        setCalculationApiPayload(payloadUsedCar)
        scrollToResult()
      })
      .catch((error: any) => {
        if (error?.response?.data?.message) {
          setToastMessage(`${error?.response?.data?.message}`)
        } else {
          setToastMessage(
            'Mohon maaf, terjadi kendala jaringan silahkan coba kembali lagi',
          )
        }
        setIsOpenToast(true)
        setDisableBtnCalculate(false)
      })
      .finally(() => {
        setIsLoadingCalculation(false)
        setDisableBtnCalculate(false)
      })
  }

  useEffect(() => {
    defaultValueCalculcator()
  }, [])

  const updateSelectedVariantData = () => {
    if (!!forms.variant?.variantId) {
      const currentVariantWithUpdatedData = carVariantList.filter(
        (item) => item.id === forms.variant?.variantId,
      )

      if (currentVariantWithUpdatedData.length !== 0) {
        setForms({
          ...forms,
          variant: {
            variantId: currentVariantWithUpdatedData[0].id,
            variantName: currentVariantWithUpdatedData[0].name,
            otr: `Rp${formatPriceNumberThousandDivisor(
              currentVariantWithUpdatedData[0].priceValue,
              LanguageCode.id,
            )}`,
            discount: currentVariantWithUpdatedData[0].discount,
          },
        })
      }

      // no need to setForms again when update currently selected variant
      return
    }
  }

  const getCreditBadgeForCountlyTracker = () => {
    let creditBadge = 'Null'
    if (loanRankcr && loanRankcr.includes(LoanRank.Green)) {
      creditBadge = 'Mudah disetujui'
    } else if (loanRankcr && loanRankcr.includes(LoanRank.Red)) {
      creditBadge = 'Sulit disetujui'
    }

    return creditBadge
  }

  const trackCountlyViewCreditTab = async () => {
    const pageReferrer = getSessionStorage(SessionStorageKey.PageReferrerLC)
    const previousSourceSection = getSessionStorage(
      SessionStorageKey.PreviousSourceSectionLC,
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

    if (client && !!window?.Countly?.q) {
      trackEventCountly(CountlyEventNames.WEB_LOAN_CALCULATOR_PAGE_VIEW, {
        PAGE_ORIGINATION: 'PDP Credit Tab',
        PAGE_REFERRER: pageReferrer ?? 'Null',
        PREVIOUS_SOURCE_SECTION: previousSourceSection ?? 'Null',
        FINCAP_FILTER_USAGE: isUsingFilterFinancial ? 'Yes' : 'No',
        PELUANG_KREDIT_BADGE: isUsingFilterFinancial
          ? getCreditBadgeForCountlyTracker()
          : 'Null',
        CAR_BRAND: carModelDetails?.brand,
        CAR_MODEL: carModelDetails?.model,
        USER_TYPE: valueForUserTypeProperty(),
        INITIAL_PAGE: pageReferrer ? 'No' : valueForInitialPageProperty(),
        TEMAN_SEVA_STATUS: temanSevaStatus,
      })

      setIsSentCountlyPageView(true)
      removeSessionStorage(SessionStorageKey.PageReferrerLC)
      removeSessionStorage(SessionStorageKey.PreviousSourceSectionLC)
    }
  }

  useEffect(() => {
    const timeoutCountlyTracker = setTimeout(() => {
      if (!isSentCountlyPageView) {
        trackCountlyViewCreditTab()
      }
    }, 1000) // use timeout because countly tracker cant process multiple event triggered at the same time

    return () => clearTimeout(timeoutCountlyTracker)
  }, [])

  useEffect(() => {
    if (calculationResult.length) {
      setIsDataSubmitted(true)
    }
  }, [calculationResult])

  useEffect(() => {
    if (dpPercentage !== 20) {
      setHidden(true)
    }
  }, [dpPercentage])

  React.useEffect(() => {
    setForms({
      ...forms,
      monthlyIncome: funnelQuery?.monthlyIncome?.toString() || '',
      age: funnelQuery?.age?.toString() || '',
    })
  }, [funnelQuery])

  useEffect(() => {
    if (
      carModelDetails !== undefined &&
      carVariantDetails !== undefined &&
      recommendation !== undefined
    ) {
      trackEventMoengage()
      autofillCarModelAndVariantData()
    }
  }, [carModelDetails, carVariantDetails, recommendation])

  useEffect(() => {
    if (forms.model?.modelId && forms.city) {
      fetchCarVariant()
    }
  }, [forms.model?.modelId, forms.city])

  React.useEffect(() => {
    if (!forms?.city?.cityCode) {
      // tempData is used to keep read-only model data
      // because credit tab can be used without selecting cityOtr first (city null)
      const tempData = {
        model: {
          brandName: '',
          modelName: '',
          modelId: '',
          modelImage: '',
          loanRank: '',
        },
      }

      if (carModelDetails) {
        tempData.model.brandName = carModelDetails.brand
        tempData.model.modelName = `${carModelDetails.brand} ${carModelDetails.model}`
        tempData.model.modelId = carModelDetails.id
        tempData.model.modelImage = carModelDetails.images[0]
      }

      setForms({
        ...forms,
        ...tempData,
        variant: variantEmptyValue,
      })
    }
  }, [forms.city?.cityCode])

  useEffect(() => {
    const temp = usedCarRecommendations.filter(
      (data: any) => data.id !== usedCarModelDetailsRes.carId,
    )

    setUsedCarRecommendationList(temp.slice(0, 10))
  }, [usedCarRecommendations, usedCarModelDetailsRes])

  useEffect(() => {
    const temp = usedCarNewRecommendations

    const result = temp.slice(0, 10)

    setUsedCarNewRecommendationList(result)
  }, [usedCarNewRecommendations, usedCarModelDetailsRes])

  useEffect(() => {
    if (isDpTooLow || isDpExceedLimit) {
      setIsDisableCtaCalculate(true)
      return
    } else {
      setIsDisableCtaCalculate(false)
    }
  }, [isDpTooLow, isDpExceedLimit])

  useEffect(() => {
    updateSelectedVariantData()
  }, [carVariantList])

  const passedVariantData = useMemo(() => {
    return (
      carModelDetails?.variants.filter(
        (item) => item.id === router.query?.selectedVariantId,
      ) || []
    )
  }, [carModelDetails])

  useEffect(() => {
    if (carModelDetails && flag === TrackerFlag.Init) {
      setFlag(TrackerFlag.Sent)
    }
  }, [carModelDetails])

  const trackEventMoengage = () => {
    if (
      !carModelDetails ||
      !carVariantDetails ||
      recommendation.length === 0 ||
      flagMoengage === TrackerFlag.Sent
    )
      return

    const objData = {
      brand: carModelDetails?.brand,
      model: carModelDetails?.model,
      ...(passedVariantData.length > 0 && {
        variants: passedVariantData[0].name,
      }),
      ...(router.query?.selectedVariantId &&
        passedVariantData.length > 0 && {
          down_payment:
            (passedVariantData[0].priceValue - passedVariantData[0].discount) *
            0.2,
        }),
      ...(funnelQuery.monthlyIncome && {
        income: funnelQuery.monthlyIncome,
      }),
      ...(funnelQuery.age && {
        age: funnelQuery.age,
      }),
      ...(!!cityOtr?.cityName && { city: cityOtr?.cityName }),
    }
    setTrackEventMoEngage(
      MoengageEventName.view_variant_list_credit_tab,
      objData,
    )
    setFlagMoengage(TrackerFlag.Sent)
  }

  const fetchCarVariant = async () => {
    const response = await getCarModelDetailsById(forms.model?.modelId ?? '')
    setCarVariantList(response.variants)
    setIsSelectPassengerCar(response.isPassengerCar)
  }

  const saveDataCarForLoginPageView = (variantName: string) => {
    const dataCarTemp = {
      ...dataCar,
      CAR_VARIANT: variantName,
    }
    saveSessionStorage(
      SessionStorageKey.PreviousCarDataBeforeLogin,
      JSON.stringify(dataCarTemp),
    )
  }
  const handleChange = (name: string, value: any) => {
    setIsDataSubmitted(false)
    if (name === 'variant') {
      saveDataCarForLoginPageView(value.variantName)
    }
    if (name === 'city') {
      if (!value) {
        return setForms({
          ...forms,
          [name]: value,
          variant: variantEmptyValue,
          downPaymentAmount: '0',
        })
      }
    }

    if (name === 'model') {
      setForms({
        ...forms,
        [name]: value,
        variant: variantEmptyValue,
      })
      // after set value & reset variant, no need to set value again
      return
    }

    if (name === 'paymentOption') {
      trackEventCountly(
        CountlyEventNames.WEB_LOAN_CALCULATOR_PAGE_ANGSURAN_TYPE_CLICK,
        { ...dataForCountlyTrackerOnClick(), ANGSURAN_TYPE: value },
      )
    }

    setForms({
      ...forms,
      [name]: value,
    })
  }

  const handleDpChange = (value: number, percentage: number) => {
    setDpValue(value)
    setDpPercentage(percentage)
  }

  const handleDpPercentageChange = (value: number, percentage: number) => {
    setDpValue(value)
    setDpPercentage(percentage)
  }

  const getCarOtrNumber = () => {
    return Number(usedCarModelDetailsRes?.priceValue.split('.')[0])
  }

  const getCarDiscountNumber = () => {
    return Number(forms.variant?.discount ?? 0)
  }

  const getFilteredCalculationResults = (calculationResult: any) => {
    const tempArr = calculationResult
    if (!isSelectPassengerCar) {
      const fiveYearIndex = tempArr.findIndex((item: any) => item.tenure == 5)
      if (fiveYearIndex !== -1) {
        tempArr.splice(fiveYearIndex, 1)
      }
    }

    return tempArr
  }

  const saveDefaultTenureCarForLoginPageView = (
    tenure: string,
    loanRank: string,
  ) => {
    const dataCar: trackDataCarType | null = getSessionStorage(
      SessionStorageKey.PreviousCarDataBeforeLogin,
    )
    const dataCarTemp = {
      ...dataCar,
      TENOR_OPTION: tenure,
      TENOR_RESULT: loanRank,
      INCOME_LC: forms.monthlyIncome,
    }
    saveSessionStorage(
      SessionStorageKey.PreviousCarDataBeforeLogin,
      JSON.stringify(dataCarTemp),
    )
  }
  const onClickCalculate = async () => {
    validateFormFields()

    if (isDisableCtaCalculate) {
      return
    }

    setIsLoadingCalculation(true)
    setDisableBtnCalculate(true)
    const payloadUsedCar: CreditCarCalculation = {
      nik: usedCarModelDetailsRes.nik,
      DP: dpValue,
      priceValue: Number(usedCarModelDetailsRes.priceValue.split('.')[0]),
      tenureAR: 0,
      tenureTLO: 60,
      presentaseDP: dpPercentage,
    }
    const queryParam = new URLSearchParams()
    queryParam.append('nik', payloadUsedCar.nik.toString())
    queryParam.append('DP', payloadUsedCar.DP.toString())
    queryParam.append('priceValue', payloadUsedCar.priceValue.toString())
    queryParam.append('tenureAR', payloadUsedCar.tenureAR.toString())
    queryParam.append('tenureTLO', payloadUsedCar.tenureTLO.toString())
    queryParam.append('presentaseDP', payloadUsedCar.presentaseDP.toString())
    getCarCreditsSk('', { params: queryParam })
      .then((response) => {
        const result = response.data.reverse()
        const filteredResult = getFilteredCalculationResults(result)
        setCalculationResult(filteredResult)

        // // select loan with the longest tenure as default
        const selectedLoanInitialValue = filteredResult[0] ?? null
        trackMoengageLoanCalc(selectedLoanInitialValue)
        setSelectedLoan(selectedLoanInitialValue)
        setCalculationApiPayload(payloadUsedCar)
        saveDefaultTenureCarForLoginPageView(
          selectedLoanInitialValue.tenure,
          selectedLoanInitialValue.loanRank,
        )
        setIsDataSubmitted(true)
        scrollToResult()
      })
      .catch((error: any) => {
        if (error?.response?.data?.message) {
          setToastMessage(`${error?.response?.data?.message}`)
        } else {
          setToastMessage(
            'Mohon maaf, terjadi kendala jaringan silahkan coba kembali lagi',
          )
        }
        setIsOpenToast(true)
        setDisableBtnCalculate(false)
      })
      .finally(() => {
        setIsLoadingCalculation(false)
        setDisableBtnCalculate(false)
      })
  }

  const validateFormFields = () => {
    setIsValidatingEmptyField(false)

    if (chosenAssurance.label === '') {
      scrollToElement('loan-calculator-form-age')
    }
  }

  const scrollToElement = (elementId: string) => {
    const target = document.getElementById(elementId)
    if (target) {
      target.scrollIntoView({ block: 'center' })
    }
  }

  const scrollToResult = () => {
    const element = document.getElementById(
      'loan-calculator-form-and-result-separator',
    )
    if (element) {
      element.scrollIntoView()
      // add more scroll because global page header is fixed position
      window.scrollBy({ top: -100, left: 0 })
    }
  }

  const handleClickButtonQualification = () => {
    setIsAssuranceModalOpen(true)
  }
  const handleTooltipClose = () => {
    setIsTooltipOpen(false)
  }

  const onCloseQualificationPopUp = () => {
    setIsAssuranceModalOpen(false)
  }

  const dataForCountlyTrackerOnClick = () => {
    return {
      PAGE_ORIGINATION: 'PDP Credit Tab',
      CAR_BRAND: forms.model?.brandName ?? 'Null',
      CAR_MODEL: removeCarBrand(forms.model?.modelName ?? 'Null'),
    }
  }

  const onFocusDpAmountField = () => {
    trackEventCountly(
      CountlyEventNames.WEB_LOAN_CALCULATOR_PAGE_DP_AMOUNT_CLICK,
      dataForCountlyTrackerOnClick(),
    )
  }

  const onFocusDpPercentageField = () => {
    trackEventCountly(
      CountlyEventNames.WEB_LOAN_CALCULATOR_PAGE_DP_PERCENTAGE_CLICK,
      dataForCountlyTrackerOnClick(),
    )
  }

  const toLeads = useRef<null | HTMLDivElement>(null)
  const scrollToLeads = () => {
    toLeads.current?.scrollIntoView({ behavior: 'smooth', inline: 'start' })
  }

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <div className={styles.formCardHeader}>
          <div className={styles.iconWrapper}>
            <IconMoney
              width={24}
              height={24}
              color="#B4231E"
              alt="SEVA Rupiah Icon"
            />
          </div>
          <h3 className={styles.formCardTitle}>Hitung Cicilan</h3>
        </div>

        <div className={styles.formWrapper}>
          {/* TODO : Implement carPrice by Car Variant Price */}
          <div id="loan-calculator-form-dp">
            <DpUsedCarForm
              label="Kemampuan DP (Min. 20%)"
              value={dpValue}
              percentage={dpPercentage}
              onChange={handleDpChange}
              emitDpPercentageChange={handleDpPercentageChange}
              carPriceMinusDiscount={getCarOtrNumber() - getCarDiscountNumber()}
              handleChange={handleChange}
              name="downPaymentAmount"
              isDisabled={false}
              isErrorEmptyField={isValidatingEmptyField && !dpValue}
              isDpTooLow={isDpTooLow}
              setIsDpTooLow={setIsDpTooLow}
              isDpExceedLimit={isDpExceedLimit}
              setIsDpExceedLimit={setIsDpExceedLimit}
              emitOnFocusDpAmountField={onFocusDpAmountField}
              emitOnFocusDpPercentageField={onFocusDpPercentageField}
              setIsOpenEducationalPopup={setIsOpenEducationalDpPopup}
            />
          </div>
          <Button
            version={ButtonVersion.PrimaryDarkBlue}
            size={ButtonSize.Big}
            onClick={onClickCalculate}
            style={{ marginTop: 32 }}
            disabled={disableBtnCalculate}
            data-testid={elementId.PDP.Button.HitungKemampuan}
          >
            {isLoadingCalculation ? (
              <div className={`${styles.iconWrapper} rotateAnimation`}>
                <IconLoading width={14} height={14} color="#FFFFFF" />
              </div>
            ) : (
              'Hitung Cicilan'
            )}
          </Button>
        </div>
      </div>

      <div className={styles.gap} />

      <div id="loan-calculator-form-and-result-separator"></div>

      {calculationResult.length > 0 &&
      !isLoadingCalculation &&
      isDataSubmitted ? (
        <>
          <div className={styles.formCardCalculationResult}>
            <CalculationUsedCarResult
              data={calculationResult}
              selectedLoan={selectedLoan}
              setSelectedLoan={setSelectedLoan}
              angsuranType={forms.paymentOption}
              isTooltipOpen={isTooltipOpen}
              isQualificationModalOpen={isAssuranceModalOpen}
              closeTooltip={handleTooltipClose}
              handleClickButtonQualification={handleClickButtonQualification}
              formData={forms}
              insuranceAndPromoForAllTenure={insuranceAndPromoForAllTenure}
              setInsuranceAndPromoForAllTenure={
                setInsuranceAndPromoForAllTenure
              }
              calculationApiPayload={calculationApiPayload}
              pageOrigination={'PDP Credit Tab'}
              scrollToLeads={scrollToLeads}
              setCalculationResult={setCalculationResult}
              setChosenAssurance={setChosenAssurance}
            />
          </div>
          <div
            ref={toLeads}
            className={
              showAnnouncementBox
                ? styles.reference
                : styles.referenceWithoutAnnounce
            }
          ></div>
          <LeadsFormUsedCar
            selectedLoan={selectedLoan}
            chosenAssurance={chosenAssurance}
          />
        </>
      ) : defaultCalculcationResult.length && !hidden ? (
        <>
          <div className={styles.formCardCalculationResult}>
            <CalculationUsedCarResult
              data={defaultCalculcationResult}
              selectedLoan={selectedLoan}
              setSelectedLoan={setSelectedLoan}
              angsuranType={forms.paymentOption}
              isTooltipOpen={isTooltipOpen}
              isQualificationModalOpen={isAssuranceModalOpen}
              closeTooltip={handleTooltipClose}
              handleClickButtonQualification={handleClickButtonQualification}
              formData={forms}
              insuranceAndPromoForAllTenure={insuranceAndPromoForAllTenure}
              setInsuranceAndPromoForAllTenure={
                setInsuranceAndPromoForAllTenure
              }
              calculationApiPayload={calculationApiPayload}
              pageOrigination={'PDP Credit Tab'}
              scrollToLeads={scrollToLeads}
              setCalculationResult={setCalculationResult}
              setChosenAssurance={setChosenAssurance}
            />
          </div>
          <div
            ref={toLeads}
            className={
              showAnnouncementBox
                ? styles.reference
                : styles.referenceWithoutAnnounce
            }
          ></div>
          <LeadsFormUsedCar
            selectedLoan={selectedLoan}
            chosenAssurance={chosenAssurance}
          />
        </>
      ) : (
        <></>
      )}

      <div className={styles.wrapper}>
        {usedCarNewRecommendationList?.length > 0 && (
          <NewCarRecommendations
            carRecommendationList={usedCarNewRecommendationList}
            title="Rekomendasi Mobil Baru"
            onClick={() => {
              return
            }}
            selectedCity={forms?.city?.cityName}
            additionalContainerStyle={styles.recommendationAdditionalStyle}
          />
        )}
      </div>
      {usedCarRecommendationList?.length > 0 && (
        <UsedCarRecommendations
          usedCarRecommendationList={usedCarRecommendationList}
          title="Beli Mobil Bekas Berkualitas"
          onClick={() => {
            return
          }}
          additionalContainerStyle={styles.recommendationAdditionalStyle}
        />
      )}
      <AssuranceCreditModal
        isOpen={isAssuranceModalOpen}
        onClickCloseButton={onCloseQualificationPopUp}
        formData={forms}
      />
      <Toast
        width={339}
        open={isOpenToast}
        text={toastMessage}
        typeToast={'error'}
        onCancel={() => setIsOpenToast(false)}
        closeOnToastClick
      />
      <EducationalContentPopupUsedCar
        isOpenBottomSheet={isOpenEducationalDpPopup}
        onButtonClick={() => {
          setIsOpenEducationalDpPopup(false)
        }}
      />
    </div>
  )
}
