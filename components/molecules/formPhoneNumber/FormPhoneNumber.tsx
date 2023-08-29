import { GlobalFormPhoneNumber } from './GlobalFormPhoneNumber'
import { LocalFormPhoneNumber } from './LocalFormPhoneNumber'

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
