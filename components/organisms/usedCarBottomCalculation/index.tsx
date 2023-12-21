import React from 'react'
import styles from 'styles/components/organisms/promoPopupCalculation.module.scss'
import { useUtils } from 'services/context/utilsContext'
import { Button, IconLoading } from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { replacePriceSeparatorByLocalization } from 'utils/handler/rupiah'
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
  setChosenAssurance: any
}

const UsedCarBottomCalculation = ({
  onClose,
  regularTDP = 0,
  finalTDP = 0,
  regularInstallment = 0,
  finalInstallment = 0,
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
