import { useLocalStorageWithEncryption } from './../useLocalStorage/index'
import { ContactFormKey } from 'utils/types/models'
import { LocalStorageKey } from 'utils/enum'

export type FormItem = { [k in ContactFormKey]?: string }

export const CountryCodePlusSign = '+'
export const IndonesiaCountryCode = '62'

export const defaultContactFormValue: FormItem = {
  [ContactFormKey.Name]: undefined,
  [ContactFormKey.PurchaseTime]: undefined,
  [ContactFormKey.ContactTime]: undefined,
  [ContactFormKey.PhoneNumber]: ``,
  [ContactFormKey.PhoneNumberValid]: ``,
  [ContactFormKey.PhoneNumberMiniSurvey]: ``,
  [ContactFormKey.IsRegistered]: undefined,
  [ContactFormKey.CalculateLoan]: '',
  [ContactFormKey.SpecialRateResult]: '',
  [ContactFormKey.Dob]: '',
  [ContactFormKey.CheckBox1]: 'Y',
  [ContactFormKey.CheckBox2]: 'N',
  [ContactFormKey.SubmittedForm]: 'N',
  [ContactFormKey.IsLogin]: 'N',
  [ContactFormKey.Email]: '',
  [ContactFormKey.NameTmp]: '',
  [ContactFormKey.Gender]: '',
  [ContactFormKey.Marital]: '',
  [ContactFormKey.ReferralCode]: '',
}

export const useContactFormData = (
  initialFormData: FormItem = defaultContactFormValue,
) => {
  const [formValue, setFormValue] = useLocalStorageWithEncryption<FormItem>(
    LocalStorageKey.ContactForm,
    initialFormData,
  )
  const formItemValue = (key: ContactFormKey) => formValue[key]

  const patchFormItemValue = (value: FormItem) => {
    setFormValue((preValue: FormItem) => {
      return { ...preValue, ...value }
    })
  }
  return { formItemValue, patchFormItemValue, formValue }
}
