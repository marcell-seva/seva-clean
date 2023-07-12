import { NewInput } from 'components/atoms/input/newInput'
import { Input } from 'components/atoms/OldInput/Input'
import {
  CountryCodePlusSign,
  IndonesiaCountryCode,
} from 'context/useContactFormData/useContactFormData'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { filterNonDigitCharacters } from 'utils/stringUtils'
import { FormLabel } from './FormComponents'
import { formConfig } from './formConfig'
import { PrefixComponent, PrefixComponentRefi } from './GlobalFormPhoneNumber'

interface FormPhoneNumberProps {
  showDefaultLabel?: boolean
  disabled?: boolean
  initialValue?: string
  onChange?: (value: string) => void
  v2Style?: boolean
  refiForm?: boolean
  name?: string
}

export const LocalFormPhoneNumber = ({
  showDefaultLabel = true,
  disabled = false,
  initialValue = '',
  onChange,
  v2Style,
  refiForm,
  name,
}: FormPhoneNumberProps) => {
  const { t } = useTranslation()
  const initialPhoneNumber = initialValue.replace(
    CountryCodePlusSign + IndonesiaCountryCode,
    '',
  )

  const [phoneNumber, setPhoneNumber] = useState('')

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value[0] != '0') {
      const phoneNumberTemp = filterNonDigitCharacters(event.target.value)
      setPhoneNumber(phoneNumberTemp)
      onChange &&
        onChange(
          `${CountryCodePlusSign}${IndonesiaCountryCode}${phoneNumberTemp}`,
        )
    }
  }

  useEffect(() => {
    setPhoneNumber(initialPhoneNumber)
  }, [initialValue])

  return (
    <Wrapper className={'phone-number-input-element'}>
      {showDefaultLabel && <FormLabel>{t(formConfig.label)}</FormLabel>}
      {v2Style ? (
        <NewInput
          value={phoneNumber}
          type={'tel'}
          onChange={handleOnChange}
          maxLength={14}
          prefixComponent={() => <PrefixComponent v2Style={v2Style} />}
          placeholder={'Contoh: 81212345678'}
          disabled={disabled}
          name={name}
        />
      ) : refiForm ? (
        <StyledNewInput
          value={phoneNumber}
          type={'tel'}
          onChange={handleOnChange}
          maxLength={14}
          prefixComponent={() => <PrefixComponentRefi v2Style={true} />}
          placeholder={'Contoh: 81212345678'}
          disabled={disabled}
        />
      ) : (
        <Input
          value={phoneNumber}
          type={'tel'}
          onChange={handleOnChange}
          maxLength={14}
          prefixComponent={() => <PrefixComponent v2Style={v2Style} />}
          placeholder={'Contoh: 81212345678'}
          disabled={disabled}
        />
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  ${FormLabel} {
    margin-bottom: 4px;
  }
`
const StyledNewInput = styled(NewInput)`
  padding: 14px 16px;
  height: 48px;
`
