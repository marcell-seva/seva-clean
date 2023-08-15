import CashbackAstrapayBadge from 'components/atoms/selectablePromoBadge/CashbackAstrapayBadge'
import CashbackBadge from 'components/atoms/selectablePromoBadge/CashbackBadge'
import FreeInsuranceBadge from 'components/atoms/selectablePromoBadge/FreeInsuranceBadge'
import React from 'react'
import { LanguageCode, LocalStorageKey } from 'utils/enum'
import { getLocalStorage } from 'utils/handler/localStorage'
import { formatNumberByLocalization } from 'utils/handler/rupiah'
import { million } from 'utils/helpers/const'
import {
  LoanCalculatorInsuranceAndPromoType,
  SimpleCarVariantDetail,
} from 'utils/types/utils'
import { useLocalStorage } from '../useLocalStorage'

export const useBadgePromo = () => {
  const selectablePromo = getLocalStorage<LoanCalculatorInsuranceAndPromoType>(
    LocalStorageKey.SelectablePromo,
  )
  const [simpleCarVariantDetails] =
    useLocalStorage<SimpleCarVariantDetail | null>(
      LocalStorageKey.SimpleCarVariantDetails,
      null,
    )
  const selectedPromoList = selectablePromo
    ? selectablePromo.selectedPromo
    : null

  const checkCDS = selectedPromoList?.filter(
    (x) =>
      x.promoId === 'CDS01' || x.promoId === 'CDS02' || x.promoId === 'CDS04',
  )

  const getMonthlyInstallment = (valueInstallment: number) => {
    return formatNumberByLocalization(
      valueInstallment,
      LanguageCode.id,
      1000000,
      10,
    )
  }

  const getTextCashback = (installment: number) => {
    return (
      'Cashback Rp' +
      getMonthlyInstallment(
        installment > 4 * million ? 4 * million : installment,
      ) +
      ' jt'
    )
  }

  const promoList =
    selectedPromoList &&
    selectedPromoList.length > 0 &&
    selectedPromoList.filter(
      (x) =>
        x.promoId !== 'CDS01' && x.promoId !== 'CDS02' && x.promoId !== 'CDS04',
    )

  const BadgeList = () => {
    return (
      <>
        {checkCDS &&
          checkCDS.length > 0 &&
          checkCDS.map((item) => {
            if (item.promoId === 'CDS01')
              return (
                <CashbackBadge
                  text={getTextCashback(
                    simpleCarVariantDetails.loanMonthlyInstallment,
                  )}
                />
              )

            if (item.promoId === 'CDS02')
              return <CashbackAstrapayBadge text="Cashback Rp500 rb" />

            if (item.promoId === 'CDS04')
              return <FreeInsuranceBadge text="Bebas Upgrade Asuransi" />
          })}
      </>
    )
  }

  return { checkCDS, selectedPromoList, BadgeList, promoList }
}
