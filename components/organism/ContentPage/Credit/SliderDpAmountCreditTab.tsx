import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import ReactSlider from 'react-slider'
import { colors } from 'styles/colors'
import { Input } from 'components/atoms/OldInput/Input'
import { Button, IconLoading, IconWarning } from 'components/atoms'
import { useCurrentLanguageFromContext } from 'context/currentLanguageContext/currentLanguageContext'
import { replacePriceSeparatorByLocalization } from 'utils/numberUtils/numberUtils'
import { filterNonDigitCharacters } from 'utils/stringUtils'
import { dpRateCollectionNewCalculator, million } from 'const/const'
import {
  getNewFunnelLoanSpecialRate,
  getNewFunnelRecommendations,
} from 'services/newFunnel'
import {
  CarRecommendation,
  NewFunnelCarVariantDetails,
  SpecialRateList,
} from 'utils/types'
import {
  useContextSurveyFormData,
  useContextSurveyFormPatch,
} from 'context/surveyFormContext/surveyFormContext'
import { useContextSpecialRateResults } from 'context/specialRateResultsContext/specialRateResultsContext'
import {
  InstallmentTypeOptions,
  LanguageCode,
  LoanRank,
  LocalStorageKey,
  SessionStorageKey,
  SurveyFormKey,
} from 'utils/models/models'
import { useFunnelQueryData } from 'context/funnelQueryContext/funnelQueryContext'
import { AxiosResponse } from 'axios'
import { getToken } from 'utils/api'
import { getCustomerInfoWrapperSeva } from 'services/customer'
import { useMediaQuery } from 'react-responsive'
import {
  CarVariantCreditTabParam,
  trackCreditHitungCicilanClick,
  trackVariantListPageCodeFailed,
  trackVariantListPageCodeSuccess,
} from 'helpers/amplitude/seva20Tracking'
import { checkPromoCodeGias } from 'services/preApproval'
import { StyledErrorText, StyledInputPromo } from './Credit'
import { InfoCircleOutlined } from 'components/atoms'
import elementId from 'helpers/elementIds'
import { parsedMonthlyIncome } from 'utils/parsedMonthlyIncome'
import { saveLocalStorage } from 'utils/localstorageUtils'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import {
  getCity,
  saveCity,
} from 'utils/hooks/useCurrentCityOtr/useCurrentCityOtr'
import { CarRecommendationResponse } from 'utils/types/context'
import {
  CityOtrOption,
  dpRateCollectionNewCalculatorTmp,
} from 'utils/types/utils'
import { useLocalStorage } from 'utils/hooks/useLocalStorage/useLocalStorage'
import { useSessionStorageWithEncryption } from 'utils/hooks/useSessionStorage/useSessionStorage'

interface AmountInputProps {
  carVariantDetails: NewFunnelCarVariantDetails
  onRecommendationsResults: (data: CarRecommendation[] | []) => void
  onCalculate?: (value: boolean) => void
  onSubmitted?: (value: boolean) => void
  promoCode: string
  setPromoCode?: (value: string) => void
  setErrorPromo: (value: boolean) => void
  errorPromo?: boolean
  setInvalidCodeMessage: (value: string) => void
  invalidCodeMessage?: string
  setDpAmout: (value: any) => void
  isSubmit: boolean
}

