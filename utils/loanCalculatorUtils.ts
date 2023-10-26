import { PromoItemType, SpecialRateListWithPromoType } from './types/utils'

export const generateAllBestPromoList = (list: PromoItemType[]) => {
  return list.map((item) => {
    // all promos from this new loan calculator api, will return best promo
    return {
      ...item,
      is_Best_Promo: true,
      is_Available: true,
    }
  })
}

// func getTdpAffectedByPromo() only used everytime API calculate is called
export const getTdpAffectedByPromo = (
  currentPermutation: SpecialRateListWithPromoType,
) => {
  if (currentPermutation?.applied.toLowerCase().includes('giias')) {
    return (
      currentPermutation?.totalFirstPaymentGiias -
      currentPermutation?.dpDiscount
    )
  } else if (currentPermutation?.applied.toLowerCase().includes('spekta')) {
    return (
      currentPermutation?.totalFirstPaymentSpekta -
      currentPermutation?.dpDiscount
    )
  } else if (currentPermutation.promoArr.length !== 0) {
    // if promoArr empty nominal will use total first payment regular only
    return (
      currentPermutation?.totalFirstPayment - currentPermutation?.dpDiscount
    )
  } else if (currentPermutation?.dpDiscount !== 0) {
    return (
      currentPermutation?.totalFirstPayment - currentPermutation?.dpDiscount
    )
  } else {
    return 0
  }
}

export const getInstallmentAffectedByPromo = (
  currentPermutation: SpecialRateListWithPromoType,
) => {
  if (currentPermutation?.applied.toLowerCase().includes('giias')) {
    return currentPermutation?.installmentGiias
  } else if (currentPermutation?.applied.toLowerCase().includes('spekta')) {
    return currentPermutation?.installmentSpekta
  } else {
    return 0
  }
}

export const getInterestRateAffectedByPromo = (
  currentPermutation: SpecialRateListWithPromoType,
) => {
  if (currentPermutation?.applied.toLowerCase().includes('giias')) {
    return currentPermutation?.interestRateGiias
  } else if (currentPermutation?.applied.toLowerCase().includes('spekta')) {
    return currentPermutation?.interestRateSpekta
  } else {
    return 0
  }
}
