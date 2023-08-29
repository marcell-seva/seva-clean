import React, { useState } from 'react'
import styles from 'styles/components/atoms/inputPhone.module.scss'
import { PropsInput } from 'utils/types/props'

const InputPrefix = ({
  value,
  placeholder,
  onChange,
  isError,
  message,
  disabled,
  title,
  dataTestId,
  className,
  onBlur,
}: PropsInput): JSX.Element => {
  const [isFocus, setIsFocus] = useState(false)

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocus(false)
    if (onBlur) {
      onBlur(event)
    }
  }

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div
        className={`${styles.wrapperInput} ${
          isFocus ? styles.focus : styles.default
        } ${!isFocus && isError && styles.error} ${
          disabled && styles.disabled
        }`}
      >
        <p className={`${styles.textRegion} ${disabled && styles.disabled} `}>
          {title && `${title}`}
        </p>
        <input
          data-test-id={dataTestId}
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setIsFocus(true)}
          onBlur={handleBlur}
          className={`${styles.input} ${disabled && styles.disabled} `}
          placeholder={placeholder}
        />
      </div>

      {isError && <p className={styles.errorText}>{message}</p>}
    </div>
  )
}

export default InputPrefix