export const SliderDpAmountCreditTab = ({
  carVariantDetails,
  onRecommendationsResults,
  onCalculate,
  onSubmitted,
  promoCode,
  setErrorPromo,
  setInvalidCodeMessage,
  setDpAmout,
  isSubmit = false,
  errorPromo = false,
  setPromoCode,
  invalidCodeMessage = '',
}: AmountInputProps) => {
  const [tmpValue, setTmpValue] = useState(0)
  const [optionADDM, setOptionADDM] = useState(false)
  const [optionADDB, setOptionADDB] = useState(false)
  const [loading, setLoading] = useState(false)
  const { currentLanguage } = useCurrentLanguageFromContext()
  const surveyFormData = useContextSurveyFormData()
  const { specialRateResults, setSpecialRateResults } =
    useContextSpecialRateResults()
  const contextSurveyFormData = useContextSurveyFormData()
  const [inputValue, setInputValue] = useState<string>(
    replacePriceSeparatorByLocalization('', currentLanguage),
  )
  const [oldInputValue, setOldInputValue] = useState<string>('')
  const [selectionStart, setSelectionStart] = useState<number>(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const patchSurveyFormValue = useContextSurveyFormPatch()
  const [isSubmitted, setIsSubmitted] = useState(isSubmit)
  const monthlyIncomeValue = surveyFormData.totalIncome?.value
  const agevalue = surveyFormData.age?.value
  const [minDpValue, setMinDpValue] = useState(0)
  const [maxDpValue, setMaxDpValue] = useState(0)
  const [minDpValueInMillion, setMinDpValueInMillion] = useState(0)
  const [maxDpValueInMillion, setMaxDpValueInMillion] = useState(0)
  const [isErrorMaxDP, setIsErrorMaxDp] = useState(false)
  const [isErrorMinDP, setIsErrorMinDp] = useState(false)
  const [isErrorEmptyDP, setIsErrorEmptyDp] = useState(false)
  const [isCheckValue, setIsCheckValue] = useState(false)
  const [dpPercent, setDpPercent] = useState(0)
  const [isCustomerCRM, setIsCustomerCRM] = useState(false)
  // const [dpOptions, setDpOptions] = useState(0)
  const { funnelQuery } = useFunnelQueryData()
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  const [, setFromGiiasCalculator] = useLocalStorage<boolean | undefined>(
    LocalStorageKey.FromGiiasCalculator,
    false,
  )
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const [isClicked, setIsClicked] = useState(false)
  const [, setPromoCodeSessionStorage] =
    useSessionStorageWithEncryption<string>(
      SessionStorageKey.PromoCodeGiiass,
      '',
    )
  const [isDefaultValue, setIsDefaultValue] = useState(true)
  // let dpRate = Math. 39.997
  // let dpPayload

  // if(dpRate >= 50) {
  //    dpPayload = 50
  // } else{
  //   for(let i = 5; i < dpRateCollection.length; i++){
  //     if(dpRate > dpRateCollection[i] && dpRate < dpRateCollection[i+1]){
  //         dpPayload = dpRateCollection[i]
  //     }
  //   }
  // }

  const prefixComponent = () => {
    return <StyledPrefixText>Rp</StyledPrefixText>
  }
  const onClickADDM = () => {
    if (!loading) {
      setOptionADDB(false)
      setOptionADDM(true)
      setSpecialRateResults([])
    }
  }
  const onClickADDB = () => {
    if (!loading) {
      setOptionADDM(false)
      setOptionADDB(true)
      setSpecialRateResults([])
    }
  }

  const resetLoadingState = () => {
    setLoading(false)
  }

  const numberWithCommas = (value: number) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  const checkPromoCode = async () => {
    setLoading(true)
    if (!promoCode) {
      setPromoCodeSessionStorage('')
      resetLoadingState()
      return true
    }

    setLoading(true)
    try {
      const result: any = await checkPromoCodeGias(promoCode)
      if (result.data.message === 'valid promo code') {
        trackVariantListPageCodeSuccess(promoCode)
        if (result.data.citySelector) {
          const citygias = {
            cityName: result.data.citySelector.cityName,
            cityCode: result.data.citySelector.cityCode,
            province: result.data.citySelector.province,
            id: '',
          }
          saveCity(citygias)
        }
        setErrorPromo(false)
        setPromoCodeSessionStorage(promoCode)
        resetLoadingState()
        return true
      }

      trackVariantListPageCodeFailed(promoCode)
      setErrorPromo(true)
      setInvalidCodeMessage(result.data.message)
      resetLoadingState()
      return false
    } catch (err: any) {
      trackVariantListPageCodeFailed(promoCode)
      setErrorPromo(true)
      setInvalidCodeMessage(
        'Kode yang kamu masukkan tidak tersedia. Masukkan kode yang benar lalu coba kembali.',
      )
      resetLoadingState()
      return false
    }
  }

  const onTrackCreditHitungCicilan = (rateResult: SpecialRateList[]) => {
    if (!isMobile && specialRateResults && specialRateResults?.length !== 0)
      return

    let peluangKredit = ''
    const greenRank = rateResult.filter((x) => x.loanRank === LoanRank.Green)
    const redRank = rateResult.filter((x) => x.loanRank === LoanRank.Red)

    if (greenRank.length > 0 && redRank.length > 0) {
      peluangKredit = 'Mudah, Sulit'
    } else if (greenRank.length > 0) {
      peluangKredit = 'Mudah'
    } else if (redRank.length > 0) {
      peluangKredit = 'Sulit'
    }

    const trackProperties: CarVariantCreditTabParam = {
      Car_Brand: carVariantDetails.modelDetail.brand,
      Car_Model: carVariantDetails.modelDetail.model,
      Car_Variant: carVariantDetails.variantDetail.name,
      OTR: `Rp${replacePriceSeparatorByLocalization(
        carVariantDetails?.variantDetail.priceValue -
          carVariantDetails?.variantDetail.discount ?? 0,
        LanguageCode.id,
      )}`,
      City: cityOtr?.cityName || 'null',
      DP: `Rp${inputValue}`,
      Tenure: String(funnelQuery.tenure),
      Income: `Rp${replacePriceSeparatorByLocalization(
        Number(surveyFormData.totalIncome?.value) ?? 0,
        LanguageCode.id,
      )}`,
      Age: `${surveyFormData.age?.value} tahun`,
      Tipe_Pembayaran: optionADDM
        ? InstallmentTypeOptions.ADDM
        : InstallmentTypeOptions.ADDB,
      Peluang_Kredit: peluangKredit, // Kalo mudah semua = mudah, sulit semua = sulit, campur = mudah,sulit
    }
    trackCreditHitungCicilanClick(trackProperties)
  }

  const onSubmit = async (e: any) => {
    e.preventDefault()
    saveLocalStorage(
      LocalStorageKey.SelectedAngsuranType,
      optionADDM ? InstallmentTypeOptions.ADDM : InstallmentTypeOptions.ADDB,
    )
    setIsClicked(true)
    setFromGiiasCalculator(false)
    onSubmitted && onSubmitted(true)
    setIsCheckValue(true)
    const digitString = filterNonDigitCharacters(inputValue)
    if (digitString.length === 0) {
      resetLoadingState()
      setIsErrorMinDp(true)
    }
    if (!optionADDB && !optionADDM) return
    if (promoCode.length > 0) {
      const isPromoValid = await checkPromoCode()
      if (!isPromoValid) return
    }

    if (carVariantDetails && tmpValue > 0 && !isErrorMinDP && !isErrorMaxDP) {
      setLoading(true)
      if (getToken()) {
        if (isCustomerCRM) {
          saveLocalStorage(LocalStorageKey.SelectedRateType, 'REGULAR')
          getNewFunnelLoanSpecialRate({
            otr:
              carVariantDetails?.variantDetail.priceValue -
                carVariantDetails?.variantDetail.discount ?? 0,
            dp: dpPercent,
            dpAmount: parseInt(digitString),
            monthlyIncome: surveyFormData.totalIncome?.value as number,
            age: surveyFormData.age?.value as string,
            city: getCity().cityCode,
            discount: carVariantDetails?.variantDetail.discount ?? 0,
            rateType: 'REGULAR',
            angsuranType: optionADDM
              ? InstallmentTypeOptions.ADDM
              : InstallmentTypeOptions.ADDB,
          })
            .then((response) => {
              const dataTemp = response.data.data
              // setSpecialRateList(data.reverse())
              setSpecialRateResults(dataTemp.reverse())
              onTrackCreditHitungCicilan(dataTemp)
              resetLoadingState()
              setIsSubmitted(true)
              onCalculate && onCalculate(true)
              scrollToSection()
              patchSurveyFormValue({
                [SurveyFormKey.DownPaymentTmp]: {
                  value:
                    contextSurveyFormData[SurveyFormKey.DownPayment]?.value,
                  isDataValid: true,
                },
                [SurveyFormKey.SpecialRateEnable]: {
                  value: 'enable',
                  isDataValid: true,
                },
              })
            })
            .catch(() => {
              resetLoadingState()
            })
        } else {
          saveLocalStorage(LocalStorageKey.SelectedRateType, 'REGULAR')
          getNewFunnelLoanSpecialRate({
            otr:
              carVariantDetails?.variantDetail.priceValue -
                carVariantDetails?.variantDetail.discount ?? 0,
            dp: dpPercent,
            dpAmount: parseInt(digitString),
            monthlyIncome: surveyFormData.totalIncome?.value as number,
            age: surveyFormData.age?.value as string,
            city: getCity().cityCode,
            discount: carVariantDetails?.variantDetail.discount ?? 0,
            rateType: 'REGULAR',
            angsuranType: optionADDM
              ? InstallmentTypeOptions.ADDM
              : InstallmentTypeOptions.ADDB,
          })
            .then((response) => {
              const dataTemp = response.data.data
              // setSpecialRateList(data.reverse())
              setSpecialRateResults(dataTemp.reverse())
              onTrackCreditHitungCicilan(dataTemp)
              resetLoadingState()
              setIsSubmitted(true)
              onCalculate && onCalculate(true)
              scrollToSection()
              patchSurveyFormValue({
                [SurveyFormKey.DownPaymentTmp]: {
                  value:
                    contextSurveyFormData[SurveyFormKey.DownPayment]?.value,
                  isDataValid: true,
                },
                [SurveyFormKey.SpecialRateEnable]: {
                  value: 'enable',
                  isDataValid: true,
                },
              })
            })
            .catch(() => {
              resetLoadingState()
            })
        }
      } else {
        saveLocalStorage(LocalStorageKey.SelectedRateType, 'REGULAR')
        getNewFunnelLoanSpecialRate({
          otr:
            carVariantDetails?.variantDetail.priceValue -
              carVariantDetails?.variantDetail.discount ?? 0,
          dp: dpPercent,
          dpAmount: parseInt(digitString),
          monthlyIncome: surveyFormData.totalIncome?.value as number,
          age: surveyFormData.age?.value as string,
          city: getCity().cityCode,
          discount: carVariantDetails?.variantDetail.discount ?? 0,
          rateType: 'REGULAR',
          angsuranType: optionADDM
            ? InstallmentTypeOptions.ADDM
            : InstallmentTypeOptions.ADDB,
        })
          .then((response) => {
            const dataTemp = response.data.data
            // setSpecialRateList(data.reverse())
            setSpecialRateResults(dataTemp.reverse())
            onTrackCreditHitungCicilan(dataTemp)
            resetLoadingState()
            setIsSubmitted(true)
            onCalculate && onCalculate(true)
            scrollToSection()
            patchSurveyFormValue({
              [SurveyFormKey.DownPaymentTmp]: {
                value: contextSurveyFormData[SurveyFormKey.DownPayment]?.value,
                isDataValid: true,
              },
              [SurveyFormKey.SpecialRateEnable]: {
                value: 'enable',
                isDataValid: true,
              },
            })
          })
          .catch(() => {
            resetLoadingState()
          })
      }
      const totalIncome = surveyFormData.totalIncome?.value as number
      const monthlyIncome = parsedMonthlyIncome(totalIncome)

      const NewFunnelRecommendationsQuery = {
        ...funnelQuery,
        monthlyIncome: monthlyIncome,
        brand: undefined,
      }

      getNewFunnelRecommendations(NewFunnelRecommendationsQuery, false, false)
        .then((response: AxiosResponse<CarRecommendationResponse>) => {
          onRecommendationsResults(response.data.carRecommendations || [])
        })
        .catch(() => {
          onRecommendationsResults([])
        })
      setDataFilterLocal(surveyFormData.age?.value as string, monthlyIncome)
    }
  }

  const setDataFilterLocal = (age: string, monthlyIncome: string): void => {
    const dataFilterLocal = localStorage.getItem(LocalStorageKey.CarFilter)
    const dataFilterParsed =
      dataFilterLocal !== null ? JSON.parse(dataFilterLocal) : null
    const newDataFilter = {
      ...dataFilterParsed,
      age: age,
      monthlyIncome: monthlyIncome,
    }
    localStorage.setItem(
      LocalStorageKey.CarFilter,
      JSON.stringify(newDataFilter),
    )
  }

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    let newValue
    if (!inputRef.current) {
      return
    }
    const cursorPosition = inputRef.current.selectionStart ?? -1
    setSelectionStart(cursorPosition)
    const digit = filterNonDigitCharacters(event.target.value)
    const digitWithSeparator = replacePriceSeparatorByLocalization(
      digit,
      currentLanguage,
    )
    if (digitWithSeparator === oldInputValue) {
      const newDigit = filterNonDigitCharacters(
        digitWithSeparator.replace(digitWithSeparator[cursorPosition - 1], ''),
      )
      newValue = replacePriceSeparatorByLocalization(newDigit, currentLanguage)
      setSelectionStart(cursorPosition - 1)
    } else {
      newValue = digitWithSeparator
    }

    // if (parseInt(filterNonDigitCharacters(newValue)) < dp15Value) {
    //   setInputError(true)
    // } else {
    //   setInputError(false)
    // }
    // if (parseInt(filterNonDigitCharacters(newValue)) > maxDp) {
    //   setInputErrorMaxDp(true)
    // } else {
    //   setInputErrorMaxDp(false)
    // }
    if (!loading) {
      setIsDefaultValue(false)
      setInputValue(newValue)
      setTmpValue(parseInt(newValue))
      setDpAmout(parseInt(newValue))
    }
    setSpecialRateResults([])
  }

  const moveSelections = (value: number) => {
    if (inputRef.current) {
      inputRef.current.selectionStart = selectionStart + value
      inputRef.current.selectionEnd = selectionStart + value
    }
  }

  const checkInputValueLenChange = () => {
    return inputValue.length - oldInputValue?.length
  }

  useEffect(() => {
    const minPercentDP = Math.ceil(
      (carVariantDetails?.variantDetail.priceValue -
        carVariantDetails?.variantDetail.discount) *
        0.2,
    )
    const maxPercentDP = Math.trunc(
      (carVariantDetails?.variantDetail.priceValue -
        carVariantDetails?.variantDetail.discount) *
        0.9,
    )
    const minDpValueTmp = minPercentDP / million
    const maxDpValueTmp = maxPercentDP / million
    setMinDpValue(minDpValueTmp)
    setMinDpValueInMillion(minPercentDP)
    setMaxDpValue(maxDpValueTmp)
    setMaxDpValueInMillion(maxPercentDP)
    if (!inputRef.current) {
      return
    }
    const digitString = filterNonDigitCharacters(inputRef.current.value)
    if (isDefaultValue) {
      setInputValue(
        replacePriceSeparatorByLocalization(minPercentDP, currentLanguage),
      )
    }
    if (inputValue.length > 0) {
      setTmpValue(parseInt(digitString))
      setDpAmout(parseInt(digitString))
    } else {
      setTmpValue(0)
      setDpAmout(0)
    }
    // setTmpValue(
    //   parseInt(
    //     replacePriceSeparatorByLocalization(digitString, currentLanguage),
    //   ),
    // )
    if (tmpValue === 0) {
      setIsErrorEmptyDp(true)
    } else {
      setIsErrorEmptyDp(false)
    }
    if (tmpValue < minDpValueInMillion) {
      setIsErrorMinDp(true)
    } else {
      setIsErrorMinDp(false)
    }
    if (tmpValue > maxDpValueInMillion) {
      setIsErrorMaxDp(true)
    } else {
      setIsErrorMaxDp(false)
    }
  }, [currentLanguage, tmpValue, isErrorMaxDP, isErrorMinDP, carVariantDetails])

  useEffect(() => {
    const stayCursorPosition = 0
    const moveCursorLeft = -1
    const moveCursorRight = 1
    if (checkInputValueLenChange() === -1 || checkInputValueLenChange() === 1) {
      if (inputValue[selectionStart - 1] === '.') {
        moveSelections(moveCursorLeft)
      } else {
        moveSelections(stayCursorPosition)
      }
    }
    if (checkInputValueLenChange() === -2) {
      if (selectionStart === 0) {
        moveSelections(stayCursorPosition)
      } else {
        moveSelections(moveCursorLeft)
      }
    }
    if (checkInputValueLenChange() === 2) {
      if (inputValue[selectionStart] === '.') {
        moveSelections(stayCursorPosition)
      } else {
        moveSelections(moveCursorRight)
      }
    }
    setOldInputValue(inputValue)
  }, [inputValue])
  useEffect(() => {
    if (specialRateResults?.length === 0) {
      setIsSubmitted(false)
    }
  }, [isSubmit, specialRateResults])

  const onFocus = () => {
    // if (!!inputValue) {
    //   const strWithoutSeparator = filterNonDigitCharacters(inputValue)
    //   setInputError(!isAmountValidSpecialRate(strWithoutSeparator))
    // }
    // if (parseInt(filterNonDigitCharacters(inputValue)) < dp15Value) {
    //   setInputError(true)
    // } else {
    //   setInputError(false)
    // }
    // if (parseInt(filterNonDigitCharacters(inputValue)) > maxDp) {
    //   setInputErrorMaxDp(true)
    // } else {
    //   setInputErrorMaxDp(false)
    // }
  }

  const resultEndRef = useRef<null | HTMLDivElement>(null)
  const scrollToSection = () => {
    resultEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  // const onChangeSlider = (value: any) => {}
  useEffect(() => {
    const dpOtr = dpRateCollectionNewCalculator.map(
      (dp: dpRateCollectionNewCalculatorTmp) => {
        return {
          ...dp,
          dpCalc:
            dp.dpCalc *
            (carVariantDetails?.variantDetail.priceValue -
              carVariantDetails?.variantDetail.discount),
        }
      },
    )
    // if (dpRate >= 50) {
    //   dpPayload = 50
    // } else {
    if (
      tmpValue >=
      (carVariantDetails?.variantDetail.priceValue -
        carVariantDetails?.variantDetail.discount) *
        0.5
    ) {
      setDpPercent(50)
    } else {
      for (let i = 0; i < 8; i++) {
        if (tmpValue >= dpOtr[i].dpCalc && tmpValue < dpOtr[i + 1].dpCalc) {
          setDpPercent(dpOtr[i].dpRate)
        }
      }
    }

    // }

    if (getToken()) {
      getCustomerInfoWrapperSeva()
        .then((res: any) => {
          if (res.data[0].isCrmCustomer) {
            setIsCustomerCRM(true)
          } else {
            setIsCustomerCRM(false)
          }
        })
        .catch((e) => console.error(e))
    }
  }, [tmpValue])

  const renderErrorDpValue = () => {
    if (
      (isErrorEmptyDP && !isErrorMinDP && !isErrorMaxDP) ||
      (isErrorEmptyDP && isCheckValue)
    ) {
      return (
        <ErrorWrapper className={'shake-animation-X'}>
          {!isMobile ? (
            <StyledIconContainerWithMargin>
              <IconWarning color={'#FFFFFF'} width={10} height={10} />
            </StyledIconContainerWithMargin>
          ) : (
            <StyledIconContainer>
              <IconWarning color={'#FFFFFF'} width={16} height={16} />
            </StyledIconContainer>
          )}
          <ErrorMessage>Wajib diisi</ErrorMessage>
        </ErrorWrapper>
      )
    } else if (
      (isErrorMinDP && !isErrorMaxDP) ||
      (isErrorMinDP && isCheckValue)
    ) {
      return (
        <ErrorWrapper>
          <StyledIconContainer>
            <IconWarning color={'#FFFFFF'} width={16} height={16} />
          </StyledIconContainer>
          <ErrorMessage>DP yang kamu masukkan terlalu rendah.</ErrorMessage>
        </ErrorWrapper>
      )
    } else if (isErrorMaxDP) {
      return (
        <ErrorWrapper>
          <StyledIconContainer>
            <IconWarning color={'#FFFFFF'} width={16} height={16} />
          </StyledIconContainer>
          <ErrorMessage>DP yang kamu masukkan terlalu tinggi.</ErrorMessage>
        </ErrorWrapper>
      )
    } else {
      return <></>
    }
  }

  const renderErrorPromo = () => {
    if (errorPromo) return () => <InfoCircleOutlined width={24} height={24} />
    return () => <></>
  }
  const renderErrorPromoMessage = () => {
    if (errorPromo)
      return () => (
        <ErrorWrapper className={'shake-animation-X'}>
          <StyledIconContainer style={{ marginTop: '6px' }}>
            <IconWarning color={'#FFFFFF'} width={16} height={16} />
          </StyledIconContainer>
          <StyledErrorText>
            {invalidCodeMessage.length === 0
              ? 'Kode yang kamu masukkan tidak tersedia. Masukkan kode yang benar lalu coba kembali.'
              : invalidCodeMessage}
          </StyledErrorText>
        </ErrorWrapper>
      )
    return () => <></>
  }
  return (
    <Content>
      {!isSubmitted && isMobile ? (
        <>
          <StyledText>Pilih DP yang kamu inginkan</StyledText>
          <StyledValueWrapper>
            <StyledTextValue>Rp {inputValue}</StyledTextValue>
          </StyledValueWrapper>
          <ContainerSlider>
            <ReactSlider
              value={tmpValue}
              max={maxDpValueInMillion}
              min={minDpValueInMillion}
              onChange={(value) => {
                if (!loading) {
                  const digit = filterNonDigitCharacters(value.toString())
                  setTmpValue(parseInt(digit))
                  setDpAmout(parseInt(digit))
                  setIsDefaultValue(false)
                  setInputValue(
                    replacePriceSeparatorByLocalization(
                      digit,
                      currentLanguage,
                    ).toString(),
                  )
                }
                setSpecialRateResults([])
              }}
              className="horizontal-slider"
              thumbClassName="example-thumb"
              trackClassName="example-track"
            />
          </ContainerSlider>
          <StyledValueLimitWrapper>
            <StyledTextValueLimit>
              Rp{Math.round(minDpValue)} jt
            </StyledTextValueLimit>
            <StyledTextValueLimit>
              Rp
              {maxDpValue.toString().length > 3
                ? numberWithCommas(Math.round(maxDpValue))
                : Math.round(maxDpValue)}{' '}
              jt
            </StyledTextValueLimit>
          </StyledValueLimitWrapper>
          <DividerDp>
            <StyledTextSmall>ATAU</StyledTextSmall>
          </DividerDp>
          <StyledText>Masukan nominal DP</StyledText>
          <StyledInputWrapper>
            <StyledInput
              value={inputValue}
              maxLength={12}
              type={'tel'}
              onChange={onChange}
              prefixComponent={prefixComponent}
              // suffixIcon={isInputError ? () => <InfoCircleOutlined /> : undefined}
              // bottomComponent={
              //   isInputError && !isInputErrorMaxDp
              //     ? errorText
              //     : !isInputError && isInputErrorMaxDp
              //     ? errorTextMaxDp
              //     : undefined
              // }
              bottomComponent={
                (isErrorMinDP && inputValue.length > 0) ||
                (isErrorMinDP && isCheckValue) ||
                (isErrorMaxDP && inputValue.length > 0)
                  ? renderErrorDpValue
                  : undefined
              }
              isError={
                (isErrorMinDP && inputValue.length > 0) ||
                (isErrorMaxDP && inputValue.length > 0) ||
                (isErrorMinDP && isCheckValue)
              }
              overrideRedBorder={
                (isErrorMinDP && tmpValue > 0) || (isErrorMaxDP && tmpValue > 0)
              }
              onFocus={onFocus}
              ref={inputRef}
              max={999}
              // placeholder={t(
              //   `preApprovalQuestionFlow.${SurveyFormKey.TotalIncome}.placeholder`,
              // )}
            />
            {!isErrorEmptyDP && !isErrorMaxDP && !isErrorMinDP && (
              <HelperTextSpacing>
                <TextSmall>
                  Ubah jumlah DP untuk memperbarui cicilanmu
                </TextSmall>
              </HelperTextSpacing>
            )}
            {tmpValue === 0 && !isCheckValue && (
              <HelperTextSpacing>
                <TextSmall>
                  Ubah jumlah DP untuk memperbarui cicilanmu
                </TextSmall>
              </HelperTextSpacing>
            )}
          </StyledInputWrapper>
          <StyledText>Pilih pembayaran angsuran pertama</StyledText>
          <StyledOptionContainer>
            <StyledButtonOption
              onClick={onClickADDM}
              isClicked={optionADDM}
              // version={ButtonVersion.Secondary}
              // size={ButtonSize.Big}
            >
              <StyledButtonOptionText isClicked={optionADDM}>
                {'Dibayar di muka'}
              </StyledButtonOptionText>
            </StyledButtonOption>{' '}
            <StyledButtonOption
              onClick={onClickADDB}
              isClicked={optionADDB}
              // version={ButtonVersion.Secondary}
              // size={ButtonSize.Big}
            >
              <StyledButtonOptionText isClicked={optionADDB}>
                {'Dibayar di belakang'}
              </StyledButtonOptionText>
            </StyledButtonOption>
          </StyledOptionContainer>
          {isClicked && !optionADDB && !optionADDM && (
            <ErrorWrapperEmpty className={'shake-animation-X'}>
              <StyledIconContainer>
                <IconWarning color={'#FFFFFF'} width={16} height={16} />
              </StyledIconContainer>
              <ErrorMessageEmpty>Wajib dipilih</ErrorMessageEmpty>
            </ErrorWrapperEmpty>
          )}
          <PromoInput>
            <StyledInputPromo
              type="text"
              isError={errorPromo}
              value={promoCode}
              suffixIcon={renderErrorPromo()}
              onChange={(e) => {
                if (!e.target.value) {
                  setErrorPromo(false)
                }
                const promo = e.target.value.toUpperCase()
                setPromoCode &&
                  setPromoCode(promo.replace(' ', '').replace(/[^\w\s]/gi, ''))
                setPromoCodeSessionStorage(
                  promo.replace(' ', '').replace(/[^\w\s]/gi, ''),
                )
              }}
              placeholder="Punya kode promo? Masukkan di sini"
              bottomComponent={renderErrorPromoMessage()}
              style={{ borderRadius: '8px' }}
            />
          </PromoInput>
          <StyledButtonWrapper ref={resultEndRef}>
            <Button
              data-testid={elementId.InstantApproval.ButtonCalculateInstallment}
              version={ButtonVersion.PrimaryDarkBlue}
              size={ButtonSize.Big}
              onClick={onSubmit}
            >
              {loading ? (
                <IconWrapper className={`rotateAnimation`}>
                  <IconLoading width={14} height={14} color="#FFFFFF" />
                </IconWrapper>
              ) : (
                <>
                  {!isMobile &&
                  specialRateResults &&
                  specialRateResults?.length !== 0
                    ? 'Hitung Ulang'
                    : 'Hitung Cicilan'}
                </>
              )}
            </Button>
          </StyledButtonWrapper>{' '}
        </>
      ) : isMobile && !loading && isSubmitted ? (
        <>
          <StyledInfo>
            <StyledTextLabel>Varian</StyledTextLabel>
            <TextCarVariantName>
              {carVariantDetails.variantDetail.name}
            </TextCarVariantName>
          </StyledInfo>
          <StyledInfo>
            <StyledTextLabel>Pendapatan per bulan</StyledTextLabel>
            <StyledLabel>
              Rp{' '}
              {monthlyIncomeValue &&
                replacePriceSeparatorByLocalization(
                  monthlyIncomeValue.toString(),
                  currentLanguage,
                )}
            </StyledLabel>
          </StyledInfo>
          <StyledInfo>
            <StyledTextLabel>Umur</StyledTextLabel>
            <StyledLabel>{agevalue}</StyledLabel>
          </StyledInfo>
          <StyledInfo>
            <StyledTextLabel>DP:</StyledTextLabel>
            <StyledLabel>Rp {inputValue}</StyledLabel>
          </StyledInfo>
          <StyledInfo>
            <StyledTextLabel>Angsuran pertama</StyledTextLabel>
            <StyledLabel>
              {optionADDM
                ? 'Dibayar di muka'
                : optionADDB
                ? 'Dibayar di belakang'
                : ''}
            </StyledLabel>
          </StyledInfo>
          <StyledInfoResetInfo
            onClick={() => {
              setIsSubmitted(false)
              onCalculate && onCalculate(false)
              setSpecialRateResults([])
            }}
          >
            <StyledResetText>Ubah Informasi</StyledResetText>
          </StyledInfoResetInfo>
        </>
      ) : (
        <>
          <StyledText>Pilih DP yang kamu inginkan</StyledText>
          <StyledValueWrapper>
            <StyledTextValue>
              Rp{' '}
              {inputValue.length === 0
                ? replacePriceSeparatorByLocalization(
                    minDpValueInMillion,
                    currentLanguage,
                  )
                : inputValue}
            </StyledTextValue>
          </StyledValueWrapper>
          <ContainerSlider>
            <ReactSlider
              value={tmpValue}
              max={maxDpValue * million}
              min={minDpValue * million}
              onChange={(value) => {
                if (!loading) {
                  const digit = filterNonDigitCharacters(value.toString())
                  setTmpValue(parseInt(digit))
                  setDpAmout(parseInt(digit))
                  setIsDefaultValue(false)
                  setInputValue(
                    replacePriceSeparatorByLocalization(
                      digit,
                      currentLanguage,
                    ).toString(),
                  )
                }
                setSpecialRateResults([])
              }}
              className="horizontal-slider"
              thumbClassName="example-thumb"
              trackClassName="example-track"
            />
          </ContainerSlider>
          <StyledValueLimitWrapper>
            <StyledTextValueLimit>
              Rp{Math.round(minDpValue)} jt
            </StyledTextValueLimit>
            <StyledTextValueLimit>
              Rp
              {maxDpValue.toString().length > 3
                ? numberWithCommas(Math.round(maxDpValue))
                : Math.round(maxDpValue)}{' '}
              jt
            </StyledTextValueLimit>
          </StyledValueLimitWrapper>
          <DividerDp>
            <StyledTextSmall>ATAU</StyledTextSmall>
          </DividerDp>
          <StyledText>Masukkan DP</StyledText>
          <StyledInputWrapper>
            <StyledInput
              data-testid={elementId.InstantApproval.InputDP}
              value={inputValue}
              maxLength={12}
              type={'tel'}
              onChange={onChange}
              prefixComponent={prefixComponent}
              bottomComponent={
                isErrorMinDP || isErrorMaxDP ? renderErrorDpValue : undefined
              }
              isError={
                (isErrorMinDP && inputValue.length > 0) ||
                (isErrorMaxDP && tmpValue > 0) ||
                (isErrorMinDP && isCheckValue)
              }
              overrideRedBorder={
                (isErrorMinDP && tmpValue > 0) || (isErrorMaxDP && tmpValue > 0)
              }
              // bottomComponent={
              //   isInputError && !isInputErrorMaxDp
              //     ? errorText
              //     : !isInputError && isInputErrorMaxDp
              //     ? errorTextMaxDp
              //     : undefined
              // }
              onFocus={onFocus}
              ref={inputRef}
              max={999}
              // placeholder={t(
              //   `preApprovalQuestionFlow.${SurveyFormKey.TotalIncome}.placeholder`,
              // )}
            />
          </StyledInputWrapper>
          <StyledText>Pilih pembayaran angsuran pertama</StyledText>
          <StyledOptionContainer>
            <StyledButtonOption
              data-testid={elementId.InstantApproval.ButtonPaidInAdvance}
              onClick={onClickADDM}
              isClicked={optionADDM}
              // width={'50%'}
              // height={'50px'}
              // version={ButtonVersion.Secondary}
              // size={ButtonSize.Big}
            >
              <StyledButtonOptionText isClicked={optionADDM}>
                {'Dibayar di muka'}
              </StyledButtonOptionText>
            </StyledButtonOption>{' '}
            <StyledButtonOption
              data-testid={elementId.InstantApproval.ButtonPaidEnd}
              onClick={onClickADDB}
              isClicked={optionADDB}
              // width={'50%'}
              // height={'50px'}
              // version={ButtonVersion.Secondary}
              // size={ButtonSize.Big}
            >
              <StyledButtonOptionText isClicked={optionADDB}>
                {'Dibayar di belakang'}
              </StyledButtonOptionText>
            </StyledButtonOption>
          </StyledOptionContainer>
          {isClicked && !optionADDB && !optionADDM && (
            <ErrorWrapperEmpty className={'shake-animation-X'}>
              {!isMobile ? (
                <StyledIconContainerWithMargin>
                  <IconWarning color={'#FFFFFF'} width={10} height={10} />
                </StyledIconContainerWithMargin>
              ) : (
                <StyledIconContainer>
                  <IconWarning color={'#FFFFFF'} width={16} height={16} />
                </StyledIconContainer>
              )}
              <ErrorMessageEmpty>Wajib dipilih</ErrorMessageEmpty>
            </ErrorWrapperEmpty>
          )}
          <PromoInput>
            <StyledInputPromo
              type="text"
              isError={errorPromo}
              value={promoCode}
              suffixIcon={renderErrorPromo()}
              onChange={(e) => {
                if (!e.target.value) {
                  setErrorPromo(false)
                }
                const promo = e.target.value.toUpperCase()
                setPromoCode &&
                  setPromoCode(promo.replace(' ', '').replace(/[^\w\s]/gi, ''))
                setPromoCodeSessionStorage(
                  promo.replace(' ', '').replace(/[^\w\s]/gi, ''),
                )
              }}
              placeholder="Punya kode promo? Masukkan di sini"
              bottomComponent={renderErrorPromoMessage()}
              style={{ borderRadius: '8px' }}
            />
          </PromoInput>
          <StyledButtonWrapper ref={resultEndRef}>
            <Button
              data-testid={elementId.InstantApproval.ButtonCalculateInstallment}
              // width="100%"
              version={
                !isMobile &&
                specialRateResults &&
                specialRateResults?.length !== 0
                  ? ButtonVersion.Secondary
                  : ButtonVersion.PrimaryDarkBlue
              }
              size={ButtonSize.Big}
              onClick={onSubmit}
              // disabled={
              //   disableButton ||
              //   disableCalculateButton ||
              //   isInputError ||
              //   isInputErrorMaxDp ||
              //   disableCalculateIncome ||
              //   disableCalculateAge ||
              //   inputValue.toString() == ''
              // }
              // className={'special-rate-calc-credit-button-element'}
              style={{
                border:
                  specialRateResults && specialRateResults?.length !== 0
                    ? '2px solid #002373'
                    : '2px solid #05256E',
              }}
            >
              {loading ? (
                <IconWrapper className={`rotateAnimation`}>
                  <IconLoading width={14} height={14} color="#FFFFFF" />
                </IconWrapper>
              ) : (
                <>
                  {!isMobile &&
                  specialRateResults &&
                  specialRateResults?.length !== 0
                    ? 'Hitung Ulang'
                    : 'Hitung Cicilan'}
                </>
              )}
            </Button>
          </StyledButtonWrapper>{' '}
        </>
      )}
    </Content>
  )
}

const WarningWrapper = css`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #ec0a23;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ContainerSlider = styled.div``

const Content = styled.div`
  width: 100%;
  ${ContainerSlider} {
    .horizontal-slider {
      width: 100%;
      max-width: 600px;
      height: 30px;
    }
    .example-track {
      position: relative;
      background: #b3cce5;
      @media (max-width: 1024px) {
        background: #e4e9f1;
      }
    }

    .example-track.example-track-1 {
      background: #b3cce5;
      @media (max-width: 1024px) {
        background: #e4e9f1;
      }
    }
    .horizontal-slider .example-track {
      top: 8px;
      height: 10px;
      @media (max-width: 743px) {
        top: 4px;
        height: 8px;
      }
    }
    .horizontal-slider .example-thumb {
      top: 3px;
      width: 30px;
      height: 21px;
      line-height: 38px;
      @media (max-width: 743px) {
        width: 23px;
        height: 16px;
        line-height: 28px;
      }
    }

    .example-thumb {
      font-size: 0.1em;
      text-align: center;
      background-color: #05256e;
      color: #05256e;
      cursor: pointer;
      border-radius: 2px;
      @media (min-width: 1025px) {
        border-radius: 4px;
        background: #002373;
        color: #002373;
      }
    }

    .example-thumb.active {
      background-color: #05256e;
    }
  }
`
const StyledText = styled.span`
  font-family: 'KanyonMedium';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  display: flex;
  align-items: center;
  letter-spacing: 0px;
  color: #52627a;

  @media (max-width: 743px) {
    font-size: 14px;
    line-height: 20px;
  }
`
const StyledValueWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

const StyledTextValue = styled.span`
  letter-spacing: 0px;
  font-family: 'KanyonBold';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  color: #000000;
`

const StyledValueLimitWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  @media (min-width: 1025px) {
    margin-top: 7px;
  }
`
const StyledTextValueLimit = styled.span`
  font-family: 'OpenSansSemiBold';
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 20px;
  display: flex;
  align-items: center;
  text-align: right;
  letter-spacing: 0px;
  color: #52627a;
  @media (max-width: 1024px) {
    line-height: 16px;
  }
`

const DividerDp = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  ::after {
    content: '';
    border: 1px solid ${colors.line};
    flex: 1;
  }
  ::before {
    content: '';
    border: 1px solid ${colors.line};
    flex: 1;
  }

  margin-top: 21px;
  margin-bottom: 19px;
  @media (max-width: 1024px) {
    width: 100%;
    margin: auto;
    margin-top: 18px;
    margin-bottom: 18px;
  }
`
const StyledTextSmall = styled.span`
  letter-spacing: 0px;
  margin-left: 5px;
  margin-right: 5px;
  font-family: 'KanyonBold';
  font-weight: 700;
  font-size: 12px;
  color: #52627a;
  line-height: 20px;
`

const StyledInput = styled(Input)<{ value: string; isError: boolean }>`
  color: ${colors.primaryDarkBlue};
  border-color: ${({ isError }) => (isError ? colors.error : colors.line)};
  border-radius: 8px;
  padding-left: 23px;
  input {
    font-family: 'OpenSans';
    color: ${colors.primaryDarkBlue};
    font-size: 16px;

    @media (max-width: 743px) {
      font-size: 16px;
    }
  }
  :focus-within {
    border-color: ${({ isError }) =>
      isError ? colors.error : colors.primary1};
    color: #05256e;
  }
  ::-webkit-input-placeholder {
    font-size: 16px;
  }
  width: 100%;
  font-size: 16px;

  font-weight: 400;
  height: 48px;
  @media (max-width: 1920px) {
    width: 100%;
  }
  @media (max-width: 1440px) {
    width: 100%;
  }
  @media (max-width: 1366px) {
    width: 100%;
  }
  @media (max-width: 1024px) {
    font-size: 12px;
    &::placeholder {
      font-size: 12px;
    }
  }
  @media (max-width: 1024px) {
    font-size: 16px;
    height: 56px;
    &::placeholder {
      font-size: 16px;
    }
  }
`
const StyledInputWrapper = styled.div`
  margin-top: 12px;
  margin-bottom: 24px;
  @media (max-width: 1024px) {
    margin-bottom: 17px;
  }
`
const HelperTextSpacing = styled.div`
  margin-top: 8px;
`
const StyledPrefixText = styled.h2`
  letter-spacing: 0px;
  margin-right: 4px;
  font-family: 'OpenSans';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 120%;
  color: #05256e;
  line-height: 24px;
  @media (max-width: 915px) {
    font-size: 12px;
  }
  @media (max-width: 1024px) {
    font-size: 16px;
    line-height: 20px;
  }
`
const StyledOptionContainer = styled.div`
  border-radius: 12px;
  margin-top: 8px;
  width: 100%;
  height: 72px;
  display: flex;
  align-items: center;
  gap: 7px;
  @media (max-width: 1024px) {
    background: #f2f5f9;
    height: 56px;
    justify-content: space-between;
  }
`

const StyledButtonOption = styled.button<{ isClicked: boolean }>`
  background: ${({ isClicked }) => (isClicked ? colors.inputBg : colors.white)};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Kanyon';
  margin: 5px 0;
  width: 50%;
  height: 50px;
  border-radius: 8px;
  border: ${({ isClicked }) =>
    isClicked ? `1.5px solid ${colors.primaryBlue}` : `1.5px solid #E4E9F1`};
  @media (max-width: 1279px) {
    height: 34px;
  }
  @media (max-width: 1024px) {
    width: 100%;
    height: 56px;
    width: 49%;
  }
`
const StyledButtonOptionText = styled.span<{ isClicked: boolean }>`
  font-family: ${({ isClicked }) =>
    isClicked ? `OpenSansSemiBold` : `OpenSans`};
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 0px;
  color: ${({ isClicked }) => (isClicked ? `#246ED4` : `#252525`)};

  @media (max-width: 1024px) {
    font-size: 14px;
  }
`

const StyledButtonWrapper = styled.div`
  margin-top: 24px;
  @media (max-width: 1024px) {
    position: fixed;
    bottom: 0px;
    width: -webkit-fill-available;
    z-index: 9;
    background: #ffffff;
    left: 0px;
    display: flex;
    align-items: center;
    height: 69px;
  }
`
const StyledInfo = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 7px;
`

const StyledInfoResetInfo = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 19px;
  margin-bottom: 19px;
  border: 1px solid #05256e;
  border-radius: 12px;
  height: 39px;
`
const StyledResetText = styled.span`
  font-family: 'KanyonBold';
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 0px;

  color: #05256e;
`
const StyledTextLabel = styled.span`
  font-family: 'KanyonMedium';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0px;
  color: #9ea3ac;
`

const ErrorWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  margin-top: 8px;
`

const ErrorMessage = styled.p`
  font-family: 'OpenSans';
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 16px;
  letter-spacing: 0px;
  color: #d83130;

  @media (max-width: 1024px) {
    font-size: 12px;
    line-height: 16px;
  }
`
const TextSmall = styled.span`
  font-family: 'KanyonMedium';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0px;
  color: #9ea3ac;
`
const TextCarVariantName = styled.h2`
  letter-spacing: 0px;
  font-family: 'KanyonBold';
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  color: #404040;
`

const ErrorWrapperEmpty = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  margin-top: 8px;
`

const ErrorMessageEmpty = styled.p`
  font-family: 'OpenSans';
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 16px;
  letter-spacing: 0px;
  color: #d83130;

  @media (max-width: 1024px) {
    font-size: 12px;
    line-height: 16px;
  }
`

const PromoInput = styled.div`
  width: 100%;
  margin-top: 24px;
`

const StyledIconContainer = styled.div`
  ${WarningWrapper};
`

const StyledIconContainerWithMargin = styled.div`
  ${WarningWrapper};
  margin-top: -1.5px;
`

const StyledLabel = styled.span<{
  newMenu?: boolean
}>`
  font-style: normal;
  letter-spacing: 0px;
  font-size: 12px;
  line-height: 18px;
  font-weight: 700;
  font-family: 'KanyonBold';
  color: ${({ newMenu }) => newMenu && colors.primaryBlue};
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
