import React, { ChangeEvent, ForwardedRef } from 'react'
import styles from 'styles/components/atoms/inputWithIcon.module.scss'

interface Props {
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onFocus?: (event: ChangeEvent<HTMLInputElement>) => void
  inputType?: string
  placeholderText?: string
  isAutoFocus?: boolean
  prefix?: () => JSX.Element
  suffix?: () => JSX.Element
  emitOnBlur?: () => void
  isError?: boolean
  emitOnKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  maxInputLength?: number
  datatestid?: string
}

const forwardedInputWithIcon = (
  {
    value,
    onChange,
    onFocus,
    inputType = 'text',
    placeholderText = '',
    isAutoFocus = false,
    prefix,
    suffix,
    emitOnBlur,
    isError,
    emitOnKeyDown,
    maxInputLength,
    datatestid,
  }: Props,
  ref?: ForwardedRef<HTMLInputElement>,
) => {
  const onBlurHandler = () => {
    emitOnBlur && emitOnBlur()
  }

  const onKeyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    emitOnKeyDown && emitOnKeyDown(e)
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.inputArea} ${isError && styles.errorArea}`}>
        {prefix && prefix()}
        <input
          onFocus={onFocus}
          ref={ref}
          value={value}
          type={inputType}
          onChange={onChange}
          className={styles.inputField}
          placeholder={placeholderText}
          autoFocus={isAutoFocus}
          onBlur={onBlurHandler}
          onKeyDown={onKeyDownHandler}
          maxLength={maxInputLength}
          data-testid={datatestid}
        />
        {suffix && suffix()}
      </div>
    </div>
  )
}

export const InputWithIcon = React.forwardRef(forwardedInputWithIcon)
