import React, { InputHTMLAttributes } from 'react'
import styles from 'styles/components/atoms/input.module.scss'
import clsx from 'clsx'
import { PropsInput } from 'utils/types/props'
import { InputVersionType } from 'utils/enum'

const Input = ({
  value,
  placeholder,
  onChange,
  isError,
  message,
  disabled,
  title,
  dataTestId,
  className,
  version,
  ...props
}: PropsInput): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      <p
        className={
          version === InputVersionType.Secondary
            ? styles.titleSecondaryText
            : styles.titlePrimaryText
        }
      >
        {title}
      </p>
      <input
        data-test-id={dataTestId}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={clsx(styles.input, isError && styles.error, className)}
        placeholder={placeholder}
        {...props}
      />
      {isError && <p className={styles.errorText}>{message}</p>}
    </div>
  )
}

export default Input
