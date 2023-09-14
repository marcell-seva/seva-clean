import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { colors } from 'styles/colors'
import {
  ButtonType,
  Primary1Style,
  StyledLoading,
} from 'components/atoms/ButtonOld/Button'
import {
  createUnverifiedLeadNew,
  UnverifiedLeadSubCategory,
} from 'services/lead'
import { trackLandingPageSearchWidgetSubmit } from 'helpers/amplitude/seva20Tracking'
import { removeWhitespaces } from 'utils/stringUtils'
import { createProbeTrack } from 'services/probe'
import { getLocalStorage } from 'utils/handler/localStorage'
import elementId from 'helpers/elementIds'
import { useRouter } from 'next/router'
import { CityOtrOption, UTMTagsData } from 'utils/types/utils'
import { LocalStorageKey } from 'utils/enum'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { ContactFormKey } from 'utils/types/models'
import { trackGAContact, trackGALead } from 'services/googleAds'
import { getConvertDP, getConvertFilterIncome } from 'utils/filterUtils'
import { downPaymentConfig } from 'config/downPaymentAmount.config'
import { incomeOptions } from 'components/organisms/PLPDesktop/Filter/FilterSideMenu/NewFilterSideMenu'
import { convertObjectQuery } from 'utils/handler/convertObjectQuery'
import { FormPhoneNumber } from '../formPhoneNumber/FormPhoneNumber'
import { NewDownPaymentAmount } from '../newDownPaymentAmount/newDownPaymentAmount'
import { Tenure } from '../tenure'
import { AdvancedSearch } from '../advencedSearch/advencedSearch'
import { jt, Rp } from 'utils/helpers/const'
import { carResultsUrl } from 'utils/helpers/routes'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import { useContextForm } from 'services/context/formContext'
import { useFinancialQueryData } from 'services/context/finnancialQueryContext'

