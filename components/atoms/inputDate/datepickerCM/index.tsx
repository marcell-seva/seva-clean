import React, { useState } from 'react'
import styles from '/styles/components/atoms/datepicker.module.scss'
import clsx from 'clsx'
import { IconCalendar } from '../../icon'
import {
  ConfigProvider,
  DatePicker as DatePickerMobile,
  DatePickerProps,
} from 'antd-mobile'
import id_ID from 'antd-mobile/es/locales/id-ID'
import 'dayjs/locale/id'
import dayjs from 'dayjs'
import { PropsIcon } from 'utils/types'

type PropsDatePicker = DatePickerProps & {
  isError?: boolean
  errorMessage?: string
  title?: string
  placeholder?: string
  name?: string
  onBlurInput?: (e: React.FocusEvent<HTMLButtonElement>) => void
  customStyle?: {
    iconCalendar?: Partial<Pick<PropsIcon, 'width' | 'height' | 'color'>>
  }
  formatValue?: (value: DatePickerProps['value']) => string
  titleDatePicker?: string
  visible?: boolean
  isOTO?: boolean
}

const defaultRenderLabel: PropsDatePicker['renderLabel'] = (type, number) => {
  if (type === 'month')
    return dayjs()
      .month(number - 1)
      .locale('id')
      .format('MMMM')
  return number
}

const DatePickerCM = (props: PropsDatePicker) => {
  const {
    className,
    value,
    placeholder = 'DD/MM/YYYY',
    isError,
    errorMessage,
    title,
    onBlurInput,
    name,
    customStyle,
    formatValue = (value) => dayjs(value).format('DD/MM/YYYY'),
    renderLabel = defaultRenderLabel,
    titleDatePicker = 'Pilih Tanggal',
    onClose,
    visible = false,
    isOTO,
    ...datePickerProps
  } = props

  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const isValueDate = value instanceof Date && !isNaN(value.valueOf())

  return (
    <>
      <div className={styles.datePickerContainer}>
        {title ? <span className={styles.titleText}>{title}</span> : null}
        <div
          className={styles.btnContainer}
          onClick={() =>
            visible ? setDatePickerOpen(true) : setDatePickerOpen(false)
          }
        >
          <button
            type="button"
            name={name}
            className={clsx(styles.input, {
              [styles.placeholder]: !isValueDate,
              [styles.error]: isError,
              ['shake-animation-X']: isError,
              [styles.disabled]: !visible ?? !isOTO,
            })}
            onBlur={onBlurInput}
            onClick={() =>
              visible ? setDatePickerOpen(true) : setDatePickerOpen(false)
            }
          >
            {isValueDate ? formatValue(value) : placeholder}
          </button>
          <div className={styles.iconCalendar}>
            <IconCalendar
              width={customStyle?.iconCalendar?.width ?? 24}
              height={customStyle?.iconCalendar?.height ?? 24}
              color={customStyle?.iconCalendar?.color ?? '#13131B'}
            />
          </div>
        </div>
        {isError && <span className={styles.errorText}>{errorMessage}</span>}

        <ConfigProvider
          locale={{
            ...id_ID,
            common: {
              cancel: 'Batal',
              close: 'Close',
              confirm: 'Simpan',
              loading: 'memuat',
            },
          }}
        >
          <DatePickerMobile
            {...datePickerProps}
            className={className}
            value={isValueDate ? value : new Date()}
            title={titleDatePicker}
            visible={datePickerOpen}
            onClose={() => {
              onClose && onClose()
              setDatePickerOpen(false)
            }}
            renderLabel={renderLabel}
          />
        </ConfigProvider>
      </div>
    </>
  )
}

export default DatePickerCM
