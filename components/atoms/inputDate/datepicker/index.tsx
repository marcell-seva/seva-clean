import React, { useState } from 'react'
import {
  DatePicker as AntdDatePicker,
  ConfigProvider,
  DatePickerProps,
} from 'antd'
import styles from 'styles/components/atoms/datepicker.module.scss'
import clsx from 'clsx'
import { IconCalendar } from '../../icon'
import { PropsIcon } from 'utils/types'

type PropsDatePicker = DatePickerProps & {
  isError?: boolean
  errorMessage?: string
  title?: string
  onBlurInput?: (e: React.FocusEvent<HTMLButtonElement>) => void
  customStyle?: {
    iconCalendar?: Partial<Pick<PropsIcon, 'width' | 'height' | 'color'>>
  }
  formatValue?: string
}

const DatePicker = (props: PropsDatePicker) => {
  const {
    className,
    value,
    placeholder,
    isError,
    errorMessage,
    title,
    onBlurInput,
    name,
    customStyle,
    formatValue,
    ...datePickerProps
  } = props

  const [datePickerOpen, setDatePickerOpen] = useState(false)

  return (
    <>
      <div className={styles.datePickerContainer}>
        {title ? <span className={styles.titleText}>{title}</span> : null}
        <div
          className={styles.btnContainer}
          onClick={() => setDatePickerOpen(true)}
        >
          <button
            type="button"
            name={name}
            className={clsx(styles.input, {
              [styles.placeholder]: !value,
              [styles.error]: isError,
            })}
            onBlur={onBlurInput}
            onClick={() => setDatePickerOpen(true)}
          >
            {value ? value.format(formatValue ?? 'DD/MM/YYYY') : placeholder}
          </button>
          <div className={styles.iconCalendar}>
            <IconCalendar
              width={customStyle?.iconCalendar?.width ?? 24}
              height={customStyle?.iconCalendar?.height ?? 24}
              color={customStyle?.iconCalendar?.color ?? '#13131B'}
            />
          </div>
        </div>
        {isError && <p className={styles.errorText}>{errorMessage}</p>}
        <ConfigProvider
          theme={{
            components: {
              DatePicker: {
                colorPrimary: '#246ED4',
                colorLink: '#246ED4',
              },
            },
          }}
        >
          <AntdDatePicker
            {...datePickerProps}
            name={name}
            className={clsx(
              styles.datePicker,
              {
                [styles.isTitle]: !!title,
              },
              className,
            )}
            placeholder={placeholder}
            value={value}
            open={datePickerOpen}
            onOpenChange={setDatePickerOpen}
          />
        </ConfigProvider>
      </div>
    </>
  )
}

export default DatePicker
