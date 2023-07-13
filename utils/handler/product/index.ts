type MonthlyInstallmentObject = {
  monthlyInstallment: number
}

export const getLowestInstallment = (variants: MonthlyInstallmentObject[]) => {
  const prices = variants.map((variant) => variant.monthlyInstallment)
  return Math.min(...prices)
}
