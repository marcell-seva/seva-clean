import React from 'react'
import styled from 'styled-components'
import { colors } from 'styles/colors'
import { LocalFormPhoneNumber } from './LocalFormPhoneNumber'
import { CountryCodePlusSign } from 'utils/hooks/useContactFormData/useContactFormData'
import { GlobalFormPhoneNumber } from './GlobalFormPhoneNumber'

const FlagIndonesia = '/assets/icon/FlagIndonesia.svg'

interface FormPhoneNumberProps {
  showDefaultLabel?: boolean
  disabled?: boolean
  global?: boolean
  initialValue?: string
  onChange?: (value: string) => void
  v2Style?: boolean
  disableAfterAutofillLoggedInUser?: boolean
  name?: string
}

export const isValidPhoneNumber = (value: string) => {
  return /^\d{6,24}$/.test(value.replace(/[+]/gi, ''))
}

export const prefixComponent = () => (
  <>
    <FlagImg
      src={FlagIndonesia}
      alt="seva-indonesia-flag"
      width="16"
      height="16"
    />
    <Spacer />
    <StyledCodeCountry>{CountryCodePlusSign}62</StyledCodeCountry>
    <Spacer />
    <Spacer2 />
    <Spacer />
  </>
)

export const FormPhoneNumber = ({
  showDefaultLabel,
  disabled,
  global = true,
  initialValue,
  onChange,
  v2Style,
  name,
  disableAfterAutofillLoggedInUser,
}: FormPhoneNumberProps) => {
  // Made FormPhoneNumber Component for global state (context)
  if (global)
    return (
      <GlobalFormPhoneNumber
        showDefaultLabel={showDefaultLabel}
        disabled={disabled}
        v2Style={v2Style}
        disableAfterAutofillLoggedInUser={disableAfterAutofillLoggedInUser}
        name={name}
      />
    )

  // Made FormPhoneNumber Component for local state
  return (
    <LocalFormPhoneNumber
      showDefaultLabel={showDefaultLabel}
      disabled={disabled}
      initialValue={initialValue}
      onChange={onChange}
      v2Style={v2Style}
      name={name}
    />
  )
}

const FlagImg = styled.img`
  max-width: 16px;
  width: 16px;
  max-height: 24px;
`

const Spacer = styled.div`
  width: 10px;
`

const Spacer2 = styled.div`
  background-color: ${colors.placeholder};
  width: 2px;
  height: 25px;
`

const StyledCodeCountry = styled.span`
  font-family: 'KanyonBold';
  font-style: normal;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0px;
  @media (max-width: 1024px) {
    font-size: 14px;
  }
`