export const SearchWidget = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [dropdown, setDropdown] = useState(false)
  const [mandatory, setMandatory] = useState(false)
  const initAdvError = { income: false, age: false }
  const { financialQuery } = useFinancialQueryData()
  const [advError, setAdvError] = useState(initAdvError)
  const buttonWording = 'Temukan Mobilku'
  const { funnelQuery } = useFunnelQueryData()
  const { patchFinancialQuery } = useFinancialQueryData()
  // const { setRecommendations } = useContextRecommendations()
  const {
    formContactValue: contactFormData,
    patchFormContactValue: patchContactFormValue,
  } = useContextForm()
  const UTMTags = getLocalStorage<UTMTagsData>(LocalStorageKey.UtmTags)
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )

  const CheckQueryDP = (): boolean => {
    if (!funnelQuery.downPaymentAmount) {
      return false
    }

    return true
  }

  const CheckQueryIncomeAge = () => {
    if (funnelQuery.age && !funnelQuery.monthlyIncome) {
      return { income: true, age: false }
    }

    if (!funnelQuery.age && funnelQuery.monthlyIncome) {
      return { income: false, age: true }
    }

    return initAdvError
  }

  const execUnverifiedLeads = () => {
    const phoneNumber = String(contactFormData.phoneNumberValid)
    const isValidPhoneNumber = phoneNumber.length > 3
    if (isValidPhoneNumber) {
      patchContactFormValue({
        [ContactFormKey.PhoneNumber]: phoneNumber,
        [ContactFormKey.PhoneNumberValid]: phoneNumber,
      })
      trackGALead()
      createProbeTrack({
        utmCampaign: UTMTags?.utm_campaign || '',
        utmContent: UTMTags?.utm_content || '',
        adsetId: UTMTags?.adset || '',
        utmTerm: UTMTags?.utm_term || '',
        phoneNumber: phoneNumber,
        loanDownPayment: parseInt(
          getConvertDP(financialQuery.downPaymentAmount),
        ),
        utmSource: UTMTags?.utm_source || '',
      })
      createUnverifiedLeadNew({
        phoneNumber,
        income: funnelQuery.monthlyIncome as string,
        age: funnelQuery.age as string,
        origination: UnverifiedLeadSubCategory.SEVA_NEW_CAR_SEARCH_WIDGET,
        tenure: (funnelQuery.tenure || 5) as number,
        ...(funnelQuery.downPaymentAmount && {
          dp: parseInt(funnelQuery.downPaymentAmount as string),
        }),
        ...(cityOtr?.id && { cityId: cityOtr.id }),
      }).then(() => {
        // prettier-ignore
        window.dataLayer.push({
          'event':'interaction',
          'eventCategory': 'Leads Generator',
          'eventAction': 'Homepage - Search Widget',
          'eventLabel': buttonWording,
        });
        // prettier-ignore
        window.dataLayer.push({
          'event': 'Leads_Form',
          'Title': 'Homepage – Search Widget',
          ...(funnelQuery.downPaymentAmount && {
            'DP': parseInt(funnelQuery.downPaymentAmount as string),
          }),
          'Tenure': (funnelQuery.tenure || 5) as number,
          'Income': funnelQuery.monthlyIncome as string,
          'Age': funnelQuery.age as string,
          'Phone_Number': phoneNumber,
        });
      })
    } else {
      trackGAContact()
    }
  }

  const removeUnnecessaryDataFilter = (): void => {
    const dataFilterLocal = localStorage.getItem(LocalStorageKey.CarFilter)
    const dataFilterParsed =
      dataFilterLocal !== null ? JSON.parse(dataFilterLocal) : null
    const newDataFilter = {
      ...dataFilterParsed,
      brand: [],
      bodyType: [],
      carModel: '',
    }

    localStorage.setItem(
      LocalStorageKey.CarFilter,
      JSON.stringify(newDataFilter),
    )
  }

  const onSubmitSearch = () => {
    const check = CheckQueryDP()
    removeUnnecessaryDataFilter()
    if (!check) {
      setMandatory(true)
      return
    }

    const checkIncomeAge = CheckQueryIncomeAge()

    if (dropdown) {
      if (checkIncomeAge.income || checkIncomeAge.age) {
        setAdvError(checkIncomeAge)
        return
      }
    }

    setLoading(false)
    execUnverifiedLeads()

    const dpLabel = downPaymentConfig.options.filter(
      (item) => item.value === getConvertDP(financialQuery.downPaymentAmount),
    )
    const incomeLabel = incomeOptions.filter(
      (item) => item.value === funnelQuery.monthlyIncome,
    )

    // trackLandingPageSearchWidgetSubmit({
    //   DP: removeWhitespaces(
    //     dpLabel[0].label.replace(`${Rp}`, '').replace(`${jt}`, '').trim(),
    //   ),
    //   Tenure: funnelQuery.tenure ? funnelQuery.tenure : null,
    //   Income:
    //     incomeLabel.length > 0
    //       ? removeWhitespaces(incomeLabel[0].label.replace('juta', '').trim())
    //       : null,
    //   Age: funnelQuery.age ? String(funnelQuery.age) : null,
    //   Phone_Number:
    //     String(contactFormData.phoneNumberValid).length > 3 ? 'YES' : 'NO',
    // })

    const tempQuery = {
      age: funnelQuery.age || '',
      tenure: funnelQuery.tenure || '',
      downPaymentAmount: funnelQuery.downPaymentAmount || '',
      monthlyIncome: funnelQuery.monthlyIncome || '',
      bodyType: [],
      brand: [],
    }

    patchFinancialQuery({
      age: funnelQuery.age,
      downPaymentAmount: funnelQuery.downPaymentAmount,
      monthlyIncome: getConvertFilterIncome(
        String(funnelQuery.monthlyIncome),
      ).replaceAll('.', ''),
      tenure: funnelQuery.tenure,
    })
    router.push({
      pathname: carResultsUrl,
      search: convertObjectQuery(tempQuery),
    })
    // getNewFunnelRecommendations(funnelQuery)
    //   .then((response: AxiosResponse<CarRecommendationResponse>) => {
    //     setRecommendations(response.data.carRecommendations || [])
    //
    //   })
    //   .catch((error) => {
    //     console.error(error)
    //     setLoading(false)
    //   })
  }

  useEffect(() => {
    setMandatory(false)
    setAdvError(initAdvError)
  }, [
    funnelQuery.downPaymentAmount,
    funnelQuery.age,
    funnelQuery.monthlyIncome,
  ])

  return (
    <Container>
      <SearchWdigetBox>
        <SearchWidgetTitle>
          Cari mobil baru yang pas buat kamu
        </SearchWidgetTitle>
        <DPTenorWrapper>
          <FieldWrapper style={{ width: 102 }}>
            <Title>Pilih maksimal DP</Title>
            <NewDownPaymentAmount isError={mandatory} placeholder=">Rp350 Jt" />
            {mandatory && (
              <MandatoryText
                data-testid={elementId.Homepage.CarSearchWidget.ErrorMessageDP}
              >
                *Wajib diisi
              </MandatoryText>
            )}
          </FieldWrapper>
          <FieldWrapper>
            <Title>Pilih tahun tenor</Title>
            <Tenure />
          </FieldWrapper>
        </DPTenorWrapper>
        <Title>
          Ingin bertanya langsung ke tim SEVA? Tulis nomor hp kamu untuk kami
          hubungi <label>(Opsional)</label>
        </Title>
        <FormPhoneNumber
          name={elementId.Homepage.CarSearchWidget.InputPhoneNumber}
          v2Style
          global
          showDefaultLabel={false}
          disableAfterAutofillLoggedInUser={true}
        />
        <AdvancedSearch
          isError={advError}
          onChangeDropdown={(open) => setDropdown(open)}
        />
      </SearchWdigetBox>
      <StyledButton
        data-testid={elementId.Homepage.CarSearchWidget.ButtonFindCar}
        id="homepage-search-widget-button-element"
        className="homepage-search-widget-button-element"
        isLoading={loading}
        buttonType={ButtonType.primary1}
        hoverColor={colors.primary2}
        onClick={onSubmitSearch}
      >
        {loading ? (
          <StyledLoading color={colors.offWhite} />
        ) : (
          <ButtonText>{buttonWording}</ButtonText>
        )}
      </StyledButton>
    </Container>
  )
}

