import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { IconWarning, InfoCircleOutlined } from 'components/atoms'
import styled, { css } from 'styled-components'
import { colors } from 'styles/colors'
import { filterNonDigitCharacters, isAmountValid } from 'utils/stringUtils'
import { useContextCalculator } from 'services/context/calculatorContext'
import { getNewFunnelLoanSpecialRate } from 'services/newFunnel'
import { saveLocalStorage } from 'utils/localstorageUtils'
import { parsedMonthlyIncome } from 'utils/parsedMonthlyIncome'
import {
  InstallmentTypeOptions,
  LocalStorageKey,
  SessionStorageKey,
  SurveyFormKey,
} from 'utils/models/models'
import { NewFunnelCarVariantDetails, PreapprovalDataType } from 'utils/types'
import { useUtils } from 'services/context/utilsContext'
import { useSessionStorageWithEncryption } from 'utils/hooks/useSessionStorage/useSessionStorage'
import { getCity } from 'utils/hooks/useCurrentCityOtr/useCurrentCityOtr'
import { Input } from 'components/atoms/OldInput/Input'
import { replacePriceSeparatorByLocalization } from 'utils/numberUtils/numberUtils'
import { useContextForm } from 'services/context/formContext'

interface AmountInputProps {
  value: string
  page: SurveyFormKey
  page2: SurveyFormKey
  page3?: SurveyFormKey
  className?: string
  isNewRegularPage?: boolean
  isSubmitted?: boolean
  isTabCreditV2?: boolean
  isTabCreditDesktop?: boolean
  dpAmount?: number
  optionADDM?: boolean
  dpPercent?: number
  carVariantDetails?: NewFunnelCarVariantDetails
  setIsLoadingLoanRank?: (value: boolean) => void
  name?: string
}

