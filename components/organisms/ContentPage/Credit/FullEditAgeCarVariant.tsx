import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { SelectLoanCalculatorPage } from 'components/atoms/OldSelect/SelectLoanCalculatorPage'
import { useContextCalculator } from 'services/context/calculatorContext'
import { ageFormConfig } from 'config/ageFormConfig'
import { isDataValid } from 'utils/surveyFormUtils'
import { getNewFunnelLoanSpecialRate } from 'services/newFunnel'
import elementId from 'helpers/elementIds'
import { saveLocalStorage } from 'utils/handler/localStorage'
import { DownOutlined, IconWarning } from 'components/atoms'
import { colors } from 'styles/colors'
import { FormControlValue, NewFunnelCarVariantDetails } from 'utils/types'
import { InstallmentTypeOptions, SurveyFormKey } from 'utils/types/models'
import { getCity } from 'utils/hooks/useCurrentCityOtr/useCurrentCityOtr'
import { useContextForm } from 'services/context/formContext'
import { LocalStorageKey } from 'utils/enum'

interface EditAgeProps {
  isNewRegularPage?: boolean
  isSubmitted?: boolean
  isTabCreditV2?: boolean
  isTabCreditDesktop?: boolean
  setScrollToAge?: (value: boolean) => void
  dpAmount?: number
  optionADDM?: boolean
  dpPercent?: number
  carVariantDetails?: NewFunnelCarVariantDetails
  setIsLoadingLoanRank?: (value: boolean) => void
}
export const FullEditAgeCarVariant = ({
  isNewRegularPage = false,
  isSubmitted = false,
  isTabCreditV2 = false,
  isTabCreditDesktop = false,
  setScrollToAge,
  dpAmount = 0,
  optionADDM = true,
  carVariantDetails = undefined,
  dpPercent = 0,
  setIsLoadingLoanRank,
}: EditAgeProps) => {
  const {
    formSurveyValue: surveyFormData,
    patchFormSurveyValue: patchSurveyFormValue,
  } = useContextForm()
  const [ageValue, setAgeValue] = useState(surveyFormData.age?.value)
  const { setSpecialRateResults } = useContextCalculator()

  const [emptyAgeValue, setEmptyAgeValue] = useState(false)
  const [isOptionOpen, setIsOptionOpen] = useState(false)

  const calculateWithFilledIncomeAnge = (age: string) => {
    if (
      carVariantDetails !== undefined &&
      surveyFormData.totalIncome?.value?.toString().length !== 0
    ) {
      setIsLoadingLoanRank && setIsLoadingLoanRank(true)
      saveLocalStorage(
        LocalStorageKey.SelectedAngsuranType,
        optionADDM ? InstallmentTypeOptions.ADDM : InstallmentTypeOptions.ADDB,
      )
      saveLocalStorage(LocalStorageKey.SelectedRateType, 'REGULAR')
      setDataFilterLocal(age)
      getNewFunnelLoanSpecialRate({
        otr:
          carVariantDetails?.variantDetail.priceValue -
            carVariantDetails?.variantDetail.discount ?? 0,
        dp: dpPercent !== 0 ? dpPercent : 20,
        dpAmount: dpAmount,
        monthlyIncome: surveyFormData.totalIncome?.value as number,
        age: age,
        city: getCity().cityCode,
        discount: carVariantDetails?.variantDetail.discount ?? 0,
        rateType: 'REGULAR',
        angsuranType: optionADDM
          ? InstallmentTypeOptions.ADDM
          : InstallmentTypeOptions.ADDB,
      })
        .then((response) => {
          const dataTemp = response.data
          setSpecialRateResults(dataTemp.reverse())
          setIsLoadingLoanRank && setIsLoadingLoanRank(false)
        })
        .catch(() => setIsLoadingLoanRank && setIsLoadingLoanRank(false))
    }
  }

  const setDataFilterLocal = (age: string): void => {
    const dataFilterLocal = localStorage.getItem(LocalStorageKey.CarFilter)
    const dataFilterParsed =
      dataFilterLocal !== null ? JSON.parse(dataFilterLocal) : null
    const newDataFilter = {
      ...dataFilterParsed,
      age: age,
    }
    localStorage.setItem(
      LocalStorageKey.CarFilter,
      JSON.stringify(newDataFilter),
    )
  }

  const handleOnChange = (value: FormControlValue) => {
    setAgeValue(value)
    if (value) {
      calculateWithFilledIncomeAnge(value.toString())
    }
    patchSurveyFormValue({
      [SurveyFormKey.Age]: { value, isDataValid: isDataValid(value) },
      [SurveyFormKey.AgeTmp]: {
        value: '0',
        isDataValid: false,
      },
      [SurveyFormKey.SpecialRateEnable]: {
        value: 'disable',
        isDataValid: false,
      },
    })
    if (!isTabCreditV2) {
      setSpecialRateResults([])
    }
  }
  useEffect(() => {
    if (
      isSubmitted &&
      ageValue === undefined &&
      (isTabCreditV2 || isTabCreditDesktop)
    ) {
      setEmptyAgeValue(true)
    } else {
      setEmptyAgeValue(false)
    }
    if (isOptionOpen) {
      setScrollToAge && setScrollToAge(true)
    } else {
      setScrollToAge && setScrollToAge(false)
    }
  }, [isSubmitted, ageValue, isOptionOpen])

  return (
    <StyledWrapper
      isNewRegularPage={isNewRegularPage}
      isTabCreditDesktop={isTabCreditDesktop}
    >
      <StyledFormLabel
        isNewRegularPage={isNewRegularPage}
        isTabCreditDesktop={isTabCreditDesktop}
        isTabCreditV2={isTabCreditV2}
      >
        Berapa umurmu?
      </StyledFormLabel>
      <SelectLoanCalculatorPage
        name={elementId.InstantApproval.DropdownAge}
        style={{ borderRadius: '8px' }}
        value={ageValue}
        options={ageFormConfig.options}
        onChoose={handleOnChange}
        placeholder={'18-27'}
        suffixIcon={() => (
          <DownOutlined color={'#05256e'} width={16} height={9} />
        )}
        isNewRegularPage={false}
        isTabCreditV2={true}
        isTabCreditDesktop={isTabCreditDesktop}
        isError={emptyAgeValue}
        onOptionOpen={setIsOptionOpen}
      />
      {isSubmitted && ageValue === undefined && !isTabCreditV2 && (
        <ErrorWrapper className={'shake-animation-X'}>
          {isTabCreditDesktop ? (
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
      )}
      {isSubmitted && ageValue === undefined && isTabCreditV2 && (
        <ErrorWrapperEmptyCreditV2 className={'shake-animation-X'}>
          <StyledIconContainer>
            <IconWarning color={'#FFFFFF'} width={10} height={10} />
          </StyledIconContainer>
          <ErrorMessageEmptySemiBold>Wajib diisi</ErrorMessageEmptySemiBold>
        </ErrorWrapperEmptyCreditV2>
      )}
    </StyledWrapper>
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

const StyledWrapper = styled.div<{
  isNewRegularPage: boolean
  isTabCreditDesktop: boolean
}>`
  margin-top: ${({ isNewRegularPage, isTabCreditDesktop }) =>
    isNewRegularPage ? '32px' : isTabCreditDesktop ? '24px' : '52px'};
  width: 96%;
  @media (max-width: 1920px) {
    width: 100%;
  }
  @media (max-width: 1024px) {
    margin-top: 26px;
  }
`

const FullEditFormLabel = styled.span`
  font-family: 'OpenSans';
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0px;

  display: block;
  color: ${colors.body};
  margin-bottom: 8px;
  font-size: 20px;
  @media (max-width: 768px) {
    font-size: 14px;
  }
`

const StyledFormLabel = styled(FullEditFormLabel)<{
  isNewRegularPage: boolean
  isTabCreditDesktop: boolean
  isTabCreditV2: boolean
}>`
  margin-bottom: 12px;
  font-size: ${({ isNewRegularPage, isTabCreditDesktop }) =>
    isNewRegularPage && !isTabCreditDesktop
      ? '24px'
      : !isNewRegularPage && isTabCreditDesktop
      ? '16px'
      : '14px'};
  font-family: 'KanyonMedium';
  line-height: ${({ isNewRegularPage }) =>
    isNewRegularPage ? '32px' : '20px'};
  @media (max-width: 1279px) {
    margin-bottom: 6px;
    font-size: 12px;
  }
  @media (max-width: 1024px) {
    margin-bottom: 6px;
  }
  @media (max-width: 1024px) {
    font-size: 14px;
    line-height: 20px;
    margin-bottom: 8px;
    font-size: 12px;
  }
  color: #52627a;
  ${({ isNewRegularPage }) =>
    isNewRegularPage &&
    `font-family: 'OpenSansSemiBold';
  font-style: normal;
  font-weight: 600;
  line-height: 20px;`};
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

const ErrorWrapperEmptyCreditV2 = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 7px;
  gap: 5px;
`

const ErrorMessageEmptySemiBold = styled.p`
  font-family: 'OpenSansSemiBold';
  font-style: normal;
  font-weight: 600;
  font-size: 10px;
  line-height: 8px;
  color: #d83130;
`
const StyledIconContainer = styled.div`
  ${WarningWrapper};
`

const StyledIconContainerWithMargin = styled.div`
  ${WarningWrapper};
  margin-top: -1.5px;
`
