import React from 'react'
import styles from 'styles/components/organisms/promoPopupCalculation.module.scss'
import { useUtils } from 'services/context/utilsContext'
import { LanguageCode } from 'utils/enum'
import { million } from 'utils/helpers/const'
import { Button } from 'components/atoms'
import CashbackBadge from 'components/atoms/selectablePromoBadge/CashbackBadge'
import CashbackAstrapayBadge from 'components/atoms/selectablePromoBadge/CashbackAstrapayBadge'
import FreeInsuranceBadge from 'components/atoms/selectablePromoBadge/FreeInsuranceBadge'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import {
  formatNumberByLocalization,
  replacePriceSeparatorByLocalization,
} from 'utils/handler/rupiah'

interface PromoProps {
  onClose: () => void
  regularTDP: number
  finalTDP?: number
  regularInstallment: number
  finalInstallment?: number
  interestRate: number
  finalInterestRate?: number
  promoCashBack: boolean
  promoAstraPay: boolean
  promoInsurance: boolean
  totalSelectedPromo: number
  isLoadingApiPromoList: boolean
  isLoadingRecalculateSDD01: boolean
}

const PromoBottomCalculation = ({
  onClose,
  regularTDP = 0,
  finalTDP = 0,
  interestRate = 0,
  finalInterestRate = 0,
  promoCashBack,
  promoAstraPay,
  promoInsurance,
  regularInstallment = 0,
  finalInstallment = 0,
  totalSelectedPromo,
  isLoadingApiPromoList,
  isLoadingRecalculateSDD01,
}: PromoProps) => {
  const { currentLanguage } = useUtils()
  const onSubmit = () => {
    onClose()
  }
  const getMonthlyInstallment = (valueInstallment: number) => {
    return formatNumberByLocalization(
      valueInstallment,
      LanguageCode.id,
      1000000,
      10,
    )
  }
  const getTextCashback = () => {
    if (finalInstallment === 0) {
      return (
        'Cashback Rp' +
        getMonthlyInstallment(
          regularInstallment > 4 * million ? 4 * million : regularInstallment,
        ) +
        ' jt'
      )
    } else {
      return (
        'Cashback Rp' +
        getMonthlyInstallment(
          finalInstallment > 4 * million ? 4 * million : finalInstallment,
        ) +
        ' jt'
      )
    }
  }
  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <p className={styles.labelText}>Total DP</p>
        <div className={styles.priceWrapper}>
          {finalTDP !== 0 && finalTDP !== regularTDP && (
            <p className={styles.strikethroughPriceText}>
              {'Rp' +
                replacePriceSeparatorByLocalization(
                  regularTDP,
                  currentLanguage,
                )}
            </p>
          )}
          <p className={styles.priceText}>
            {finalTDP !== 0
              ? 'Rp' +
                replacePriceSeparatorByLocalization(finalTDP, currentLanguage)
              : 'Rp' +
                replacePriceSeparatorByLocalization(
                  regularTDP,
                  currentLanguage,
                )}
          </p>
        </div>
      </div>

      <div className={styles.row}>
        <p className={styles.labelText}>Cicilan per bulan</p>
        <div className={styles.priceWrapper}>
          {finalInterestRate !== 0 ? (
            <p className={styles.interestRateText}>
              Bunga {finalInterestRate}%
            </p>
          ) : (
            <p className={styles.interestRateText}>Bunga {interestRate}%</p>
          )}
          {finalInstallment !== 0 && (
            <p className={styles.strikethroughPriceText}>
              {'Rp' +
                replacePriceSeparatorByLocalization(
                  regularInstallment,
                  currentLanguage,
                )}
            </p>
          )}
          {finalInstallment !== 0 && (
            <p className={styles.priceText}>
              {'Rp' +
                replacePriceSeparatorByLocalization(
                  finalInstallment,
                  currentLanguage,
                )}
            </p>
          )}
          {finalInstallment === 0 && (
            <p className={styles.priceText}>
              {'Rp' +
                replacePriceSeparatorByLocalization(
                  regularInstallment,
                  currentLanguage,
                )}
            </p>
          )}
        </div>
      </div>
      <div className={styles.rowBadge}>
        {promoCashBack && <CashbackBadge text={getTextCashback()} />}
        {promoAstraPay && <CashbackAstrapayBadge text="Cashback Rp500 rb" />}
        {promoInsurance && <FreeInsuranceBadge text="Bebas Upgrade Asuransi" />}
      </div>
      <Button
        version={ButtonVersion.SecondaryDark}
        size={ButtonSize.Big}
        onClick={onSubmit}
        loading={isLoadingApiPromoList || isLoadingRecalculateSDD01}
        disabled={isLoadingApiPromoList}
      >
        {totalSelectedPromo === 0
          ? 'Terapkan Asuransi Tanpa Promo'
          : 'Terapkan Promo dan Asuransi'}
      </Button>
    </div>
  )
}

export default PromoBottomCalculation
