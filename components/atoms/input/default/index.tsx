import React from 'react'
import styles from '../../../../styles/saas/components/atoms/input.module.scss'
import { PropsInput } from 'utils/types'
import clsx from 'clsx'

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
  ...props
}: PropsInput): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      <p className={styles.titleText}>{title}</p>
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
