import React from 'react'
import styles from 'styles/components/organisms/promoPopupCalculation.module.scss'
import { useUtils } from 'services/context/utilsContext'
import { LanguageCode } from 'utils/enum'
import { million } from 'utils/helpers/const'
import { Button, IconLoading } from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import {
  formatNumberByLocalization,
  replacePriceSeparatorByLocalization,
} from 'utils/handler/rupiah'
import { SelectedCalculateLoanUsedCar } from 'utils/types/utils'
import { colors } from 'utils/helpers/style/colors'

interface PromoProps {
  onClose: () => void
  regularTDP: number
  finalTDP?: number
  regularInstallment: number
  finalInstallment?: number
  interestRate?: number
  finalInterestRate?: number
  promoCashBack?: boolean
  promoAstraPay?: boolean
  promoInsurance?: boolean
  totalSelectedPromo?: number
  isLoadingApiPromoList: boolean
  setCalculationResult: any
  data: SelectedCalculateLoanUsedCar[]
  tempFinal: any
}

const UsedCarBottomCalculation = ({
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
  setCalculationResult,
  data,
  tempFinal,
}: PromoProps) => {
  const { currentLanguage } = useUtils()
  const onSubmit = () => {
    const result = data.map((item: SelectedCalculateLoanUsedCar) => {
      if (item.tenor === tempFinal.tenor) {
        return {
          tenor: tempFinal.tenor,
          totalDP: tempFinal.totalTDP.toString(),
          totalInstallment: tempFinal.totalInstallment.toString(),
        }
      }
      return item
    })

    setCalculationResult(result)
    onClose()
  }

  return (
    <div className={styles.containerUsedCar}>
      <div className={styles.row}>
        <p className={styles.labelText}>Total DP</p>
        <div className={styles.priceWrapper}>
          {/* {finalTDP !== 0 && finalTDP !== regularTDP && (
            <p className={styles.strikethroughPriceText}>
              {'Rp' +
                replacePriceSeparatorByLocalization(
                  regularTDP,
                  currentLanguage,
                )}
            </p>
          )} */}
          <p className={styles.priceText}>
            {isLoadingApiPromoList ? (
              <div className={`${styles.iconLoading} rotateAnimation`}>
                <IconLoading
                  width={14}
                  height={14}
                  color={colors.primaryDarkBlue}
                />
              </div>
            ) : finalTDP !== 0 ? (
              'Rp' +
              replacePriceSeparatorByLocalization(finalTDP, currentLanguage)
            ) : (
              'Rp' +
              replacePriceSeparatorByLocalization(regularTDP, currentLanguage)
            )}
          </p>
        </div>
      </div>

      <div className={styles.row}>
        <p className={styles.labelText}>Cicilan per bulan</p>
        <div className={styles.priceWrapper}>
          {/* {finalInstallment !== 0 && (
            <p className={styles.strikethroughPriceText}>
              {'Rp' +
                replacePriceSeparatorByLocalization(
                  regularInstallment,
                  currentLanguage,
                )}
            </p>
          )} */}
          {isLoadingApiPromoList ? (
            <div className={`${styles.iconLoading} rotateAnimation`}>
              <IconLoading
                width={14}
                height={14}
                color={colors.primaryDarkBlue}
              />
            </div>
          ) : finalInstallment !== 0 ? (
            <p className={styles.priceText}>
              {'Rp' +
                replacePriceSeparatorByLocalization(
                  finalInstallment,
                  currentLanguage,
                )}
            </p>
          ) : (
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
      {/* <div className={styles.rowBadge}>
        {promoCashBack && <CashbackBadge text={getTextCashback()} />}
        {promoAstraPay && <CashbackAstrapayBadge text="Cashback Rp500 rb" />}
        {promoInsurance && <FreeInsuranceBadge text="Bebas Upgrade Asuransi" />}
      </div> */}
      <Button
        version={ButtonVersion.SecondaryDark}
        size={ButtonSize.Big}
        onClick={onSubmit}
        loading={isLoadingApiPromoList}
        disabled={isLoadingApiPromoList}
      >
        Terapkan Promo dan Asuransi
      </Button>
    </div>
  )
}

export default UsedCarBottomCalculation
