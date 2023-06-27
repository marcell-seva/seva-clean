import React, { ChangeEvent, useEffect, useState } from 'react'
import styles from '../../../../styles/saas/components/molecules/form/formPrice.module.scss'
import { Input } from 'antd'
import { useFunnelQueryData } from 'context/funnelQueryContext/funnelQueryContext'
import { replacePriceSeparatorByLocalization } from 'utils/numberUtils/numberUtils'
import { filterNonDigitCharacters } from 'utils/stringUtils'
import elementId from 'helpers/elementIds'
import { LanguageCode } from 'utils/enum'
type FormDownPaymentProps = {
  setDownPaymentAmount?: any
  collapseTwo?: boolean
  isResetFilter?: boolean
  isErrorDp?: boolean
  setIsErrorDp?: any
  isErrorMinMaxDP?: any
  setIsErrorMinMaxDP?: any
  minPriceValidation?: any
  maxPriceValidation?: any
  scrollToPrice?: any
  isApplied?: boolean
  isButtonClick: boolean
}
export const FormDP = ({
  setDownPaymentAmount,
  isResetFilter,
  isErrorDp,
  setIsErrorDp,
  isErrorMinMaxDP,
  setIsErrorMinMaxDP,
  minPriceValidation,
  maxPriceValidation,
  scrollToPrice,
  isApplied,
  isButtonClick,
}: FormDownPaymentProps) => {
  const { funnelQuery } = useFunnelQueryData()
  const Currency = (value: any) => {
    return replacePriceSeparatorByLocalization(
      filterNonDigitCharacters(value.toString()),
      LanguageCode.id,
    )
  }
  const [downPaymentFilter, setDownPaymentFilter] = useState(
    Currency(funnelQuery.downPaymentAmount),
  )

  const [downPaymentAmountTmp, setDownPaymentAmountTmp] = useState<any>()
  const [minDp, setMinDp] = useState(
    Currency(Number(minPriceValidation / 100) * 20),
  )
  const [maxDp, setMaxDp] = useState(
    Currency(Number(maxPriceValidation / 100) * 90),
  )
  setDownPaymentAmount(
    Number(filterNonDigitCharacters(downPaymentFilter.toString())),
  )
  const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value[0] === '0') {
      return
    }
    if (
      Number(filterNonDigitCharacters(event.target.value.toString())) <
        20000000 &&
      event.target.value
    ) {
      setIsErrorDp(true)
    } else {
      setIsErrorDp(false)
    }
    if (
      isErrorMinMaxDP === '1' &&
      Number(filterNonDigitCharacters(event.target.value.toString())) >
        (Number(minPriceValidation) / 100) * 20
    )
      setIsErrorMinMaxDP('0')
    if (
      isErrorMinMaxDP === '2' &&
      Number(filterNonDigitCharacters(event.target.value.toString())) <
        (Number(maxPriceValidation) / 100) * 90
    )
      setIsErrorMinMaxDP('0')
    setDownPaymentFilter(Currency(event.target.value))
    setDownPaymentAmountTmp(
      Number(filterNonDigitCharacters(event.target.value.toString())),
    )
    setDownPaymentAmount(
      Number(filterNonDigitCharacters(event.target.value.toString())),
    )
  }
  useEffect(() => {
    if (isResetFilter) {
      setDownPaymentFilter('')
      // setDownPaymentAmount('')
    }
    if (downPaymentFilter.length === 0 && !isApplied) {
      setDownPaymentFilter(Currency(funnelQuery.downPaymentAmount))
      // setDownPaymentAmount(
      //   Number(filterNonDigitCharacters(downPaymentAmountTmp.toString())),
      // )
    }
    console.log('test1', downPaymentAmountTmp)
  }, [isResetFilter, isApplied, isButtonClick])
  useEffect(() => {
    setMinDp(Currency(Number(minPriceValidation / 100) * 20))
    setMaxDp(Currency(Number(maxPriceValidation / 100) * 90))
  }, [minPriceValidation, maxPriceValidation])
  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapperHeader}>
          <div className={styles.textTitle}>Maksimum DP</div>
        </div>
        <Input
          type="tel"
          maxLength={13}
          value={
            downPaymentFilter ? 'Rp' + downPaymentFilter : downPaymentFilter
          }
          onChange={onChangeInput}
          className={
            isErrorDp || isErrorMinMaxDP !== '0'
              ? styles.inputStyleError
              : styles.inputStyle
          }
          placeholder="Masukkan DP"
          data-testid={elementId.Field.DP}
        />
      </div>
      {isErrorDp && isErrorMinMaxDP === '0' && (
        <span className={styles.errorText}>
          {downPaymentFilter
            ? 'Minimum DP sebesar Rp20 jt.'
            : 'Wajib mengisi maksimum DP'}
        </span>
      )}
      {isErrorMinMaxDP === '1' && (
        <span className={styles.errorText}>
          Berdasarkan harga yang anda pilih, min. DP Rp
          {minDp}.
        </span>
      )}
      {isErrorMinMaxDP === '2' && (
        <span className={styles.errorText}>
          Berdasarkan harga yang anda pilih, maks. DP Rp
          {maxDp}.
        </span>
      )}
      {isErrorMinMaxDP !== '0' && (
        <p onClick={scrollToPrice} className={styles.adjustText}>
          Atau sesuaikan harga mobil
        </p>
      )}
    </>
  )
}
