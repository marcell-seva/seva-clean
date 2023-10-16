import React from 'react'
import styles from 'styles/components/molecules/calculationResultItem.module.scss'
import {
  LoanCalculatorInsuranceAndPromoType,
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
  data: SpecialRateListWithPromoType
  emitOnClick: (value: SpecialRateListWithPromoType) => void
  isActive: boolean
  onClickBottomSection: (selectedData: SpecialRateListWithPromoType) => void
  insuranceAndPromoData: LoanCalculatorInsuranceAndPromoType
}

export const CalculationResultItem = ({
  data,
  emitOnClick,
  isActive,
  onClickBottomSection,
  insuranceAndPromoData,
}: Props) => {
  const { currentLanguage } = useUtils()

  const isUsingBestPromo = insuranceAndPromoData.selectedPromo?.some(
    (x: any) => x.is_Best_Promo,
  )
  const isUsingRegularPromo = !insuranceAndPromoData.selectedPromo?.some(
    (x: any) => x.is_Best_Promo,
  )
  const isNotUsingAnyPromo = insuranceAndPromoData.selectedPromo?.length === 0
  const isCarDontHavePromo =
    insuranceAndPromoData.allPromoListOnlyFullComprehensive?.length === 0

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
    if (isCarDontHavePromo) {
      return <div></div>
    } else if (isNotUsingAnyPromo) {
      return (
        <span className={styles.interestText}>
          Tersedia {insuranceAndPromoData.allPromoList.length} promo terbaik
          untukmu
        </span>
      )
    } else if (isUsingRegularPromo) {
      return (
        <span
          className={clsx({
            [styles.interestText]: true,
            [styles.secondaryGreenColor]: data.loanRank === LoanRank.Green,
          })}
        >
          {insuranceAndPromoData.selectedPromo?.length} promo diterapkan
        </span>
      )
    } else if (isUsingBestPromo) {
      return (
        <span
          className={clsx({
            [styles.interestText]: true,
            [styles.bestPromoCounter]: true,
          })}
        >
          {insuranceAndPromoData.selectedPromo?.length} promo diterapkan
        </span>
      )
    } else {
      return <></>
    }
  }

  const renderCheckOtherPromoButton = () => {
    if (isCarDontHavePromo) {
      return (
        <TextButton
          rightIcon={() => (
            <IconChevronDown width={16} height={16} color="#246ED4" />
          )}
        >
          <span className={styles.checkOtherPromo}>Cek Asuransi</span>
        </TextButton>
      )
    } else if (isNotUsingAnyPromo) {
      return (
        <TextButton
          rightIcon={() => (
            <IconChevronDown width={16} height={16} color="#246ED4" />
          )}
        >
          <span className={styles.checkOtherPromo}>Cek Promo</span>
        </TextButton>
      )
    } else if (isUsingRegularPromo) {
      return (
        <TextButton
          rightIcon={() => (
            <IconChevronDown width={16} height={16} color="#246ED4" />
          )}
        >
          <span className={styles.checkOtherPromo}>Cek Promo Lain</span>
        </TextButton>
      )
    } else if (isUsingBestPromo) {
      return (
        <TextButton
          rightIcon={() => (
            <IconChevronDown width={16} height={16} color="#246ED4" />
          )}
        >
          <span className={styles.checkOtherPromo}>Cek Promo Lain</span>
        </TextButton>
      )
    } else {
      return <></>
    }
  }

  const renderBottomSectionContent = () => {
    return (
      <>
        {isUsingBestPromo ? renderBestPromoBadge() : <></>}
        {renderUsedPromoCounter()}
        {renderCheckOtherPromoButton()}
      </>
    )
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
          [styles.upperInfo]: true,
          [styles.hideComponent]: !isActive,
          [styles.upperInfoGreen]: data.loanRank === LoanRank.Green,
          [styles.upperInfoRed]: data.loanRank === LoanRank.Red,
        })}
      >
        {getUpperInfoText()}
      </div>
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
            <span className={styles.interestText}>{`Bunga ${
              insuranceAndPromoData.interestRateAfterPromo != 0
                ? insuranceAndPromoData.interestRateAfterPromo
                : insuranceAndPromoData.interestRateBeforePromo
            }%`}</span>
          </div>
        </div>
        <div className={styles.priceTextWrapper}>
          <span className={styles.priceText}>
            {`Rp${replacePriceSeparatorByLocalization(
              insuranceAndPromoData.tdpAfterPromo
                ? insuranceAndPromoData.tdpAfterPromo
                : insuranceAndPromoData.tdpBeforePromo,
              currentLanguage,
            )}`}
          </span>
          {insuranceAndPromoData.tdpAfterPromo &&
          insuranceAndPromoData.tdpAfterPromo !==
            insuranceAndPromoData.tdpBeforePromo ? (
            <span className={styles.oldPriceText}>
              {`Rp${replacePriceSeparatorByLocalization(
                insuranceAndPromoData.tdpBeforePromo,
                currentLanguage,
              )}`}
            </span>
          ) : (
            <></>
          )}
        </div>
        <div className={styles.priceTextWrapper}>
          <span className={styles.priceText}>
            {`Rp${replacePriceSeparatorByLocalization(
              insuranceAndPromoData.installmentAfterPromo
                ? insuranceAndPromoData.installmentAfterPromo
                : insuranceAndPromoData.installmentBeforePromo,
              currentLanguage,
            )}`}
          </span>
          {insuranceAndPromoData.installmentAfterPromo ? (
            <span className={styles.oldPriceText}>
              {`Rp${replacePriceSeparatorByLocalization(
                insuranceAndPromoData.installmentBeforePromo,
                currentLanguage,
              )}`}
            </span>
          ) : (
            <></>
          )}
        </div>
      </div>

      <div
        className={clsx({
          [styles.separator]: true,
          [styles.hideComponent]: !isActive,
          [styles.separatorGreen]: data.loanRank === LoanRank.Green,
          [styles.separatorRed]: data.loanRank === LoanRank.Red,
        })}
      ></div>

      <div
        className={clsx({
          [styles.bottomInfo]: true,
          [styles.hideComponent]: !isActive,
          [styles.bottomInfoBestPromo]: isUsingBestPromo,
          [styles.bottomInfoGreen]: data.loanRank === LoanRank.Green,
          [styles.bottomInfoRed]: data.loanRank === LoanRank.Red,
        })}
        onClick={() => onClickBottomSection(data)}
      >
        {renderBottomSectionContent()}
      </div>
    </div>
  )
}
