import styled from 'styled-components'
import {
  CountryCodePlusSign,
  IndonesiaCountryCode,
} from 'utils/hooks/useContactFormData/useContactFormData'
import { useTranslation } from 'react-i18next'
import {
  useContextContactFormData,
  useContextContactFormPatch,
} from 'context/contactFormContext/contactFormContext'
import { ChangeEvent, useEffect, useState } from 'react'
import { filterNonDigitCharacters } from 'utils/stringUtils'
import { decryptValue, encryptValue } from 'utils/encryptionUtils'
import { ContactFormKey, LocalStorageKey } from 'utils/models/models'
import { getLocalStorage, saveLocalStorage } from 'utils/localstorageUtils'
import { getToken } from 'utils/api'
import { getCustomerInfoSeva } from 'services/customer'
import elementId from 'helpers/elementIds'
import { FormLabel } from './FormComponents'
import { NewInput } from 'components/atoms/input/newInput'
import { Input } from 'components/atoms/OldInput/Input'
import { colors } from 'styles/colors'
import { LinkLabelMediumBoldStyle } from 'utils/typography/LinkLabelMediumBold'
import { formConfig } from './formConfig'

const FlagIndonesia = '/v3/assets/illustration/FlagIndonesiaNew.png'

interface FormPhoneNumberProps {
  showDefaultLabel?: boolean
  disabled?: boolean
  v2Style?: boolean
  disableAfterAutofillLoggedInUser?: boolean
  name?: string
}

export const PrefixComponent = ({ v2Style }: { v2Style?: boolean }) => (
  <>
    <FlagImg
      src={FlagIndonesia}
      alt="seva-indonesia-flag"
      width="16"
      height="16"
    />
    <Spacer />
    <StyledCodeCountry v2Style={v2Style}>
      {CountryCodePlusSign}62
    </StyledCodeCountry>
    <Spacer />
    <Spacer2 />
    <Spacer />
  </>
)

export const PrefixComponentRefi = ({ v2Style }: { v2Style?: boolean }) => (
  <>
    <StyledCodeCountry v2Style={v2Style}>
      {CountryCodePlusSign}62
    </StyledCodeCountry>
    <Spacer />
  </>
)

export const GlobalFormPhoneNumber = ({
  showDefaultLabel = true,
  disabled = false,
  v2Style,
  name,
  disableAfterAutofillLoggedInUser = false,
}: FormPhoneNumberProps) => {
  const { t } = useTranslation()
  const contactFormData = useContextContactFormData()
  const savedPhoneNumber =
    contactFormData.phoneNumber?.replace(
      CountryCodePlusSign + IndonesiaCountryCode,
      '',
    ) || ''
  const [phoneNumber, setPhoneNumber] = useState('')
  console.log('qwe phoneNumber global', phoneNumber)

  const [nameForm, setNameForm] = useState('')
  const patchContactFormValue = useContextContactFormPatch()
  const [isDisablePhoneNumberField, setIsDisablePhoneNumberField] =
    useState(false)

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value[0] != '0') {
      const phoneNumberTemp = filterNonDigitCharacters(event.target.value)
      setPhoneNumber(phoneNumberTemp)
      patchContactFormValue({
        [ContactFormKey.PhoneNumberValid]: `${CountryCodePlusSign}${IndonesiaCountryCode}${phoneNumberTemp}`,
      })
    }
  }

  const setCustomerDetail = (payload: any) => {
    const encryptedData = encryptValue(JSON.stringify(payload))
    saveLocalStorage(LocalStorageKey.sevaCust, encryptedData)
  }

  useEffect(() => {
    const token = getToken()
    const checkDataCustomer = async () => {
      const data: string | null = getLocalStorage(LocalStorageKey.sevaCust)
      if (data === null) {
        getCustomerInfoSeva().then((response: any) => {
          if (Array.isArray(response.data)) {
            const customerPhoneNumber = response.data[0].phoneNumber.replace(
              CountryCodePlusSign + IndonesiaCountryCode,
              '',
            )
            setPhoneNumber(customerPhoneNumber)
            disableAfterAutofillLoggedInUser &&
              setIsDisablePhoneNumberField(true)
            setCustomerDetail(response.data[0])
          } else {
            setPhoneNumber(savedPhoneNumber)
          }
        })
      } else {
        const decryptedData = JSON.parse(decryptValue(data))
        const customerPhoneNumber = decryptedData.phoneNumber.replace(
          CountryCodePlusSign + IndonesiaCountryCode,
          '',
        )
        setPhoneNumber(customerPhoneNumber)
        disableAfterAutofillLoggedInUser && setIsDisablePhoneNumberField(true)
      }
    }
    if (token) {
      checkDataCustomer()
    } else {
      setPhoneNumber(savedPhoneNumber)
    }
    if (name === 'login-phone-number') {
      setNameForm(elementId.HamburgerMenu.Login.InputPhoneNumber)
    }
  }, [])

  return (
    <Wrapper className={'phone-number-input-element'}>
      {showDefaultLabel && <FormLabel>{t(formConfig.label)}</FormLabel>}
      {v2Style ? (
        <NewInput
          data-testid={nameForm || name}
          value={phoneNumber}
          type={'tel'}
          onChange={handleOnChange}
          maxLength={14}
          prefixComponent={() => <PrefixComponent v2Style={v2Style} />}
          placeholder={'Contoh: 81212345678'}
          disabled={
            disableAfterAutofillLoggedInUser
              ? isDisablePhoneNumberField
              : disabled
          }
        />
      ) : (
        <Input
          data-testid={nameForm || name}
          value={phoneNumber}
          type={'tel'}
          onChange={handleOnChange}
          maxLength={14}
          prefixComponent={() => <PrefixComponent v2Style={v2Style} />}
          placeholder={'Contoh: 81212345678'}
          disabled={
            disableAfterAutofillLoggedInUser
              ? isDisablePhoneNumberField
              : disabled
          }
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
const StyledCodeCountry = styled.span<{ v2Style?: boolean }>`
  @media (max-width: 480px) {
    font-size: 14px;
  }
  ${({ v2Style }) =>
    v2Style
      ? `font-family: 'OpenSansSemiBold';
font-style: normal;
font-weight: 600;
font-size: 12px !important;
line-height: 20px;
color: ${colors.body2};
`
      : LinkLabelMediumBoldStyle}
`
