import React from 'react'
import styles from 'styles/components/molecules/calculationUsedCarResultItem.module.scss'
import {
  LoanCalculatorInsuranceAndPromoType,
  SelectedCalculateLoanUsedCar,
  SpecialRateListWithPromoType,
} from 'utils/types/utils'
import {
  IconChecklist,
  IconChevronDown,
  IconWarning,
  TextButton,
} from 'components/atoms'
import { useUtils } from 'services/context/utilsContext'
import clsx from 'clsx'
import elementId from 'helpers/elementIds'
import { LoanRank } from 'utils/types/models'
import { replacePriceSeparatorByLocalization } from 'utils/handler/rupiah'

interface Props {
  data: any
  emitOnClick: (value: SelectedCalculateLoanUsedCar) => void
  isActive: boolean
  onClickBottomSection: (selectedData: SelectedCalculateLoanUsedCar) => void
}

export const CalculationUsedCarResultItem = ({
  data,
  emitOnClick,
  isActive,
  onClickBottomSection,
}: Props) => {
  const { currentLanguage } = useUtils()
  console.log(data)

  const renderLoanRankIcon = () => {
    if (data.loanRank === LoanRank.Green) {
      return (
        <div className={`${styles.iconWrapper} ${styles.iconWrapperGreen}`}>
          <IconChecklist width={9} height={9} color="#FFFFFF" />
        </div>
      )
    } else if (data.loanRank === LoanRank.Red) {
      return (
        <div className={`${styles.iconWrapper} ${styles.iconWrapperRed}`}>
          <IconWarning width={9} height={9} color="#FFFFFF" />
        </div>
      )
    }
  }

  const renderBestPromoBadge = () => {
    return (
      <>
        <div className={styles.bestPromoBadgeSmallSquare}></div>
        <div className={styles.bestPromoBadge}>Promo Terbaik!</div>
      </>
    )
  }

  const renderUsedPromoCounter = () => {
    return <div></div>
  }

  const renderCheckOtherPromoButton = () => {
    return (
      <TextButton
        rightIcon={() => (
          <IconChevronDown width={16} height={16} color="#246ED4" />
        )}
      >
        <span className={styles.checkOtherPromo}>Cek Promo</span>
      </TextButton>
    )
  }

  const renderBottomSectionContent = () => {
    return <>{renderUsedPromoCounter()}</>
  }

  const getUpperInfoText = () => {
    if (data.loanRank === LoanRank.Green) {
      return 'Berpeluang besar untuk mendapatkan persetujuan.'
    } else if (data.loanRank === LoanRank.Red) {
      return 'Naikkan jumlah DP untuk mendapatkan cicilan idealmu.'
    } else {
      return ''
    }
  }

  return (
    <div className={styles.container}>
      <div
        className={clsx({
          [styles.detailSection]: true,
          [styles.detailSectionBlue]: isActive,
          [styles.activeSection]: isActive,
        })}
        role="button"
        onClick={() => emitOnClick(data)}
      >
        <div
          className={clsx({
            [styles.rowCicilan]: true,
            [styles.activeRow]: isActive,
          })}
        >
          <div className={styles.rankTenureInterestWrapper}>
            <div className={styles.tenureInterestWrapper}>
              <span className={styles.priceText}>{`${data.tenor} Tahun`}</span>
            </div>
          </div>
          <div className={styles.priceTextWrapper}>
            <span
              className={styles.priceText}
            >{`Rp${replacePriceSeparatorByLocalization(
              data.totalDP,
              currentLanguage,
            )}`}</span>
          </div>
          <div className={styles.priceTextWrapperEnd}>
            <span
              className={styles.priceText}
            >{`Rp${replacePriceSeparatorByLocalization(
              data.totalInstallment,
              currentLanguage,
            )}`}</span>
          </div>
        </div>
        <div
          className={clsx({
            [styles.separator]: true,
            [styles.hideComponent]: !isActive,
          })}
        ></div>
        <div
          className={clsx({
            [styles.bottomInfo]: true,
            [styles.hideComponent]: !isActive,
          })}
          onClick={() => onClickBottomSection(data)}
        >
          <TextButton
            rightIcon={() => (
              <IconChevronDown width={16} height={16} color="#246ED4" />
            )}
          >
            <span className={styles.checkOtherPromo}>Cek Asuransi</span>
          </TextButton>
        </div>
      </div>
    </div>
  )
}
