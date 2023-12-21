import React, { ChangeEvent, useRef } from 'react'
import styles from '../../../../styles/components/molecules/form/formReferralCode.module.scss'
import {
  IconChecked,
  IconLoading,
  IconRemove,
  InputWithIcon,
} from 'components/atoms'
import clsx from 'clsx'
import elementId from 'helpers/elementIds'

interface Props {
  emitOnChange: (event: ChangeEvent<HTMLInputElement>) => void
  onFocus?: (event: ChangeEvent<HTMLInputElement>) => void
  isLoadingReferralCode: boolean
  isErrorReferralCode: boolean
  isSuccessReferralCode: boolean
  passedResetReferralCodeStatusFunc: () => void
  passedCheckReferralCodeFunc: () => void
  onClearInput: () => void
  value: string
  errorMessage?: string
  checkedIconColor?: string
  errorIconColor?: string
  maxInputLength?: number
  vibrateErrorMessage?: boolean
  isFocus?: boolean
  fieldLabel?: string
  placeholderText?: string
  additionalContainerStyle?: string
  className?: string
}

export const FormReferralCode = ({
  emitOnChange,
  onFocus,
  isLoadingReferralCode,
  isErrorReferralCode,
  isSuccessReferralCode,
  passedResetReferralCodeStatusFunc,
  passedCheckReferralCodeFunc,
  onClearInput,
  value,
  errorMessage = 'Kode referral tidak ditemukan',
  checkedIconColor = '#5FC19E',
  errorIconColor = '#05256E',
  maxInputLength,
  vibrateErrorMessage = false,
  isFocus,
  fieldLabel = 'Kode Referral (opsional)',
  placeholderText = 'Masukkan kode referral',
  additionalContainerStyle,
  className,
}: Props) => {
  const inputWithIconRef = useRef<HTMLInputElement | null>(null)

  const onBlurReferralCode = () => {
    if (value.length === 0) {
      passedResetReferralCodeStatusFunc()
      return
    } else passedCheckReferralCodeFunc()
  }

  const inputFieldKeyDownHandler = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Enter') {
      inputWithIconRef.current?.blur()
    }
  }

  const renderReferralCodeSuffixIcon = () => {
    if (isLoadingReferralCode) {
      return (
        <div className={styles.iconWrapper}>
          <IconLoading width={14} height={14} color="#52627A" />
        </div>
      )
    } else if (isErrorReferralCode) {
      return (
        <div
          onClick={() => {
            onClearInput()
            inputWithIconRef.current?.focus()
          }}
        >
          <IconRemove width={24} height={24} color={errorIconColor} />
        </div>
      )
    } else if (isSuccessReferralCode) {
      return <IconChecked width={24} height={24} color={checkedIconColor} />
    } else {
      return <></>
    }
  }

  const renderMessage = () => {
    if (isErrorReferralCode) {
      return (
        <span
          className={clsx({
            [styles.textMessageReferralCode]: true,
            [styles.redText]: true,
            [styles.shakeText]: vibrateErrorMessage,
          })}
        >
          {errorMessage}
        </span>
      )
    } else {
      return <></>
    }
  }

  return (
    <div
      className={`${styles.container} ${additionalContainerStyle} ${className}`}
    >
      <span className={styles.fieldLabel}>{fieldLabel}</span>
      <InputWithIcon
        onFocus={onFocus}
        isAutoFocus={isFocus}
        ref={inputWithIconRef}
        value={value}
        placeholderText={placeholderText}
        onChange={emitOnChange}
        emitOnBlur={onBlurReferralCode}
        suffix={renderReferralCodeSuffixIcon}
        isError={isErrorReferralCode}
        emitOnKeyDown={inputFieldKeyDownHandler}
        maxInputLength={maxInputLength}
        datatestid={elementId.Input.KodeReferral}
      />
      {renderMessage()}
    </div>
  )
}
