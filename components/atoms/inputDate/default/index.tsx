import React from 'react'
import styles from 'styles/components/atoms/inputDate.module.scss'
import clsx from 'clsx'
import { IconCalendar } from '../../icon'
import { PropsInputDate } from 'utils/types/props'

const forwardedInputDate = (
  props: PropsInputDate,
  ref: React.ForwardedRef<HTMLInputElement>,
) => {
  const {
    title,
    dataTestId,
    id,
    className,
    message,
    isError,
    onBlur,
    onFocus,
    value,
    placeholder,
    showValueAs,
    ...inputDateProps
  } = props

  const [isFocus, setIsFocus] = React.useState(false)

  const showValue = () => (showValueAs ? showValueAs : value)

  return (
    <div>
      {title ? (
        <label className={styles.titleText} htmlFor={id}>
          {title}
        </label>
      ) : null}
      <div className={styles.inputContainer}>
        <div
          className={clsx(styles.maskInput, {
            [styles.error]: isError,
            [styles.focus]: isFocus,
          })}
        >
          {showValue() ? (
            showValue()
          ) : (
            <span className={styles.placeholder}>{placeholder}</span>
          )}
        </div>
        <input
          value={value}
          placeholder={placeholder}
          title={title}
          id={id}
          data-test-id={dataTestId}
          type="date"
          onFocus={(e) => {
            setIsFocus(true)
            onFocus && onFocus(e)
          }}
          onBlur={(e) => {
            setIsFocus(false)
            onBlur && onBlur(e)
          }}
          className={clsx(styles.input, isError && styles.error, className)}
          ref={ref}
          {...inputDateProps}
        />
        <div className={styles.iconCalendar}>
          <IconCalendar width={24} height={24} color="#13131B" />
        </div>
      </div>
      {isError && <p className={styles.errorText}>{message}</p>}
    </div>
  )
}

export const InputDate = React.forwardRef(forwardedInputDate)
