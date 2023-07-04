import React from 'react'
import styles from 'styles/saas/components/molecules/calculationResultItem.module.scss'
import { SpecialRateListType } from 'utils/types/utils'
import { IconChecklist, IconWarning } from 'components/atoms'
import { replacePriceSeparatorByLocalization } from 'utils/numberUtils/numberUtils'
import { useCurrentLanguageFromContext } from 'context/currentLanguageContext/currentLanguageContext'
import { LoanRank } from 'utils/models/models'
import clsx from 'clsx'
import elementId from 'helpers/elementIds'

interface Props {
  data: SpecialRateListType
  emitOnClick: (value: SpecialRateListType) => void
  isActive: boolean
}

export const CalculationResultItem = ({
  data,
  emitOnClick,
  isActive,
}: Props) => {
  const { currentLanguage } = useCurrentLanguageFromContext()

  const renderLoanRankIcon = () => {
    if (data.loanRank === LoanRank.Green) {
      return (
        <div className={`${styles.iconWrapper} ${styles.iconWrapperGreen}`}>
          <IconChecklist width={16} height={16} color="#FFFFFF" />
        </div>
      )
    } else if (data.loanRank === LoanRank.Red) {
      return (
        <div className={`${styles.iconWrapper} ${styles.iconWrapperRed}`}>
          <IconWarning width={16} height={16} color="#FFFFFF" />
        </div>
      )
    }
  }

  const getLoanRankBottomInfoText = () => {
    if (data.loanRank === LoanRank.Green) {
      return 'Berpeluang besar untuk mendapatkan persetujuan.'
    } else if (data.loanRank === LoanRank.Red) {
      return 'Naikkan jumlah DP untuk mendapatkan cicilan idealmu.'
    }
  }

  return (
    <div className={styles.container}>
      <div
        className={clsx({
          [styles.detailSection]: true,
          [styles.detailSectionGreen]:
            isActive && data.loanRank === LoanRank.Green,
          [styles.detailSectionRed]: isActive && data.loanRank === LoanRank.Red,
        })}
        role="button"
        onClick={() => emitOnClick(data)}
        data-testid={
          elementId.LoanCalculator.Result.LoanCalculator +
          '-' +
          data.loanRank.toLowerCase()
        }
      >
        <div className={styles.rankTenureInterestWrapper}>
          {renderLoanRankIcon()}
          <div className={styles.tenureInterestWrapper}>
            <span className={styles.priceText}>{`${data.tenure} Tahun`}</span>
            <span
              className={styles.interestText}
            >{`Bunga ${data.interestRate}%`}</span>
          </div>
        </div>
        <div className={styles.priceTextWrapper}>
          <span className={styles.priceText}>
            {`Rp${replacePriceSeparatorByLocalization(
              data.totalFirstPayment,
              currentLanguage,
            )}`}
          </span>
        </div>
        <div className={styles.priceTextWrapper}>
          <span className={styles.priceText}>
            {`Rp${replacePriceSeparatorByLocalization(
              data.installment,
              currentLanguage,
            )}`}
          </span>
        </div>
      </div>

      <div
        className={clsx({
          [styles.bottomInfo]: true,
          [styles.hideBottomInfo]: !isActive,
          [styles.bottomInfoGreen]: data.loanRank === LoanRank.Green,
          [styles.bottomInfoRed]: data.loanRank === LoanRank.Red,
        })}
      >
        <span className={styles.bottomIndoText}>
          {getLoanRankBottomInfoText()}
        </span>
      </div>
    </div>
  )
}
