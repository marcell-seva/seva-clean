export const convertObjectQuery = (data: any) => {
  const objectData = {
    age: (data.age && data.age.toString()) || '',
    downPaymentType: data.downPaymentType || 'amount',
    downPaymentAmount: data.downPaymentAmount || '',
    monthlyIncome: data.monthlyIncome || '',
    priceRangeGroup: data.priceRangeGroup || '',
    bodyType:
      data.bodyType && data.bodyType.length > 0 ? data.bodyType.toString() : '',
    // sortBy: sortBy,
    brand: data.brand && data.brand.length > 0 ? data.brand.toString() : '',
    tenure: (data.tenure && data.tenure.toString()) || 5,
    sortBy: data.sortBy || 'lowToHigh',
  }
  return new URLSearchParams(
    Object.entries(objectData).filter(([, v]) => v !== ''),
  )
    .toString()
    .replace('%2C', ',')
}
