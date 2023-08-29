/* eslint-disable react-hooks/rules-of-hooks */
import React, {
  ForwardedRef,
  InputHTMLAttributes,
  ReactElement,
  useEffect,
  useState,
} from 'react'
import elementId from 'utils/helpers/trackerId'
import styles from 'styles/components/atoms/searchInput.module.scss'
export enum InputTheme {
  default = 'default',
  profilePage = 'profile-page',
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type: string
  inputTheme?: InputTheme
  suffixIcon?: () => JSX.Element
  prefixComponent?: () => JSX.Element
  prefixMarginRight?: number
  bottomComponent?: () => JSX.Element
  height?: number
  ref?: ForwardedRef<HTMLInputElement>
  overrideRedBorder?: boolean
  overrideHeightMobile?: boolean
  citySelectorMobile?: boolean
  dataTestId?: string
  name?: string
}

const noForwardRefInput = (
  {
    prefixComponent,
    suffixIcon,
    bottomComponent,
    dataTestId,
    onFocus,
    onBlur,
    name,
    ...restProps
  }: InputProps,
  ref?: ForwardedRef<HTMLInputElement>,
): ReactElement => {
  const [nameForm, setNameForm] = useState('')
  const [isFocus, setIsFocus] = useState(false)

  const handleFocus = (e: any) => {
    onFocus && onFocus(e)
    setIsFocus(true)
  }

  const handleBlur = (e: any) => {
    onBlur && onBlur(e)
    setIsFocus(false)
  }

  useEffect(() => {
    if (name === 'birthdate-register') {
      setNameForm(elementId.HamburgerMenu.Register.BirthDate)
    }
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.searchInput}>
        <input
          className={`input-element ${styles.input}`}
          data-testid={dataTestId || nameForm}
          ref={ref}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...restProps}
        />
        {suffixIcon && suffixIcon()}
      </div>
      {bottomComponent && bottomComponent()}
    </div>
  )
}
export const Input = React.forwardRef(noForwardRefInput)