const Container = styled.div`
  height: auto;
  width: 342px;
  position: relative;
  @media (max-width: 1024px) {
    margin-top: -33.5%;
    width: 95%;
    height: 100%;
  }
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const SearchWdigetBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: ${colors.white};
  border-radius: 8px;
  padding: 13px 10px 47px;
  width: 98%;
  box-shadow: 0px 1px 16px rgba(3, 24, 56, 0.1);
`

const SearchWidgetTitle = styled.span`
  font-family: var(--kanyon-bold);
  font-size: 14px;
  line-height: 14px;
  color: ${colors.body2};
  margin-bottom: 12px;
`

export const Title = styled.span`
  font-family: var(--open-sans);
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: ${colors.body2};
  margin-bottom: 8px;
  text-align: left;

  label {
    font-family: var(--open-sans);
    font-style: normal;
    font-weight: 400;
    font-size: 10px;
    line-height: 13.62px;
  }
`

export const MandatoryText = styled.span`
  margin-top: 4px;
  font-family: var(--open-sans);
  font-style: normal;
  font-weight: 400;
  font-size: 8px;
  line-height: 14px;
  color: #d83130;
  text-align: left;

  @media (min-width: 1025px) {
    font-size: 10px;
  }
`

const StyledButton = styled.span<{
  buttonType: ButtonType
  isLoading?: boolean
  hoverColor: string
}>`
  // style from button component
  ${({ isLoading = false, hoverColor }) => {
    return Primary1Style(isLoading, hoverColor)
  }}
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 0 auto;
  :hover {
    cursor: pointer;
  }
  :disabled {
    cursor: default;
  }
  // end of style from button component

  position: absolute;
  bottom: 0;
  width: 97%;
  height: 48px;
  border-radius: 8px;
  font-size: 14px;
  border: 3px solid white;
  :hover:enabled {
    :after {
      border-radius: 12px;
      border: 6px solid #d4d3ed;
    }
  }
`

const ButtonText = styled.span`
  font-family: var(--kanyon-bold);
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 24px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 0px;
  color: #eef6fb;

  @media (min-width: 1025px) {
    line-height: 18px;
  }
`

const DPTenorWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 17px;
  align-items: flex-start;
  margin-bottom: 12px;
`

export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
`
