import {
  formatNumberByLocalization,
  replacePriceSeparatorByLocalization,
  rupiah,
} from 'utils/handler/rupiah'
import {
  Article,
  CityOtrOption,
  CreditCarCalculation,
  FinalLoan,
  LoanCalculatorIncludePromoPayloadType,
  LoanCalculatorInsuranceAndPromoType,
  SelectedCalculateLoanUsedCar,
  SpecialRateListWithPromoType,
  UsedCarRecommendation,
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
import {
  LeadsFormSecondary,
  UsedCarRecommendations,
} from 'components/organisms'
import styles from 'styles/components/organisms/creditUsedCarTab.module.scss'
import { Button, Gap, IconCalculator, IconLoading } from 'components/atoms'
import {
  FormPromoCode,
  FormSelectCarVariant,
  FormSelectCity,
  FormSelectModelCar,
  Info,
} from 'components/molecules'
import { availableList, availableListColors } from 'config/AvailableListColors'
import { getMinimumMonthlyInstallment } from 'utils/carModelUtils/carModelUtils'
import { client, hundred, million } from 'utils/helpers/const'
import {
  defaultCity,
  saveCity,
} from 'utils/hooks/useCurrentCityOtr/useCurrentCityOtr'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import IncomeForm from 'components/molecules/credit/income'
import DpUsedCarForm from 'components/molecules/credit/dpUsedCar'
import { CicilOptionForm } from 'components/molecules/credit/cicil'
import { FormAsuransiCredit } from 'components/molecules/credit/asuransi'
import { useSessionStorageWithEncryption } from 'utils/hooks/useSessionStorage/useSessionStorage'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import {
  CarRecommendation,
  SimpleCarVariantDetail,
  SpecialRateListType,
} from 'utils/types/utils'
import { variantEmptyValue } from 'components/molecules/form/formSelectCarVariant'
import { useFinancialQueryData } from 'services/context/finnancialQueryContext'
import { getLocalStorage, saveLocalStorage } from 'utils/handler/localStorage'
import elementId from 'helpers/elementIds'
import { useRouter } from 'next/router'
import { CarModel } from 'utils/types/carModel'
import { ModelVariant } from 'utils/types/carVariant'
import { TrackVariantList } from 'utils/types/tracker'
import { useCar } from 'services/context/carContext'
import { LanguageCode, LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { ageOptions, assuranceOptions } from 'utils/config/funnel.config'
import { formatPriceNumberThousandDivisor } from 'utils/numberUtils/numberUtils'
import { getToken } from 'utils/handler/auth'
import {
  generateAllBestPromoList,
  getInstallmentAffectedByPromo,
  getInterestRateAffectedByPromo,
  getTdpAffectedByPromo,
} from 'utils/loanCalculatorUtils'
import { removeFirstWordFromString } from 'utils/stringUtils'
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
import {
  getCarCreditsSk,
  getLoanCalculatorInsurance,
  getRecommendation,
  getUsedCarRecommendations,
  postCheckPromoGiias,
  postLoanPermutationIncludePromo,
} from 'services/api'
import { getCarModelDetailsById } from 'utils/handler/carRecommendation'
import { getCustomerInfoSeva } from 'utils/handler/customer'
import { getNewFunnelRecommendations } from 'utils/handler/funnel'
import { getCustomerAssistantWhatsAppNumber } from 'utils/handler/lead'
import { IconMoney } from 'components/atoms/icon'
import { UsedPdpDataLocalContext } from 'pages/mobil-bekas/p/[[...slug]]'
import { LeadsFormUsedCar } from 'components/organisms'

const CalculationUsedCarResult = dynamic(() =>
  import('components/organisms').then((mod) => mod.CalculationUsedCarResult),
)
const NewCarRecommendations = dynamic(
  () => import('components/organisms/NewCarRecommendations'),
)
const CreditCualificationBenefit = dynamic(
  () => import('components/organisms/CreditCualificationBenefit'),
)
const Articles = dynamic(() =>
  import('components/organisms').then((mod) => mod.Articles),
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

export const CreditUsedCarTab = () => {
  const { usedCarModelDetailsRes, usedCarRecommendations } = useContext(
    UsedPdpDataLocalContext,
  )
  const router = useRouter()
  const { carModelDetails, carVariantDetails, recommendation } = useCar()
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const [info, setInfo] = useState<any>({})
  const { funnelQuery, patchFunnelQuery } = useFunnelQueryData()
  const [isDisableCtaCalculate, setIsDisableCtaCalculate] = useState(true)
  const [isValidatingEmptyField, setIsValidatingEmptyField] = useState(false)
  const [isLoadingCalculation, setIsLoadingCalculation] = useState(false)
  const [, setPromoCodeSessionStorage] =
    useSessionStorageWithEncryption<string>(
      SessionStorageKey.PromoCodeGiiass,
      '',
    )
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)
  const [allModelCarList, setAllModalCarList] = useState<CarModel[]>([])
  const [carVariantList, setCarVariantList] = useState<ModelVariant[]>([])
  const [modelError, setModelError] = useState<boolean>(false)
  const [isIncomeTooLow, setIsIncomeTooLow] = useState(false)
  const [dpValue, setDpValue] = useState<number>(0)
  const [dpPercentage, setDpPercentage] = useState<number>(20)
  const [mappedDpPercentage, setMappedDpPercentage] = useState<number>(20)
  const [isDpTooLow, setIsDpTooLow] = useState<boolean>(false)
  const [isDpExceedLimit, setIsDpExceedLimit] = useState<boolean>(false)
  const [installmentType, setInstallmentType] =
    useState<InstallmentTypeOptions>(InstallmentTypeOptions.ADDB)
  const [calculationResult, setCalculationResult] = useState([])
  const [isTooltipOpen, setIsTooltipOpen] = useState(false)
  const [tooltipNextDisplay, setTooltipNextDisplay] = useState<string | null>(
    null,
  )
  const [isAssuranceModalOpen, setIsAssuranceModalOpen] = useState(false)
  const [chosenAssurance, setChosenAssurance] = useState<any>({})
  const [carRecommendations, setCarRecommendations] = useState<
    CarRecommendation[]
  >([])

  const [articles, setArticles] = React.useState<Article[]>([])
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
  const [, setSimpleCarVariantDetails] =
    useLocalStorage<SimpleCarVariantDetail | null>(
      LocalStorageKey.SimpleCarVariantDetails,
      null,
    )
  const [insuranceAndPromoForAllTenure, setInsuranceAndPromoForAllTenure] =
    useState<LoanCalculatorInsuranceAndPromoType[]>([])
  const [isLoadingInsuranceAndPromo, setIsLoadingInsuranceAndPromo] =
    useState(false)
  const [isSelectPassengerCar, setIsSelectPassengerCar] = useState(false)
  const [calculationApiPayload, setCalculationApiPayload] =
    useState<LoanCalculatorIncludePromoPayloadType>()

  const referralCodeLocalStorage = getLocalStorage<string>(
    LocalStorageKey.referralTemanSeva,
  )
  const [isUserHasReffcode, setIsUserHasReffcode] = useState(false)
  const [isOpenToast, setIsOpenToast] = useState(false)
  const [finalLoan, setFinalLoan] = useState<FinalLoan>({
    selectedInsurance: {},
    selectedPromoFinal: [],
    tppFinal: 0,
    tdpBeforePromo: 0,
    installmentFinal: 0,
    interestRateFinal: 0,
    interestRateBeforePromo: 0,
    installmentBeforePromo: 0,
  })
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
  const checkReffcode = () => {
    if (referralCodeLocalStorage) {
      setIsUserHasReffcode(true)
    } else if (!!getToken()) {
      getCustomerInfoSeva().then((response) => {
        if (response[0].temanSevaTrxCode) {
          setIsUserHasReffcode(true)
        }
      })
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
    // console.log
    fetchCarRecommendations()
    const timeoutCountlyTracker = setTimeout(() => {
      if (!isSentCountlyPageView) {
        trackCountlyViewCreditTab()
      }
    }, 1000) // use timeout because countly tracker cant process multiple event triggered at the same time

    const nextDisplay = localStorage.getItem('tooltipNextDisplay')
    if (nextDisplay) {
      setTooltipNextDisplay(nextDisplay)
    }

    return () => clearTimeout(timeoutCountlyTracker)
  }, [])

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
      getSummaryInfo()
      autofillCarModelAndVariantData()
    }
  }, [carModelDetails, carVariantDetails, recommendation])

  useEffect(() => {
    if (forms.model?.modelId && forms.city) {
      fetchCarVariant()
    }
  }, [forms.model?.modelId, forms.city])

  useEffect(() => {
    if (modelError) {
      resetVariant()
    }
  }, [modelError])

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
    if (
      Object.keys(chosenAssurance).length === 0 &&
      chosenAssurance.length === undefined
    ) {
      setIsDisableCtaCalculate(true)
      return
    } else {
      setIsDisableCtaCalculate(false)
    }
  }, [chosenAssurance])

  useEffect(() => {
    updateSelectedVariantData()
    checkReffcode()
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

  const getDimenssion = (payload: any) => {
    return payload.filter((car: any) => car.id === carModelDetails?.id)[0]
  }

  const getTransmissionType = (payload: any) => {
    if (payload) {
      const type: Array<string> = payload
        .map((item: any) => item.transmission)
        .filter(
          (value: any, index: number, self: any) =>
            self.indexOf(value) === index,
        )

      return type
    }
  }
  const getPriceRange = (payload: any) => {
    if (payload) {
      const variantLength = payload.length
      if (variantLength === 1) {
        const price: string = rupiah(payload[0].priceValue)
        return `yang tersedia dalam kisaran harga mulai dari ${price}`
      } else {
        const upperPrice = rupiah(payload[0].priceValue)
        const lowerPrice = rupiah(payload[variantLength - 1].priceValue)

        return `yang tersedia dalam kisaran harga ${lowerPrice} - ${upperPrice} juta`
      }
    }
  }

  const getColorVariant = () => {
    const currentUrlPathName = window.location.pathname
    const splitedPath = currentUrlPathName.split('/')
    const carBrandModelUrl = `/${splitedPath[1]}/${splitedPath[2]}/${splitedPath[3]}`
    if (availableList.includes(carBrandModelUrl)) {
      const colorsTmp = availableListColors.filter(
        (url) => url.url === carBrandModelUrl,
      )[0].colors

      return colorsTmp.length
    }
  }

  const getCreditPrice = (payload: any) => {
    return getMinimumMonthlyInstallment(
      payload,
      LanguageCode.en,
      million,
      hundred,
    )
  }

  const getSummaryInfo = () => {
    const brand = carModelDetails?.brand || ''
    const model = carModelDetails?.model || ''
    const type = carVariantDetails?.variantDetail.bodyType
    const seats = carVariantDetails?.variantDetail.carSeats
    const priceRange = getPriceRange(carModelDetails?.variants)
    const totalType = carModelDetails?.variants.length
    const color = getColorVariant()
    const dimenssion = getDimenssion(recommendation)
    const credit = getCreditPrice(carModelDetails?.variants)
    const month = carModelDetails && carModelDetails!.variants[0].tenure * 12
    const transmissionType = getTransmissionType(
      carModelDetails?.variants,
    )?.length
    const transmissionDetail = getTransmissionType(
      carModelDetails?.variants,
    )?.join(' dan ')
    const CarVariants = carModelDetails?.variants
    const dpAmount = carModelDetails?.variants.sort(
      (a: any, b: any) => a.priceValue - b.priceValue,
    )[0].dpAmount

    const info = {
      brand,
      model,
      type,
      seats,
      priceRange,
      totalType,
      color,
      width: dimenssion?.width,
      height: dimenssion?.height,
      length: dimenssion?.length,
      credit,
      month,
      transmissionType,
      transmissionDetail,
      carVariants: CarVariants,
      carModelId: dimenssion?.id,
      lowestAssetPrice: dimenssion?.lowestAssetPrice,
      highestAssetPrice: dimenssion?.highestAssetPrice,
      dpAmount: dpAmount,
    }
    setInfo(info)
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
      } else {
        const isModelFound = allModelCarList.find(
          (model) => model.id === forms.model?.modelId,
        )

        if (!isModelFound) {
          setForms({
            ...forms,
            [name]: value,
            variant: variantEmptyValue,
          })
          // after set value & reset variant, no need to set value again
          return
        }
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

    if (name === 'monthlyIncome') {
      setIsIncomeTooLow(false)
    }

    if (name === 'paymentOption') {
      trackEventCountly(
        CountlyEventNames.WEB_LOAN_CALCULATOR_PAGE_ANGSURAN_TYPE_CLICK,
        { ...dataForCountlyTrackerOnClick(), ANGSURAN_TYPE: value },
      )
    }

    if (name === 'assurance') {
      const result = assuranceOptions.find((opt: any) => opt.label === value)
      setChosenAssurance(result)
    }

    setForms({
      ...forms,
      [name]: value,
    })
  }

  const renderErrorMessageEmpty = () => {
    return (
      <div className={`${styles.errorMessageWrapper} shake-animation-X`}>
        <span className={styles.errorMessage}>Wajib diisi</span>
      </div>
    )
  }

  const handleDpChange = (
    value: number,
    percentage: number,
    mappedPercentage: number,
  ) => {
    setDpValue(value)
    setDpPercentage(percentage)
    setMappedDpPercentage(mappedPercentage)
  }

  const handleDpPercentageChange = (
    value: number,
    percentage: number,
    mappedPercentage: number,
  ) => {
    setDpValue(value)
    setDpPercentage(percentage)
    setMappedDpPercentage(mappedPercentage)
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
    const payloadUsedCar: CreditCarCalculation = {
      nik: usedCarModelDetailsRes.nik,
      DP: dpValue,
      priceValue: Number(usedCarModelDetailsRes.priceValue.split('.')[0]),
      tenureAR: chosenAssurance.tenureAR,
      tenureTLO: chosenAssurance.tenureTLO,
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
        setSelectedLoan(selectedLoanInitialValue)
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
      })
      .finally(() => {
        setIsLoadingCalculation(false)
      })
  }

  const validateFormFields = () => {
    setIsValidatingEmptyField(true)

    if (Object.keys(chosenAssurance).length === 0) {
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
    if (!tooltipNextDisplay || isTooltipExpired()) {
      setIsTooltipOpen(true)
      trackCountlyOnShowTooltip()
      const nextDisplay = calculateNextDisplayDate().toString()
      setTooltipNextDisplay(nextDisplay)
      localStorage.setItem('tooltipNextDisplay', nextDisplay)
    }
  }

  const handleClickButtonQualification = () => {
    setIsAssuranceModalOpen(true)
  }

  const isTooltipExpired = (): boolean => {
    const currentDate = new Date().getTime()
    const nextDisplayDate = new Date(tooltipNextDisplay!).getTime()
    return currentDate > nextDisplayDate
  }

  const calculateNextDisplayDate = (): Date => {
    const nextDisplayDate = new Date()
    nextDisplayDate.setDate(nextDisplayDate.getDate() + 30) // Add 30 days
    return nextDisplayDate
  }

  const handleTooltipClose = () => {
    setIsTooltipOpen(false)
  }

  const fetchCarRecommendations = async () => {
    const response = await getNewFunnelRecommendations({
      ...funnelQuery,
      sortBy: 'highToLow',
      age: forms?.age,
      monthlyIncome: forms?.monthlyIncome,
    })
    const filteredCarRecommendations = response.carRecommendations.filter(
      (car: any) => car.loanRank === LoanRank.Green,
    )
    setCarRecommendations(filteredCarRecommendations.slice(0, 10))
  }

  const resetVariant = () => {
    // when using this func, make sure to not exec "setForms" again
    // because there will be discrepancy (set state is async)
    setForms({
      ...forms,
      variant: variantEmptyValue,
    })
  }

  const onCloseQualificationPopUp = () => {
    setIsAssuranceModalOpen(false)
  }

  const formatCurrency = (value: number): string => {
    return `Rp${value.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`
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

  const onAfterChangeDpSlider = () => {
    const hasTrackedDpSliderLC = getSessionStorage(
      SessionStorageKey.HasTrackedDpSliderLC,
    )
    if (!hasTrackedDpSliderLC) {
      trackEventCountly(
        CountlyEventNames.WEB_LOAN_CALCULATOR_PAGE_DP_SLIDER_CLICK,
        dataForCountlyTrackerOnClick(),
      )
      saveSessionStorage(SessionStorageKey.HasTrackedDpSliderLC, 'true')
    }
  }

  const onShowDropdownAgeField = () => {
    trackEventCountly(
      CountlyEventNames.WEB_LOAN_CALCULATOR_PAGE_AGE_CLICK,
      dataForCountlyTrackerOnClick(),
    )
  }

  const trackCountlyOnShowTooltip = () => {
    trackEventCountly(
      CountlyEventNames.WEB_LOAN_CALCULATOR_PAGE_KUALIFIKASI_KREDIT_COACHMARK_VIEW,
      {
        ...dataForCountlyTrackerOnClick(),
        CAR_VARIANT: forms.variant?.variantName ?? 'Null',
      },
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
              alt="SEVA Calculator Hitung Kemampuan Icon"
            />
          </div>
          <h3 className={styles.formCardTitle}>Hitung Angsuran</h3>
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
              isErrorEmptyField={
                isValidatingEmptyField && !forms.downPaymentAmount
              }
              isDpTooLow={isDpTooLow}
              setIsDpTooLow={setIsDpTooLow}
              isDpExceedLimit={isDpExceedLimit}
              setIsDpExceedLimit={setIsDpExceedLimit}
              emitOnFocusDpAmountField={onFocusDpAmountField}
              emitOnFocusDpPercentageField={onFocusDpPercentageField}
              emitOnAfterChangeDpSlider={onAfterChangeDpSlider}
            />
          </div>
          <div
            id="loan-calculator-form-age"
            className={styles.loanCalculatorFormAge}
          >
            <FormAsuransiCredit
              ageList={assuranceOptions}
              name="assurance"
              handleChange={handleChange}
              defaultValue={chosenAssurance?.length > 0 ? chosenAssurance : ''}
              onShowDropdown={onShowDropdownAgeField}
              isError={isValidatingEmptyField && !chosenAssurance}
              setIsAssuranceModal={setIsAssuranceModalOpen}
            />
            {isValidatingEmptyField && Object.keys(chosenAssurance).length === 0
              ? renderErrorMessageEmpty()
              : null}
          </div>
          <Button
            version={ButtonVersion.PrimaryDarkBlue}
            size={ButtonSize.Big}
            onClick={onClickCalculate}
            style={{ marginTop: 32 }}
            data-testid={elementId.PDP.Button.HitungKemampuan}
          >
            {isLoadingCalculation || isLoadingInsuranceAndPromo ? (
              <div className={`${styles.iconWrapper} rotateAnimation`}>
                <IconLoading width={14} height={14} color="#FFFFFF" />
              </div>
            ) : (
              'Hitung Angsuran'
            )}
          </Button>
        </div>
      </div>

      <div className={styles.gap} />

      <div id="loan-calculator-form-and-result-separator"></div>

      {calculationResult.length > 0 &&
      !isLoadingCalculation &&
      !isLoadingInsuranceAndPromo &&
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
              setFinalLoan={setFinalLoan}
              pageOrigination={'PDP Credit Tab'}
              scrollToLeads={scrollToLeads}
            />
          </div>
          <div ref={toLeads} className={styles.reference}></div>
          <LeadsFormUsedCar selectedLoan={selectedLoan} />
        </>
      ) : (
        <></>
      )}

      <div className={styles.wrapper}>
        {carRecommendations.length > 0 && (
          <NewCarRecommendations
            carRecommendationList={carRecommendations}
            title="Rekomendasi Mobil Baru"
            onClick={() => {
              return
            }}
            selectedCity={forms?.city?.cityName}
            additionalContainerStyle={styles.recommendationAdditionalStyle}
          />
        )}
      </div>
      <div className={styles.wrapper}>
        {usedCarRecommendations?.length > 0 && (
          <UsedCarRecommendations
            usedCarRecommendationList={usedCarRecommendations}
            title="Beli Mobil Bekas Berkualitas"
            onClick={() => {
              return
            }}
            additionalContainerStyle={styles.recommendationAdditionalStyle}
          />
        )}
      </div>
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
    </div>
  )
}
