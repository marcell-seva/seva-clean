import React, { ChangeEvent, useRef } from 'react'
import styles from '../../../../styles/components/molecules/form/formPromoCode.module.scss'
import {
  IconChecked,
  IconLoading,
  IconRemove,
  InputWithIcon,
} from 'components/atoms'
import elementId from 'helpers/elementIds'

interface Props {
  emitOnChange: (value: string) => void
  emitPromoCodeValidResult: (value: boolean) => void
  isLoadingPromoCode: boolean
  isErrorPromoCode: boolean
  isSuccessPromoCode: boolean
  passedResetPromoCodeStatusFunc: () => void
  passedCheckPromoCodeFunc: () => void
  onClearInput: () => void
  value: string
}

export const FormPromoCode = ({
  emitOnChange,
  emitPromoCodeValidResult,
  isLoadingPromoCode,
  isErrorPromoCode,
  isSuccessPromoCode,
  passedResetPromoCodeStatusFunc,
  passedCheckPromoCodeFunc,
  onClearInput,
  value,
}: Props) => {
  const inputWithIconRef = useRef<HTMLInputElement | null>(null)

  const onChangePromoCode = (event: ChangeEvent<HTMLInputElement>) => {
    passedResetPromoCodeStatusFunc()

    const value = event.target.value
      .toUpperCase()
      .replace(' ', '')
      .replace(/[^\w\s]/gi, '')

    emitOnChange(value)
  }

  const onBlurPromoCode = () => {
    if (value.length === 0) {
      passedResetPromoCodeStatusFunc()
      emitPromoCodeValidResult(true)
      return
    }

    passedCheckPromoCodeFunc()
  }

  const inputFieldKeyDownHandler = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Enter') {
      inputWithIconRef.current?.blur()
    }
  }

  const renderPromoCodeSuffixIcon = () => {
    if (isLoadingPromoCode) {
      return (
        <div className={styles.iconWrapper}>
          <IconLoading width={14} height={14} color="#52627A" />
        </div>
      )
    } else if (isErrorPromoCode) {
      return (
        <div
          onClick={() => {
            onClearInput()
            inputWithIconRef.current?.focus()
          }}
        >
          <IconRemove width={24} height={24} color="#05256E" />
        </div>
      )
    } else if (isSuccessPromoCode) {
      return <IconChecked width={24} height={24} color="#05256E" />
    } else {
      return <></>
    }
  }

  const renderMessage = () => {
    if (isErrorPromoCode) {
      return (
        <span className={`${styles.textMessagePromoCode} ${styles.redText}`}>
          Kode promo tidak ditemukan
        </span>
      )
    } else if (isSuccessPromoCode) {
      return (
        <span className={`${styles.textMessagePromoCode} ${styles.greenText}`}>
          Selamat! Kamu memenuhi syarat untuk promo ini
        </span>
      )
    } else {
      return <></>
    }
  }

  return (
    <div className={styles.container}>
      <span className={styles.fieldLabel}>Kode promo (opsional)</span>
      <InputWithIcon
        ref={inputWithIconRef}
        value={value}
        placeholderText="Masukkan kode promo"
        onChange={onChangePromoCode}
        emitOnBlur={onBlurPromoCode}
        suffix={renderPromoCodeSuffixIcon}
        isError={isErrorPromoCode}
        emitOnKeyDown={inputFieldKeyDownHandler}
        datatestid={elementId.Field.Promo}
      />
      {renderMessage()}
    </div>
  )
}
