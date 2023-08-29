import React, { ChangeEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Input } from 'components/atoms/OldInput/Input'
import { filterNonDigitCharacters } from 'utils/stringUtils'
import { PrefixComponent, PrefixComponentRefi } from './GlobalFormPhoneNumber'
import { NewInput } from 'components/atoms/OldInput/NewInput'
import {
  CountryCodePlusSign,
  IndonesiaCountryCode,
} from 'utils/hooks/useContactFormData/useContactFormData'
import { colors } from 'styles/colors'

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
      {showDefaultLabel && <FormLabel>Tulis nomor telepon kamu</FormLabel>}
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

const FormLabel = styled.span`
  font-family: 'KanyonBold';
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0px;
  color: ${colors.label};
  margin-top: 32px;
`

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
