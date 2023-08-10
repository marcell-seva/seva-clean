import React, { ChangeEvent, useEffect, useState } from 'react'
import styles from '../../../../styles/components/molecules/form/formPrice.module.scss'
import { Input } from 'antd'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import { replacePriceSeparatorByLocalization } from 'utils/numberUtils/numberUtils'
import { filterNonDigitCharacters } from 'utils/stringUtils'
import { getConvertFilterIncome } from 'utils/filterUtils'
import elementId from 'helpers/elementIds'
import { LanguageCode } from 'utils/enum'
type FormIncomeProps = {
  setIncomeAmount?: any
  collapseTwo?: boolean
  isResetFilter?: boolean
  isErrorIncome?: boolean
  setIsErrorIncome?: any
  isApplied?: boolean
}
export const FormIncome = ({
  setIncomeAmount,
  isResetFilter,
  isErrorIncome,
  setIsErrorIncome,
  isApplied,
}: FormIncomeProps) => {
  const { funnelQuery } = useFunnelQueryData()
  const Currency = (value: any) => {
    if (value.includes('-') || value.includes('>') || value.includes('<')) {
      return getConvertFilterIncome(value)
    } else {
      return replacePriceSeparatorByLocalization(
        filterNonDigitCharacters(value.toString()),
        LanguageCode.id,
      )
    }
  }
  const [incomeFilter, setIncomeFilter] = useState(
    Currency(funnelQuery.monthlyIncome),
  )
  setIncomeAmount(Number(filterNonDigitCharacters(incomeFilter.toString())))
  const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value[0] === '0') {
      return
    }
    if (
      Number(filterNonDigitCharacters(event.target.value.toString())) <
        3000000 &&
      event.target.value
    ) {
      setIsErrorIncome(true)
    } else {
      setIsErrorIncome(false)
    }
    setIncomeFilter(Currency(event.target.value))
    setIncomeAmount(
      Number(filterNonDigitCharacters(event.target.value.toString())),
    )
  }
  useEffect(() => {
    if (isResetFilter) {
      setIncomeFilter('')
      setIncomeAmount('')
    }
    if (incomeFilter.length === 0 && !isApplied) {
      setIncomeFilter(Currency(funnelQuery.monthlyIncome))
    }
  }, [isResetFilter, isApplied])
  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapperHeader}>
          <div className={styles.textTitle}>Pendapatan Perbulan</div>
        </div>
        <Input
          type="tel"
          maxLength={13}
          value={incomeFilter ? 'Rp' + incomeFilter : incomeFilter}
          onChange={onChangeInput}
          className={isErrorIncome ? styles.inputStyleError : styles.inputStyle}
          placeholder="Masukkan Pendapatan"
          data-testid={elementId.Field.Income}
        />
      </div>
      {isErrorIncome && !isResetFilter && (
        <span className={styles.errorText}>
          {incomeFilter
            ? 'Pendapatan yang kamu masukkan terlalu rendah.'
            : 'Wajib mengisi pendapatanmu'}
        </span>
      )}
    </>
  )
}