export const CashAmountInputCarVariantPage = ({
  value,
  page,
  page2,
  page3 = SurveyFormKey.DownPayment,
  className,
  isNewRegularPage = false,
  isSubmitted = false,
  isTabCreditV2 = false,
  isTabCreditDesktop = false,
  dpAmount = 0,
  optionADDM = true,
  carVariantDetails = undefined,
  dpPercent = 0,
  setIsLoadingLoanRank,
  name,
}: AmountInputProps) => {
  const { currentLanguage } = useUtils()
  const { setSpecialRateResults } = useContextCalculator()
  const {
    patchFormSurveyValue: patchSurveyFormValue,
    formSurveyValue: contextSurveyFormData,
  } = useContextForm()
  const [isInputError, setInputError] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>(
    replacePriceSeparatorByLocalization(value, currentLanguage),
  )
  const [oldInputValue, setOldInputValue] = useState<string>(value)
  const [selectionStart, setSelectionStart] = useState<number>(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const [preapprovalSessionData, setPreapprovalSessionData] =
    useSessionStorageWithEncryption<PreapprovalDataType | string>(
      SessionStorageKey.PreapprovalData,
      '',
    )

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    let newValue
    if (event.target.value[0] !== '0') {
      if (!inputRef.current) {
        return
      }

      patchSurveyFormValue({
        [page3]: {
          value: undefined,
          isDataValid: false,
        },
      })
      if (!isTabCreditV2) {
        setSpecialRateResults([])
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
          digitWithSeparator.replace(
            digitWithSeparator[cursorPosition - 1],
            '',
          ),
        )
        newValue = replacePriceSeparatorByLocalization(
          newDigit,
          currentLanguage,
        )
        setSelectionStart(cursorPosition - 1)
      } else {
        newValue = digitWithSeparator
      }
      setInputError(!!newValue && !isAmountValid(digit))
      setInputValue(newValue)
      patchSurveyFormValue({
        [SurveyFormKey.TotalIncomeTmp]: {
          value: '0',
          isDataValid: false,
        },
        [SurveyFormKey.SpecialRateEnable]: {
          value: 'disable',
          isDataValid: false,
        },
      })
      patchSurveyFormValue({
        [page2]: {
          value: digit,
          isDataValid: false,
        },
      })

      patchSurveyFormValue({
        [page]: {
          value: digit,
          isDataValid: isAmountValid(digit),
        },
      })

      const preapprovalDataTemp: PreapprovalDataType = {
        ...preapprovalSessionData,
        totalIncome: digit,
      }
      setPreapprovalSessionData(preapprovalDataTemp)
    }
  }

  const moveSelections = (valueParam: number) => {
    if (inputRef.current) {
      inputRef.current.selectionStart = selectionStart + valueParam
      inputRef.current.selectionEnd = selectionStart + valueParam
    }
  }

  const checkInputValueLenChange = () => {
    return inputValue.length - oldInputValue?.length
  }

  useEffect(() => {
    if (!inputRef.current) {
      return
    }
    patchSurveyFormValue({
      [SurveyFormKey.TotalIncomeTmp]: {
        value: '0',
        isDataValid: false,
      },
    })
    const digitString = filterNonDigitCharacters(inputRef.current.value)
    if (digitString[0] !== '0') {
      setInputValue(
        replacePriceSeparatorByLocalization(digitString, currentLanguage),
      )
    }
  }, [currentLanguage])

  useEffect(() => {
    patchSurveyFormValue({
      [SurveyFormKey.TotalIncomeTmp]: {
        value: '0',
        isDataValid: false,
      },
    })
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

  const onFocus = () => {
    if (!!inputValue) {
      const strWithoutSeparator = filterNonDigitCharacters(inputValue)
      setInputError(!isAmountValid(strWithoutSeparator))
    }

    if (!isTabCreditV2) {
      setSpecialRateResults([])
    }
    patchSurveyFormValue({
      [SurveyFormKey.TotalIncomeTmp]: {
        value: '0',
        isDataValid: false,
      },
      [SurveyFormKey.SpecialRateEnable]: {
        value: 'disable',
        isDataValid: false,
      },
    })
  }
  const calculateWithFilledIncomeAnge = () => {
    if (
      carVariantDetails !== undefined &&
      contextSurveyFormData.age?.value?.toString().length !== 0
    ) {
      setIsLoadingLoanRank && setIsLoadingLoanRank(true)
      const totalIncome = contextSurveyFormData.totalIncome?.value as number
      const monthlyIncome = parsedMonthlyIncome(totalIncome)
      setDataFilterLocal(monthlyIncome)
      saveLocalStorage(
        LocalStorageKey.SelectedAngsuranType,
        optionADDM ? InstallmentTypeOptions.ADDM : InstallmentTypeOptions.ADDB,
      )
      saveLocalStorage(LocalStorageKey.SelectedRateType, 'REGULAR')
      getNewFunnelLoanSpecialRate({
        otr:
          carVariantDetails?.variantDetail.priceValue -
            carVariantDetails?.variantDetail.discount ?? 0,
        dp: dpPercent !== 0 ? dpPercent : 20,
        dpAmount: dpAmount,
        monthlyIncome: contextSurveyFormData.totalIncome?.value as number,
        age: contextSurveyFormData.age?.value as string,
        city: getCity().cityCode,
        discount: carVariantDetails?.variantDetail.discount ?? 0,
        rateType: 'REGULAR',
        angsuranType: optionADDM
          ? InstallmentTypeOptions.ADDM
          : InstallmentTypeOptions.ADDB,
      })
        .then((response) => {
          const dataTemp = response.data.data
          setSpecialRateResults(dataTemp.reverse())
          setIsLoadingLoanRank && setIsLoadingLoanRank(false)
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
        .catch(() => setIsLoadingLoanRank && setIsLoadingLoanRank(false))
    }
  }

  const setDataFilterLocal = (monthlyIncome: any): void => {
    const dataFilterLocal = localStorage.getItem(LocalStorageKey.CarFilter)
    const dataFilterParsed =
      dataFilterLocal !== null ? JSON.parse(dataFilterLocal) : null
    const newDataFilter = {
      ...dataFilterParsed,
      monthlyIncome: monthlyIncome,
    }
    localStorage.setItem(
      LocalStorageKey.CarFilter,
      JSON.stringify(newDataFilter),
    )
  }

  const prefixComponent = () => {
    return (
      <StyledPrefixText
        isNewRegularPage={isNewRegularPage}
        isTabCreditDesktop={isTabCreditDesktop}
      >
        Rp
      </StyledPrefixText>
    )
  }
  const errorText = () => {
    return (
      <StyledErrorText>
        Jumlah uang muka yang dimasukkan lebih rendah dari jumlah minimum yang
        disyaratkan.
      </StyledErrorText>
    )
  }

  return (
    <>
      <StyledInput
        data-testid={name}
        className={className}
        value={inputValue}
        maxLength={11}
        type={'tel'}
        onChange={onChange}
        onMouseLeave={calculateWithFilledIncomeAnge}
        prefixComponent={prefixComponent}
        suffixIcon={
          isInputError
            ? () => <InfoCircleOutlined width={24} height={24} />
            : undefined
        }
        bottomComponent={isInputError ? errorText : undefined}
        isError={
          isInputError ||
          (isSubmitted &&
            inputValue.length === 0 &&
            (isTabCreditV2 || isTabCreditDesktop))
        }
        onFocus={onFocus}
        ref={inputRef}
        placeholder={'8.500.000'}
        isNewRegularPage={isNewRegularPage}
        onCreditTabV2={isTabCreditV2}
        isTabCreditDesktop={isTabCreditDesktop}
        overrideRedBorder={
          isSubmitted && inputValue.length === 0 && isTabCreditV2
        }
      />
      {isSubmitted && inputValue.length === 0 && !isTabCreditV2 && (
        <ErrorWrapperEmpty className={'shake-animation-X'}>
          {isTabCreditDesktop ? (
            <StyledIconContainerWithMargin>
              <IconWarning color={'#FFFFFF'} width={10} height={10} />
            </StyledIconContainerWithMargin>
          ) : (
            <StyledIconContainer>
              <IconWarning color={'#FFFFFF'} width={10} height={10} />
            </StyledIconContainer>
          )}
          <ErrorMessageEmpty>Wajib diisi</ErrorMessageEmpty>
        </ErrorWrapperEmpty>
      )}

      {isSubmitted && inputValue.length === 0 && isTabCreditV2 && (
        <ErrorWrapperEmptyCreditV2 className={'shake-animation-X'}>
          <StyledIconContainer>
            <IconWarning color={'#FFFFFF'} width={10} height={10} />
          </StyledIconContainer>
          <ErrorMessageEmptySemiBold>Wajib diisi</ErrorMessageEmptySemiBold>
        </ErrorWrapperEmptyCreditV2>
      )}
    </>
  )
}

const StyledInput = styled(Input)<{
  value: string
  isError: boolean
  isNewRegularPage: boolean
  onCreditTabV2: boolean
  isTabCreditDesktop: boolean
}>`
  color: ${colors.primaryDarkBlue};
  border-color: ${({ isError, onCreditTabV2, isTabCreditDesktop }) =>
    isError && !onCreditTabV2
      ? colors.error
      : isError && onCreditTabV2
      ? colors.secondary
      : isTabCreditDesktop
      ? '#E4E9F1'
      : colors.placeholder};
  font-family: 'Kanyon';
  border-radius: 8px;
  input {
    color: ${colors.primaryDarkBlue};
    font-size: ${({ isNewRegularPage, isTabCreditDesktop }) =>
      isNewRegularPage && !isTabCreditDesktop
        ? '24px'
        : !isNewRegularPage && isTabCreditDesktop
        ? '18px'
        : '16px'};
    font-family: ${({ isTabCreditDesktop }) =>
      isTabCreditDesktop && 'OpenSans !important'};
    ::placeholder {
      font-size: ${({ isNewRegularPage, onCreditTabV2 }) =>
        isNewRegularPage && !onCreditTabV2
          ? '24px'
          : !isNewRegularPage && onCreditTabV2
          ? '14px'
          : '16px'};
      font-family: ${({ onCreditTabV2 }) =>
        onCreditTabV2 && 'OpenSans !important'};
      @media (max-width: 1024px) {
        font-size: 16px;
      }
    }
    @media (max-width: 1024px) {
      font-size: 16px;
    }
  }
  :focus-within {
    border-color: ${({ isError }) => (isError ? colors.error : colors.label)};
    color: #05256e;
  }
  ::-webkit-input-placeholder {
    font-size: ${({ isNewRegularPage }) =>
      isNewRegularPage ? '24px' : '16px'};
  }
  width: 96%;
  font-size: ${({ isNewRegularPage }) => (isNewRegularPage ? '24px' : '16px')};
  font-weight: 400;
  height: 48px;
  @media (max-width: 1920px) {
    width: 100%;
  }
  @media (max-width: 1279px) {
    font-size: 12px;
  }
  @media (max-width: 1024px) {
    font-size: 14px;
    height: 56px;
  }
  @media (min-width: 1025px) {
    padding-left: 23px;
  }
`
const StyledPrefixText = styled.h2<{
  isNewRegularPage: boolean
  isTabCreditDesktop: boolean
}>`
  letter-spacing: 0px;
  margin-right: 4px;
  font-size: ${({ isNewRegularPage, isTabCreditDesktop }) =>
    isNewRegularPage && !isTabCreditDesktop
      ? '24px'
      : !isNewRegularPage && isTabCreditDesktop
      ? '18px'
      : '16px'};
  font-family: 'Kanyon';
  font-family: 'OpenSans';
  font-style: normal;
  font-weight: 400;
  line-height: 120%;
  color: #05256e;
  @media (max-width: 1279px) {
    font-size: 12px;
  }
  @media (max-width: 1024px) {
    font-size: 14px;
  }
`
const StyledErrorText = styled.span`
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0px;
  color: ${colors.error};
  margin-top: 4px;
  font-family: 'Kanyon';
`

const ErrorWrapperEmpty = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  margin-top: 8px;
`

const ErrorWrapperEmptyCreditV2 = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 7px;
  gap: 5px;
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

const ErrorMessageEmptySemiBold = styled.p`
  font-family: 'OpenSansSemiBold';
  font-style: normal;
  font-weight: 600;
  font-size: 10px;
  line-height: 8px;
  color: #d83130;
`

const WarningWrapper = css`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #ec0a23;
  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledIconContainer = styled.div`
  ${WarningWrapper}
`

const StyledIconContainerWithMargin = styled.div`
  ${WarningWrapper}
  margin-top: -1.5px;
`
