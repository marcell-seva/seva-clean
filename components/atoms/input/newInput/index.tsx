import React, { ForwardedRef, InputHTMLAttributes, ReactElement } from 'react'
import styles from 'styles/components/atoms/newInput.module.scss'
import elementId from 'utils/helpers/trackerId'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type: string
  suffixIcon?: () => JSX.Element
  prefixComponent?: () => JSX.Element
  prefixMarginRight?: number
  bottomComponent?: () => JSX.Element
  ref?: ForwardedRef<HTMLInputElement>
  citySelectorMobile?: boolean
  additionalInputAreaClassname?: string
  name?: string
  additionalContainerClassname?: string
}

const noForwardRefInput = (
  {
    type,
    onFocus,
    onBlur,
    prefixComponent,
    suffixIcon,
    bottomComponent,
    additionalInputAreaClassname,
    name,
    additionalContainerClassname,
    ...restProps
  }: InputProps,
  ref?: ForwardedRef<HTMLInputElement>,
): ReactElement => {
  return (
    <div
      className={`${styles.styledContainer} ${additionalContainerClassname}`}
    >
      <div
        {...restProps}
        className={`${styles.styledInputArea} ${additionalInputAreaClassname}`}
      >
        {prefixComponent && prefixComponent()}
        {type === 'tel' && name === null ? (
          <input
            className={styles.styledInput}
            data-testid={elementId.Homepage.CarSearchWidget.InputPhoneNumber}
            type={type}
            ref={ref}
            {...restProps}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        ) : type === 'tel' && name === 'login-phone-number' ? (
          <input
            className={styles.styledInput}
            data-testid={elementId.HamburgerMenu.Login.InputPhoneNumber}
            type={type}
            ref={ref}
            {...restProps}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        ) : (
          <input
            className={styles.styledInput}
            data-testid={name}
            type={type}
            ref={ref}
            {...restProps}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        )}
        {suffixIcon && suffixIcon()}
      </div>
      {bottomComponent && bottomComponent()}
    </div>
  )
}

export const NewInput = React.forwardRef(noForwardRefInput)
