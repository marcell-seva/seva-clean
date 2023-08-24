import React from 'react'
import {
  MinAmountMessage,
  RequiredFunnelErrorMessage,
} from 'utils/config/funnel.config'
import { Currency } from 'utils/handler/calculation'
import { MinAmount } from 'utils/types/models'
import styles from 'styles/components/organisms/searchWidget.module.scss'

export const useDownPayment = () => {
  const errorLimitDP = ({
    text,
    gotoPriceRange,
  }: {
    text: string
    gotoPriceRange: () => void
  }) => (
    <span className={styles.dpError} style={{ width: '90%' }}>
      {text}
      <span className={styles.clickable} onClick={gotoPriceRange}>
        sesuaikan harga mobil
      </span>
    </span>
  )

  const errorDownPayment = (
    downPaymentAmount: number,
    limitMaximumDp: number,
    limitMinimumDp: number,
    gotoPriceRange: () => void,
  ): JSX.Element | string => {
    if (!downPaymentAmount) return RequiredFunnelErrorMessage.downPaymentAmount

    if (Number(downPaymentAmount) < MinAmount.downPaymentAmount)
      return MinAmountMessage.downPayemntAmount

    if (Number(downPaymentAmount) < limitMinimumDp)
      return errorLimitDP({
        text: `Berdasarkan kisaran harga yang kamu pilih, masukkan min. DP  
      Rp${Currency(limitMinimumDp)} atau `,
        gotoPriceRange,
      })

    if (Number(downPaymentAmount) > limitMaximumDp)
      return errorLimitDP({
        text: `Berdasarkan kisaran harga yang kamu pilih, masukkan maks. DP  
      Rp${Currency(limitMaximumDp)} atau `,
        gotoPriceRange,
      })

    return ''
  }

  return { errorDownPayment }
}
